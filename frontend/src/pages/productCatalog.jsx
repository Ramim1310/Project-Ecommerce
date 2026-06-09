
import { useEffect, useState } from "react";
import { fetchCatalog } from "../api/apiClient";
import ProductCard from "../features/products/productCard";
import SidebarProduct from "../features/products/SidebarProduct";

export default function Catalog({ searchTerm = "" }) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const activeFilters = searchTerm
        ? { ...filters, search: searchTerm, page }
        : { ...filters, page };
      const res = await fetchCatalog(activeFilters);
      setProducts(res.data || []);
      if (res.pagination) setPagination(res.pagination);
      setLoading(false);
    };
    loadData();
  }, [filters, searchTerm, page]);

    if (loading && products.length === 0) {
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
                <SidebarProduct onFilterChange={handleFilterChange} currentFilters={filters} />

                {/* Main Grid */}
                <div className="flex-grow">
                    <header className="mb-10 flex items-end justify-between border-b border-zinc-800 pb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-100">All Products</h1>
                            <p className="text-zinc-500 text-sm mt-1">{pagination.total} items in stock</p>
                        </div>
                    </header>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-8 h-8 border-2 border-zinc-800 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                            <div className="text-zinc-500 text-sm">Updating catalog…</div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-zinc-500 text-center py-20 border border-zinc-900 border-dashed rounded-lg">
                            No products found matching your criteria.
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>

                            {/* Pagination Controls */}
                            {pagination.totalPages > 1 && (
                                <div className="mt-12 flex items-center justify-center gap-4">
                                    <button 
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-300 rounded-sm hover:border-cyan-500 hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm font-medium text-zinc-500">
                                        Page <span className="text-zinc-100">{page}</span> of {pagination.totalPages}
                                    </span>
                                    <button 
                                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                        disabled={page === pagination.totalPages}
                                        className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-300 rounded-sm hover:border-cyan-500 hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}