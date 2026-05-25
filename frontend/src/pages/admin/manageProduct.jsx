import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import FormField from '../../components/ui/FormField';
import AdminButton from '../../components/ui/AdminButton';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const INPUT_CLASS =
    'bg-[#111] border border-gray-800 p-3 text-sm text-white focus:border-cyan-500 outline-none transition-all';

export default function ManageProducts() {
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [tempSpecs, setTempSpecs] = useState([{ key: '', value: '' }]);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        categoryId: '',
        description: '',
        specifications: {},
        variants: [
            { variantName: '', sku: '', price: 0, stock: 0, images: [] }
        ]
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        fetch(`${API}/products/categories`)
            .then(res => res.json())
            .then(result => setCategories(result.data || []))
            .catch(() => setCategories([]));
    };

    const loadInventory = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API}/products/admin-inventory`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const result = await response.json();
            if (result.success) {
                setInventory(result.data);
            }
        } catch (error) {
            console.error('[ManageProducts] Failed to load inventory:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadInventory();
    }, []);

    const handleDelete = async (id, name) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${name}"?`);
        if (!confirmed) return;

        try {
            const response = await fetch(`${API}/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (response.ok) {
                loadInventory();
            }
        } catch (error) {
            console.error('[ManageProducts] Delete failed:', error);
            alert('Delete failed. Please try again.');
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.brand || !formData.categoryId) {
            alert('Name, Brand, and Category are required.');
            return;
        }
        if (formData.variants.length === 0) {
            alert('At least one variant is required.');
            return;
        }
        const invalidVariant = formData.variants.find(v => !v.sku || !v.variantName);
        if (invalidVariant) {
            alert('Every variant must have a name and SKU.');
            return;
        }

        // Convert the key-value spec rows into a clean JSON object for the JSONB column.
        const finalSpecs = {};
        tempSpecs.forEach(item => {
            if (item.key && item.value) {
                finalSpecs[item.key.toLowerCase().replace(/\s+/g, '_')] = item.value;
            }
        });

        const submissionData = { ...formData, specifications: finalSpecs };

        try {
            const response = await fetch(`${API}/products/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(submissionData)
            });
            const result = await response.json();

            if (result.success) {
                setFormData({
                    name: '', brand: '', categoryId: '', description: '',
                    specifications: {},
                    variants: [{ variantName: '', sku: '', price: 0, stock: 0, images: [] }]
                });
                setTempSpecs([{ key: '', value: '' }]);
                setIsModalOpen(false);
                loadInventory();
            } else {
                alert(`Could not create product: ${result.message}`);
            }
        } catch (error) {
            console.error('[ManageProducts] Create product failed:', error);
            alert('Could not reach the server. Please try again.');
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            alert('Category name is required.');
            return;
        }
        try {
            const response = await fetch(`${API}/products/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ name: newCategoryName.trim() })
            });
            const result = await response.json();
            if (result.success) {
                setNewCategoryName('');
                setIsCategoryModalOpen(false);
                loadCategories();
            } else {
                alert(`Could not create category: ${result.message}`);
            }
        } catch (error) {
            console.error('[ManageProducts] Create category failed:', error);
            alert('Could not reach the server. Please try again.');
        }
    };

    const addSpecRow = () => setTempSpecs([...tempSpecs, { key: '', value: '' }]);

    const removeSpecRow = (index) => {
        const updated = [...tempSpecs];
        updated.splice(index, 1);
        setTempSpecs(updated);
    };

    const updateSpecRow = (index, field, val) => {
        const updated = [...tempSpecs];
        updated[index][field] = val;
        setTempSpecs(updated);
    };

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

    if (isLoading) return (
        <div className="p-10 text-cyan-500 font-mono animate-pulse">Loading inventory...</div>
    );

    return (
        <div className="p-8 bg-[#050505] min-h-screen text-white font-sans">
            <div className="mb-6">
                <Link
                    to="/admin/dashboard"
                    className="text-[10px] font-mono text-gray-500 hover:text-cyan-500 transition-colors uppercase tracking-widest"
                >
                    &larr; Back to Dashboard
                </Link>
            </div>

            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">Inventory Log</h1>
                    <p className="text-gray-500 text-xs font-mono mt-1 uppercase tracking-widest">
                        {inventory.length} products
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <AdminButton variant="secondary" onClick={() => setIsCategoryModalOpen(true)}>
                        + New Category
                    </AdminButton>
                    <AdminButton variant="primary" onClick={() => setIsModalOpen(true)}>
                        + Add Product
                    </AdminButton>
                </div>
            </header>

            {/* ── Add Product Modal ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0a0a0a] border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
                        <h2 className="text-2xl font-black uppercase italic mb-8 tracking-tighter">
                            Add New Product
                        </h2>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <FormField label="Product Name">
                                <input
                                    type="text"
                                    placeholder="e.g. G Pro X Superlight"
                                    value={formData.name}
                                    className={INPUT_CLASS}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </FormField>
                            <FormField label="Manufacturer">
                                <input
                                    type="text"
                                    placeholder="e.g. Logitech"
                                    value={formData.brand}
                                    className={INPUT_CLASS}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <FormField label="Category">
                                <select
                                    value={formData.categoryId}
                                    className="bg-[#111] border border-gray-800 p-3 text-sm text-white focus:border-cyan-500 outline-none appearance-none"
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </FormField>
                            <FormField label="Description">
                                <input
                                    type="text"
                                    placeholder="Short product description"
                                    value={formData.description}
                                    className={INPUT_CLASS}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </FormField>
                        </div>

                        {/* Variants Section */}
                        <div className="border border-gray-800 bg-[#080808] p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-black uppercase text-cyan-500 tracking-widest font-mono">
                                    SKU Variants
                                </h3>
                                <AdminButton variant="ghost" size="sm" className="border border-gray-800 text-cyan-500 hover:bg-cyan-500 hover:text-black" onClick={addVariant}>
                                    + Add Variant
                                </AdminButton>
                            </div>

                            {formData.variants.map((variant, index) => (
                                <div key={index} className="border-t border-gray-800 pt-6 mt-4 first:border-0 first:pt-0 first:mt-0 relative group">
                                    {formData.variants.length > 1 && (
                                        <button
                                            onClick={() => removeVariant(index)}
                                            className="absolute top-0 right-0 text-red-500 hover:text-white text-[10px] font-black uppercase bg-red-500/10 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Remove
                                        </button>
                                    )}
                                    <div className="grid grid-cols-2 gap-6 mb-4">
                                        <FormField label="Variant Name">
                                            <input
                                                type="text"
                                                placeholder="e.g. Carbon Black"
                                                value={variant.variantName}
                                                className={INPUT_CLASS}
                                                onChange={(e) => updateVariant(index, 'variantName', e.target.value)}
                                            />
                                        </FormField>
                                        <FormField label="SKU">
                                            <input
                                                type="text"
                                                placeholder="e.g. LOGI-GPX2-BLK"
                                                value={variant.sku}
                                                className={INPUT_CLASS}
                                                onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                            />
                                        </FormField>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <FormField label="Price ($)">
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={variant.price || ''}
                                                className={INPUT_CLASS}
                                                onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                                            />
                                        </FormField>
                                        <FormField label="Initial Stock">
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={variant.stock || ''}
                                                className={INPUT_CLASS}
                                                onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                                            />
                                        </FormField>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Specifications Section */}
                        <div className="border border-gray-800 bg-[#080808] p-6 mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-black uppercase text-cyan-500 tracking-widest font-mono">
                                    Specifications
                                </h3>
                                <AdminButton variant="ghost" size="sm" className="border border-gray-800 text-cyan-500 hover:bg-cyan-500 hover:text-black" type="button" onClick={addSpecRow}>
                                    + Add Field
                                </AdminButton>
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
                                                placeholder="Value"
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
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mt-10">
                            <AdminButton variant="ghost" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </AdminButton>
                            <AdminButton variant="primary" size="lg" onClick={handleSubmit}>
                                Save Product
                            </AdminButton>
                        </div>
                    </div>
                </div>
            )}

            {/* ── New Category Modal ── */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0a0a0a] border border-gray-800 w-full max-w-md p-8 shadow-2xl">
                        <h2 className="text-xl font-black uppercase italic mb-6 tracking-tighter">
                            New Category
                        </h2>
                        <div className="mb-8">
                            <FormField label="Category Name">
                                <input
                                    type="text"
                                    placeholder="e.g. Keyboards"
                                    value={newCategoryName}
                                    className="bg-[#111] border border-gray-800 p-3 text-sm text-white focus:border-amber-500 outline-none transition-all"
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
                                />
                            </FormField>
                        </div>

                        {categories.length > 0 && (
                            <div className="mb-8">
                                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">
                                    Existing Categories
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <span key={cat.id} className="text-[10px] font-mono text-amber-400 border border-amber-400/30 bg-amber-400/10 rounded px-2 py-1 uppercase">
                                            {cat.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-4">
                            <AdminButton variant="ghost" onClick={() => { setIsCategoryModalOpen(false); setNewCategoryName(''); }}>
                                Cancel
                            </AdminButton>
                            <AdminButton variant="secondary" size="lg" onClick={handleCreateCategory}>
                                Save Category
                            </AdminButton>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Inventory Table ── */}
            <div className="border border-gray-800 bg-[#0a0a0a] rounded-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#111] border-b border-gray-800">
                        <tr className="text-[10px] uppercase text-gray-500 font-mono tracking-widest">
                            <th className="p-4">Product</th>
                            <th className="p-4 text-center">SKUs</th>
                            <th className="p-4 text-center">Stock</th>
                            <th className="p-4">Starting Price</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900">
                        {inventory.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4">
                                    <div className="font-bold text-sm">{item.name}</div>
                                    <div className="text-[10px] text-cyan-500 font-mono uppercase">
                                        {item.brand} · {item.category.name}
                                    </div>
                                </td>
                                <td className="p-4 text-center text-sm font-mono text-gray-400">
                                    {item.variantCount}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`text-xs font-black px-2 py-1 rounded-sm ${item.totalStock > 10 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {item.totalStock} units
                                    </span>
                                </td>
                                <td className="p-4 font-mono text-sm">
                                    ${item.variants[0]?.price || '0.00'}
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleDelete(item.id, item.name)}
                                        className="text-gray-600 hover:text-red-500 text-[10px] font-black uppercase transition-colors"
                                    >
                                        Delete
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