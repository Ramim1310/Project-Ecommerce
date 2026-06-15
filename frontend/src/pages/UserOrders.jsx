import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/apiClient';
export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [payingOrderId, setPayingOrderId] = useState(null);
    const [toast, setToast] = useState(null); // { type: 'success'|'fail', msg: string }
    const [searchParams, setSearchParams] = useSearchParams();

    // Show toast if redirected from SSLCommerz
    useEffect(() => {
        const payment = searchParams.get('payment');
        if (payment === 'success') {
            setToast({ type: 'success', msg: '✅ Payment confirmed! Your order is now processing.' });
        } else if (payment === 'fail') {
            setToast({ type: 'fail', msg: '❌ Payment was not completed. You can retry below.' });
        } else if (payment === 'cancelled') {
            setToast({ type: 'fail', msg: '⚠️ Payment cancelled.' });
        }
        // Clean the URL query param
        if (payment) setSearchParams({}, { replace: true });
    }, []);

    // Auto-dismiss toast after 5s
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 5000);
        return () => clearTimeout(t);
    }, [toast]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await API.get('/orders/my-orders');
                const result = response.data;
                if (result.success) {
                    setOrders(result.data);
                }
            } catch (error) {
                console.error('[UserOrders] Failed to fetch orders:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleReinitiatePayment = async (orderId) => {
        setPayingOrderId(orderId);
        try {
            const response = await API.post(`/orders/reinitiate/${orderId}`);
            const result = response.data;
            if (result.success && result.data) {
                window.location.replace(result.data);
            } else {
                alert(`Payment failed: ${result.message}`);
                setPayingOrderId(null);
            }
        } catch (err) {
            alert('Could not connect to payment gateway.');
            setPayingOrderId(null);
        }
    };

    const getTimelineProgress = (status) => {
        const stages = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        return stages.indexOf(status);
    };

    if (isLoading) return <div className="p-10 text-cyan-500 font-mono animate-pulse">Loading your orders...</div>;


    return (
        <div className="p-8 md:p-12 bg-[#050505] min-h-screen text-white font-sans">
            <div className="max-w-5xl mx-auto">

                {/* Payment result toast */}
                {toast && (
                    <div className={`mb-6 px-5 py-4 flex items-center justify-between gap-4 border rounded-sm font-mono text-sm transition-all ${
                        toast.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                        <span>{toast.msg}</span>
                        <button onClick={() => setToast(null)} className="text-gray-600 hover:text-white text-xs shrink-0">✕ dismiss</button>
                    </div>
                )}

                <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-10 text-white">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="border border-gray-900 bg-[#0a0a0a] p-10 flex items-center justify-center">
                        <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">You have no orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {orders.map(order => (
                            <div key={order.id} className="bg-[#0a0a0a] border-t-2 border-t-cyan-500/30 border border-gray-900 p-8 shadow-2xl relative overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[100px] pointer-events-none"></div>

                                {/* Order Header */}
                                <div className="flex justify-between items-start mb-14 relative z-10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className="text-[10px] text-cyan-500 font-mono uppercase tracking-widest flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                                                ORDER #{order.id.split('-')[0]}
                                            </p>
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-mono tracking-widest uppercase border ${
                                                order.paymentStatus === 'PAID' 
                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                    : order.paymentStatus === 'FAILED'
                                                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                                    : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                                            }`}>
                                                {order.paymentStatus || 'UNPAID'}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-black text-gray-100 uppercase tracking-tight">Order Summary</h2>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-sm text-gray-100 font-bold">${Number(order.totalAmount).toFixed(2)}</p>
                                        <p className="text-[10px] text-gray-600 font-mono mt-1 tracking-widest">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                        {/* Reinitiate payment button for UNPAID orders */}
                                        {order.paymentStatus !== 'PAID' && (
                                            <button
                                                onClick={() => handleReinitiatePayment(order.id)}
                                                disabled={payingOrderId === order.id}
                                                className="mt-3 text-[9px] font-mono font-black uppercase tracking-widest px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-wait rounded-sm"
                                            >
                                                {payingOrderId === order.id ? 'Connecting...' : '⚡ Pay Now'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* The Status Timeline */}
                                {order.status !== 'CANCELLED' ? (
                                    <div className="relative flex justify-between items-center mb-16 mx-4 md:mx-12">
                                        {/* Background Track */}
                                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-800 -z-10 -translate-y-1/2"></div>
                                        
                                        {/* Progress Track */}
                                        <div 
                                            className="absolute top-1/2 left-0 h-[1px] bg-cyan-500 -z-10 transition-all duration-1000 -translate-y-1/2 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                            style={{ width: `${(getTimelineProgress(order.status) / 3) * 100}%` }}
                                        ></div>
                                        
                                        {/* Steps */}
                                        {['PLACED', 'ASSEMBLING', 'SHIPPED', 'DELIVERED'].map((step, index) => {
                                            const isActive = getTimelineProgress(order.status) >= index;
                                            const isCurrent = getTimelineProgress(order.status) === index;
                                            return (
                                                <div key={step} className="flex flex-col items-center bg-[#0a0a0a] px-4 py-1 relative z-10 group cursor-default">
                                                    <div className={`w-3 h-3 rounded-full mb-4 transition-all duration-500 ${
                                                        isActive 
                                                            ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] border-none' 
                                                            : 'bg-[#0a0a0a] border border-gray-700'
                                                    } ${isCurrent ? 'ring-4 ring-cyan-500/20' : ''}`}></div>
                                                    
                                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors absolute -bottom-6 whitespace-nowrap ${
                                                        isActive ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]' : 'text-gray-600'
                                                    }`}>{step}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="mb-14 flex items-center gap-3 border-l-2 border-red-500 bg-red-500/5 p-4 rounded-r relative z-10 mx-4">
                                        <span className="text-red-500 text-lg">⚠️</span>
                                        <div>
                                            <h3 className="text-red-500 text-xs font-black uppercase tracking-widest">Order Cancelled</h3>
                                            <p className="text-red-500/60 text-[10px] mt-0.5">The order was cancelled or payment failed.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Order Items */}
                                <div className="pt-8 relative z-10">
                                    <h3 className="text-[10px] text-gray-500 font-mono uppercase mb-5 tracking-widest flex items-center gap-2">Items</h3>
                                    <div className="space-y-1">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex justify-between items-center group hover:bg-white/[0.02] p-3 -mx-3 rounded transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-mono text-cyan-500/80 bg-cyan-500/10 px-2 py-0.5 rounded">{item.quantity}x</span>
                                                    <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{item.variant?.product?.name || "Unknown Product"}</span>
                                                    <span className="text-[10px] font-mono bg-black border border-gray-800 px-2.5 py-0.5 text-gray-400 rounded-sm">
                                                        {item.variant?.variantName || "N/A"}
                                                    </span>
                                                </div>
                                                <span className="font-mono text-sm text-gray-300">${Number(item.price).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}