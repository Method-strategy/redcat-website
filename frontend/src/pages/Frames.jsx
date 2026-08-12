import { motion } from "framer-motion";
import { RefreshCw, Feather, ShieldCheck, Leaf, Flame, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

const TR90_BENEFITS = [
  { icon: Feather,      stat: "Ultra-Lightweight",  title: "Pressure-free all day",       body: "TR90 removes the weight that builds into soreness over a long session. Reduced bridge pressure, no ear fatigue — just your game." },
  { icon: RefreshCw,    stat: "Shape Memory",       title: "Bends. Always bounces back.",  body: "Sit on them. Twist them. Pack them wrong. TR90 returns instantly to its original frame geometry. It remembers its shape so you don't have to be careful." },
  { icon: ShieldCheck,  stat: "Impact-Flex",        title: "Flexes under force — not with it.", body: "Under real-world impact, TR90 bends before it breaks. The frame absorbs and distributes stress rather than cracking at a stress point." },
  { icon: Leaf,         stat: "Hypoallergenic",     title: "No BPA. No irritants.",        body: "Biocompatible and skin-safe by design — no BPA, no phthalates, no common skin irritants. Built for athletes who wear their eyewear all day." },
  { icon: Flame,        stat: "Chemical-Resistant", title: "Sweat, SPF, UV — no problem.", body: "TR90 withstands sweat, sunscreen, cosmetics, UV rays, and cleaning products without degrading, discoloring, or losing structural integrity." },
];

const TR90_SCIENCE = [
  {
    label: "Swiss Grilamid PA12",
    body: "Advanced transparent nylon 12 chemistry engineered for high tensile strength and impact resilience — the same material class used in high-performance engineering applications.",
  },
  {
    label: "Memory Structure",
    body: "An anti-deformation index of approximately 620 kg/cm² resists permanent bending at the molecular level — the reason TR90 returns to shape rather than staying distorted.",
  },
  {
    label: "Precision Injection Molding",
    body: "Melted at 230–275°C and injected into precision molds for uniform density throughout the frame — no weak spots, no seams, consistent structural behavior from temple to bridge.",
  },
];

const CE_POINTS = [
  { label: "High-velocity impact test", body: "Lenses are tested against high-speed fragment and ball impact — the standard that matters for sport." },
  { label: "UV protection verification", body: "UV400 filtration is independently confirmed — not self-declared. Covers the full UV spectrum up to 400nm." },
  { label: "Optical quality standard", body: "Lens distortion, power, and prismatic deviation are tested to confirm the lens doesn't visually compromise what you're seeing." },
  { label: "EN ISO 12312-1 compliant", body: "Every REDCAT® frame and lens ships meeting the European standard for sunglasses used in general and sporting applications." },
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay } },
});

export default function Frames() {
  useSEO({
    title: "Frame Technology | Redcat® Eyewear",
    description: "TR90 Swiss memory plastic frames and CE-certified lens standards. Why REDCAT® frames are built to flex, return, and protect.",
    keywords: "TR90 frames, Swiss Grilamid eyewear, CE certified sunglasses, sport eyewear frames",
    path: "/frames",
  });

  return (
    <div className="bg-white overflow-x-hidden" data-testid="frames-page">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="min-h-[58vh] flex items-end pb-20 px-6 pt-[calc(var(--navbar-h)+6rem)] bg-[#060606] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#1a1a1a_0%,_#060606_70%)]" />
        <div className="relative z-10 max-w-screen-xl mx-auto w-full">
          <motion.div variants={fadeUp()} initial="hidden" animate="visible">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">Frame Technology</span>
            <h1
              className="font-display font-black uppercase leading-[0.88] text-white mt-2"
              style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}
            >
              The Frame Behind<br /><span className="text-rc-red">the Performance.</span>
            </h1>
          </motion.div>
          <motion.p
            variants={fadeUp(0.2)}
            initial="hidden"
            animate="visible"
            className="text-white/60 text-base mt-6 max-w-xl leading-relaxed"
          >
            Every REDCAT® frame is built from TR90 — a Swiss-developed thermoplastic that bends under real-world force and bounces back to its exact original shape. CE certified. Every lens. Every time.
          </motion.p>
          <motion.div variants={fadeUp(0.35)} initial="hidden" animate="visible" className="mt-8 flex gap-4">
            <Link to="/technology" className="inline-flex items-center gap-2 text-white/60 text-xs font-bold tracking-widest uppercase hover:text-white transition-colors">
              Lens Technology <ChevronRight size={12} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── TR90 Benefits ─────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUp()} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">TR90 Swiss Thermoplastic</span>
            <h2
              className="font-display font-black uppercase leading-tight text-gray-900 mt-1"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              Memory Plastic.<br />Built to Last.
            </h2>
            <p className="text-gray-500 text-sm mt-4 max-w-2xl leading-relaxed">
              TR90 is a Swiss-developed thermoplastic — the "memory plastic" of eyewear. It was specifically engineered for active wear because standard frame materials crack, warp, and lose their fit. TR90 doesn't. It remembers its shape through every session, every impact, and every year of use.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-px bg-black/5">
            {TR90_BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  variants={fadeUp(i * 0.08)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white p-8"
                >
                  <p className="text-[10px] font-bold tracking-widest uppercase text-rc-red mb-4">{b.stat}</p>
                  <Icon size={20} className="text-gray-200 mb-4" />
                  <h3 className="font-display font-black uppercase text-base tracking-wide text-gray-900 mb-3 leading-snug">{b.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{b.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TR90 Science ─────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#060606]">
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUp()} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">The Engineering</span>
            <h2
              className="font-display font-black uppercase leading-tight text-white mt-1"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              Why TR90 Behaves<br />the Way It Does
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {TR90_SCIENCE.map((s, i) => (
              <motion.div
                key={s.label}
                variants={fadeUp(i * 0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-[#0D0D0D] p-8"
              >
                <h3 className="font-display font-black uppercase text-lg tracking-widest text-rc-red mb-4">{s.label}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CE Certification ─────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div variants={fadeUp()} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">CE Certification</span>
              <h2
                className="font-display font-black uppercase leading-tight text-gray-900 mt-1"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Independently Tested.<br />Not Self-Declared.
              </h2>
              <p className="text-gray-500 text-sm mt-5 leading-relaxed max-w-lg">
                CE marking isn't a logo you add — it's a certification you earn. Every REDCAT® lens and frame has been independently tested and verified against European optical safety standards. What that means in practice: your lenses have been proven to hold up under the conditions they claim to handle. If they didn't pass, they don't ship.
              </p>
              <div className="mt-8 inline-flex items-center gap-3 border border-black/10 px-5 py-3">
                <div className="font-display font-black text-2xl text-gray-900">CE</div>
                <div className="text-xs text-gray-500 leading-tight">
                  <p className="font-bold text-gray-900 uppercase tracking-widest">Certified</p>
                  <p>EN ISO 12312-1 compliant</p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-px bg-black/5">
              {CE_POINTS.map((p, i) => (
                <motion.div
                  key={p.label}
                  variants={fadeUp(i * 0.08)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white p-6 flex gap-5"
                >
                  <div className="w-1 bg-rc-red flex-shrink-0" />
                  <div>
                    <h4 className="font-display font-black uppercase text-sm tracking-widest text-gray-900 mb-1">{p.label}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{p.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-[#F9F9F7] border-t border-black/5">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-black uppercase text-2xl text-gray-900">Ready to find your frame?</h3>
            <p className="text-sm text-gray-500 mt-1">Sport, ball color, and lighting — answered in 60 seconds.</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 bg-rc-red text-white font-display font-black uppercase px-8 py-4 text-sm tracking-widest hover:bg-red-700 transition-colors"
              data-testid="frames-quiz-cta"
            >
              Find Your REDCATS <ChevronRight size={16} />
            </Link>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 border border-black/20 text-gray-700 font-display uppercase px-6 py-4 text-sm tracking-widest hover:border-black/40 transition-colors"
            >
              Shop All
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
