import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, purpose } = location.state || {};

    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const inputRefs = useRef([]);

    // Redirect if no email in state
    useEffect(() => {
        if (!email) navigate('/register');
    }, [email, navigate]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleDigitChange = (index, value) => {
        // Accept only digits
        const clean = value.replace(/\D/g, '').slice(-1);
        const next = [...digits];
        next[index] = clean;
        setDigits(next);
        setError('');

        // Auto-advance focus
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
        if (otp.length < 6) return setError('Please enter the full 6-digit code.');

        setLoading(true);
        try {
            await axios.post(`${API}/auth/verify-otp`, { email, otp });
            setSuccess('Email verified! Redirecting to login…');
            setTimeout(() => navigate('/login'), 1800);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        try {
            await axios.post(`${API}/auth/resend-otp`, { email });
            setSuccess('A new code has been sent to your email.');
            setResendCooldown(60);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code.');
        }
    };

    const isRegistration = purpose === 'register';

    return (
        <div className="auth-page">
            {/* Left hero */}
            <div className="auth-hero">
                <div className="hero-logo">⚡ TechParts</div>
                <p className="hero-tagline">Secure account verification</p>
                <div className="hero-features">
                    <div className="hero-feature">
                        <span className="hero-feature-icon">📧</span>
                        <span>Check your inbox for the code</span>
                    </div>
                    <div className="hero-feature">
                        <span className="hero-feature-icon">⏱</span>
                        <span>Code expires in 10 minutes</span>
                    </div>
                    <div className="hero-feature">
                        <span className="hero-feature-icon">🔁</span>
                        <span>Resend if you don't receive it</span>
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

                    <h1 className="auth-card-title">
                        {isRegistration ? 'Verify Your Email' : 'Two-Factor Auth'}
                    </h1>
                    <p className="auth-card-subtitle">
                        We sent a 6-digit code to <strong style={{ color: '#93c5fd' }}>{email}</strong>.
                        Enter it below to {isRegistration ? 'activate your account' : 'complete login'}.
                    </p>

                    {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}
                    {success && <div className="alert alert-success"><span>✓</span> {success}</div>}

                    <form onSubmit={handleVerify} noValidate>
                        <div className="otp-grid" onPaste={handlePaste}>
                            {digits.map((d, i) => (
                                <input
                                    key={i}
                                    ref={(el) => (inputRefs.current[i] = el)}
                                    id={`otp-cell-${i}`}
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
                            id="verify-otp-submit"
                            className="btn btn-primary"
                            type="submit"
                            disabled={loading || otp.length < 6}
                        >
                            {loading ? <><span className="spinner" /> Verifying…</> : 'Verify Code →'}
                        </button>
                    </form>

                    <div className="auth-divider">or</div>

                    <button
                        id="resend-otp-btn"
                        className="btn btn-ghost"
                        onClick={handleResend}
                        disabled={resendCooldown > 0}
                    >
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : '↻ Resend Code'}
                    </button>

                    <p className="auth-footer" style={{ marginTop: '20px' }}>
                        <Link to="/register">← Back to Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
