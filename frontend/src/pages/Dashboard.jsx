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
        <div className="dashboard-page">
            {/* Navbar */}
            <nav className="dashboard-nav">
                <span className="nav-logo">⚡ TechParts Store</span>
                <div className="nav-user">
                    <span style={{ color: '#64748b' }}>{user.email}</span>
                    <div className="nav-avatar">{getInitials(user.name)}</div>
                    <button
                        id="logout-btn"
                        onClick={handleLogout}
                        style={{
                            background: 'transparent',
                            border: '1px solid #1e2d4e',
                            color: '#94a3b8',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => {
                            e.target.style.borderColor = '#f87171';
                            e.target.style.color = '#f87171';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.borderColor = '#1e2d4e';
                            e.target.style.color = '#94a3b8';
                        }}
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* Main content */}
            <main className="dashboard-content">
                {/* Welcome */}
                <div className="dashboard-welcome">
                    <h1>Welcome back, <span>{user.name?.split(' ')[0] || 'Shopper'}</span> 👋</h1>
                    <p style={{ color: '#64748b', marginTop: '4px' }}>
                        Your session is active. Here's what's happening in your store.
                    </p>
                </div>

                {/* Info card */}
                <div
                    style={{
                        background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(6,182,212,0.08))',
                        border: '1px solid #1e2d4e',
                        borderRadius: '16px',
                        padding: '28px 32px',
                        marginBottom: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                    }}
                >
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.6rem',
                            fontWeight: '800',
                            color: '#fff',
                            flexShrink: 0,
                        }}
                    >
                        {getInitials(user.name)}
                    </div>
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{user.name}</div>
                        <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '2px' }}>{user.email}</div>
                        <div style={{ marginTop: '8px' }}>
                            <span
                                style={{
                                    background: user.role === 'ADMIN' ? 'rgba(251,191,36,0.15)' : 'rgba(52,211,153,0.12)',
                                    border: `1px solid ${user.role === 'ADMIN' ? 'rgba(251,191,36,0.4)' : 'rgba(52,211,153,0.3)'}`,
                                    color: user.role === 'ADMIN' ? '#fbbf24' : '#34d399',
                                    padding: '3px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.78rem',
                                    fontWeight: '600',
                                    letterSpacing: '0.5px',
                                }}
                            >
                                {user.role === 'ADMIN' ? '👑 Admin' : '🛒 Customer'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick action cards */}
                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <div className="dashboard-card-icon">🛒</div>
                        <h3>My Orders</h3>
                        <p>Track and manage your purchases</p>
                    </div>
                    <div className="dashboard-card">
                        <div className="dashboard-card-icon">❤️</div>
                        <h3>Wishlist</h3>
                        <p>Items you're saving for later</p>
                    </div>
                    <div className="dashboard-card">
                        <div className="dashboard-card-icon">🖥️</div>
                        <h3>PC Builder</h3>
                        <p>Configure your custom build</p>
                    </div>
                    <div className="dashboard-card">
                        <div className="dashboard-card-icon">🔔</div>
                        <h3>Alerts</h3>
                        <p>Price drops & stock updates</p>
                    </div>
                    <div className="dashboard-card">
                        <div className="dashboard-card-icon">⚙️</div>
                        <h3>Settings</h3>
                        <p>Manage your account details</p>
                    </div>
                    <div className="dashboard-card">
                        <div className="dashboard-card-icon">🎁</div>
                        <h3>Deals</h3>
                        <p>Today's best component deals</p>
                    </div>
                </div>

                {/* Featured banner */}
                <div
                    style={{
                        background: 'linear-gradient(135deg, #0f1629, #162040)',
                        border: '1px solid #1e2d4e',
                        borderRadius: '16px',
                        padding: '36px',
                        textAlign: 'center',
                        color: '#475569',
                        fontSize: '0.9rem',
                    }}
                >
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚀</div>
                    <h2 style={{ color: '#94a3b8', marginBottom: '8px', fontSize: '1.2rem' }}>
                        Shop Coming Soon
                    </h2>
                    <p>The product catalog, cart, and checkout are being built. Stay tuned!</p>
                </div>
            </main>
        </div>
    );
}
