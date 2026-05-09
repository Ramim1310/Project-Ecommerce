// src/features/products/FilterSidebar.jsx
export default function FilterSidebar({ onFilterChange, currentFilters }) {
  const brands = ["Logitech", "Razer", "Corsair", "SteelSeries"];
  const categories = ["Mice", "Keyboards", "Audio", "Monitors"];

  const handleCheckbox = (key, value) => {
    // If the value is already selected, remove it; otherwise, set it.
    // (For Phase 1, we will keep it simple: one value at a time)
    const newFilters = { ...currentFilters };
    if (newFilters[key] === value) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    onFilterChange(newFilters);
  };

  return (
    <aside className="w-64 flex-shrink-0 space-y-8 hidden lg:block">
      <div>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Brands</h3>
        <div className="space-y-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 accent-cyan-500 bg-gray-900 border-gray-700 rounded"
                checked={currentFilters.brand === brand}
                onChange={() => handleCheckbox('brand', brand)}
              />
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 accent-cyan-500 bg-gray-900 border-gray-700 rounded"
                checked={currentFilters.category === cat}
                onChange={() => handleCheckbox('category', cat)}
              />
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}