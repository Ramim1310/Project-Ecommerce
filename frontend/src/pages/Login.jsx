import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isAuthenticated, saveSession, getUser } from '../utils/auth';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated()) {
            const user = getUser();
            if (user?.role === 'ADMIN') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
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
                navigate('/login/verify', {
                    state: { email: form.email, purpose: 'login' },
                });
            } else if (data.token) {
                saveSession(data.token, data.user);
                navigate(
                    data.user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard',
                    { replace: true }
                );
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
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-zinc-950 font-sans overflow-hidden">
            {/* Left panel */}
            <div className="relative hidden md:flex flex-col justify-center items-center py-16 px-12 bg-zinc-900/60 border-r border-zinc-800 overflow-hidden">
                {/* Accent glow */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

                <div className="z-10 text-center mb-12">
                    <div className="text-3xl font-black tracking-tight mb-2">
                        Nexus<span className="text-cyan-500">Tech</span>
                    </div>
                    <p className="text-zinc-500 text-sm">
                        PC parts for builders who mean it.
                    </p>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-[300px] z-10">
                    <div className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700/50 rounded-sm px-4 py-3.5 text-sm text-zinc-300">
                        <span className="text-cyan-500 text-base">🔐</span>
                        <span>Two-factor login protection</span>
                    </div>
                    <div className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700/50 rounded-sm px-4 py-3.5 text-sm text-zinc-300">
                        <span className="text-cyan-500 text-base">📦</span>
                        <span>Track your orders in real time</span>
                    </div>
                    <div className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700/50 rounded-sm px-4 py-3.5 text-sm text-zinc-300">
                        <span className="text-cyan-500 text-base">⚙️</span>
                        <span>Build your custom PC config</span>
                    </div>
                </div>
            </div>

            {/* Right form */}
            <div className="flex items-center justify-center p-8 md:py-12 md:px-10 overflow-y-auto">
                <div className="w-full max-w-[400px]">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Welcome back</h1>
                        <p className="text-zinc-500 text-sm">
                            Sign in to your account. We'll send a verification code to your email.
                        </p>
                    </div>

                    {error && (
                        <div className="px-4 py-3 text-sm mb-5 flex items-start gap-2 bg-red-950/30 border border-red-500/40 text-red-400 rounded-sm">
                            <span className="mt-0.5">⚠</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-zinc-300 mb-1.5" htmlFor="login-email">
                                Email address
                            </label>
                            <input
                                id="login-email"
                                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-sm text-zinc-100 text-sm outline-none transition-all focus:border-cyan-500 placeholder-zinc-600"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </div>

                        <div className="mb-7">
                            <label className="block text-sm font-medium text-zinc-300 mb-1.5" htmlFor="login-password">
                                Password
                            </label>
                            <input
                                id="login-password"
                                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-sm text-zinc-100 text-sm outline-none transition-all focus:border-cyan-500 placeholder-zinc-600"
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
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold outline-none transition-all bg-cyan-500 text-zinc-950 w-full hover:bg-cyan-400 rounded-sm disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                                    Signing in…
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-zinc-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
