import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import { useProducts } from "@/hooks/useShopify";

const HERO_IMG = "https://redcateyewear.com/cdn/shop/files/ROAR_Redcat_red_with_Red_Rave_Mirror_c08b4d6e-d0ba-401c-b8ee-70753c68da81.png?crop=center&v=1763566571&width=1920";
const MTB_IMG = "https://redcateyewear.com/cdn/shop/files/mountain-bike-cycling-and-fitness.jpg?crop=center&height=900&v=1719939492&width=1600";
const ROAR_FLOAT = "https://redcateyewear.com/cdn/shop/files/Redcat_ROAR_Cyan_Floating_Product_Shot.png?crop=center&v=1764667633&width=1600";
const BEAST_WILD = "https://redcateyewear.com/cdn/shop/files/Redcat_BEAST_Aron_in_the_Wild.png?crop=center&height=800&v=1764667927&width=1600";

const STATIC_PRODUCTS = [
  { id: "1", handle: "beast", title: "BEAST™", priceRange: { minVariantPrice: { amount: "204.99" } }, images: [{ url: "https://redcateyewear.com/cdn/shop/files/beast_red_frame_brown_with_red_mirror_lenses_1.jpg?crop=center&height=480&v=1740676455&width=600", altText: "BEAST" }] },
  { id: "2", handle: "roar", title: "ROAR™", priceRange: { minVariantPrice: { amount: "184.99" } }, images: [{ url: "https://redcateyewear.com/cdn/shop/files/roar_matte_met_cyan_gray_green_oil_slick_mirror_1.jpg?crop=center&height=480&v=1740665868&width=600", altText: "ROAR" }] },
  { id: "3", handle: "leap", title: "LEAP™", priceRange: { minVariantPrice: { amount: "144.99" } }, images: [{ url: "https://redcateyewear.com/cdn/shop/files/leap_matte_metallic_red_gray_polar_blue_mirror_1.jpg?crop=center&height=480&v=1740770157&width=600", altText: "LEAP" }] },
  { id: "4", handle: "strike", title: "STRIKE™", priceRange: { minVariantPrice: { amount: "119.99" } }, images: [{ url: "https://redcateyewear.com/cdn/shop/files/strike_matte_tortoise_gray_polar_green_mirror_1.jpg?crop=center&height=480&v=1740770168&width=600", altText: "STRIKE" }] },
];

const MARQUEE_ITEMS = ["BEAST™", "ROAR™", "LEAP™", "STRIKE™", "SEE FASTER", "BE FASTER", "COLORBOOST™", "MADE IN ITALY", "UV400", "LIFETIME WARRANTY", "TR-90 FRAMES", "POLYCARBONATE LENSES"];

const ACTIVITIES = [
  { name: "PICKLEBALL", href: "/activities/pickleball", image: "https://redcateyewear.com/cdn/shop/files/LEAP_Pickleball_-_Dark_Blue_with_Dark_Green_Lenses_3840x2160_12ac36d4-ede4-4785-811b-4ac3d3ec569c.jpg?crop=center&height=800&v=1713192324&width=800", lens: "LumiGlo™ / FireGlo™" },
  { name: "CYCLING", href: "/activities/cycling", image: "https://redcateyewear.com/cdn/shop/files/mountain-bike-cycling-and-fitness.jpg?crop=center&height=800&v=1719939492&width=800", lens: "CarbonGlo™ / BronzeGlo™" },
  { name: "TENNIS", href: "/activities/tennis", image: "https://redcateyewear.com/cdn/shop/files/AdobeStock_321178379.jpg?crop=center&height=800&v=1721052329&width=800", lens: "LumiGlo™" },
  { name: "GOLF & OUTDOORS", href: "/activities/golf", image: BEAST_WILD, lens: "CarbonGlo™" },
];

const CHAPTERS = [
  { num: "01", title: "COLORBOOST™ TECHNOLOGY", body: "Advanced Hue ColorBoost lenses amplify specific wavelengths beyond normal human perception — up to 37% — delivering sharper acuity, heightened contrast, and a true competitive edge." },
  { num: "02", title: "MADE IN ITALY", body: "Every Redcat frame is designed and manufactured in Italy, CE-certified. TR-90 thermoplastic construction that flexes under impact instead of snapping. Hand-finished by skilled craftspeople." },
  { num: "03", title: "UV400 PROTECTION", body: "Every Redcat lens filters UVA and UVB rays up to 400 nanometers — no upgrade tier, no exceptions. Backed by a lifetime warranty to the original owner." },
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay } },
});

export default function Home() {
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroImgY = useTransform(scrollY, [0, 700], [0, 110]);
  const { products: liveProducts, isLoading } = useProducts();

  const displayProducts = !isLoading && liveProducts.length > 0
    ? liveProducts.filter((p) => ["beast", "roar", "leap", "strike"].includes(p.handle)).slice(0, 4)
    : STATIC_PRODUCTS;

  return (
    <div className="bg-rc-dark overflow-x-hidden">
      {/* ─── HERO ─────────────────────────────────── */}
      <section
        ref={heroRef}
        data-testid="hero-section"
        className="relative h-screen min-h-[700px] flex items-center overflow-hidden"
      >
        <motion.div style={{ y: heroImgY }} className="absolute inset-0 scale-110 origin-center">
          <img src={HERO_IMG} alt="Redcat ROAR" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-rc-dark/80 via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 w-full pt-[var(--navbar-h)]">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-3 mb-7"
            >
              <span className="block w-8 h-px bg-rc-red" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">Elite Performance Eyewear</span>
            </motion.div>

            {["SEE FASTER.", "BE FASTER.™"].map((line, i) => (
              <div key={line} className="line-mask">
                <motion.h1
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.14 }}
                  className="font-display font-black uppercase leading-[0.88] block"
                  style={{ fontSize: "clamp(3.8rem, 10vw, 9rem)", color: i === 1 ? "#D90012" : "#fff" }}
                >
                  {line}
                </motion.h1>
              </div>
            ))}

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.58 }}
              className="text-base text-white/55 mt-6 max-w-sm leading-relaxed"
            >
              Hue ColorBoost lenses amplify color beyond normal human perception. Designed for athletes who refuse to slow down.
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
                className="inline-flex items-center gap-2.5 bg-rc-red text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-rc-red transition-colors duration-200"
              >
                Shop Now <ArrowRight size={13} />
              </Link>
              <Link
                to="/brand"
                data-testid="hero-brand-cta"
                className="text-xs font-bold tracking-widest uppercase text-white/45 hover:text-white transition-colors underline underline-offset-4"
              >
                Our Story
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-[9px] tracking-[0.25em] uppercase text-white/25">Scroll</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-white/25 to-transparent"
          />
        </motion.div>
      </section>

      {/* ─── MARQUEE ──────────────────────────────── */}
      <div
        data-testid="marquee-section"
        className="border-y border-white/10 py-5 overflow-hidden bg-rc-dark"
      >
        <div className="flex whitespace-nowrap animate-marquee">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="font-display font-bold text-xl uppercase tracking-[0.2em] px-8 text-stroke-white"
            >
              {item}&nbsp;<span className="text-rc-red/30 mx-2">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── COLORBOOST FEATURE ───────────────────── */}
      <section data-testid="colorboost-section" className="grid lg:grid-cols-2 min-h-[600px]">
        <div className="relative overflow-hidden h-[420px] lg:h-auto">
          <img src={MTB_IMG} alt="Mountain biking with Redcat Eyewear" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-rc-dark/50 hidden lg:block" />
        </div>
        <motion.div
          variants={fadeUp(0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col justify-center px-8 lg:px-16 py-16 bg-rc-dark"
        >
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-cyan mb-5">ColorBoost™ Technology</span>
          <h2
            className="font-display font-black uppercase leading-tight text-white mb-5"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}
          >
            Boosted Color Vision = Fierce Competitive Edge
          </h2>
          <p className="text-white/55 text-sm leading-relaxed mb-8 max-w-md">
            Redcat amplifies select color wavelengths to make colors more vivid and alive. Sharper acuity, heightened clarity, true performance advantage — in high-velocity sports and everyday life.
          </p>
          <div className="flex items-center gap-6 mb-8">
            {[["Up to 37%", "Color boost"], ["UV400", "Full spectrum"], ["Lifetime", "Warranty"]].map(([val, label]) => (
              <div key={label}>
                <p className="font-display text-3xl font-black text-rc-red">{val}</p>
                <p className="text-[10px] text-white/35 uppercase tracking-widest mt-1">{label}</p>
              </div>
            ))}
          </div>
          <Link
            to="/brand"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white border-b border-white/15 pb-1 hover:border-rc-red hover:text-rc-red transition-colors duration-200 w-fit"
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
              className="font-display font-black uppercase leading-tight text-white mt-1"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}
            >
              Choose Your Style
            </h2>
            <p className="text-white/40 text-sm mt-2">On the Court, Course, Water, Road, or Trail</p>
          </div>
          <Link
            to="/collections"
            data-testid="view-all-products"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/45 hover:text-white transition-colors"
          >
            View All <ArrowRight size={12} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8">
          {displayProducts.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id || product.handle}
              variants={fadeUp(i * 0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-rc-dark group"
            >
              <Link
                to={`/products/${product.handle}`}
                data-testid={`product-card-${product.handle}`}
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
                  <p className="text-[10px] text-white/35 tracking-widest uppercase mb-1">Redcat Eyewear</p>
                  <h3 className="font-display text-2xl font-black uppercase tracking-wider text-white group-hover:text-rc-red transition-colors duration-200">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-white/50">
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
      <section data-testid="manifesto-section" className="bg-rc-surface py-24 px-6">
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
              className="font-display font-black uppercase leading-tight text-white mt-1"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}
            >
              Precision Optics
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-0 border-t border-white/10">
            {CHAPTERS.map((c, i) => (
              <motion.div
                key={c.num}
                variants={fadeUp(i * 0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="border-b md:border-b-0 md:border-r border-white/10 last:border-r-0 px-0 md:px-8 py-10 first:pl-0 last:pr-0"
              >
                <span className="font-display text-[6rem] font-black text-white/6 leading-none block mb-2">{c.num}</span>
                <h3 className="font-display text-lg font-black uppercase tracking-widest text-white mb-4">{c.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{c.body}</p>
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
            <img src={ROAR_FLOAT} alt="Redcat ROAR floating" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-rc-surface via-transparent to-transparent" />
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
            className="font-display font-black uppercase leading-tight text-white mt-1"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}
          >
            Your Sport. Your Edge.
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
                  <span className="bg-rc-red text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1.5">
                    Shop
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── ITALY ────────────────────────────────── */}
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
          <p className="text-white/55 text-sm leading-relaxed max-w-md mb-7">
            Every Redcat frame is manufactured in Italy — TR-90 thermoplastic, shatterproof polycarbonate lenses, CE-certified. Backed by a lifetime warranty.
          </p>
          <Link
            to="/brand"
            data-testid="italy-brand-link"
            className="inline-flex items-center gap-2 bg-white text-rc-dark px-7 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-rc-red hover:text-white transition-colors duration-200"
          >
            Our Brand <ArrowRight size={12} />
          </Link>
        </motion.div>
      </section>

      {/* ─── NEWSLETTER ───────────────────────────── */}
      <section data-testid="newsletter-section" className="py-24 px-6 bg-rc-surface">
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
                className="font-display font-black uppercase leading-tight text-white mt-2 mb-4"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Join the Redcat<br />Coalition
              </h2>
              <p className="text-white/45 text-sm mb-8">New products, sales, restocks, and exclusive offers.</p>
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
    <form
      onSubmit={handleSubmit}
      data-testid="newsletter-form"
      className="flex flex-col sm:flex-row max-w-md mx-auto"
    >
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        data-testid="newsletter-email-input"
        className="flex-1 bg-rc-dark border border-white/15 px-5 py-4 text-sm text-white placeholder-white/25 focus:outline-none focus:border-rc-cyan transition-colors"
      />
      <button
        type="submit"
        data-testid="newsletter-submit"
        className="bg-rc-red text-white px-7 py-4 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-rc-red transition-colors duration-200 whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
