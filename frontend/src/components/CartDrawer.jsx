import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, isLoading } = useCart();
  const lines = cart?.lines || [];
  const total = cart?.cost?.totalAmount;
  const checkoutUrl = cart?.checkoutUrl;

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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            onClick={closeCart}
          />
          <motion.aside
            key="drawer"
            data-testid="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-rc-surface border-l border-white/10 z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h2 className="font-display text-xl font-black uppercase tracking-widest">
                Cart {lines.length > 0 && <span className="text-white/30 font-normal">({cart?.totalQuantity})</span>}
              </h2>
              <button
                onClick={closeCart}
                data-testid="close-cart"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {lines.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <ShoppingBag size={40} className="text-white/15 mb-4" />
                  <p className="text-white/40 text-sm mb-1">Your cart is empty</p>
                  <p className="text-white/25 text-xs mb-6">Add some performance eyewear</p>
                  <button
                    onClick={closeCart}
                    className="text-xs font-bold tracking-widest uppercase text-rc-cyan underline underline-offset-4 hover:text-white transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-white/8">
                  {lines.map((line) => (
                    <li key={line.id} className="flex gap-4 px-6 py-5" data-testid="cart-line-item">
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-rc-dark">
                        {line.variant?.image ? (
                          <img
                            src={line.variant.image.url}
                            alt={line.variant.image.altText || line.variant.product?.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-rc-dark" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-sm uppercase tracking-wider truncate">
                          {line.variant?.product?.title}
                        </p>
                        {line.variant?.title !== "Default Title" && (
                          <p className="text-xs text-white/40 mt-0.5 truncate">{line.variant?.title}</p>
                        )}
                        <p className="text-sm font-semibold mt-2">
                          ${parseFloat(line.variant?.price?.amount || 0).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => updateQuantity(line.id, line.quantity - 1)}
                            className="w-7 h-7 border border-white/20 flex items-center justify-center hover:border-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-sm w-5 text-center font-medium">{line.quantity}</span>
                          <button
                            onClick={() => updateQuantity(line.id, line.quantity + 1)}
                            className="w-7 h-7 border border-white/20 flex items-center justify-center hover:border-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={10} />
                          </button>
                          <button
                            onClick={() => removeFromCart(line.id)}
                            className="ml-auto text-xs text-white/25 hover:text-white/70 transition-colors"
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
            {lines.length > 0 && (
              <div className="border-t border-white/10 px-6 py-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-sm">Subtotal</span>
                  <span className="font-bold text-white">
                    ${total ? parseFloat(total.amount).toFixed(2) : "0.00"} {total?.currencyCode || "USD"}
                  </span>
                </div>
                <p className="text-xs text-white/30">Shipping and taxes calculated at checkout.</p>
                <a
                  href={checkoutUrl || "https://redcateyewear.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="checkout-button"
                  className="block w-full bg-rc-red text-white text-center py-4 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-rc-red transition-colors duration-200"
                >
                  Checkout Securely
                </a>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
