import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, ChevronDown, Menu } from "lucide-react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  {
    label: "SHOP",
    href: "/collections",
    children: [
      { label: "All Products", href: "/collections" },
      { label: "BEAST™", href: "/products/beast" },
      { label: "ROAR™", href: "/products/roar" },
      { label: "LEAP™", href: "/products/leap" },
      { label: "STRIKE™", href: "/products/strike" },
    ],
  },
  { label: "BRAND", href: "/brand" },
  {
    label: "ACTIVITIES",
    href: "/activities/pickleball",
    children: [
      { label: "Pickleball", href: "/activities/pickleball" },
      { label: "Tennis", href: "/activities/tennis" },
      { label: "Cycling", href: "/activities/cycling" },
      { label: "Mountain Biking", href: "/activities/mountain-biking" },
      { label: "Golf", href: "/activities/golf" },
    ],
  },
];

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-rc-dark/95 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      }`}
      style={{ height: "var(--navbar-h)" }}
    >
      <div className="max-w-screen-xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          data-testid="navbar-logo"
          className="font-display text-2xl font-black tracking-widest uppercase text-white hover:text-rc-red transition-colors duration-200"
        >
          REDCAT<span className="text-rc-red">®</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8" data-testid="desktop-nav">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={link.href}
                className="flex items-center gap-1 text-xs font-body font-semibold tracking-widest uppercase text-white/80 hover:text-white transition-colors duration-200"
                data-testid={`nav-${link.label.toLowerCase()}`}
              >
                {link.label}
                {link.children && <ChevronDown size={12} />}
              </Link>
              <AnimatePresence>
                {link.children && activeDropdown === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-2 bg-rc-surface border border-white/10 min-w-[180px] py-2"
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        className="block px-5 py-2.5 text-xs font-semibold tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <button
            data-testid="cart-button"
            onClick={openCart}
            className="relative text-white hover:text-rc-cyan transition-colors duration-200"
            aria-label="Open cart"
          >
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span
                data-testid="cart-count"
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rc-red text-white text-[9px] font-bold rounded-full flex items-center justify-center"
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-white hover:text-rc-cyan transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-rc-dark border-t border-white/10 overflow-hidden"
            data-testid="mobile-menu"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    to={link.href}
                    className="block py-3 text-sm font-semibold tracking-widest uppercase text-white/80 hover:text-white transition-colors border-b border-white/5"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pl-4">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block py-2 text-xs tracking-widest uppercase text-white/50 hover:text-white transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
