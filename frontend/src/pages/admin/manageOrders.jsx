import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, clearSession } from '../../utils/auth';
import API from '../../api/apiClient';
const STATUS_CONFIG = {
  PENDING:    { label: 'Pending',    color: 'text-amber-400',  bg: 'bg-amber-400/10  border-amber-400/30',  dot: 'bg-amber-400'  },
  PROCESSING: { label: 'Processing', color: 'text-blue-400',   bg: 'bg-blue-400/10   border-blue-400/30',   dot: 'bg-blue-400'   },
  SHIPPED:    { label: 'Shipped',    color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30', dot: 'bg-purple-400' },
  DELIVERED:  { label: 'Delivered',  color: 'text-emerald-400',bg: 'bg-emerald-400/10 border-emerald-400/30',dot: 'bg-emerald-400'},
  CANCELLED:  { label: 'Cancelled',  color: 'text-red-400',    bg: 'bg-red-400/10    border-red-400/30',    dot: 'bg-red-400'    },
};

const STATUS_FLOW = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function ManageOrders() {
  const navigate  = useNavigate();
  const admin     = getUser();

  const [orders,   setOrders]   = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(null); // order id being updated
  const [expanded, setExpanded] = useState(null); // order id whose items are shown

  const PER_PAGE = 15;

  const fetchOrders = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const res = await API.get(`/admin/orders?page=${p}`);
      const json = res.data;
      if (json.success) {
        setOrders(json.data.orders);
        setTotal(json.data.total);
        setPage(p);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(0); }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await API.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      const json = res.data;
      if (json.success) {
        setOrders(prev =>
          prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
        );
      }
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = () => { clearSession(); navigate('/login', { replace: true }); };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans">

      {/* ── Top Nav ── */}
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
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-xs font-mono text-gray-400 border border-gray-800 px-3 py-1.5 rounded hover:border-amber-500/50 hover:text-amber-400 transition-all"
          >
            ← Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="text-xs font-mono text-gray-500 border border-gray-800 px-3 py-1.5 rounded hover:border-red-500/50 hover:text-red-400 transition-all"
          >
            LOGOUT
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Header ── */}
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="text-[10px] font-mono text-amber-400 border border-amber-400/30 bg-amber-400/10 rounded px-2 py-0.5 uppercase tracking-widest">
              📋 Order Management
            </span>
            <h1 className="text-3xl font-black tracking-tight mt-2">
              Manage <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Orders</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">
              {total} total order{total !== 1 ? 's' : ''} · Page {page + 1} of {totalPages || 1}
            </p>
          </div>
          <button
            onClick={() => fetchOrders(page)}
            className="text-xs font-mono text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 rounded hover:bg-cyan-500/20 transition-all"
          >
            ↻ Refresh
          </button>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-8" />

        {/* ── Status legend ── */}
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <span key={key} className={`flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          ))}
        </div>

        {/* ── Orders table ── */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-32 text-gray-600 font-mono text-sm uppercase tracking-widest">
            No orders found
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => {
              const cfg      = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
              const isOpen   = expanded === order.id;
              const isBusy   = updating === order.id;
              const shortId  = order.id.slice(-8).toUpperCase();

              return (
                <div
                  key={order.id}
                  className="bg-[#0d0d14] border border-gray-800/60 rounded-xl overflow-hidden transition-all hover:border-gray-700"
                >
                  {/* Row */}
                  <div className="flex flex-wrap items-center gap-4 p-5">

                    {/* Order ID */}
                    <div className="min-w-[100px]">
                      <div className="text-[10px] font-mono text-gray-600 uppercase mb-0.5">Order</div>
                      <div className="text-sm font-bold text-white font-mono">#{shortId}</div>
                    </div>

                    {/* Customer */}
                    <div className="flex-1 min-w-[160px]">
                      <div className="text-[10px] font-mono text-gray-600 uppercase mb-0.5">Customer</div>
                      <div className="text-sm font-bold text-white truncate">{order.user?.name ?? '—'}</div>
                      <div className="text-xs text-gray-500 font-mono truncate">{order.user?.email}</div>
                    </div>

                    {/* Total */}
                    <div className="min-w-[90px]">
                      <div className="text-[10px] font-mono text-gray-600 uppercase mb-0.5">Total</div>
                      <div className="text-sm font-black text-amber-400">${Number(order.totalAmount).toFixed(2)}</div>
                    </div>

                    {/* Items count */}
                    <div className="min-w-[70px]">
                      <div className="text-[10px] font-mono text-gray-600 uppercase mb-0.5">Items</div>
                      <div className="text-sm font-bold text-gray-300">{order.items?.length ?? 0}</div>
                    </div>

                    {/* Date */}
                    <div className="min-w-[130px]">
                      <div className="text-[10px] font-mono text-gray-600 uppercase mb-0.5">Placed</div>
                      <div className="text-xs text-gray-400 font-mono">
                        {new Date(order.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className="min-w-[110px]">
                      <div className="text-[10px] font-mono text-gray-600 uppercase mb-1">Status</div>
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>

                    {/* Status selector */}
                    <div className="ml-auto flex items-center gap-3">
                      <select
                        id={`status-select-${order.id}`}
                        value={order.status}
                        disabled={isBusy}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className="text-xs font-mono bg-[#0a0a0f] border border-gray-700 text-gray-300 rounded px-3 py-2 focus:outline-none focus:border-amber-500 disabled:opacity-50 cursor-pointer hover:border-gray-600 transition-all"
                      >
                        {STATUS_FLOW.map(s => (
                          <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                        ))}
                      </select>

                      {isBusy && (
                        <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      )}

                      <button
                        onClick={() => setExpanded(isOpen ? null : order.id)}
                        className="text-[11px] font-mono text-gray-500 hover:text-cyan-400 transition-colors px-2"
                      >
                        {isOpen ? '▲ Hide' : '▼ Items'}
                      </button>
                    </div>
                  </div>

                  {/* Expandable items list */}
                  {isOpen && (
                    <div className="border-t border-gray-800/60 px-5 pb-5 pt-4 bg-black/20">
                      <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-3">Order Items</div>
                      <div className="space-y-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center justify-between gap-4 bg-[#0d0d14] border border-gray-800 rounded-lg px-4 py-3">
                            <div>
                              <div className="text-sm font-bold text-white">{item.variant?.product?.name ?? '—'}</div>
                              <div className="text-xs text-cyan-400 font-mono mt-0.5">{item.variant?.variantName} · {item.variant?.sku}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-xs text-gray-400 font-mono">Qty: <span className="text-white font-bold">{item.quantity}</span></div>
                              <div className="text-xs text-amber-400 font-mono">${Number(item.price).toFixed(2)} ea</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-xs font-mono text-gray-600">
                        📍 {order.shippingAddress}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => fetchOrders(page - 1)}
              disabled={page === 0 || loading}
              className="text-xs font-mono px-4 py-2 border border-gray-800 rounded hover:border-amber-500/50 hover:text-amber-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <span className="text-xs font-mono text-gray-500">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => fetchOrders(page + 1)}
              disabled={page >= totalPages - 1 || loading}
              className="text-xs font-mono px-4 py-2 border border-gray-800 rounded hover:border-amber-500/50 hover:text-amber-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
