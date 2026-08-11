import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const HERO_IMG = "https://redcateyewear.com/cdn/shop/files/Redcat_Hero_1_4K_7d6a3cb8-6a17-4bc8-9c40-1e9b6b5b2cae.png?crop=center&v=1724073572&width=1920";
const MTB_IMG = "https://redcateyewear.com/cdn/shop/files/mountain-bike-cycling-and-fitness.jpg?crop=center&height=900&v=1719939492&width=1600";
const PICKLEBALL_IMG = "https://redcateyewear.com/cdn/shop/files/LEAP_Pickleball_-_Dark_Blue_with_Dark_Green_Lenses_3840x2160_12ac36d4-ede4-4785-811b-4ac3d3ec569c.jpg?crop=center&height=900&v=1713192324&width=1600";
const ROAR_IMG = "https://redcateyewear.com/cdn/shop/files/ROAR_Matte_Crystal_with_Carbon_Crush_Lens_with_Oil_Slick_Mirror.png?crop=center&v=1720544252&width=1600";
const BEAST_IMG = "https://redcateyewear.com/cdn/shop/files/John_in_BEAST.png?crop=center&v=1720547259&width=1600";

const BRAND_PILLARS = [
  { icon: "01", title: "SEE FASTER. BE FASTER.", body: "Redcat® is driven by a passion to elevate athletes' performance. Our mission is to seamlessly blend cutting-edge vision technology with bold, purpose-built design." },
  { icon: "02", title: "STYLE MEETS PERFORMANCE", body: "Every pair of Redcat® Eyewear is crafted in Italy, combining timeless style with performance-enhancing features. Our ultra-lightweight TR-90 frames come in a fierce palette of matte metallics and neutrals." },
  { icon: "03", title: "BOOST YOUR VISION", body: "BronzeGlo amplifies warm tones — pink, red, orange, brown. CarbonGlo boosts cool tones — aqua, green, blue-gray. PolarGlo adds polarization without sacrificing color tuning." },
  { icon: "04", title: "PERFORM AT YOUR PEAK", body: "By accelerating your ability to see and track the ball, our color-tuned technology significantly improves reaction time. Especially advantageous for older athletes, as color vision naturally diminishes with age." },
];

const LENSES = [
  { name: "LumiGlo", sub: "Outdoor & Indoor", color: "#7BC743", desc: "Boosts yellow-green hues by up to 35%. Ideal for high-visibility green pickleball and tennis balls." },
  { name: "FireGlo", sub: "Outdoor & Indoor", color: "#FF4B2B", desc: "Amplifies pink, orange, and red by up to 30%. Ideal for colored pickleball, soccer, or golf balls." },
  { name: "BronzeGlo", sub: "Warm Spectrum", color: "#C87941", desc: "Boosts warm tones — red, orange, brown — by up to 30%. Enhanced acuity and clarity for a vivid picture overall." },
  { name: "CarbonGlo", sub: "Cool Spectrum", color: "#7CB9E8", desc: "Boosts aquas, greens, and blue-grays by up to 37%. The lens for water, golf, and road cycling." },
  { name: "PolarGlo", sub: "Polarized", color: "#8ECAE6", desc: "Cuts glare off water, wet roads, and hard surfaces while staying color-tuned. Best of both worlds." },
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay } },
});

export default function Brand() {
  useSEO({
    title: "The Science Behind the Lens | Redcat® Eyewear Brand Story",
    description: "Redcat® sport sunglasses are built around color-tuned lens technology that amplifies specific wavelengths to make balls more visible and terrain sharper. Crafted in Italy.",
    keywords: "color tuned lens technology, sport sunglasses technology, LumiGlo, FireGlo, CarbonGlo, BronzeGlo, PolarGlo, performance eyewear Italy",
    path: "/brand",
  });
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 100]);

  return (
    <div className="bg-white dark:bg-rc-dark pt-[var(--navbar-h)]" data-testid="brand-page">
      {/* HERO */}
      <section className="relative h-[85vh] min-h-[600px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <img src={HERO_IMG} alt="Redcat Brand" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-8 h-px bg-rc-red" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">The Brand</span>
          </motion.div>
          <div className="line-mask">
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="font-display font-black text-white"
              style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)", lineHeight: "0.9" }}
            >
              Redcat
            </motion.h1>
          </div>
          <div className="line-mask">
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.44 }}
              className="font-display font-black uppercase text-rc-red"
              style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)", lineHeight: "0.9" }}
            >
              SHREDS.
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-white/55 text-base mt-6 max-w-lg leading-relaxed"
          >
            Elite performance eyewear built for athletes who refuse to accept average vision.
          </motion.p>
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-24 px-6 max-w-screen-xl mx-auto" data-testid="brand-pillars">
        <div className="grid md:grid-cols-2 gap-px bg-black/5 dark:bg-white/8">
          {BRAND_PILLARS.map((p, i) => (
            <motion.div
              key={p.icon}
              variants={fadeUp(i * 0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-white dark:bg-rc-dark p-10"
            >
              <span className="font-display text-7xl font-black text-black/5 dark:text-white/6 leading-none block mb-3">{p.icon}</span>
              <h3 className="font-display text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white mb-4">{p.title}</h3>
              <p className="text-sm text-gray-500 dark:text-white/50 leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SPLIT — MTB IMAGE */}
      <section className="grid lg:grid-cols-2 min-h-[500px]">
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col justify-center px-8 lg:px-16 py-16 bg-[#FAFAFA] dark:bg-rc-surface order-2 lg:order-1"
        >
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-cyan mb-5">Sport-Specific Performance</span>
          <h2
            className="font-display font-black uppercase leading-tight text-gray-900 dark:text-white mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Lens Technology for Every Sport
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed mb-6 max-w-md">
            From LumiGlo and FireGlo for racket sports to BronzeGlo and CarbonGlo for outdoor and road — every lens is tuned to a specific performance spectrum.
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-900 dark:text-white border-b border-black/15 dark:border-white/15 pb-1 hover:border-rc-red hover:text-rc-red transition-colors duration-200 w-fit"
          >
            Shop by Activity <ArrowRight size={11} />
          </Link>
        </motion.div>
        <div className="relative overflow-hidden h-[380px] lg:h-auto order-1 lg:order-2">
          <img src={PICKLEBALL_IMG} alt="Pickleball with Redcat" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* LENS GUIDE */}
      <section className="py-24 px-6 bg-white dark:bg-rc-dark" data-testid="lens-guide">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            variants={fadeUp()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-12"
          >
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">Vision System</span>
            <h2
              className="font-display font-black uppercase leading-tight text-gray-900 dark:text-white mt-1"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              The Lens Guide
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-black/5 dark:bg-white/8">
            {LENSES.map((lens, i) => (
              <motion.div
                key={lens.name}
                variants={fadeUp(i * 0.06)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="bg-white dark:bg-rc-dark p-6"
              >
                <div className="w-10 h-10 mb-4 rounded-full" style={{ backgroundColor: lens.color + "40", border: `2px solid ${lens.color}` }} />
                <h3 className="font-display font-black uppercase text-lg tracking-widest text-gray-900 dark:text-white mb-1">{lens.name}</h3>
                <p className="text-[10px] text-gray-400 dark:text-white/35 uppercase tracking-widest mb-3">{lens.sub}</p>
                <p className="text-sm text-gray-500 dark:text-white/50 leading-relaxed">{lens.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ITALY */}
      <section className="grid lg:grid-cols-2 min-h-[500px]">
        <div className="relative overflow-hidden h-[380px] lg:h-auto">
          <img src={BEAST_IMG} alt="Redcat BEAST athlete" className="w-full h-full object-cover" />
        </div>
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col justify-center px-8 lg:px-16 py-16 bg-[#FAFAFA] dark:bg-rc-surface"
        >
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-cyan mb-5">Manufacturing</span>
          <h2
            className="font-display font-black uppercase leading-tight text-gray-900 dark:text-white mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Made in Italy.<br />You Can Feel the Difference.
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed mb-6 max-w-md">
            Most sport eyewear in this price range is made in China. Ours isn't. Every Redcat frame carries the CE marking, meeting European standards for safety, health, and environmental protection.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[["TR-90", "Thermoplastic frames"], ["CE Rated", "EU certified"], ["Polycarbonate", "Shatterproof lenses"], ["UV400", "Full protection"]].map(([val, label]) => (
              <div key={label} className="border border-black/10 dark:border-white/10 p-4">
                <p className="font-display font-black text-lg uppercase text-gray-900 dark:text-white">{val}</p>
                <p className="text-xs text-gray-400 dark:text-white/35 uppercase tracking-widest mt-1">{label}</p>
              </div>
            ))}
          </div>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 bg-rc-red text-white px-7 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 dark:hover:bg-white dark:hover:text-rc-red transition-colors duration-200 w-fit"
          >
            Shop Now <ArrowRight size={12} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
