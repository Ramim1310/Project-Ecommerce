import { useEffect, useState } from 'react';
import API from '../../api/apiClient';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Static weekly chart data; replace with a live endpoint when the time-series API is available.
const weeklyTelemetry = [
  { day: 'MON', currentCycle: 4000, lastCycle: 2400 },
  { day: 'TUE', currentCycle: 3000, lastCycle: 1398 },
  { day: 'WED', currentCycle: 9000, lastCycle: 4800 },
  { day: 'THU', currentCycle: 3908, lastCycle: 3908 },
  { day: 'FRI', currentCycle: 6800, lastCycle: 4800 },
  { day: 'SAT', currentCycle: 11800, lastCycle: 8800 },
  { day: 'SUN', currentCycle: 8300, lastCycle: 6300 },
];

export default function Analytics() {
  const [telemetry, setTelemetry] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    totalUsers: 0,
    lowStockAlerts: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const response = await API.get('/admin/telemetry');
        const result = response.data;
        if (result.success) {
          setTelemetry(result.data);
        }
      } catch (error) {
        console.error('[Analytics] Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTelemetry();
  }, []);

  if (isLoading) return <div className="p-10 text-cyan-500 font-mono animate-pulse">Loading analytics...</div>;

  return (
    <div className="p-8 bg-[#050505] min-h-screen text-white font-sans">
      <header className="mb-10">
        <h1 className="text-3xl font-black italic tracking-tighter">Revenue Analytics</h1>
        <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mt-1">Real-time financial telemetry</p>
      </header>

      {/* KPI summary cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0a0a0a] border border-gray-800 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Total Revenue</p>
          <h2 className="text-4xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
            ${telemetry.totalRevenue.toLocaleString()}
          </h2>
          <p className="text-xs font-bold text-cyan-500 mt-2">↗ +14.2% vs last period</p>
        </div>
        
        <div className="bg-[#0a0a0a] border border-gray-800 p-6">
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Active Orders</p>
          <h2 className="text-4xl font-black text-white">
            {telemetry.activeOrders.toLocaleString()}
          </h2>
          <p className="text-xs font-bold text-cyan-500 mt-2">↗ +5.8% vs last period</p>
        </div>

        <div className="bg-[#0a0a0a] border border-gray-800 p-6">
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2">Total Users</p>
          <h2 className="text-4xl font-black text-white">
            {telemetry.totalUsers.toLocaleString()}
          </h2>
          <p className="text-xs font-bold text-red-500 mt-2">↘ -1.2% vs last period</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
      
        <div className="col-span-2 bg-[#0a0a0a] border border-gray-800 p-6">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest font-mono mb-6">Weekly Sales</h3>
          
          <div className="h-[400px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTelemetry} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                
                <defs>
                  <filter id="neonGlowCyan" height="300%" width="300%" x="-100%" y="-100%">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <filter id="neonGlowPurple" height="300%" width="300%" x="-100%" y="-100%">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                <XAxis dataKey="day" stroke="#333" tick={{fill: '#666', fontSize: 10, fontFamily: 'monospace'}} tickLine={false} axisLine={false} />
                <YAxis stroke="#333" tick={{fill: '#666', fontSize: 10, fontFamily: 'monospace'}} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', borderColor: '#333', fontFamily: 'monospace', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                
                {/* Prior period */}
                <Line 
                  type="monotone" 
                  dataKey="lastCycle" 
                  stroke="#a855f7" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#0a0a0a', stroke: '#a855f7', strokeWidth: 2 }} 
                  style={{ filter: 'url(#neonGlowPurple)' }} 
                />
                {/* Current period */}
                <Line 
                  type="monotone" 
                  dataKey="currentCycle" 
                  stroke="#06b6d4" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#0a0a0a', stroke: '#06b6d4', strokeWidth: 3 }} 
                  style={{ filter: 'url(#neonGlowCyan)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low stock alerts panel */}
        <div className="col-span-1 bg-[#0a0a0a] border border-gray-800 p-6 flex flex-col">
          <h3 className="text-xs font-black uppercase text-red-500 tracking-widest font-mono mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Low Stock Alerts
          </h3>

          <div className="space-y-4 flex-1">
            {telemetry.lowStockAlerts.length === 0 ? (
              <p className="text-gray-600 font-mono text-[10px]">All stock levels are healthy.</p>
            ) : (
              telemetry.lowStockAlerts.map(alert => (
                <div key={alert.id} className="border border-red-900/30 bg-red-950/10 p-4 flex justify-between items-center group hover:border-red-500/50 transition-colors">
                  <div>
                    <h4 className="text-sm font-bold text-gray-200">{alert.product.name}</h4>
                    <p className="text-[10px] text-red-400 font-mono mt-1">
                      {alert.stock} units remaining
                    </p>
                    <p className="text-[9px] text-gray-500 font-mono uppercase mt-0.5">
                      SKU: {alert.sku}
                    </p>
                  </div>
                  <button className="text-[10px] border border-gray-700 px-3 py-1 text-gray-400 hover:text-white hover:border-white transition-all uppercase font-black">
                    Order
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}