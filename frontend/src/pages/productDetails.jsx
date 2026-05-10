import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/cartContext";



export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, toggleCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

 

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/products/${id}`);

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const result = await response.json();
        setProduct(result.data);
        setSelectedVariant(result.data.variants.find(v => v.isDefault) || result.data.variants[0]);
      } catch (err) {
        console.error("Fetch Error:", err.message);
      }
    };

    getDetails();
  }, [id]);

  if (!product || !selectedVariant) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
    {/* Breadcrumbs / Back Link (Professional UX) */}
    <nav className="p-6 max-w-7xl mx-auto">
      <button onClick={() => window.history.back()} className="text-gray-500 hover:text-cyan-500 transition-colors text-sm font-mono">
        &lt; BACK_TO_CATALOG
      </button>
    </nav>

    <main className="max-w-7xl mx-auto p-6 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
      
      {/* LEFT: Image Gallery Section */}
      <section className="space-y-4">
        <div className="aspect-square bg-[#111] rounded-2xl border border-gray-800 flex items-center justify-center p-12 sticky top-12">
          <img 
            src={selectedVariant.images[0]} 
            alt={product.name} 
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-700"
          />
        </div>
      </section>

      {/* RIGHT: Info & Purchase Section */}
      <section className="flex flex-col">
        <div className="border-b border-gray-800 pb-8 mb-8">
          <span className="text-cyan-500 font-mono tracking-widest text-sm uppercase">{product.brand}</span>
          <h1 className="text-4xl lg:text-5xl font-black mt-2 tracking-tight uppercase italic">{product.name}</h1>
          <p className="text-gray-400 mt-4 leading-relaxed">{product.description}</p>
        </div>

        {/* Pricing & Variants */}
        <div className="space-y-8">
          <div>
            <span className="text-gray-500 text-xs uppercase tracking-widest">Current Configuration</span>
            <div className="text-4xl font-black mt-1">${selectedVariant.price}</div>
          </div>

          <div>
            <h3 className="text-xs uppercase text-gray-500 mb-4 tracking-widest">Select Style</h3>
            <div className="flex flex-wrap gap-3">
              {product.variants.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-6 py-3 rounded-md font-bold text-sm transition-all border-2 ${
                    selectedVariant.id === v.id 
                    ? "border-cyan-500 text-cyan-500 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.1)]" 
                    : "border-gray-800 text-gray-500 hover:border-gray-600"
                  }`}
                >
                  {v.variantName}
                </button>
              ))}
            </div>
          </div>

          {/* Action Area */}
          <div className="pt-8 border-t border-gray-800">
             <div className="flex items-center gap-4 mb-6">
                <span className={`h-2 w-2 rounded-full animate-ping ${selectedVariant.stock > 0 ? "bg-green-500" : "bg-red-500"}`}></span>
                <span className="text-sm font-mono text-gray-400 uppercase">
                  {selectedVariant.stock > 0 ? `Stock_Available: ${selectedVariant.stock}` : "Out_of_Stock"}
                </span>
             </div>
             
             {/* Fixed Button Width: Using max-w-sm to prevent it being too huge */}
             <button
               onClick={() => { addToCart(product, selectedVariant); toggleCart(); }}
               disabled={selectedVariant.stock === 0}
               className="w-full max-w-sm py-5 bg-white text-black font-black uppercase tracking-tighter hover:bg-cyan-500 hover:text-white transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none"
             >
               {selectedVariant.stock === 0 ? "Out of Stock" : "Add to Rig"}
             </button>
          </div>
        </div>

        {/* --- NEW: SPECIFICATIONS SECTION --- */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <h3 className="text-sm uppercase text-cyan-500 font-bold mb-6 tracking-[0.2em]">Technical_Specifications</h3>
          <div className="grid grid-cols-2 gap-y-6 gap-x-12">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="border-b border-gray-900 pb-2">
                <dt className="text-gray-500 text-[10px] uppercase font-mono">{key.replace('_', ' ')}</dt>
                <dd className="text-white text-sm font-medium mt-1 uppercase">{value}</dd>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  </div>
  );
}