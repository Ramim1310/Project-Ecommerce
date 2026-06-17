import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    return (
        <div className="bg-zinc-900 border border-zinc-800 hover-industrial flex flex-col h-full group cursor-pointer relative overflow-hidden" onClick={() => {
            navigate(`/product/${product.id}`);
        }}>
            {/* Image Container */}
            <div className="h-48 bg-zinc-950 flex items-center justify-center p-4">
                <img
                    src={product.thumbnail || product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => { e.target.src = 'https://placehold.co/400x300/18181b/06b6d4?text=Nexus+Hardware'; }}
                />
            </div>

            {/* Content */}
            <div className="p-5 flex-grow flex flex-col justify-between border-t border-zinc-800">
                <div>
                    <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.2em]">
                        {product.brand}
                    </span>
                    <h3 className="text-zinc-100 font-bold text-base mt-2 leading-tight uppercase">
                        {product.name}
                    </h3>
                </div>

                <div className="flex items-end justify-between mt-6">
                    <div className="flex flex-col">
                        <span className="text-zinc-500 font-mono text-[10px] tracking-widest">BASE_MSRP</span>
                        <span className="text-zinc-100 font-mono font-bold text-lg mt-1">${product.startingPrice || (product.variants && product.variants[0]?.price)}</span>
                    </div>
                    <div className="text-cyan-500 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        [ VIEW_SPECS ]
                    </div>
                </div>
            </div>
            
            {/* Subtle accent line on hover */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
        </div>
    );
}