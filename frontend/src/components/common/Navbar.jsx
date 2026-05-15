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
  const debouncedSearchTerm = useDebounce(term, 500); // 500ms delay

  useEffect(() => {
    // Only trigger search when the debounced value changes
    if (onSearch) onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  return (
    <nav className="bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="w-full px-8 h-20 flex items-center justify-between">

        {/* BRAND LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-cyan-500 rounded flex items-center justify-center font-black text-black group-hover:bg-white transition-colors">
            N
          </div>
          <span className="text-xl font-black uppercase tracking-tighter italic">
            Nexus <span className="text-cyan-500">Tech</span>
          </span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
            Catalog
          </Link>
          <Link to="/rig-builder" className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
            Rig Builder
          </Link>
          <Link to="/support" className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
            Support
          </Link>

          {/* NEW: Conditional Admin Entry */}
          {user?.role === 'ADMIN' && (
            <Link 
              to="/admin/dashboard" 
              className="text-orange-500 border border-orange-500/30 px-2 py-0.5 rounded text-[10px] font-black hover:bg-orange-500 hover:text-black transition-all uppercase tracking-widest"
            >
              ADMIN_PANEL
            </Link>
          )}
        </div>

        {/* SEARCH BAR — center position */}
        <div className="flex-1 max-w-md mx-10 hidden lg:block">
          <div className="relative">
            <input
              type="text"
              placeholder="SEARCH_HARDWARE_..."
              className="w-full bg-[#111] border border-gray-800 rounded py-2 px-4 text-xs font-mono text-cyan-500 focus:outline-none focus:border-cyan-500 transition-all"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <span className="absolute right-3 top-2 text-gray-600 font-mono text-[10px]">
              [CTRL+K]
            </span>
          </div>
        </div>

        {/*cart */}

        <div className="relative group cursor-pointer ">
          <div onClick={toggleCart} className="cursor-pointer">
            <span className="text-gray-400 group-hover:text-cyan-500 transition-colors text-xs font-bold uppercase tracking-widest">
              Cart ({totalItems})
            </span>
          </div>
          {/* Visual Indicator */}
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 w-4 h-4 bg-cyan-500 text-black text-[10px] font-black rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>

        {/* USER ACTIONS (Auth Status) */}
        <div className="flex items-center gap-6">
          {user ? (
            <button
              onClick={() => {
                clearSession();
                navigate('/login');
              }}
              className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-cyan-500 hover:bg-white text-black px-5 py-2.5 rounded text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Join Nexus
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}