const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { otpMailer } = require('../config/otpMailer');


// ─────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required.' });
        }

        // Check for existing user
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min

        // Create user (unverified)
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                otp,
                otpExpires,
                isVerified: false,
            },
        });

        // Send verification OTP
        await otpMailer(email, otp, 'register');

        res.status(201).json({
            message: 'Account created! Please check your email and enter the 6-digit code to verify your account.',
            email,
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// ─────────────────────────────────────────
// POST /api/auth/verify-otp   (registration verification)
// ─────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'This account is already verified. Please log in.' });
        }

        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid verification code.' });
        }

        if (new Date() > user.otpExpires) {
            return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
        }

        // Mark user as verified & clear OTP
        await prisma.user.update({
            where: { email },
            data: { isVerified: true, otp: null, otpExpires: null },
        });

        res.status(200).json({ message: 'Email verified successfully! You can now log in.' });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// ─────────────────────────────────────────
// POST /api/auth/resend-otp   (resend registration OTP)
// ─────────────────────────────────────────
router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found.' });
        if (user.isVerified) return res.status(400).json({ message: 'Account already verified.' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.user.update({
            where: { email },
            data: { otp, otpExpires },
        });

        await otpMailer(email, otp, 'register');

        res.status(200).json({ message: 'A new verification code has been sent to your email.' });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});



// POST /api/auth/login   (Step 1 — credentials check, send 2FA OTP)

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // ─── ADMIN SHORTCUT ──────────────────────────────────────────
        // Hardcoded admin credentials live only in .env (never in source code).
        // Admin bypasses OTP entirely and gets a JWT directly.
        if (
            process.env.ADMIN_EMAIL &&
            email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
        ) {
            const isAdminValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
            if (!isAdminValid) {
                return res.status(401).json({ message: 'Invalid email or password.' });
            }

            const token = jwt.sign(
                { id: 'admin', email, name: 'Admin', role: 'ADMIN' },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            return res.status(200).json({
                message: 'Admin login successful.',
                token,
                user: { id: 'admin', name: 'Admin', email, role: 'ADMIN' },
            });
        }
        // ─────────────────────────────────────────────────────────────

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Your email is not verified. Please verify your account first.',
                requiresVerification: true,
                email,
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate 2FA OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.user.update({
            where: { email },
            data: { otp, otpExpires },
        });

        await otpMailer(email, otp, 'login');

        res.status(200).json({
            message: 'A 6-digit login code has been sent to your email.',
            requiresTwoFactor: true,
            email,
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});



// ─────────────────────────────────────────
// POST /api/auth/verify-login-otp  (Step 2 — verify 2FA & issue JWT)
// ─────────────────────────────────────────
router.post('/verify-login-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid login code.' });
        }

        if (new Date() > user.otpExpires) {
            return res.status(400).json({ message: 'Login code has expired. Please log in again.' });
        }

        // Clear OTP
        await prisma.user.update({
            where: { email },
            data: { otp: null, otpExpires: null },
        });

        // Issue JWT (7 day session)
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful! Welcome back.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error('Verify login OTP error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// ─────────────────────────────────────────
// POST /api/auth/me  (validate JWT & return user info)
// ─────────────────────────────────────────
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });

        if (!user) return res.status(404).json({ message: 'User not found.' });

        res.status(200).json({ user });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }
        res.status(401).json({ message: 'Invalid token.' });
    }
});


module.exports = router;