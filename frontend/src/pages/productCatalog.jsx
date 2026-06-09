
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
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8">
                <div className="w-10 h-10 border-2 border-zinc-800 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-500 text-sm">Loading products…</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-sans">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
                {/* Sidebar */}
                <SidebarProduct onFilterChange={setFilters} currentFilters={filters} />

                {/* Main Grid */}
                <div className="flex-grow">
                    <header className="mb-10 flex items-end justify-between border-b border-zinc-800 pb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-100">All Products</h1>
                            <p className="text-zinc-500 text-sm mt-1">{products.length} items in stock</p>
                        </div>
                    </header>

                    {loading ? (
                        <div className="text-zinc-500 text-sm animate-pulse">Updating…</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}