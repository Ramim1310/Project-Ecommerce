import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            return setError('All fields are required.');
        }
        if (form.password.length < 6) {
            return setError('Password must be at least 6 characters.');
        }
        if (form.password !== form.confirm) {
            return setError('Passwords do not match.');
        }

        setLoading(true);
        try {
            await axios.post(`${API}/auth/register`, {
                name: form.name,
                email: form.email,
                password: form.password,
            });
            // Pass email to verify-otp page via state
            navigate('/verify-otp', { state: { email: form.email, purpose: 'register' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Left hero panel */}
            <div className="auth-hero">
                <div className="hero-logo">⚡ TechParts</div>
                <p className="hero-tagline">Your one-stop shop for premium computer components</p>
                <div className="hero-features">
                    <div className="hero-feature">
                        <span className="hero-feature-icon">🖥️</span>
                        <span>CPUs, GPUs & Motherboards</span>
                    </div>
                    <div className="hero-feature">
                        <span className="hero-feature-icon">⚡</span>
                        <span>Fast delivery, tracked orders</span>
                    </div>
                    <div className="hero-feature">
                        <span className="hero-feature-icon">🔐</span>
                        <span>Secure 2-step verification</span>
                    </div>
                    <div className="hero-feature">
                        <span className="hero-feature-icon">💳</span>
                        <span>Multiple payment methods</span>
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="auth-form-panel">
                <div className="auth-card">
                    {/* Step indicator */}
                    <div className="step-indicator">
                        <div className="step-dot active" title="Create Account" />
                        <div className="step-dot" title="Verify Email" />
                        <div className="step-dot" title="Done" />
                    </div>

                    <h1 className="auth-card-title">Create Account</h1>
                    <p className="auth-card-subtitle">
                        Join TechParts Store — we'll send a verification code to your email.
                    </p>

                    {error && (
                        <div className="alert alert-error">
                            <span>⚠</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label className="form-label" htmlFor="reg-name">Full Name</label>
                            <input
                                id="reg-name"
                                className="form-input"
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={handleChange}
                                autoComplete="name"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="reg-email">Email Address</label>
                            <input
                                id="reg-email"
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
                            <label className="form-label" htmlFor="reg-password">Password</label>
                            <input
                                id="reg-password"
                                className="form-input"
                                type="password"
                                name="password"
                                placeholder="Min. 6 characters"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
                            <input
                                id="reg-confirm"
                                className={`form-input ${form.confirm && form.confirm !== form.password ? 'error' : ''}`}
                                type="password"
                                name="confirm"
                                placeholder="Repeat your password"
                                value={form.confirm}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                        </div>

                        <button
                            id="register-submit"
                            className="btn btn-primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <><span className="spinner" /> Creating Account…</> : 'Create Account →'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account?{' '}
                        <Link to="/login">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
