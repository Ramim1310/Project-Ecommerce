import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';

export default function ManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = getToken();

  useEffect(() => {
    fetch('http://localhost:5001/api/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products.');
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="p-8 bg-[#050505] min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="text-xs font-mono text-gray-500 hover:text-amber-400 transition-colors"
          >
            ← Admin
          </button>
          <h1 className="text-2xl font-black uppercase italic tracking-tight">
            Inventory_<span className="text-amber-400">Management</span>
          </h1>
        </div>
        <button className="bg-cyan-500 text-black px-6 py-2 font-bold uppercase text-xs hover:bg-white transition-all">
          + Add_New_Product
        </button>
      </div>

      {/* States */}
      {loading && (
        <div className="text-center py-20 text-gray-600 font-mono text-sm">Loading_Products...</div>
      )}
      {error && (
        <div className="text-center py-20 text-red-500 font-mono text-sm">{error}</div>
      )}

      {/* Table */}
      {!loading && !error && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-left text-gray-500 text-[10px] uppercase tracking-widest">
              <th className="pb-4 px-4">Product_Name</th>
              <th className="pb-4 px-4">Category</th>
              <th className="pb-4 px-4">Stock_Status</th>
              <th className="pb-4 px-4">Base_Price</th>
              <th className="pb-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-gray-600 font-mono text-xs uppercase">
                  No_Products_Found
                </td>
              </tr>
            ) : (
              products.map(p => (
                <tr key={p.id} className="border-b border-gray-900 hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4 font-bold">{p.name}</td>
                  <td className="py-4 px-4 text-gray-400">{p.category?.name ?? '—'}</td>
                  <td className="py-4 px-4">
                    <span className={(p.totalStock ?? 0) > 10 ? 'text-green-500' : 'text-red-500'}>
                      {p.totalStock ?? '—'} Units
                    </span>
                  </td>
                  <td className="py-4 px-4">${Number(p.startingPrice ?? p.price ?? 0).toFixed(2)}</td>
                  <td className="py-4 px-4 space-x-4">
                    <button className="text-cyan-500 hover:text-white transition-colors">EDIT</button>
                    <button className="text-red-900 hover:text-red-500 transition-colors">DELETE</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}