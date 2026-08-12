import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import { useProducts } from "@/hooks/useShopify";
import { useSEO } from "@/hooks/useSEO";

const ARON_IMG = "https://customer-assets-v7afamib.emergentagent.net/job_redcat-astro-build/artifacts/c7hlz9sw_Aron%20Redcats%20Special%20Effect%202.webp";
const MTB_IMG = "https://redcateyewear.com/cdn/shop/files/mountain-bike-cycling-and-fitness.jpg?crop=center&height=900&v=1719939492&width=1600";
const ROAR_FLOAT = "https://redcateyewear.com/cdn/shop/files/Redcat_ROAR_Cyan_Floating_Product_Shot.png?crop=center&v=1764667633&width=1600";
const BEAST_WILD = "https://redcateyewear.com/cdn/shop/files/Redcat_BEAST_Aron_in_the_Wild.png?crop=center&height=800&v=1764667927&width=1600";

const CDN = "https://cdn.shopify.com/s/files/1/0774/1784/0936/files";
const STATIC_PRODUCTS = [
  { id: "1", handle: "beast", title: "Beast", priceRange: { minVariantPrice: { amount: "204.99" } }, images: [{ url: `${CDN}/beast_red_frame_brown_with_red_mirror_lenses_1.jpg`, altText: "Beast" }] },
  { id: "2", handle: "roar", title: "Roar", priceRange: { minVariantPrice: { amount: "184.99" } }, images: [{ url: `${CDN}/roar_matte_met_cyan_gray_green_oil_slick_mirror_1.jpg`, altText: "Roar" }] },
  { id: "3", handle: "leap", title: "Leap", priceRange: { minVariantPrice: { amount: "144.99" } }, images: [{ url: `${CDN}/leap_matte_metallic_red_gray_polar_blue_mirror_1.jpg`, altText: "Leap" }] },
  { id: "4", handle: "strike", title: "Strike", priceRange: { minVariantPrice: { amount: "119.99" } }, images: [{ url: `${CDN}/strike_matte_tortoise_gray_polar_green_mirror_1.jpg`, altText: "Strike" }] },
];

const ACTIVITIES = [
  { name: "PICKLEBALL", href: "/activities/pickleball", image: "https://redcateyewear.com/cdn/shop/files/LEAP_Pickleball_-_Dark_Blue_with_Dark_Green_Lenses_3840x2160_12ac36d4-ede4-4785-811b-4ac3d3ec569c.jpg?crop=center&height=800&v=1713192324&width=800", lens: "LumiGlo / FireGlo" },
  { name: "CYCLING", href: "/activities/cycling", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=srgb&fm=jpg&q=85&w=800", lens: "CarbonGlo" },
  { name: "TENNIS", href: "/activities/tennis", image: "https://redcateyewear.com/cdn/shop/files/AdobeStock_321178379.jpg?crop=center&height=800&v=1721052329&width=800", lens: "LumiGlo" },
  { name: "GOLF & OUTDOORS", href: "/activities/golf", image: "https://images.unsplash.com/photo-1611374243147-44a702c2d44c?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85", lens: "CarbonGlo" },
  { name: "DRIVING", href: "/activities/driving", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=800", lens: "BronzeGlo / PolarGlo" },
];

const CHAPTERS = [
  { num: "01", title: "COLOR-TUNED TECHNOLOGY", body: "Advanced color-tuned lenses amplify specific wavelengths beyond normal human perception — up to 37% — delivering sharper acuity, heightened contrast, and a true competitive edge." },
  { num: "02", title: "MADE IN ITALY", body: "Every Redcat frame is designed and manufactured in Italy, CE-certified. TR-90 thermoplastic construction that flexes under impact instead of snapping. Hand-finished by skilled craftspeople." },
  { num: "03", title: "UV400 PROTECTION", body: "Every Redcat lens filters UVA and UVB rays up to 400 nanometers — no upgrade tier, no exceptions. Backed by a lifetime warranty to the original owner." },
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay } },
});

export default function Home() {
  useSEO({
    title: "Redcat® Eyewear | Color-Tuned Performance Sport Sunglasses",
    description: "Redcat® sport sunglasses use color-tuned lens technology to make balls easier to track and terrain sharper to read. Crafted in Italy. Free shipping on orders over $150.",
    keywords: "sport sunglasses, pickleball sunglasses, tennis sunglasses, cycling sunglasses, color tuned lenses, performance eyewear",
    path: "/",
  });
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const { products: liveProducts, isLoading } = useProducts();

  const displayProducts = !isLoading && liveProducts.length > 0
    ? liveProducts.filter((p) => ["beast", "roar", "leap", "strike"].includes(p.handle)).slice(0, 4)
    : STATIC_PRODUCTS;

  return (
    <div className="overflow-x-hidden bg-white">
      {/* ─── HERO — split layout ─────────────────── */}
      <section
        ref={heroRef}
        data-testid="hero-section"
        className="relative min-h-screen bg-white flex items-center overflow-hidden pt-[var(--navbar-h)]"
      >
        {/* Mobile hero — Aron full-bleed background */}
        <div className="lg:hidden absolute inset-0 pointer-events-none select-none">
          <img
            src={ARON_IMG}
            alt="Redcat athlete in action"
            fetchpriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/65 to-black/20" />
        </div>

        {/* Desktop hero image — right-flushed, no clip */}
        <div className="hidden lg:block absolute right-0 top-0 h-full w-[55%] pointer-events-none select-none">
          <img
            src={ARON_IMG}
            alt="Redcat athlete in action"
            fetchpriority="high"
            decoding="async"
            className="w-full h-full object-contain object-right-top"
          />
        </div>

        {/* Left content */}
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 w-full">
          <div className="lg:max-w-[52%]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-3 mb-7"
            >
              <span className="block w-8 h-px bg-rc-red" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">Elite Performance Eyewear</span>
            </motion.div>

            {["SEE FASTER.", "BE FASTER."].map((line, i) => (
              <div key={line} className="line-mask">
                <motion.h1
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.14 }}
                  className={`font-display font-black uppercase leading-[0.88] block ${i === 0 ? "text-white lg:text-[#0A0A0A]" : "text-rc-red"}`}
                  style={{ fontSize: "clamp(3.8rem, 9vw, 9rem)" }}
                >
                  {line}
                </motion.h1>
              </div>
            ))}

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.58 }}
              className="text-base text-white/80 lg:text-gray-600 mt-6 max-w-lg leading-relaxed"
            >
              Redcat® Eyewear amplifies select color wavelengths — making colors more vivid, vibrant, and alive. Sharper acuity, heightened clarity, and a true performance advantage in high-velocity sports and everyday life.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.72 }}
              className="flex items-center flex-wrap gap-4 mt-8"
            >
              <Link
                to="/collections"
                data-testid="hero-shop-cta"
                className="inline-flex items-center gap-2.5 bg-rc-red text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors duration-200"
              >
                Shop Now <ArrowRight size={13} />
              </Link>
              <Link
                to="/brand"
                data-testid="hero-brand-cta"
                className="text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-gray-900 transition-colors underline underline-offset-4"
              >
                Our Story
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-[9px] tracking-[0.25em] uppercase text-black/20">Scroll</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-black/20 to-transparent"
          />
        </motion.div>
      </section>

      {/* ─── COLOR-TUNED FEATURE ──────────────────── */}
      <section data-testid="colorboost-section" className="grid lg:grid-cols-2 min-h-[600px]">
        <div className="relative overflow-hidden h-[420px] lg:h-auto">
          <img src={MTB_IMG} alt="Mountain biking with Redcat Eyewear" className="w-full h-full object-cover" />
        </div>
        <motion.div
          variants={fadeUp(0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col justify-center px-8 lg:px-16 py-16 bg-[#F5F0E8]"
        >
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-cyan mb-5">color-tuned technology</span>
          <h2
            className="font-display font-black uppercase leading-tight text-gray-900 mb-5"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}
          >
            Amplified Color Vision = Fierce Competitive Edge
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-md">
            Redcat amplifies select color wavelengths to make colors more vivid and alive. Sharper acuity, heightened clarity, true performance advantage — in high-velocity sports and everyday life.
          </p>
          <div className="flex items-center gap-6 mb-8">
            {[["Up to 37%", "Color-tuned"], ["UV400", "Full spectrum"], ["Lifetime", "Warranty"]].map(([val, label]) => (
              <div key={label}>
                <p className="font-display text-3xl font-black text-rc-red">{val}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{label}</p>
              </div>
            ))}
          </div>
          <Link
            to="/brand"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-900 border-b border-black/15 pb-1 hover:border-rc-red hover:text-rc-red transition-colors duration-200 w-fit"
          >
            Learn the Science <ArrowRight size={11} />
          </Link>
        </motion.div>
      </section>

      {/* ─── PRODUCTS ─────────────────────────────── */}
      <section data-testid="products-section" className="py-24 px-6 max-w-screen-xl mx-auto">
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">Our Models</span>
            <h2
              className="font-display font-black uppercase leading-tight text-gray-900 mt-1"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}
            >
              Choose Your Style
            </h2>
            <p className="text-gray-400 text-sm mt-2">On the Court, Course, Water, Road, or Trail</p>
          </div>
          <Link
            to="/collections"
            data-testid="view-all-products"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-gray-900 transition-colors"
          >
            View All <ArrowRight size={12} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/5">
          {displayProducts.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id || product.handle}
              variants={fadeUp(i * 0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-white group"
            >
              <Link to={`/products/${product.handle}`} data-testid={`product-card-${product.handle}`}>
                <div className="product-img-wrap aspect-square overflow-hidden bg-[#FAFAFA] flex items-center justify-center p-4">
                  <img
                    src={product.images?.[0]?.url || ""}
                    alt={product.images?.[0]?.altText || product.title}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 border-t border-black/5">
                  <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1">Redcat Eyewear</p>
                  <h3 className="font-display text-2xl font-black uppercase tracking-wider text-gray-900 group-hover:text-rc-red transition-colors duration-200">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-500">
                      From ${parseFloat(product.priceRange?.minVariantPrice?.amount || 0).toFixed(2)}
                    </p>
                    <span className="text-xs text-rc-cyan font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── TECHNOLOGY MANIFESTO ────────────────── */}
      <section data-testid="manifesto-section" className="bg-[#F5F0E8] py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            variants={fadeUp()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-14"
          >
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">The Redcat Difference</span>
            <h2
              className="font-display font-black uppercase leading-tight text-gray-900 mt-1"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}
            >
              Precision Optics
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-0 border-t border-black/10">
            {CHAPTERS.map((c, i) => (
              <motion.div
                key={c.num}
                variants={fadeUp(i * 0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="border-b md:border-b-0 md:border-r border-black/10 last:border-r-0 px-0 md:px-8 py-10 first:pl-0 last:pr-0"
              >
                <span className="font-display text-[6rem] font-black text-black/6 leading-none block mb-2">{c.num}</span>
                <h3 className="font-display text-lg font-black uppercase tracking-widest text-gray-900 mb-4">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-16 relative overflow-hidden aspect-[16/6]"
          >
            <img src={ROAR_FLOAT} alt="Redcat ROAR floating" className="w-full h-full object-contain bg-white" />
          </motion.div>
        </div>
      </section>

      {/* ─── ACTIVITIES ───────────────────────────── */}
      <section data-testid="activities-section" className="py-24 px-6 max-w-screen-xl mx-auto">
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12"
        >
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">Sport Performance</span>
          <h2
            className="font-display font-black uppercase leading-tight text-gray-900 mt-1"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}
          >
            Your Sport. Your Edge.
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ACTIVITIES.map((act, i) => (
            <motion.div
              key={act.name}
              variants={fadeUp(i * 0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              <Link
                to={act.href}
                data-testid={`activity-${act.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group block relative overflow-hidden aspect-[3/4]"
              >
                <img
                  src={act.image}
                  alt={act.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="text-[9px] text-rc-cyan font-semibold tracking-widest uppercase mb-1.5">{act.lens}</p>
                  <h3 className="font-display text-lg font-black uppercase text-white tracking-wide leading-tight">{act.name}</h3>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-rc-red text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1.5">Shop</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── ITALY — editorial dark ────────────────── */}
      <section data-testid="italy-section" className="relative overflow-hidden h-[500px] flex items-center">
        <img src={BEAST_WILD} alt="Redcat BEAST in the wild" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/65 to-transparent" />
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative z-10 max-w-screen-xl mx-auto px-6"
        >
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">Craftsmanship</span>
          <h2
            className="font-display font-black uppercase leading-tight text-white mt-2 mb-4"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}
          >
            Made in Italy,<br />Built to Last
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-md mb-7">
            Every Redcat frame is manufactured in Italy — TR-90 thermoplastic, shatterproof polycarbonate lenses, CE-certified. Backed by a lifetime warranty.
          </p>
          <Link
            to="/brand"
            data-testid="italy-brand-link"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-7 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-rc-red hover:text-white transition-colors duration-200"
          >
            Our Brand <ArrowRight size={12} />
          </Link>
        </motion.div>
      </section>

      {/* ─── NEWSLETTER ───────────────────────────── */}
      <section data-testid="newsletter-section" className="py-24 px-6 bg-[#F5F0E8]">
        <div className="max-w-screen-xl mx-auto">
          <div className="max-w-xl mx-auto text-center">
            <motion.div
              variants={fadeUp()}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">Stay Ahead</span>
              <h2
                className="font-display font-black uppercase leading-tight text-gray-900 mt-2 mb-4"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Join the Redcat<br />Coalition
              </h2>
              <p className="text-gray-500 text-sm mb-8">New products, sales, restocks, and exclusive offers.</p>
              <NewsletterForm />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await axios.post(`${API}/newsletter`, { email });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return <p className="text-rc-cyan font-semibold tracking-wide text-sm">You're in. Welcome to the coalition.</p>;
  }

  return (
    <form onSubmit={handleSubmit} data-testid="newsletter-form" className="flex flex-col sm:flex-row max-w-md mx-auto">
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        data-testid="newsletter-email-input"
        className="flex-1 bg-white border border-black/15 px-5 py-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rc-cyan transition-colors"
      />
      <button
        type="submit"
        data-testid="newsletter-submit"
        className="bg-rc-red text-white px-7 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors duration-200 whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
