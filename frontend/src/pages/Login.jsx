import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isAuthenticated, saveSession } from '../utils/auth';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // If user already has a valid JWT → skip to dashboard
    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            return setError('Please enter your email and password.');
        }

        setLoading(true);
        try {
            const { data } = await axios.post(`${API}/auth/login`, {
                email: form.email,
                password: form.password,
            });

            if (data.requiresTwoFactor) {
                // Go to 2FA OTP page
                navigate('/login/verify', {
                    state: { email: form.email, purpose: 'login' },
                });
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            const requiresVerification = err.response?.data?.requiresVerification;

            if (requiresVerification) {
                setError(msg + ' Redirecting to verification…');
                setTimeout(() => {
                    navigate('/verify-otp', {
                        state: { email: form.email, purpose: 'register' },
                    });
                }, 1500);
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Left hero */}
            <div className="auth-hero">
                <div className="hero-logo">⚡ TechParts</div>
                <p className="hero-tagline">Computer parts & components store</p>
                <div className="hero-features">
                    <div className="hero-feature">
                        <span className="hero-feature-icon">🔐</span>
                        <span>2-step login protection</span>
                    </div>
                    <div className="hero-feature">
                        <span className="hero-feature-icon">🛒</span>
                        <span>Track your orders instantly</span>
                    </div>
                    <div className="hero-feature">
                        <span className="hero-feature-icon">⚙️</span>
                        <span>Build your custom PC</span>
                    </div>
                    <div className="hero-feature">
                        <span className="hero-feature-icon">💡</span>
                        <span>Expert product recommendations</span>
                    </div>
                </div>
            </div>

            {/* Right form */}
            <div className="auth-form-panel">
                <div className="auth-card">
                    <div className="step-indicator">
                        <div className="step-dot active" />
                        <div className="step-dot" />
                        <div className="step-dot" />
                    </div>

                    <h1 className="auth-card-title">Welcome Back</h1>
                    <p className="auth-card-subtitle">
                        Sign in to your TechParts account. A verification code will be sent to your email.
                    </p>

                    {error && (
                        <div className="alert alert-error">
                            <span>⚠</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label className="form-label" htmlFor="login-email">Email Address</label>
                            <input
                                id="login-email"
                                className="form-input"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="login-password">Password</label>
                            <input
                                id="login-password"
                                className="form-input"
                                type="password"
                                name="password"
                                placeholder="Your password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            id="login-submit"
                            className="btn btn-primary"
                            type="submit"
                            disabled={loading}
                            style={{ marginTop: '8px' }}
                        >
                            {loading ? <><span className="spinner" /> Signing In…</> : 'Continue →'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account?{' '}
                        <Link to="/register">Create one free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
