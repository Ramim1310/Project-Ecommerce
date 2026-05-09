import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUser, clearSession } from '../utils/auth';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login', { replace: true });
            return;
        }
        setUser(getUser());
    }, [navigate]);

    const handleLogout = () => {
        clearSession();
        navigate('/login', { replace: true });
    };

    const getInitials = (name = '') =>
        name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-bg-deep flex flex-col">
            {/* Navbar */}
            <nav className="bg-bg-card border-b border-border py-4 px-10 max-md:py-3.5 max-md:px-5 flex items-center justify-between">
                <span className="text-[1.2rem] font-extrabold bg-gradient-to-br from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    ⚡ Nexus Tech
                </span>
                <div className="flex items-center gap-3 text-text-secondary text-[0.9rem]">
                    <span className="text-slate-500">{user.email}</span>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-[0.85rem]">
                        {getInitials(user.name)}
                    </div>
                    <button
                        id="logout-btn"
                        onClick={handleLogout}
                        className="bg-transparent border border-border text-slate-400 py-1.5 px-3.5 rounded-md cursor-pointer text-[0.85rem] transition-all hover:border-red-400 hover:text-red-400"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* Main content */}
            <main className="flex-1 py-12 px-10 max-w-[1100px] mx-auto w-full max-md:py-8 max-md:px-5">
                {/* Welcome */}
                <div className="mb-10">
                    <h1 className="text-[2rem] font-extrabold mb-1.5 text-text-primary">
                        Welcome back, <span className="bg-gradient-to-br from-blue-600 to-cyan-500 bg-clip-text text-transparent">{user.name?.split(' ')[0] || 'Shopper'}</span> 👋
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Your session is active. Here's what's happening in your store.
                    </p>
                </div>

                {/* Info card */}
                <div className="bg-gradient-to-br from-blue-600/10 to-cyan-500/10 border border-border rounded-2xl py-7 px-8 mb-9 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-[1.6rem] font-extrabold text-white shrink-0">
                        {getInitials(user.name)}
                    </div>
                    <div>
                        <div className="font-bold text-[1.1rem] text-text-primary">{user.name}</div>
                        <div className="text-slate-500 text-[0.9rem] mt-0.5">{user.email}</div>
                        <div className="mt-2">
                            <span
                                className={`px-3 py-1 rounded-full text-[0.78rem] font-semibold tracking-[0.5px] border ${
                                    user.role === 'ADMIN'
                                        ? 'bg-amber-400/15 border-amber-400/40 text-amber-400'
                                        : 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400'
                                }`}
                            >
                                {user.role === 'ADMIN' ? '👑 Admin' : '🛒 Customer'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick action cards */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 mb-10">
                    <div className="bg-bg-card border border-border rounded-2xl py-7 px-6 transition-all hover:border-blue-500 hover:-translate-y-0.5">
                        <div className="text-2xl mb-3.5">🛒</div>
                        <h3 className="text-base font-semibold mb-1 text-text-primary">My Orders</h3>
                        <p className="text-[0.85rem] text-text-secondary">Track and manage your purchases</p>
                    </div>
                    <div className="bg-bg-card border border-border rounded-2xl py-7 px-6 transition-all hover:border-blue-500 hover:-translate-y-0.5">
                        <div className="text-2xl mb-3.5">❤️</div>
                        <h3 className="text-base font-semibold mb-1 text-text-primary">Wishlist</h3>
                        <p className="text-[0.85rem] text-text-secondary">Items you're saving for later</p>
                    </div>
                    <div className="bg-bg-card border border-border rounded-2xl py-7 px-6 transition-all hover:border-blue-500 hover:-translate-y-0.5">
                        <div className="text-2xl mb-3.5">🖥️</div>
                        <h3 className="text-base font-semibold mb-1 text-text-primary">PC Builder</h3>
                        <p className="text-[0.85rem] text-text-secondary">Configure your custom build</p>
                    </div>
                    <div className="bg-bg-card border border-border rounded-2xl py-7 px-6 transition-all hover:border-blue-500 hover:-translate-y-0.5">
                        <div className="text-2xl mb-3.5">🔔</div>
                        <h3 className="text-base font-semibold mb-1 text-text-primary">Alerts</h3>
                        <p className="text-[0.85rem] text-text-secondary">Price drops & stock updates</p>
                    </div>
                    <div className="bg-bg-card border border-border rounded-2xl py-7 px-6 transition-all hover:border-blue-500 hover:-translate-y-0.5">
                        <div className="text-2xl mb-3.5">⚙️</div>
                        <h3 className="text-base font-semibold mb-1 text-text-primary">Settings</h3>
                        <p className="text-[0.85rem] text-text-secondary">Manage your account details</p>
                    </div>
                    <div className="bg-bg-card border border-border rounded-2xl py-7 px-6 transition-all hover:border-blue-500 hover:-translate-y-0.5">
                        <div className="text-2xl mb-3.5">🎁</div>
                        <h3 className="text-base font-semibold mb-1 text-text-primary">Deals</h3>
                        <p className="text-[0.85rem] text-text-secondary">Today's best component deals</p>
                    </div>
                </div>

                {/* Featured banner */}
                <div className="bg-gradient-to-br from-[#0f1629] to-[#162040] border border-border rounded-2xl p-9 text-center text-slate-500 text-[0.9rem]">
                    <div className="text-[2.5rem] mb-3">🚀</div>
                    <h2 className="text-slate-400 mb-2 text-[1.2rem] font-bold">
                        Shop Coming Soon
                    </h2>
                    <p>The product catalog, cart, and checkout are being built. Stay tuned!</p>
                </div>
            </main>
        </div>
    );
}
