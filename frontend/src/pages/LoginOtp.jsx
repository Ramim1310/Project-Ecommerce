import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveSession } from '../utils/auth';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function LoginOtp() {
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};

    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(60);

    const inputRefs = useRef([]);

    // Redirect if no email passed via state
    useEffect(() => {
        if (!email) navigate('/login');
    }, [email, navigate]);

    // Countdown for resend
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleDigitChange = (index, value) => {
        const clean = value.replace(/\D/g, '').slice(-1);
        const next = [...digits];
        next[index] = clean;
        setDigits(next);
        setError('');
        if (clean && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;
        const next = pasted.padEnd(6, '').split('').slice(0, 6);
        setDigits(next);
        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const otp = digits.join('');

    const handleVerify = async (e) => {
        e.preventDefault();
        if (otp.length < 6) return setError('Please enter the complete 6-digit code.');

        setLoading(true);
        try {
            const { data } = await axios.post(`${API}/auth/verify-login-otp`, { email, otp });

            // Save JWT + user to localStorage
            saveSession(data.token, data.user);

            setSuccess('Login successful! Welcome back 🎉');
            setTimeout(() => navigate('/dashboard', { replace: true }), 1200);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        try {
            // Trigger a new login OTP by re-calling login without password check
            // Backend will re-send OTP if credentials are cached — we need to expose a resend endpoint
            // For now, direct user back to login
            navigate('/login');
        } catch {
            setError('Failed to resend. Please go back and log in again.');
        }
    };

    return (
        <div className="auth-page">
            {/* Left hero */}
            <div className="auth-hero">
                <div className="hero-logo">⚡ TechParts</div>
                <p className="hero-tagline">Two-factor authentication</p>
                <div className="hero-features">
                    <div className="hero-feature">
                        <span className="hero-feature-icon">🛡️</span>
                        <span>Your account is protected</span>
                    </div>
                    <div className="hero-feature">
                        <span className="hero-feature-icon">📧</span>
                        <span>Code sent to your email</span>
                    </div>
                    <div className="hero-feature">
                        <span className="hero-feature-icon">⏱</span>
                        <span>Expires in 10 minutes</span>
                    </div>
                </div>
            </div>

            {/* Right form */}
            <div className="auth-form-panel">
                <div className="auth-card">
                    <div className="step-indicator">
                        <div className="step-dot done" />
                        <div className="step-dot active" />
                        <div className="step-dot" />
                    </div>

                    <h1 className="auth-card-title">Check Your Email</h1>
                    <p className="auth-card-subtitle">
                        We sent a login code to <strong style={{ color: '#93c5fd' }}>{email}</strong>.
                        Enter it below to access your account.
                    </p>

                    {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}
                    {success && <div className="alert alert-success"><span>✓</span> {success}</div>}

                    <form onSubmit={handleVerify} noValidate>
                        <div className="otp-grid" onPaste={handlePaste}>
                            {digits.map((d, i) => (
                                <input
                                    key={i}
                                    ref={(el) => (inputRefs.current[i] = el)}
                                    id={`login-otp-cell-${i}`}
                                    className={`otp-cell ${d ? 'filled' : ''}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={d}
                                    onChange={(e) => handleDigitChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    autoFocus={i === 0}
                                />
                            ))}
                        </div>

                        <button
                            id="login-otp-submit"
                            className="btn btn-primary"
                            type="submit"
                            disabled={loading || otp.length < 6}
                        >
                            {loading ? <><span className="spinner" /> Verifying…</> : 'Verify & Sign In →'}
                        </button>
                    </form>

                    <div className="auth-divider">or</div>

                    <button
                        id="login-otp-resend"
                        className="btn btn-ghost"
                        onClick={handleResend}
                        disabled={resendCooldown > 0}
                    >
                        {resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : '← Back to Login'}
                    </button>
                </div>
            </div>
        </div>
    );
}
