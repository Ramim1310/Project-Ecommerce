import { useCart } from "../../context/cartContext";

export default function CartDrawer() {
  const { cart, isOpen, toggleCart, removeFromCart, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop: Click to close */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={toggleCart}
      ></div>

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#0a0a0a] border-l border-gray-800 shadow-2xl flex flex-col h-full animate-slide-in">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-tighter italic">
            Your <span className="text-cyan-500">Rig_</span>
          </h2>
          <button onClick={toggleCart} className="text-gray-500 hover:text-white transition-colors">
            [CLOSE]
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 font-mono text-sm uppercase">Empty_Inventory</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.sku} className="flex gap-4 group">
                <div className="w-20 h-20 bg-black rounded border border-gray-800 p-2 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-grow">
                  <h4 className="text-white text-sm font-bold uppercase truncate">{item.name}</h4>
                  <p className="text-xs text-cyan-500 font-mono mt-1">{item.variantName}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400 text-xs italic">Qty: {item.quantity}</span>
                    <span className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.sku)}
                  className="text-gray-800 group-hover:text-red-500 transition-colors text-xs"
                >
                  REMOVE
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer: Totals and Checkout */}
        <div className="p-6 border-t border-gray-800 bg-[#0d0d0d]">
          <div className="flex justify-between mb-6">
            <span className="text-gray-500 uppercase text-xs font-bold tracking-widest">Total_Value</span>
            <span className="text-white text-2xl font-black">${totalPrice.toFixed(2)}</span>
          </div>
          <button 
            disabled={cart.length === 0}
            className="w-full py-4 bg-cyan-500 hover:bg-white text-black font-black uppercase tracking-widest transition-all disabled:bg-gray-800"
          >
            Initiate_Checkout
          </button>
        </div>
      </div>
    </div>
  );
}