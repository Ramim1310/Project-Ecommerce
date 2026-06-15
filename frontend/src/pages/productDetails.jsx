import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/cartContext";
import API from '../api/apiClient';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, toggleCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        const result = response.data;
        setProduct(result.data);
        setSelectedVariant(result.data.variants.find(v => v.isDefault) || result.data.variants[0]);
      } catch (err) {
        console.error("Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    getDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 animate-shimmer">
         <div className="aspect-square bg-zinc-900 border border-zinc-800"></div>
         <div className="space-y-6">
            <div className="h-8 bg-zinc-900 w-1/4"></div>
            <div className="h-16 bg-zinc-900 w-3/4"></div>
            <div className="h-24 bg-zinc-900 w-full"></div>
         </div>
      </div>
    );
  }

  if (!product || !selectedVariant) return <div className="text-zinc-500 font-mono text-center mt-20">Product not found</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500 selection:text-black">
      <nav className="p-6 max-w-7xl mx-auto border-b border-zinc-900">
        <button onClick={() => window.history.back()} className="text-zinc-500 hover:text-cyan-500 transition-colors text-xs font-mono tracking-widest uppercase">
          &lt; Back to Catalog
        </button>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* LEFT: Image Gallery */}
        <section className="space-y-4">
          <div className="aspect-square bg-zinc-900 border border-zinc-800 flex items-center justify-center p-12 sticky top-12 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <img 
              src={selectedVariant.images[0]} 
              alt={product.name} 
              className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-700"
            />
          </div>
        </section>

        {/* RIGHT: Info & Purchase Section */}
        <section className="flex flex-col">
          <div className="border-b border-zinc-800 pb-8 mb-8">
            <span className="text-cyan-500 font-mono tracking-[0.3em] text-xs uppercase">{product.brand}</span>
            <h1 className="text-4xl lg:text-5xl font-black mt-2 tracking-tighter uppercase leading-none">{product.name}</h1>
            <p className="text-zinc-400 mt-6 leading-relaxed font-light">{product.description}</p>
          </div>

          <div className="space-y-8">
            <div>
              <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Price</span>
              <div className="text-4xl font-mono font-bold mt-1 text-white">${selectedVariant.price}</div>
            </div>

            <div>
              <h3 className="font-mono text-[10px] uppercase text-zinc-600 mb-4 tracking-widest">Select Option</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-5 py-3 font-mono text-xs uppercase transition-all border ${
                      selectedVariant.id === v.id 
                      ? "border-cyan-500 text-cyan-400 bg-cyan-950/30" 
                      : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 bg-zinc-900"
                    }`}
                  >
                    {v.variantName}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-800">
               <div className="flex items-center gap-3 mb-6">
                  <span className={`h-1.5 w-1.5 animate-pulse ${selectedVariant.stock > 0 ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"}`}></span>
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    {selectedVariant.stock > 0 ? `In Stock: ${selectedVariant.stock}` : "Out of Stock"}
                  </span>
               </div>
               
               <button
                 onClick={() => { addToCart(product, selectedVariant); toggleCart(); }}
                 disabled={selectedVariant.stock === 0}
                 className="w-full max-w-sm py-4 bg-zinc-100 text-zinc-950 font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:bg-zinc-900 disabled:text-zinc-700 disabled:border disabled:border-zinc-800 disabled:cursor-not-allowed disabled:transform-none"
               >
                 {selectedVariant.stock === 0 ? "Unavailable" : "Add to Cart"}
               </button>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-zinc-800">
            <h3 className="text-xs uppercase text-zinc-500 font-mono mb-6 tracking-[0.2em] flex items-center gap-4">
              Specifications <span className="h-[1px] flex-grow bg-zinc-800"></span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="border-b border-zinc-800/50 pb-2">
                  <dt className="text-cyan-500/70 text-[10px] uppercase font-mono tracking-widest">{key.replace('_', ' ')}</dt>
                  <dd className="text-zinc-200 text-sm font-mono mt-1 uppercase">{value}</dd>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}