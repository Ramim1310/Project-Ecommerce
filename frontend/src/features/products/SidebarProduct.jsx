// src/features/products/FilterSidebar.jsx
import { useState, useEffect } from 'react';
import API from '../../api/apiClient';

export default function FilterSidebar({ onFilterChange, currentFilters }) {
  const brands = ["Logitech", "Razer", "Corsair", "SteelSeries"];
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get('/products/categories')
      .then(res => {
        const result = res.data;
        if (result.success && result.data) {
          setCategories(result.data.map(cat => cat.name));
        }
      })
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

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
    <aside className="w-56 flex-shrink-0 space-y-8 hidden lg:block pr-8">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">Brands</h3>
        <div className="space-y-2.5">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-3.5 h-3.5 border flex items-center justify-center transition-colors ${currentFilters.brand === brand ? 'border-cyan-500 bg-cyan-500/10' : 'border-zinc-700 bg-zinc-900 group-hover:border-zinc-500'}`}>
                 {currentFilters.brand === brand && <div className="w-1.5 h-1.5 bg-cyan-500"></div>}
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={currentFilters.brand === brand}
                onChange={() => handleCheckbox('brand', brand)}
              />
              <span className={`text-sm transition-colors ${currentFilters.brand === brand ? 'text-cyan-400 font-semibold' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-800">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">Category</h3>
        <div className="space-y-2.5">
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-3.5 h-3.5 border flex items-center justify-center transition-colors ${currentFilters.category === cat ? 'border-cyan-500 bg-cyan-500/10' : 'border-zinc-700 bg-zinc-900 group-hover:border-zinc-500'}`}>
                 {currentFilters.category === cat && <div className="w-1.5 h-1.5 bg-cyan-500"></div>}
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={currentFilters.category === cat}
                onChange={() => handleCheckbox('category', cat)}
              />
              <span className={`text-sm transition-colors ${currentFilters.category === cat ? 'text-cyan-400 font-semibold' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{cat}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}