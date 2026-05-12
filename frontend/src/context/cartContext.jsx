import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize from localStorage so the cart doesn't disappear on refresh
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('nexus_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nexus_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, variant, quantity = 1) => {
    setCart((prev) => {
      // Check if this specific SKU is already in the cart
      const existingItem = prev.find((item) => item.sku === variant.sku);

      if (existingItem) {
        // Validation: Don't exceed stock
        const newQty = existingItem.quantity + quantity;
        if (newQty > variant.stock) return prev;

        return prev.map((item) =>
          item.sku === variant.sku ? { ...item, quantity: newQty } : item
        );
      }



      // Add new item if it doesn't exist
      return [...prev, {
        productId: product.id,
        name: product.name,
        brand: product.brand,
        variantName: variant.variantName,
        sku: variant.sku,
        price: variant.price,
        image: variant.images[0],
        stock: variant.stock,
        quantity
      }];
    });
  };

  const removeFromCart = (sku) => {
    setCart((prev) => prev.filter((item) => item.sku !== sku));
  };

  const clearCart = () => setCart([]);

  const updateQuantity = (sku, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.sku === sku) {
          const newQty = item.quantity + delta;

          // 1. Min Boundary: Don't go below 1
          if (newQty < 1) return item;

          // 2. Max Boundary: Don't exceed current stock
          if (newQty > item.stock) return item;

          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // Calculate totals for the UI
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  //cart slider open and close
  const [isOpen, setIsOpen] = useState(false);
  const toggleCart = () => setIsOpen(!isOpen);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart,
      clearCart, updateQuantity, totalItems, totalPrice,
      isOpen, toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);