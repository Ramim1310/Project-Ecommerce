import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, clearSession, getToken } from '../utils/auth';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [time, setTime] = useState(new Date());
    const [statsData, setStatsData] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        setAdmin(getUser());
        const tick = setInterval(() => setTime(new Date()), 1000);

        // Fetch live stats from backend
        const token = getToken();
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/admin/telemetry`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) setStatsData(json.data);
            })
            .catch(() => {})
            .finally(() => setStatsLoading(false));

        return () => clearInterval(tick);
    }, []);

    const handleLogout = () => {
        clearSession();
        navigate('/login', { replace: true });
    };

    if (!admin) return null;

    const fmt = (n) => (n === null || n === undefined ? '—' : Number(n).toLocaleString());

    const stats = [
        {
            label: 'Total Products',
            value: statsLoading ? '…' : fmt(statsData?.totalProducts),
            icon: '📦',
            color: 'from-blue-600 to-cyan-500',
        },
        {
            label: 'Registered Users',
            value: statsLoading ? '…' : fmt(statsData?.totalUsers),
            icon: '👥',
            color: 'from-violet-600 to-purple-500',
        },
        {
            label: 'Total SKUs',
            value: statsLoading ? '…' : fmt(statsData?.totalVariants),
            icon: '🔧',
            color: 'from-emerald-600 to-teal-500',
        },
        {
            label: 'Stock Units',
            value: statsLoading ? '…' : fmt(statsData?.totalStock),
            icon: '📊',
            color: 'from-amber-500 to-orange-500',
        },
    ];

    const quickLinks = [
        { label: 'Manage Products', desc: 'Add, edit or remove products', icon: '📦', path: '/admin/manage-products' },
        { label: 'Manage Orders', desc: 'View and update order status', icon: '📋', path: '/admin/manage-orders' },
        { label: 'Manage Users', desc: 'View registered customers', icon: '👤', path: '/admin/manage-users' },
        { label: 'Site Settings', desc: 'Configure store settings', icon: '⚙️', soon: true },
        { label: 'Analytics', desc: 'Sales and traffic reports', icon: '📊', path: '/admin/analytics' },
        { label: 'Promotions', desc: 'Coupons and discount codes', icon: '🎁', soon: true },
    ];

    return (
        <div className="min-h-screen bg-[#050508] text-white font-sans">

            {/* Top Nav */}
            <nav className="bg-[#0a0a0f] border-b border-gray-800/60 px-8 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <span className="text-xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent tracking-tight">
                        ⚡ NEXUS
                    </span>
                    <span className="text-[10px] font-mono text-amber-400/70 border border-amber-400/30 rounded px-2 py-0.5 uppercase tracking-widest">
                        Admin Panel
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-gray-500 hidden md:block">
                        {time.toLocaleTimeString()}
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-black text-xs">
                            A
                        </div>
                        <span className="text-xs text-gray-400 hidden md:block">{admin.email}</span>
                    </div>
                    <button
                        id="admin-logout-btn"
                        onClick={handleLogout}
                        className="text-xs font-mono text-gray-500 border border-gray-800 px-3 py-1.5 rounded hover:border-red-500/50 hover:text-red-400 transition-all"
                    >
                        LOGOUT
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="mb-10 flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-mono text-amber-400 border border-amber-400/30 bg-amber-400/10 rounded px-2 py-0.5 uppercase tracking-widest">
                                👑 Super Admin
                            </span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">
                            Admin <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Command Center</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1 font-mono">
                            Full store access · {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="text-xs font-mono text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 rounded hover:bg-cyan-500/20 transition-all"
                    >
                        ← View Store
                    </button>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-10" />

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {stats.map((s) => (
                        <div key={s.label} className="bg-[#0d0d14] border border-gray-800/60 rounded-xl p-5 hover:border-gray-700 transition-all group">
                            <div className={`text-2xl mb-3 w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-base`}>
                                {s.icon}
                            </div>
                            <div className="text-2xl font-black text-white mb-1">{s.value}</div>
                            <div className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Section: Management */}
                <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Management Modules</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {quickLinks.map((link) => (
                        <div
                            key={link.label}
                            onClick={() => link.path && navigate(link.path)}
                            className={`relative bg-[#0d0d14] border border-gray-800/60 rounded-xl p-6 transition-all overflow-hidden group ${
                                link.path
                                    ? 'hover:border-amber-500/50 hover:-translate-y-0.5 cursor-pointer'
                                    : 'opacity-60 cursor-not-allowed'
                            }`}
                        >
                            {link.soon && (
                                <span className="absolute top-3 right-3 text-[9px] font-mono text-gray-600 border border-gray-800 rounded px-1.5 py-0.5 uppercase">
                                    Coming Soon
                                </span>
                            )}
                            <div className="text-2xl mb-3">{link.icon}</div>
                            <h3 className={`text-sm font-bold mb-1 transition-colors ${
                                link.path ? 'text-white group-hover:text-amber-400' : 'text-gray-600'
                            }`}>{link.label}</h3>
                            <p className="text-xs text-gray-500">{link.desc}</p>
                            {link.path && (
                                <span className="absolute bottom-4 right-4 text-amber-400/40 text-lg group-hover:text-amber-400 transition-colors">→</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Security Note */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 flex items-start gap-4">
                    <span className="text-amber-400 text-xl shrink-0">🔒</span>
                    <div>
                        <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">Secure Session</div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            You are signed in as <span className="text-amber-400 font-mono">{admin.email}</span>.
                            This admin session expires in <span className="text-amber-400 font-mono">8 hours</span>.
                            Always log out when done. Admin credentials are stored server-side only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
