import { useEffect, useState } from 'react';
import { getToken } from '../../utils/auth';


export default function ManageProducts() {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Block 1: The Data Fetcher
  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/products/admin-inventory', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const result = await response.json();
      if (result.success) {
        setInventory(result.data);
      }
    } catch (error) {
      console.error("Nexus_Link_Failure:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Block 2: The Delete Handler
  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`PERMANENTLY PURGE [${name}] FROM LOGS?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5001/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      
      if (response.ok) {
        // Refresh the list to show the item is gone
        loadInventory();
      }
    } catch (error) {
      alert("Purge_Failed: System  error.");
    }
  };

  if (isLoading) return <div className="p-10 text-cyan-500 font-mono animate-pulse">SYNCHRONIZING INVENTORY...</div>;

  return (
    <div className="p-8 bg-[#050505] min-h-screen text-white font-sans">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Inventory_Log</h1>
          <p className="text-gray-500 text-xs font-mono mt-1">TOTAL_UNITS_DETECTED: {inventory.length}</p>
        </div>
        <button className="bg-cyan-500 text-black px-6 py-2 font-black uppercase text-xs hover:bg-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          + Initialize_New_Unit
        </button>
      </header>

      {/* Block 3: The Data Grid */}
      <div className="border border-gray-800 bg-[#0a0a0a] rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#111] border-b border-gray-800">
            <tr className="text-[10px] uppercase text-gray-500 font-mono tracking-widest">
              <th className="p-4">Model_Identifier</th>
              <th className="p-4 text-center">SKU_Count</th>
              <th className="p-4 text-center">Current_Stock</th>
              <th className="p-4">Base_Value</th>
              <th className="p-4 text-right">Directives</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-sm">{item.name}</div>
                  <div className="text-[10px] text-cyan-500 font-mono uppercase">{item.brand} // {item.category.name}</div>
                </td>
                <td className="p-4 text-center text-sm font-mono text-gray-400">
                  {item.variantCount}
                </td>
                <td className="p-4 text-center">
                   <span className={`text-xs font-black px-2 py-1 rounded-sm ${item.totalStock > 10 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {item.totalStock} UNITS
                   </span>
                </td>
                <td className="p-4 font-mono text-sm">
                  ${item.variants[0]?.price || "0.00"}
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDelete(item.id, item.name)}
                    className="text-gray-600 hover:text-red-500 text-[10px] font-black uppercase transition-colors"
                  >
                    [DELETE_ENTRY]
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}