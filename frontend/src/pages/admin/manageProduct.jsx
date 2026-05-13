import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../utils/auth';


export default function ManageProducts() {
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [tempSpecs, setTempSpecs] = useState([{ key: '', value: '' }]);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        categoryId: '',
        description: '',
        specifications: {}, // JSONB data
        variants: [
            { variantName: '', sku: '', price: 0, stock: 0, images: [] }
        ]
    });

    // Fetch categories on mount for the dropdown
    useEffect(() => {
        fetch('http://localhost:5001/api/products/categories')
            .then(res => res.json())
            .then(result => setCategories(result.data || []))
            .catch(() => setCategories([]));
    }, []);

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

    // Block 3: The Create Handler
    const handleSubmit = async () => {
        // Basic validation
        if (!formData.name || !formData.brand || !formData.categoryId) {
            alert("VALIDATION_ERROR: Name, Brand, and Category are required.");
            return;
        }
        if (formData.variants.length === 0) {
            alert("VALIDATION_ERROR: At least one variant is required.");
            return;
        }
        const invalidVariant = formData.variants.find(v => !v.sku || !v.variantName);
        if (invalidVariant) {
            alert("VALIDATION_ERROR: Every variant must have a SKU and Name.");
            return;
        }

        // 1. Convert tempSpecs array to a clean JSON object
        const finalSpecs = {};
        tempSpecs.forEach(item => {
            if (item.key && item.value) {
                finalSpecs[item.key.toLowerCase().replace(/\s+/g, '_')] = item.value;
            }
        });

        // 2. Attach these to our final payload
        const submissionData = {
            ...formData,
            specifications: finalSpecs
        };

        try {
            const response = await fetch('http://localhost:5001/api/products/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(submissionData) // Use the new submissionData
            });
            const result = await response.json();

            if (result.success) {
                setFormData({
                    name: '', brand: '', categoryId: '', description: '',
                    specifications: {},
                    variants: [{ variantName: '', sku: '', price: 0, stock: 0, images: [] }]
                });
                setTempSpecs([{ key: '', value: '' }]); // Reset specs too
                setIsModalOpen(false);
                loadInventory();
            } else {
                alert(`CREATION_FAILED: ${result.message}`);
            }
        } catch (error) {
            alert("SYSTEM_ERROR: Could not reach server.");
        }
    };




    // Helper to add a new empty spec row
    const addSpecRow = () => {
        setTempSpecs([...tempSpecs, { key: '', value: '' }]);
    };

    // Helper to remove a spec row
    const removeSpecRow = (index) => {
        const updated = [...tempSpecs];
        updated.splice(index, 1);
        setTempSpecs(updated);
    };

    // Helper to update a specific key or value
    const updateSpecRow = (index, field, val) => {
        const updated = [...tempSpecs];
        updated[index][field] = val;
        setTempSpecs(updated);
    };

    // Helpers to manage variants
    const updateVariant = (index, field, value) => {
        const updated = { ...formData };
        updated.variants[index][field] = value;
        setFormData(updated);
    };

    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [...formData.variants, { variantName: '', sku: '', price: 0, stock: 0, images: [] }]
        });
    };

    const removeVariant = (index) => {
        const updated = { ...formData };
        updated.variants.splice(index, 1);
        setFormData(updated);
    };

    if (isLoading) return <div className="p-10 text-cyan-500 font-mono animate-pulse">SYNCHRONIZING INVENTORY...</div>;

    return (
        <div className="p-8 bg-[#050505] min-h-screen text-white font-sans">
            <div className="mb-6">
                <Link
                    to="/admin/dashboard"
                    className="text-[10px] font-mono text-gray-500 hover:text-cyan-500 transition-colors uppercase tracking-widest"
                >
                    &larr; Return_to_Command_Center
                </Link>
            </div>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">Inventory_Log</h1>
                    <p className="text-gray-500 text-xs font-mono mt-1">TOTAL_UNITS_DETECTED: {inventory.length}</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-cyan-500 text-black px-6 py-2 font-black uppercase text-xs hover:bg-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    + Initialize_New_Unit
                </button>
            </header>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0a0a0a] border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
                        <h2 className="text-2xl font-black uppercase italic mb-8 tracking-tighter">
                            Initialize_New_Hardware_Entry
                        </h2>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            {/* Row 1: Name + Brand */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Model_Identifier</label>
                                <input
                                    type="text"
                                    placeholder="e.g. G Pro X Superlight"
                                    value={formData.name}
                                    className="bg-[#111] border border-gray-800 p-3 text-sm text-white focus:border-cyan-500 outline-none transition-all"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Manufacturer</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Logitech"
                                    value={formData.brand}
                                    className="bg-[#111] border border-gray-800 p-3 text-sm text-white focus:border-cyan-500 outline-none transition-all"
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            {/* Category Dropdown */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Logic_Classification</label>
                                <select
                                    value={formData.categoryId}
                                    className="bg-[#111] border border-gray-800 p-3 text-sm text-white focus:border-cyan-500 outline-none appearance-none"
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                >
                                    <option value="">SELECT_CATEGORY</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Description</label>
                                <input
                                    type="text"
                                    placeholder="Short product description"
                                    value={formData.description}
                                    className="bg-[#111] border border-gray-800 p-3 text-sm text-white focus:border-cyan-500 outline-none transition-all"
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Variant Section */}
                        <div className="border border-gray-800 bg-[#080808] p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-black uppercase text-cyan-500 tracking-widest font-mono">// SKU_Config</h3>
                                <button onClick={addVariant} className="text-[10px] uppercase font-black bg-[#111] border border-gray-800 px-3 py-1 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all">
                                    + ADD_VARIANT
                                </button>
                            </div>

                            {formData.variants.map((variant, index) => (
                                <div key={index} className="border-t border-gray-800 pt-6 mt-4 first:border-0 first:pt-0 first:mt-0 relative group">
                                    {formData.variants.length > 1 && (
                                        <button onClick={() => removeVariant(index)} className="absolute top-0 right-0 text-red-500 hover:text-white text-[10px] font-black uppercase bg-red-500/10 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            [X] REMOVE
                                        </button>
                                    )}
                                    <div className="grid grid-cols-2 gap-6 mb-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Variant_Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Carbon Black"
                                                value={variant.variantName}
                                                className="bg-[#111] border border-gray-800 p-3 text-sm text-white focus:border-cyan-500 outline-none transition-all"
                                                onChange={(e) => updateVariant(index, 'variantName', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">SKU_Code</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. LOGI-GPX2-BLK"
                                                value={variant.sku}
                                                className="bg-[#111] border border-gray-800 p-3 text-sm text-white focus:border-cyan-500 outline-none transition-all"
                                                onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Unit_Price ($)</label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={variant.price || ''}
                                                className="bg-[#111] border border-gray-800 p-3 text-sm text-white focus:border-cyan-500 outline-none transition-all"
                                                onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Initial_Stock</label>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={variant.stock || ''}
                                                className="bg-[#111] border border-gray-800 p-3 text-sm text-white focus:border-cyan-500 outline-none transition-all"
                                                onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border border-gray-800 bg-[#080808] p-6 mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-black uppercase text-cyan-500 tracking-widest font-mono">// Hardware_Specifications</h3>
                                <button
                                    type="button"
                                    onClick={addSpecRow}
                                    className="text-[10px] uppercase font-black bg-[#111] border border-gray-800 px-3 py-1 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all"
                                >
                                    + ADD_SPEC_FIELD
                                </button>
                            </div>

                            <div className="space-y-3">
                                {tempSpecs.map((spec, index) => (
                                    <div key={index} className="flex gap-4 items-center group">
                                        <div className="flex-1 grid grid-cols-2 gap-4">
                                            <input
                                                placeholder="Label (e.g. Sensor)"
                                                value={spec.key}
                                                className="bg-[#111] border border-gray-800 p-2 text-[11px] text-white focus:border-cyan-500 outline-none font-mono uppercase"
                                                onChange={(e) => updateSpecRow(index, 'key', e.target.value)}
                                            />
                                            <input
                                                placeholder="Technical Value"
                                                value={spec.value}
                                                className="bg-[#111] border border-gray-800 p-2 text-[11px] text-white focus:border-cyan-500 outline-none"
                                                onChange={(e) => updateSpecRow(index, 'value', e.target.value)}
                                            />
                                        </div>
                                        {tempSpecs.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSpecRow(index)}
                                                className="text-red-900 hover:text-red-500 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                [X]
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Button Row */}
                        <div className="flex justify-end gap-4 mt-10">
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 uppercase font-black text-xs px-6 py-2 hover:text-white transition-colors">
                                [ABORT_SEQUENCE]
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-cyan-500 text-black px-8 py-2 font-black uppercase text-xs hover:bg-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                            >
                                [COMMIT_TO_NEXUS]
                            </button>
                        </div>
                    </div>
                </div>
            )}

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