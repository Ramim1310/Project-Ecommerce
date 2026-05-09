
import { useEffect, useState } from "react";
import { fetchCatalog } from "../api/apiClient";
import ProductCard from "../features/products/productCard";
import SidebarProduct from "../features/products/SidebarProduct";

export default function Catalog({ searchTerm = "" }) {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Merge searchTerm into filters before sending to API
      const activeFilters = searchTerm
        ? { ...filters, search: searchTerm }
        : filters;
      const data = await fetchCatalog(activeFilters);
      setProducts(data);
      setLoading(false);
    };
    loadData();
  }, [filters, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-nexusAccent animate-pulse font-bold text-2xl tracking-tighter">
          LOADING THE NEXUS...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto flex gap-10">
        {/* Sidebar */}
        <SidebarProduct onFilterChange={setFilters} currentFilters={filters} />

        {/* Main Grid */}
        <div className="flex-grow">
          <header className="mb-8">
            <h1 className="text-3xl font-black italic uppercase">Catalog</h1>
          </header>

          {loading ? (
             <div className="text-cyan-500">Updating Nexus Catalog...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}