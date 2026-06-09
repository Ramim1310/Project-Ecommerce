import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import useDebounce from "../../hooks/deBounce";
import { useState, useEffect } from "react";
import { getUser, clearSession } from "../../utils/auth";


export default function Navbar({ onSearch }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const { totalItems, toggleCart } = useCart();

  const [term, setTerm] = useState("");
  const debouncedSearchTerm = useDebounce(term, 500);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    if (onSearch) onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  // Live clock — only runs on admin routes to avoid unnecessary ticks elsewhere
  const isAdminRoute = location.pathname.startsWith("/admin");
  useEffect(() => {
    if (!isAdminRoute) return;
    const tick = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(tick);
  }, [isAdminRoute]);

  return (
    <nav className="bg-zinc-950/95 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-50 font-sans">
      <div className="w-full px-8 h-16 flex items-center justify-between gap-4">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 bg-cyan-500 flex items-center justify-center font-black text-zinc-950 text-xs group-hover:bg-zinc-100 transition-colors rounded-sm">
            Nx
          </div>
          <span className="text-lg font-black tracking-tight">
            Nexus<span className="text-cyan-500">Tech</span>
          </span>
          {/* Admin badge — shown inline next to brand on admin routes */}
          {isAdminRoute && user?.role === 'ADMIN' && (
            <span className="ml-1 text-[10px] font-semibold text-cyan-400 border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5 rounded-sm uppercase tracking-widest">
              Admin
            </span>
          )}
        </Link>

        {/* Nav links — hidden on admin routes to reduce clutter */}
        {!isAdminRoute && (
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
              Shop
            </Link>
            <Link to="/rig-builder" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
              Build a PC
            </Link>
            <Link to="/support" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
              Support
            </Link>

            {user?.role === 'ADMIN' && (
              <Link
                to="/admin/dashboard"
                className="text-cyan-400 border border-cyan-500/40 px-3 py-1 text-xs font-semibold hover:bg-cyan-500 hover:text-zinc-950 hover:border-cyan-500 transition-all rounded-sm"
              >
                Admin
              </Link>
            )}
          </div>
        )}


        {/* Admin sub-nav links — only on admin routes */}
        {isAdminRoute && (
          <div className="hidden md:flex items-center gap-6">
            <Link to="/admin/dashboard" className={`text-sm font-medium transition-colors ${location.pathname === '/admin/dashboard' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'}`}>
              Overview
            </Link>
            <Link to="/admin/manage-products" className={`text-sm font-medium transition-colors ${location.pathname === '/admin/manage-products' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'}`}>
              Products
            </Link>
            <Link to="/admin/manage-orders" className={`text-sm font-medium transition-colors ${location.pathname === '/admin/manage-orders' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'}`}>
              Orders
            </Link>
            <Link to="/admin/analytics" className={`text-sm font-medium transition-colors ${location.pathname === '/admin/analytics' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'}`}>
              Analytics
            </Link>
            <Link to="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
              ← Store
            </Link>
          </div>
        )}

        {/* Search — hidden on admin pages */}
        {!isAdminRoute && (
          <div className="flex-1 max-w-sm mx-6 hidden lg:block">
            <input
              type="text"
              placeholder="Search parts, brands, models..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-sm py-2 px-4 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500 transition-all placeholder-zinc-600"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>
        )}

        {/* Spacer on admin routes */}
        {isAdminRoute && <div className="flex-1" />}

        {/* Admin info strip — clock + email — only on admin routes */}
        {isAdminRoute && user?.role === 'ADMIN' && (
          <div className="hidden md:flex items-center gap-3 mr-2">
            <span className="text-xs text-zinc-500 tabular-nums font-mono">
              {clock.toLocaleTimeString()}
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-xs text-zinc-400">{user.email}</span>
          </div>
        )}

        {/* Cart — hidden on admin routes */}
        {!isAdminRoute && (
          <div className="relative group cursor-pointer mr-2" onClick={toggleCart}>
            <span className="text-zinc-300 group-hover:text-cyan-400 transition-colors text-sm font-medium">
              Cart
              {totalItems > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500 text-zinc-950 text-[10px] font-black">
                  {totalItems}
                </span>
              )}
            </span>
          </div>
        )}

        {/* Auth */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <button
              onClick={() => { clearSession(); navigate('/login'); }}
              className="text-zinc-400 hover:text-red-400 text-sm font-medium transition-colors"
            >
              Sign out
            </button>
          ) : (
            <>
              <Link to="/login" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-4 py-2 text-sm font-semibold transition-all rounded-sm"
              >
                Get started
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}