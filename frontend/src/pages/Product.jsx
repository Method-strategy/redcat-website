import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { useProduct } from "@/hooks/useShopify";
import { useCart } from "@/context/CartContext";
import { useSEO } from "@/hooks/useSEO";

const COLOR_MAP = {
  black: "#1C1C1C", pink: "#D4496C", orange: "#E8642C",
  red: "#D90012", cyan: "#00C9D4", tortoise: "#8B5E3C",
  crystal: "#AAAAAA", smoke: "#888888", white: "#F0F0F0",
};

function getFrameColor(val = "") {
  const lower = val.toLowerCase();
  for (const [key, hex] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return hex;
  }
  return "#555555";
}

const PRODUCT_SPECS = {
  beast: { colortuned: "32%", vlt: "13%", weight: "32g", frames: "TR-90", lens: "Polycarbonate", fit: "One Size Fits Most", country: "Italy", activities: "Mountain Biking, Cycling, General Outdoors" },
  roar: { colortuned: "32%", vlt: "16%", weight: "28g", frames: "TR-90", lens: "Polycarbonate", fit: "One Size Fits Most", country: "Italy", activities: "Pickleball, Tennis, Cycling, Running" },
  leap: { colortuned: "28%", vlt: "20%", weight: "26g", frames: "TR-90", lens: "Polycarbonate", fit: "One Size Fits Most", country: "Italy", activities: "Pickleball, Tennis, Cycling, General Sports" },
  strike: { colortuned: "28%", vlt: "22%", weight: "24g", frames: "TR-90", lens: "Polycarbonate", fit: "One Size Fits Most", country: "Italy", activities: "Pickleball, Tennis, Running, General Sports" },
};

function ProductSkeleton() {
  return (
    <div className="bg-white dark:bg-rc-dark pt-[var(--navbar-h)] px-6 max-w-screen-xl mx-auto py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-100 dark:bg-rc-surface animate-pulse" />
        <div className="space-y-4">
          <div className="h-12 bg-gray-100 dark:bg-rc-surface w-3/4 animate-pulse" />
          <div className="h-8 bg-gray-100 dark:bg-rc-surface w-1/3 animate-pulse" />
          <div className="h-24 bg-gray-100 dark:bg-rc-surface animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function Product() {
  const { handle } = useParams();
  const { product, isLoading, error } = useProduct(handle);
  const { addToCart } = useCart();

  const specs = PRODUCT_SPECS[handle] || {};

  // SEO with Product schema
  useSEO({
    title: product
      ? `${product.title} Sport Sunglasses | Redcat® Eyewear`
      : `${handle.charAt(0).toUpperCase() + handle.slice(1)} | Redcat® Eyewear`,
    description: product
      ? `The ${product.title} by Redcat® — ${specs.activities || "performance sport sunglasses"}. ${product.description || ""} Made in Italy.`
      : "Performance sport sunglasses with color-tuned lenses. Crafted in Italy.",
    keywords: `${handle} sunglasses, Redcat ${handle}, ${specs.activities || "sport sunglasses"}, color tuned lenses`,
    image: product?.images?.[0]?.url,
    path: `/products/${handle}`,
    schema: product
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          description: product.description,
          brand: { "@type": "Brand", name: "Redcat® Eyewear" },
          image: product.images?.map((i) => i.url) || [],
          sku: handle,
          category: "Sport Sunglasses",
          countryOfOrigin: "Italy",
          material: "Polycarbonate lenses, TR-90 frames",
          offers: product.variants?.length
            ? product.variants.map((v) => ({
                "@type": "Offer",
                price: v.price?.amount || product.priceRange?.minVariantPrice?.amount,
                priceCurrency: "USD",
                availability: v.availableForSale
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
                url: `https://redcateyewear.com/products/${handle}`,
                itemCondition: "https://schema.org/NewCondition",
              }))
            : {
                "@type": "Offer",
                price: product.priceRange?.minVariantPrice?.amount,
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
                url: `https://redcateyewear.com/products/${handle}`,
              },
        }
      : undefined,
  });

  const [selectedOptions, setSelectedOptions] = useState({});
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");

  useEffect(() => {
    if (product?.options?.length) {
      const initial = {};
      product.options.forEach((opt) => { initial[opt.name] = opt.values[0]; });
      setSelectedOptions(initial);
    }
  }, [product?.id]);

  // Smart option change: when Frame Color changes, auto-update incompatible lens options
  const handleOptionChange = (optName, val) => {
    setSelectedOptions((prev) => {
      const next = { ...prev, [optName]: val };
      // Check if any variant matches the new combo
      const exactMatch = product?.variants.find((v) =>
        v.selectedOptions.every((o) => next[o.name] === o.value)
      );
      if (!exactMatch && product?.variants?.length) {
        // Find first variant that matches the changed option
        const fallback = product.variants.find((v) =>
          v.selectedOptions.some((o) => o.name === optName && o.value === val)
        );
        if (fallback) {
          fallback.selectedOptions.forEach((o) => { next[o.name] = o.value; });
        }
      }
      return next;
    });
  };

  const currentVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    return product.variants.find((v) =>
      v.selectedOptions.every((o) => selectedOptions[o.name] === o.value)
    ) || product.variants[0];
  }, [product, selectedOptions]);

  // Reset image index when variant changes
  useEffect(() => {
    setMainImageIndex(0);
  }, [currentVariant?.id]);

  // Use variant-specific images if available, fall back to product images
  const galleryImages = useMemo(() => {
    if (currentVariant?.variantImages?.length) {
      return currentVariant.variantImages;
    }
    return product?.images || [];
  }, [currentVariant, product]);

  const mainImage = galleryImages[mainImageIndex] || galleryImages[0] || null;
  const price = currentVariant?.price?.amount || product?.priceRange?.minVariantPrice?.amount;

  const handleAddToCart = () => {
    if (!currentVariant?.id) return;
    addToCart(currentVariant.id, 1, {
      productTitle: product.title,
      variantTitle: currentVariant.title,
      price: parseFloat(currentVariant.price?.amount || 0),
      image: galleryImages[0] || null,
      handle,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  if (isLoading) return <ProductSkeleton />;

  if (error || !product) {
    return (
      <div className="bg-white dark:bg-rc-dark pt-[var(--navbar-h)] min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-gray-400 dark:text-white/40 text-sm">Product not found.</p>
        <Link to="/collections" className="text-xs font-bold tracking-widest uppercase text-rc-red underline">
          Browse All Products
        </Link>
      </div>
    );
  }

  const tabs = ["specs", "care", "brand"];

  return (
    <div className="bg-white dark:bg-rc-dark pt-[var(--navbar-h)]" data-testid="product-page">
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-6 py-5">
        <Link
          to="/collections"
          data-testid="back-to-collections"
          className="inline-flex items-center gap-2 text-xs text-gray-400 dark:text-white/30 hover:text-gray-900 dark:hover:text-white transition-colors tracking-widest uppercase"
        >
          <ArrowLeft size={12} /> All Products
        </Link>
      </div>

      {/* Main */}
      <div className="max-w-screen-xl mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 pb-24">
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="aspect-square bg-gray-50 dark:bg-rc-surface overflow-hidden flex items-center justify-center p-6"
            data-testid="product-main-image"
          >
            {mainImage ? (
              <img
                src={mainImage.url}
                alt={mainImage.altText || product.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag size={40} className="text-gray-200 dark:text-white/10" />
              </div>
            )}
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
            {galleryImages.slice(0, 8).map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImageIndex(i)}
                className={`flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-colors bg-gray-50 dark:bg-rc-surface flex items-center justify-center p-1 ${
                  mainImageIndex === i
                    ? "border-rc-red"
                    : "border-transparent hover:border-gray-300 dark:hover:border-white/30"
                }`}
                data-testid={`thumb-${i}`}
              >
                <img
                  src={img.url}
                  alt={img.altText || `${product.title} view ${i + 1}`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          <span className="text-xs text-gray-400 dark:text-white/35 tracking-widest uppercase">Redcat Eyewear</span>
          <h1
            data-testid="product-title"
            className="font-display font-black uppercase text-gray-900 dark:text-white mt-1 mb-2"
            style={{ fontSize: "clamp(3rem, 7vw, 5rem)", lineHeight: 0.9 }}
          >
            {product.title}
          </h1>

          <p data-testid="product-price" className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            ${parseFloat(price || 0).toFixed(2)}{" "}
            <span className="text-sm text-gray-400 dark:text-white/35 font-normal">USD</span>
          </p>

          {/* Options */}
          {product.options?.map((opt) => {
            const isColor = opt.name.toLowerCase().includes("color") || opt.name.toLowerCase().includes("frame");
            return (
              <div key={opt.name} className="mb-6">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-white/40 mb-3">
                  {opt.name}:{" "}
                  <span className="text-gray-900 dark:text-white">{selectedOptions[opt.name]}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {opt.values.map((val) =>
                    isColor ? (
                      <button
                        key={val}
                        onClick={() => handleOptionChange(opt.name, val)}
                        title={val}
                        data-testid={`option-${opt.name}-${val}`.toLowerCase().replace(/\s+/g, "-")}
                        className="relative w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110"
                        style={{
                          backgroundColor: getFrameColor(val),
                          borderColor: selectedOptions[opt.name] === val ? "#D90012" : "transparent",
                          outline: selectedOptions[opt.name] === val ? "2px solid rgba(217,0,18,0.25)" : "none",
                          outlineOffset: "2px",
                        }}
                      />
                    ) : (
                      <button
                        key={val}
                        onClick={() => handleOptionChange(opt.name, val)}
                        data-testid={`option-${opt.name}-${val}`.toLowerCase().replace(/\s+/g, "-")}
                        className={`px-3 py-1.5 text-xs font-semibold tracking-wide border transition-colors duration-150 ${
                          selectedOptions[opt.name] === val
                            ? "border-rc-red bg-rc-red text-white"
                            : "border-black/15 dark:border-white/15 text-gray-600 dark:text-white/55 hover:border-gray-900 dark:hover:border-white/40 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        {val}
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}

          {/* Availability */}
          {currentVariant && (
            <p className="text-xs text-gray-400 dark:text-white/35 mb-4">
              {currentVariant.availableForSale ? (
                <span className="text-green-600 dark:text-green-400">In Stock</span>
              ) : (
                <span className="text-rc-red">Out of Stock</span>
              )}
              {currentVariant.quantityAvailable > 0 && currentVariant.quantityAvailable < 10 && (
                <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                  — Only {currentVariant.quantityAvailable} left
                </span>
              )}
            </p>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!currentVariant?.availableForSale}
            data-testid="add-to-cart-button"
            className={`w-full py-4 text-xs font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
              addedToCart
                ? "bg-green-600 text-white"
                : "bg-rc-red text-white hover:bg-gray-900 dark:hover:bg-white dark:hover:text-rc-red disabled:opacity-40 disabled:cursor-not-allowed"
            }`}
          >
            {addedToCart ? (
              <><Check size={14} /> Added to Cart</>
            ) : currentVariant?.availableForSale ? (
              "Add to Cart"
            ) : (
              "Out of Stock"
            )}
          </button>

          <p className="text-xs text-gray-400 dark:text-white/25 mt-3 text-center">Free shipping on orders over $75</p>

          {/* Description */}
          <div className="mt-8 border-t border-black/10 dark:border-white/10 pt-6">
            <p className="text-sm text-gray-600 dark:text-white/50 leading-relaxed">{product.description}</p>
          </div>

          {/* Tabs */}
          <div className="mt-8">
            <div className="flex border-b border-black/10 dark:border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  data-testid={`tab-${tab}`}
                  className={`px-4 py-3 text-xs font-bold tracking-widest uppercase transition-colors ${
                    activeTab === tab
                      ? "text-gray-900 dark:text-white border-b-2 border-rc-red"
                      : "text-gray-400 dark:text-white/30 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tab === "brand" ? "About Redcat" : tab}
                </button>
              ))}
            </div>

            <div className="pt-5 text-sm text-gray-600 dark:text-white/50 leading-relaxed">
              {activeTab === "specs" && (
                <div data-testid="specs-tab" className="grid grid-cols-2 gap-y-3 gap-x-6">
                  {[
                    ["Color Tuned", specs.colortuned || "Up to 32%"],
                    ["Lens VLT", specs.vlt || "—"],
                    ["Frame Material", specs.frames || "TR-90"],
                    ["Lens Material", specs.lens || "Polycarbonate"],
                    ["Weight", specs.weight || "~30g"],
                    ["Country of Origin", specs.country || "Italy"],
                    ["Fit", specs.fit || "One Size Fits Most"],
                    ["CE Rated", "Yes"],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-widest">{label}</p>
                      <p className="text-gray-900 dark:text-white font-medium mt-0.5">{val}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "care" && (
                <div data-testid="care-tab" className="space-y-3">
                  <p>Store in the provided microfiber pouch and padded case.</p>
                  <p>Clean with one or two drops of mild soap in lukewarm water, or an eyeglass cleaner designated for coated lenses. Dry with the included microfiber cloth.</p>
                  <p>Avoid harsh cleaners, solvents, and paper products. Don't leave in a hot car or direct sun for extended periods.</p>
                </div>
              )}
              {activeTab === "brand" && (
                <div data-testid="brand-tab" className="space-y-3">
                  <p><strong className="text-gray-900 dark:text-white">Manufactured in Italy.</strong> Like many of the world's top sports and designer sunglasses, Redcat® Eyewear is designed and manufactured in Italy, carrying CE certification.</p>
                  <p><strong className="text-gray-900 dark:text-white">Lifetime Warranty.</strong> We offer a lifetime warranty to the original owner against manufacturer's defects in materials and workmanship.</p>
                  <p><strong className="text-gray-900 dark:text-white">30-Day Returns.</strong> If you're not completely satisfied, return it for a full refund within 30 days of delivery.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
