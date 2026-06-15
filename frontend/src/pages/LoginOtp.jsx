import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API from '../api/apiClient';
import { saveSession } from '../utils/auth';

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

    useEffect(() => {
        if (!email) navigate('/login');
    }, [email, navigate]);

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
            const { data } = await API.post('/auth/verify-login-otp', { email, otp });

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
            navigate('/login');
        } catch {
            setError('Failed to resend. Please go back and log in again.');
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-bg-deep overflow-hidden">
            {/* Left hero */}
            <div className="relative hidden md:flex flex-col justify-center items-center py-16 px-12 bg-bg-card border-r border-border overflow-hidden">
                <div className="absolute -top-[120px] -left-[120px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.25)_0%,transparent_70%)] pointer-events-none"></div>
                <div className="absolute -bottom-[100px] -right-[100px] w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.18)_0%,transparent_70%)] pointer-events-none"></div>
                
                <div className="text-3xl font-extrabold bg-gradient-to-br from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-3 tracking-tight z-10">
                    ⚡ Nexus Tech
                </div>
                <p className="text-text-secondary text-[0.95rem] mb-12 text-center z-10">
                    Two-factor authentication
                </p>
                <div className="flex flex-col gap-4 w-full max-w-[300px] z-10">
                    <div className="flex items-center gap-3.5 bg-white/5 border border-border rounded-md px-4.5 py-3.5 text-[0.9rem] text-text-secondary transition-colors hover:border-blue-500">
                        <span className="text-[1.4rem] shrink-0">🛡️</span>
                        <span>Your account is protected</span>
                    </div>
                    <div className="flex items-center gap-3.5 bg-white/5 border border-border rounded-md px-4.5 py-3.5 text-[0.9rem] text-text-secondary transition-colors hover:border-blue-500">
                        <span className="text-[1.4rem] shrink-0">📧</span>
                        <span>Code sent to your email</span>
                    </div>
                    <div className="flex items-center gap-3.5 bg-white/5 border border-border rounded-md px-4.5 py-3.5 text-[0.9rem] text-text-secondary transition-colors hover:border-blue-500">
                        <span className="text-[1.4rem] shrink-0">⏱</span>
                        <span>Expires in 10 minutes</span>
                    </div>
                </div>
            </div>

            {/* Right form */}
            <div className="flex items-center justify-center p-8 md:py-12 md:px-10 overflow-y-auto">
                <div className="w-full max-w-[420px]">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-2 h-2 rounded-full bg-success transition-colors" />
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-dot" />
                        <div className="w-2 h-2 rounded-full bg-border transition-colors" />
                    </div>

                    <h1 className="text-[1.75rem] font-bold text-text-primary mb-1.5">Check Your Email</h1>
                    <p className="text-text-secondary text-[0.9rem] mb-9">
                        We sent a login code to <strong className="text-blue-300 font-bold">{email}</strong>.
                        Enter it below to access your account.
                    </p>

                    {error && (
                        <div className="px-4 py-3 rounded-sm text-[0.88rem] mb-5 flex items-start gap-2.5 bg-red-400/10 border border-red-400/30 text-error">
                            <span>⚠</span> {error}
                        </div>
                    )}
                    {success && (
                        <div className="px-4 py-3 rounded-sm text-[0.88rem] mb-5 flex items-start gap-2.5 bg-emerald-400/10 border border-emerald-400/30 text-success">
                            <span>✓</span> {success}
                        </div>
                    )}

                    <form onSubmit={handleVerify} noValidate>
                        <div className="flex gap-2 mb-7 w-full overflow-hidden" onPaste={handlePaste}>
                            {digits.map((d, i) => (
                                <input
                                    key={i}
                                    ref={(el) => (inputRefs.current[i] = el)}
                                    id={`login-otp-cell-${i}`}
                                    className={`flex-1 min-w-0 max-w-[56px] h-[56px] bg-bg-elevated border-2 rounded-sm text-[1.4rem] font-bold font-mono text-center outline-none transition-all focus:border-cyan-500 focus:shadow-otp-focus ${d ? 'border-blue-500 text-cyan-400' : 'border-border text-text-primary'}`}
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
                            className="inline-flex items-center justify-center gap-2 px-6 py-[13px] mt-2 rounded-sm text-[0.95rem] font-semibold tracking-[0.3px] border-none outline-none transition-all bg-gradient-to-br from-blue-600 to-cyan-500 text-white w-full shadow-btn hover:-translate-y-[1px] hover:shadow-btn-hover active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading || otp.length < 6}
                        >
                            {loading ? (
                                <>
                                    <span className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin-custom" />
                                    Verifying…
                                </>
                            ) : (
                                'Verify & Sign In →'
                            )}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-6 text-text-muted text-[0.82rem] before:content-[''] before:flex-1 before:h-[1px] before:bg-border after:content-[''] after:flex-1 after:h-[1px] after:bg-border">or</div>

                    <button
                        id="login-otp-resend"
                        className="inline-flex items-center justify-center gap-2 px-6 py-[13px] rounded-sm text-[0.95rem] font-semibold tracking-[0.3px] outline-none transition-all w-full bg-transparent text-cyan-400 border border-border hover:border-cyan-500 hover:bg-cyan-400/10 disabled:opacity-60 disabled:cursor-not-allowed"
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
