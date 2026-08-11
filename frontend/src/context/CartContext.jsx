import { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const CartContext = createContext({});

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cartId = localStorage.getItem("rc_cart_id");
    if (cartId) {
      axios.get(`${API}/cart/${encodeURIComponent(cartId)}`)
        .then(r => setCart(r.data))
        .catch(() => localStorage.removeItem("rc_cart_id"));
    }
  }, []);

  const addToCart = useCallback(async (variantId, quantity = 1) => {
    setIsLoading(true);
    try {
      const cartId = cart?.id || localStorage.getItem("rc_cart_id");
      let newCart;
      if (cartId) {
        const r = await axios.post(`${API}/cart/add`, { cartId, lines: [{ merchandiseId: variantId, quantity }] });
        newCart = r.data;
      } else {
        const r = await axios.post(`${API}/cart`, { lines: [{ merchandiseId: variantId, quantity }] });
        newCart = r.data;
        localStorage.setItem("rc_cart_id", newCart.id);
      }
      setCart(newCart);
      setIsOpen(true);
    } catch (e) {
      if (e?.response?.status === 503) {
        // Shopify Storefront API unavailable — redirect to store
        window.open("https://redcateyewear.com/collections/all", "_blank");
      } else {
        console.error("Add to cart error:", e);
      }
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const removeFromCart = useCallback(async (lineId) => {
    if (!cart) return;
    setIsLoading(true);
    try {
      const r = await axios.post(`${API}/cart/remove`, { cartId: cart.id, lineIds: [lineId] });
      setCart(r.data);
    } catch (e) {
      console.error("Remove from cart error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const updateQuantity = useCallback(async (lineId, quantity) => {
    if (!cart) return;
    if (quantity <= 0) return removeFromCart(lineId);
    setIsLoading(true);
    try {
      const r = await axios.post(`${API}/cart/update`, { cartId: cart.id, lines: [{ id: lineId, quantity }] });
      setCart(r.data);
    } catch (e) {
      console.error("Update quantity error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [cart, removeFromCart]);

  return (
    <CartContext.Provider value={{
      cart,
      isOpen,
      isLoading,
      totalItems: cart?.totalQuantity || 0,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addToCart,
      removeFromCart,
      updateQuantity,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
