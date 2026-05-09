
import { useEffect, useState } from "react";
import { fetchCatalog } from "../api/apiClient";
import ProductCard from "../features/products/productCard";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCatalog();
      setProducts(data);
      setLoading(false);
    };
    loadData();
  }, []);

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
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">
          Hardware <span className="text-nexusAccent">Catalog</span>
        </h1>
        <p className="text-gray-400 mt-2">Elite-grade peripherals for the top 1%.</p>
      </header>

      {/* Responsive Grid System */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}