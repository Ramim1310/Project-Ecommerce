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
        <div className="min-h-screen bg-zinc-950 font-sans flex flex-col">
            {/* Navbar */}
            <nav className="bg-zinc-900/80 border-b border-zinc-800 py-4 px-10 max-md:py-3.5 max-md:px-5 flex items-center justify-between">
                <span className="text-lg font-bold tracking-tight">
                    Nexus<span className="text-cyan-500">Tech</span>
                </span>
                <div className="flex items-center gap-4 text-zinc-400 text-sm">
                    <span className="hidden sm:inline text-zinc-500">{user.email}</span>
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-zinc-950 font-bold text-xs">
                        {getInitials(user.name)}
                    </div>
                    <button
                        id="logout-btn"
                        onClick={handleLogout}
                        className="text-zinc-400 hover:text-red-400 transition-colors text-sm"
                    >
                        Sign out
                    </button>
                </div>
            </nav>

            {/* Main content */}
            <main className="flex-1 py-12 px-10 max-w-[1100px] mx-auto w-full max-md:py-8 max-md:px-5">
                {/* Welcome */}
                <div className="mb-10 border-b border-zinc-800 pb-6">
                    <h1 className="text-2xl font-bold mb-1 text-zinc-100">
                        Hey, <span className="text-cyan-400">{user.name?.split(' ')[0] || 'there'}</span> 👋
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Welcome back to your dashboard.
                    </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg py-6 px-7 mb-9 flex items-center gap-5">
                    <div className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center text-xl font-black text-zinc-950 shrink-0">
                        {getInitials(user.name)}
                    </div>
                    <div>
                        <div className="font-semibold text-base text-zinc-100">{user.name}</div>
                        <div className="text-zinc-500 text-sm mt-0.5">{user.email}</div>
                        <div className="mt-2">
                            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                                user.role === 'ADMIN'
                                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                            }`}>
                                {user.role === 'ADMIN' ? 'Admin' : 'Customer'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-10">
                    <button onClick={() => navigate('/orders')} className="bg-zinc-900 border border-zinc-800 rounded-lg py-6 px-5 transition-all hover:border-cyan-500 text-left group">
                        <div className="text-2xl mb-3">🛒</div>
                        <h3 className="text-sm font-semibold mb-1 text-zinc-100 group-hover:text-cyan-400 transition-colors">My Orders</h3>
                        <p className="text-xs text-zinc-500">Track and manage your purchases</p>
                    </button>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg py-6 px-5 transition-all hover:border-cyan-500 group cursor-pointer">
                        <div className="text-2xl mb-3">❤️</div>
                        <h3 className="text-sm font-semibold mb-1 text-zinc-100 group-hover:text-cyan-400 transition-colors">Wishlist</h3>
                        <p className="text-xs text-zinc-500">Items you've saved for later</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg py-6 px-5 transition-all hover:border-cyan-500 group cursor-pointer">
                        <div className="text-2xl mb-3">⚙️</div>
                        <h3 className="text-sm font-semibold mb-1 text-zinc-100 group-hover:text-cyan-400 transition-colors">Build a PC</h3>
                        <p className="text-xs text-zinc-500">Design your custom setup</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg py-6 px-5 transition-all hover:border-cyan-500 group cursor-pointer">
                        <div className="text-2xl mb-3">🔔</div>
                        <h3 className="text-sm font-semibold mb-1 text-zinc-100 group-hover:text-cyan-400 transition-colors">Price Alerts</h3>
                        <p className="text-xs text-zinc-500">Get notified on price drops</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg py-6 px-5 transition-all hover:border-cyan-500 group cursor-pointer">
                        <div className="text-2xl mb-3">👤</div>
                        <h3 className="text-sm font-semibold mb-1 text-zinc-100 group-hover:text-cyan-400 transition-colors">Account</h3>
                        <p className="text-xs text-zinc-500">Manage your details</p>
                    </div>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-8 text-center">
                    <div className="text-3xl mb-3">🚀</div>
                    <h2 className="text-zinc-100 font-semibold mb-2">More features coming soon</h2>
                    <p className="text-zinc-500 text-sm">PC builder, wishlist, and deals are on the way.</p>
                </div>
            </main>
        </div>
    );
}
