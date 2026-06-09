import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, getToken } from '../utils/auth';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [statsData, setStatsData] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        setAdmin(getUser());

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
    }, []);

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
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500 selection:text-black flex flex-col">


            <div className="max-w-6xl mx-auto px-6 py-10 flex-grow">
                {/* Header */}
                <div className="mb-10 flex items-start justify-between flex-wrap gap-4 border-b border-zinc-800 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                System online
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-zinc-500 text-sm mt-1">
                            {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-zinc-400 border border-zinc-700 bg-zinc-900 px-4 py-2 hover:bg-zinc-800 hover:text-zinc-100 transition-all rounded-sm"
                    >
                        ← View store
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {stats.map((s) => (
                        <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 hover:border-cyan-500 transition-all group flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-xl">{s.icon}</div>
                                <span className="text-xs text-zinc-600 group-hover:text-cyan-500 transition-colors">live</span>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-zinc-100 mb-1">{s.value}</div>
                                <div className="text-xs text-zinc-500 uppercase tracking-wider">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Section: Management */}
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">
                    Quick actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {quickLinks.map((link) => (
                        <div
                            key={link.label}
                            onClick={() => link.path && navigate(link.path)}
                            className={`relative bg-zinc-900 border border-zinc-800 rounded-lg p-6 transition-all group flex flex-col ${
                                link.path
                                    ? 'hover:border-cyan-500 cursor-pointer hover:bg-zinc-800/80'
                                    : 'opacity-50 cursor-not-allowed'
                            }`}
                        >
                            {link.soon && (
                                <span className="absolute top-4 right-4 text-[10px] text-zinc-500 border border-zinc-700 px-1.5 py-0.5 rounded-sm">
                                    Coming soon
                                </span>
                            )}
                            <div className="text-xl mb-3">{link.icon}</div>
                            <h3 className={`text-sm font-semibold mb-1 transition-colors ${
                                link.path ? 'text-zinc-100 group-hover:text-cyan-400' : 'text-zinc-600'
                            }`}>{link.label}</h3>
                            <p className="text-xs text-zinc-500">{link.desc}</p>
                            {link.path && (
                                <div className="mt-4 text-xs text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                    Open →
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-5 flex items-start gap-3">
                    <span className="text-zinc-400 shrink-0 mt-0.5">🔒</span>
                    <div>
                        <div className="text-sm font-medium text-zinc-300 mb-1">Signed in as admin</div>
                        <p className="text-xs text-zinc-500">
                            You're logged in as <span className="text-zinc-300">{admin.email}</span>. Remember to sign out when you're done.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
