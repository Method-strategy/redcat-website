import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, subtotal, getCheckoutUrl } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={closeCart}
          />
          <motion.aside
            key="drawer"
            data-testid="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#0f0f0f] border-l border-white/8 z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <h2 className="font-display text-xl font-black uppercase tracking-widest text-white">
                Cart{" "}
                {items.length > 0 && (
                  <span className="text-white/30 font-normal text-base">
                    ({items.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                data-testid="close-cart"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-3">
                  <ShoppingBag size={36} className="text-white/10" />
                  <p className="text-white/35 text-sm">Your cart is empty</p>
                  <p className="text-white/20 text-xs">Add some performance eyewear</p>
                  <button
                    onClick={closeCart}
                    className="text-xs font-bold tracking-widest uppercase text-rc-cyan underline underline-offset-4 hover:text-white transition-colors mt-2"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-white/6">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 px-6 py-5" data-testid="cart-line-item">
                      {/* Image */}
                      <Link
                        to={`/products/${item.handle || ""}`}
                        onClick={closeCart}
                        className="flex-shrink-0 w-20 h-20 bg-white flex items-center justify-center overflow-hidden"
                      >
                        {item.image?.url ? (
                          <img
                            src={item.image.url}
                            alt={item.image.altText || item.productTitle}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <ShoppingBag size={20} className="text-gray-300" />
                        )}
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-sm uppercase tracking-wider text-white truncate">
                          {item.productTitle}
                        </p>
                        {item.variantTitle && item.variantTitle !== "Default Title" && (
                          <p className="text-xs text-white/40 mt-0.5 truncate">{item.variantTitle}</p>
                        )}
                        <p className="text-sm font-semibold text-white mt-1.5">
                          ${((item.price || 0) * item.quantity).toFixed(2)}
                        </p>

                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 border border-white/15 flex items-center justify-center hover:border-white/50 transition-colors text-white"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-sm w-5 text-center font-medium text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 border border-white/15 flex items-center justify-center hover:border-white/50 transition-colors text-white"
                            aria-label="Increase quantity"
                          >
                            <Plus size={10} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-xs text-white/20 hover:text-white/60 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/8 px-6 py-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/45 text-sm">Subtotal</span>
                  <span className="font-bold text-white text-lg">${subtotal.toFixed(2)} USD</span>
                </div>
                <p className="text-xs text-white/25">Shipping and taxes calculated at checkout.</p>
                <a
                  href={getCheckoutUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="checkout-button"
                  className="flex items-center justify-center gap-2 w-full bg-rc-red text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-rc-red transition-colors duration-200"
                >
                  Checkout Securely <ArrowRight size={13} />
                </a>
                <p className="text-[10px] text-white/20 text-center">
                  You'll complete your purchase on redcateyewear.com
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
