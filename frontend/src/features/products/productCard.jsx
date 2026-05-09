

export default function ProductCard({ product }) {
    return (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden hover:border-cyan-500 transition-all duration-300 group">
            {/* Image Container */}
            <div className="h-48 bg-black">
                <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-fit: cover hover:scale-105 transition-all duration-500 ease-in-out "
                    onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Nexus+Hardware'; }}
                />
            </div>

            {/* Content */}
            <div className="p-4">
                <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest">
                    {product.brand}
                </span>
                <h3 className="text-white font-semibold text-lg truncate mt-1">
                    {product.name}
                </h3>

                <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-400 text-sm">Starting at</span>
                    <span className="text-white font-bold text-xl">${product.startingPrice}</span>
                </div>

                <button onClick={() => {
                    window.location.href = `/product/${product.id}`;
                }} className="w-full mt-4 bg-white text-black py-2 rounded font-bold hover:bg-cyan-500 hover:text-white transition-colors text-center">
                    View Details
                </button>
            </div>
        </div>
    );
}