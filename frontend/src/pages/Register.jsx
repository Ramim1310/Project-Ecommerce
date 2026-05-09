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
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-bg-deep overflow-hidden">
            {/* Left hero panel */}
            <div className="relative hidden md:flex flex-col justify-center items-center py-16 px-12 bg-bg-card border-r border-border overflow-hidden">
                <div className="absolute -top-[120px] -left-[120px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.25)_0%,transparent_70%)] pointer-events-none"></div>
                <div className="absolute -bottom-[100px] -right-[100px] w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.18)_0%,transparent_70%)] pointer-events-none"></div>
                
                <div className="text-3xl font-extrabold bg-gradient-to-br from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-3 tracking-tight z-10">
                    ⚡ Nexus Tech
                </div>
                <p className="text-text-secondary text-[0.95rem] mb-12 text-center z-10">
                    Your one-stop shop for premium computer components
                </p>
                <div className="flex flex-col gap-4 w-full max-w-[300px] z-10">
                    <div className="flex items-center gap-3.5 bg-white/5 border border-border rounded-md px-4.5 py-3.5 text-[0.9rem] text-text-secondary transition-colors hover:border-blue-500">
                        <span className="text-[1.4rem] shrink-0">🖥️</span>
                        <span>CPUs, GPUs & Motherboards</span>
                    </div>
                    <div className="flex items-center gap-3.5 bg-white/5 border border-border rounded-md px-4.5 py-3.5 text-[0.9rem] text-text-secondary transition-colors hover:border-blue-500">
                        <span className="text-[1.4rem] shrink-0">⚡</span>
                        <span>Fast delivery, tracked orders</span>
                    </div>
                    <div className="flex items-center gap-3.5 bg-white/5 border border-border rounded-md px-4.5 py-3.5 text-[0.9rem] text-text-secondary transition-colors hover:border-blue-500">
                        <span className="text-[1.4rem] shrink-0">🔐</span>
                        <span>Secure 2-step verification</span>
                    </div>
                    <div className="flex items-center gap-3.5 bg-white/5 border border-border rounded-md px-4.5 py-3.5 text-[0.9rem] text-text-secondary transition-colors hover:border-blue-500">
                        <span className="text-[1.4rem] shrink-0">💳</span>
                        <span>Multiple payment methods</span>
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex items-center justify-center p-8 md:py-12 md:px-10 overflow-y-auto">
                <div className="w-full max-w-[420px]">
                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-dot" title="Create Account" />
                        <div className="w-2 h-2 rounded-full bg-border transition-colors" title="Verify Email" />
                        <div className="w-2 h-2 rounded-full bg-border transition-colors" title="Done" />
                    </div>

                    <h1 className="text-[1.75rem] font-bold text-text-primary mb-1.5">Create Account</h1>
                    <p className="text-text-secondary text-[0.9rem] mb-9">
                        Join NExus Tech — we'll send a verification code to your email.
                    </p>

                    {error && (
                        <div className="px-4 py-3 rounded-sm text-[0.88rem] mb-5 flex items-start gap-2.5 bg-red-400/10 border border-red-400/30 text-error">
                            <span>⚠</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-5">
                            <label className="block text-[0.82rem] font-semibold text-text-secondary uppercase tracking-[0.8px] mb-2" htmlFor="reg-name">Full Name</label>
                            <input
                                id="reg-name"
                                className="w-full px-4 py-[13px] bg-bg-elevated border border-border rounded-sm text-text-primary text-[0.95rem] outline-none transition-all focus:border-blue-500 focus:shadow-input-focus placeholder-text-muted"
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={handleChange}
                                autoComplete="name"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-[0.82rem] font-semibold text-text-secondary uppercase tracking-[0.8px] mb-2" htmlFor="reg-email">Email Address</label>
                            <input
                                id="reg-email"
                                className="w-full px-4 py-[13px] bg-bg-elevated border border-border rounded-sm text-text-primary text-[0.95rem] outline-none transition-all focus:border-blue-500 focus:shadow-input-focus placeholder-text-muted"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-[0.82rem] font-semibold text-text-secondary uppercase tracking-[0.8px] mb-2" htmlFor="reg-password">Password</label>
                            <input
                                id="reg-password"
                                className="w-full px-4 py-[13px] bg-bg-elevated border border-border rounded-sm text-text-primary text-[0.95rem] outline-none transition-all focus:border-blue-500 focus:shadow-input-focus placeholder-text-muted"
                                type="password"
                                name="password"
                                placeholder="Min. 6 characters"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-[0.82rem] font-semibold text-text-secondary uppercase tracking-[0.8px] mb-2" htmlFor="reg-confirm">Confirm Password</label>
                            <input
                                id="reg-confirm"
                                className={`w-full px-4 py-[13px] bg-bg-elevated border rounded-sm text-text-primary text-[0.95rem] outline-none transition-all focus:shadow-input-focus placeholder-text-muted ${form.confirm && form.confirm !== form.password ? 'border-error focus:border-error' : 'border-border focus:border-blue-500'}`}
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
                            className="inline-flex items-center justify-center gap-2 px-6 py-[13px] mt-2 rounded-sm text-[0.95rem] font-semibold tracking-[0.3px] border-none outline-none transition-all bg-gradient-to-br from-blue-600 to-cyan-500 text-white w-full shadow-btn hover:-translate-y-[1px] hover:shadow-btn-hover active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin-custom" />
                                    Creating Account…
                                </>
                            ) : (
                                'Create Account →'
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-7 text-[0.9rem] text-text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" className="text-cyan-400 no-underline transition-colors hover:text-[#67e8f9]">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
