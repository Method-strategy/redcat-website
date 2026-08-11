import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/useShopify";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "pickleball", label: "Pickleball" },
  { id: "cycling", label: "Cycling" },
  { id: "tennis", label: "Tennis" },
  { id: "mountain-biking", label: "MTB" },
  { id: "golf", label: "Golf" },
];

const STATIC_PRODUCTS = [
  { id: "1", handle: "beast", title: "BEAST™", description: "Shield style. Mountain biking, cycling, and general outdoors.", tags: ["cycling", "mountain biking", "outdoors"], priceRange: { minVariantPrice: { amount: "204.99" } }, images: [{ url: "https://redcateyewear.com/cdn/shop/files/beast_red_frame_brown_with_red_mirror_lenses_1.jpg?crop=center&height=480&v=1740676455&width=600", altText: "BEAST" }] },
  { id: "2", handle: "roar", title: "ROAR™", description: "Wrap shield. Pickleball, tennis, cycling, running.", tags: ["pickleball", "tennis", "cycling"], priceRange: { minVariantPrice: { amount: "184.99" } }, images: [{ url: "https://redcateyewear.com/cdn/shop/files/roar_matte_met_cyan_gray_green_oil_slick_mirror_1.jpg?crop=center&height=480&v=1740665868&width=600", altText: "ROAR" }] },
  { id: "3", handle: "leap", title: "LEAP™", description: "Wrap frame. Pickleball, tennis, and general sports.", tags: ["pickleball", "tennis", "golf"], priceRange: { minVariantPrice: { amount: "144.99" } }, images: [{ url: "https://redcateyewear.com/cdn/shop/files/leap_matte_metallic_red_gray_polar_blue_mirror_1.jpg?crop=center&height=480&v=1740770157&width=600", altText: "LEAP" }] },
  { id: "4", handle: "strike", title: "STRIKE™", description: "Classic wrap. Pickleball, tennis, running, general sports.", tags: ["pickleball", "tennis", "outdoors"], priceRange: { minVariantPrice: { amount: "119.99" } }, images: [{ url: "https://redcateyewear.com/cdn/shop/files/strike_matte_tortoise_gray_polar_green_mirror_1.jpg?crop=center&height=480&v=1740770168&width=600", altText: "STRIKE" }] },
];

const TAG_MAP = {
  pickleball: ["pickleball"],
  cycling: ["cycling", "bike", "road cycling"],
  tennis: ["tennis"],
  "mountain-biking": ["mountain biking", "mtb", "cycling"],
  golf: ["golf", "course"],
};

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay } },
});

export default function Collections() {
  const { collection } = useParams();
  const [activeFilter, setActiveFilter] = useState(collection || "all");
  const { products: liveProducts, isLoading } = useProducts();

  const allProducts = !isLoading && liveProducts.length > 0 ? liveProducts : STATIC_PRODUCTS;

  const displayProducts = activeFilter === "all"
    ? allProducts
    : allProducts.filter((p) => {
        const tags = TAG_MAP[activeFilter] || [activeFilter];
        return p.tags?.some((tag) =>
          tags.some((t) => tag.toLowerCase().includes(t.toLowerCase()))
        );
      });

  return (
    <div className="bg-rc-dark pt-[var(--navbar-h)]" data-testid="collections-page">
      {/* Header */}
      <div className="py-16 px-6 max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">All Products</span>
          <h1
            className="font-display font-black uppercase leading-tight text-white mt-1"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
          >
            Performance<br />Eyewear
          </h1>
          <p className="text-white/45 text-sm mt-3 max-w-lg">
            Made in Italy. ColorBoost™ lens technology. Lifetime warranty. See faster. Be faster.
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="border-t border-white/10 px-6 sticky top-[var(--navbar-h)] z-30 bg-rc-dark/95 backdrop-blur-xl" data-testid="filter-bar">
        <div className="max-w-screen-xl mx-auto flex gap-0 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              data-testid={`filter-${f.id}`}
              className={`px-5 py-4 text-xs font-bold tracking-widest uppercase whitespace-nowrap border-b-2 transition-colors duration-150 ${
                activeFilter === f.id
                  ? "border-rc-red text-white"
                  : "border-transparent text-white/35 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-rc-dark">
                <div className="aspect-square bg-rc-surface animate-pulse" />
                <div className="p-5 space-y-2">
                  <div className="h-6 bg-rc-surface animate-pulse w-1/2" />
                  <div className="h-4 bg-rc-surface animate-pulse w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/30 text-sm mb-4">No products found for this activity.</p>
            <button
              onClick={() => setActiveFilter("all")}
              className="text-xs font-bold tracking-widest uppercase text-rc-cyan underline"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8">
            {displayProducts.map((product, i) => (
              <motion.div
                key={product.id || product.handle}
                variants={fadeUp(i * 0.06)}
                initial="hidden"
                animate="visible"
                className="bg-rc-dark group"
              >
                <Link
                  to={`/products/${product.handle}`}
                  data-testid={`collection-product-${product.handle}`}
                >
                  <div className="product-img-wrap aspect-square overflow-hidden bg-rc-surface">
                    <img
                      src={product.images?.[0]?.url || ""}
                      alt={product.images?.[0]?.altText || product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 border-t border-white/8">
                    <p className="text-[10px] text-white/30 tracking-widest uppercase mb-1">Redcat Eyewear</p>
                    <h3 className="font-display text-2xl font-black uppercase tracking-wider text-white group-hover:text-rc-red transition-colors duration-200">
                      {product.title}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-white/35 mt-1.5 leading-relaxed line-clamp-2">
                        {product.description.slice(0, 80)}...
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-white/55">
                        From ${parseFloat(product.priceRange?.minVariantPrice?.amount || 0).toFixed(2)}
                      </p>
                      <ArrowRight
                        size={14}
                        className="text-rc-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          variants={fadeUp(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 border border-white/10 p-10 text-center"
        >
          <p className="text-xs font-bold tracking-widest uppercase text-white/30 mb-3">Need Help Choosing?</p>
          <h3 className="font-display text-2xl font-black uppercase text-white mb-4">Shop by Activity</h3>
          <p className="text-sm text-white/45 mb-6 max-w-sm mx-auto">
            We'll match you with the right lens for your sport. Every model available in multiple lens systems.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["pickleball", "cycling", "tennis", "golf"].map((act) => (
              <Link
                key={act}
                to={`/activities/${act}`}
                className="px-5 py-2.5 border border-white/15 text-xs font-bold tracking-widest uppercase text-white/55 hover:border-rc-red hover:text-white transition-colors"
              >
                {act}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
