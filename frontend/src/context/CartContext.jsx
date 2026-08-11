import { createContext, useContext, useState, useCallback, useEffect } from "react";

const CartContext = createContext({});
const STORE_URL = "https://redcateyewear.com";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rc_cart_items") || "[]"); }
    catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("rc_cart_items", JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((variantId, quantity = 1, meta = {}) => {
    const id = String(variantId);
    setItems(prev => {
      const existing = prev.find(i => i.variantId === id);
      if (existing) {
        return prev.map(i => i.variantId === id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { id: `${id}_${Date.now()}`, variantId: id, quantity, ...meta }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.id !== itemId));
    } else {
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
    }
  }, []);

  const getCheckoutUrl = useCallback(() => {
    if (!items.length) return STORE_URL;
    const params = items.map(i => `${i.variantId}:${i.quantity}`).join(",");
    return `${STORE_URL}/cart/${params}`;
  }, [items]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      isLoading: false,
      totalItems,
      subtotal,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addToCart,
      removeFromCart,
      updateQuantity,
      getCheckoutUrl,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
