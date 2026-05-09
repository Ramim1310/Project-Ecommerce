import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
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
        </div>

        {/* USER ACTIONS (Auth Status) */}
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-cyan-500 hover:bg-white text-black px-5 py-2.5 rounded text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Join Nexus
          </Link>
        </div>

      </div>
    </nav>
  );
}