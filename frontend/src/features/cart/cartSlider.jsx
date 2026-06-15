import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import { isAuthenticated } from '../../utils/auth';
import API from '../../api/apiClient';


export default function CartDrawer() {
  const { cart, isOpen, toggleCart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loginPrompt, setLoginPrompt] = useState(false);

  if (!isOpen) return null;



  const handleCheckout = async () => {
    // require login before placing an order
    if (!isAuthenticated()) {
      setLoginPrompt(true);
      setTimeout(() => {
        setLoginPrompt(false);
        toggleCart();           // close the drawer
        navigate('/login');     // redirect to login page
      }, 3500);
      return;
    }


    const orderPayload = {
      totalAmount: totalPrice,
      shippingAddress: "Nexus HQ, Cyber City", // Hardcoded for now, you can add a form later
      items: cart.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const response = await API.post('/orders/checkout', orderPayload);
      const result = response.data;

      if (result.success && result.data) {
        window.location.replace(result.data);
      } else {
        alert(`Checkout failed: ${result.message}`);
      }

    } catch (error) {
      console.error("Checkout error:", error);
      alert("Could not reach servers. Please try again.");
    }
  };



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
            Your <span className="text-cyan-500">Cart</span>
          </h2>
          <button onClick={toggleCart} className="text-gray-500 hover:text-white transition-colors">
            Close
          </button>
        </div>

        {/* Login Required Banner */}
        {loginPrompt && (
          <div className="mx-4 mt-4 p-4 rounded-lg border border-cyan-500/50 bg-cyan-500/10 animate-pulse">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="text-cyan-400 font-bold uppercase text-sm tracking-wider">Login Required</p>
                <p className="text-gray-400 text-xs mt-1">You need to log in before placing an order. Redirecting...</p>
              </div>
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 font-mono text-sm uppercase">Your cart is empty</p>
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
                    <span className="text-white font-bold">${Number(item.price).toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(item.sku)}
                      className="text-gray-800 group-hover:text-red-500 transition-colors text-xs"
                    >
                      REMOVE
                    </button>
                  </div>

                  {/* Quantity Stepper + Subtotal */}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-gray-800 rounded bg-black">
                      <button
                        onClick={() => updateQuantity(item.sku, -1)}
                        className="px-3 py-1 text-gray-500 hover:text-cyan-500 transition-colors border-r border-gray-800 disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-xs font-mono text-white">
                        {item.quantity.toString().padStart(2, '0')}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.sku, 1)}
                        className="px-3 py-1 text-gray-500 hover:text-cyan-500 transition-colors border-l border-gray-800 disabled:opacity-30"
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-gray-500 text-[10px] uppercase font-mono">
                      Sub: ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Totals and Checkout */}
        <div className="p-6 border-t border-gray-800 bg-[#0d0d0d]">
          <div className="flex justify-between mb-6">
            <span className="text-gray-500 uppercase text-xs font-bold tracking-widest">Total</span>
            <span className="text-white text-2xl font-black">${totalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-4 bg-cyan-500 hover:bg-white text-black font-black uppercase tracking-widest transition-all disabled:bg-gray-800"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}