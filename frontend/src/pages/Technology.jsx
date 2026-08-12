import { motion } from "framer-motion";
import { Shield, Feather, Sun, Eye, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

const CDN_ASSETS = "https://customer-assets-v7afamib.emergentagent.net/job_redcat-astro-build/artifacts";

const LENS_IMAGES = {
  "LumiGlo Outdoor": `${CDN_ASSETS}/5cgbmphe_PC-G1608%20LumiGlo%20Outdoor.webp`,
  "LumiGlo Indoor":  `${CDN_ASSETS}/7ojiofny_PC-G3902%20LumiGlo%20Indoor.webp`,
  "FireGlo Outdoor": `${CDN_ASSETS}/tnnn27ci_PC-V3001%20FireGlo%20Outdoor.webp`,
  "FireGlo Indoor":  `${CDN_ASSETS}/9yg7mbam_PC-R4704%20FireGlo%20Indoor.webp`,
  "CarbonGlo":       `${CDN_ASSETS}/s1chu67m_PC-SG1511%20CarbonGlo.webp`,
  "BronzeGlo":       `${CDN_ASSETS}/vi0k8fqs_PCPL-B2003-v%20BronzeGlo.webp`,
};

const POLY_PROPERTIES = [
  {
    icon: Shield,
    stat: "Shatter-Resistant",
    title: "Shatters? Never.",
    body: "When impact hits polycarbonate, the material deforms microscopically to absorb kinetic energy — then holds its shape. Standard CR-39 plastic doesn't flex. It fragments into sharp shards.",
  },
  {
    icon: Feather,
    stat: "20–30% Lighter",
    title: "Weighs nothing. Stays put.",
    body: "Polycarbonate runs 20–30% lighter than traditional plastic. Zero nose pressure, no frame drift — lenses that stay exactly where you set them mid-rally, mid-descent, or mid-drive.",
  },
  {
    icon: Sun,
    stat: "UV400 Built-In",
    title: "No upgrade required.",
    body: "UV400 protection is built into the polycarbonate material itself — not applied as a removable spray coating. 100% UVA and UVB filtration, standard on every REDCAT® lens. No asterisk.",
  },
  {
    icon: Eye,
    stat: "Index 1.59",
    title: "Thinner profile. Better wrap.",
    body: "At a refractive index of 1.59, polycarbonate produces a thinner lens than standard plastic — cleaner frame geometry, better peripheral clearance, less edge bulk in sport-wrap designs.",
  },
];

const LENS_SCIENCE = [
  {
    name: "LumiGlo Outdoor",
    sport: "Pickleball · Tennis — outdoor",
    body: "Amplifies yellow-green wavelengths by up to 35%. The hi-vis ball stops looking like a moving object and starts looking lit. Built for full sun and overcast outdoor courts.",
  },
  {
    name: "LumiGlo Indoor",
    sport: "Pickleball · Tennis — indoor",
    body: "Same yellow-green amplification, calibrated for gym courts and covered facilities. The ball stays sharp under flat artificial lighting — no squinting, no losing it in the shadows.",
  },
  {
    name: "FireGlo Outdoor",
    sport: "Pickleball — warm ball colors, outdoor",
    body: "Boosts red, orange, and pink wavelengths by up to 30% in bright conditions. If you play with a colored ball outdoors, this is your lens — it's not a subtle difference.",
  },
  {
    name: "FireGlo Indoor",
    sport: "Pickleball — warm ball colors, indoor",
    body: "FireGlo science tuned for indoor courts and covered facilities. Warm-tone balls stay vivid and trackable under artificial lighting. Stop losing them in the fluorescents.",
  },
  {
    name: "CarbonGlo",
    sport: "Cycling · Golf · Outdoors",
    body: "Amplifies aqua and green-spectrum tones by up to 37%. Road grain, course contours, trail hazards — everything sharpens. The lens for sports where reading the ground is the whole game.",
  },
  {
    name: "BronzeGlo",
    sport: "Driving · Mountain Biking · Trail",
    body: "Amber-tuned for full sun, low-angle glare, and variable outdoor light. Sharpens road markings, brake lights, and warm-tone hazards before you have time to consciously register them.",
  },
];

const COMPARISON = [
  ["Impact Resistance", "Shatter-resistant — deforms, absorbs, holds", "Brittle — can fragment on impact"],
  ["Weight", "20–30% lighter than standard plastic", "Heavy and dense"],
  ["UV Protection", "100% UV400 — built into the material", "Often requires an additional paid coating"],
  ["Lens Thickness", "Thin profile (refractive index 1.59)", "Thicker, visible edge bulk in frames"],
  ["Sport Safety Standard", "CE certified — meets ANSI Z87.1", "Fails high-velocity impact tests"],
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay } },
});

export default function Technology() {
  useSEO({
    title: "Lens Technology | Redcat® Eyewear",
    description: "Why Redcat® uses polycarbonate — shatter-resistant, UV400, 20–30% lighter than standard plastic. Plus the science behind all six color-tuned lens types.",
    keywords: "polycarbonate lenses, sport sunglasses technology, UV400 lenses, color tuned lenses, LumiGlo, FireGlo, CarbonGlo, BronzeGlo",
    path: "/technology",
  });

  return (
    <div className="bg-white overflow-x-hidden" data-testid="technology-page">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="min-h-[62vh] flex items-end pb-20 px-6 pt-[calc(var(--navbar-h)+6rem)] bg-[#060606] relative overflow-hidden">
        {/* Lens image mosaic */}
        <div className="absolute right-0 top-0 h-full w-[45%] pointer-events-none select-none hidden lg:flex flex-col gap-px opacity-30">
          {Object.entries(LENS_IMAGES).map(([name, src]) => (
            <div key={name} className="flex-1 overflow-hidden">
              <img src={src} alt={name} className="w-full h-full object-cover object-center scale-110" loading="eager" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606] via-[#060606]/90 to-transparent" />

        <div className="relative z-10 max-w-screen-xl mx-auto w-full">
          <motion.div variants={fadeUp()} initial="hidden" animate="visible">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">Materials Science</span>
            <h1
              className="font-display font-black uppercase leading-[0.88] text-white mt-2"
              style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}
            >
              Built<br /><span className="text-rc-red">Different.</span>
            </h1>
          </motion.div>
          <motion.p
            variants={fadeUp(0.2)}
            initial="hidden"
            animate="visible"
            className="text-white/60 text-base mt-6 max-w-xl leading-relaxed"
          >
            Every REDCAT® lens starts with polycarbonate — the same thermoplastic engineered for astronaut helmet visors and space shuttle windows. Then the science begins.
          </motion.p>
          <motion.div variants={fadeUp(0.35)} initial="hidden" animate="visible" className="mt-8 flex gap-4">
            <Link to="/frames" className="inline-flex items-center gap-2 text-white/60 text-xs font-bold tracking-widest uppercase hover:text-white transition-colors">
              Frame Technology <ChevronRight size={12} />
            </Link>
            <Link to="/lenses" className="inline-flex items-center gap-2 text-white/60 text-xs font-bold tracking-widest uppercase hover:text-white transition-colors">
              Lens Gallery <ChevronRight size={12} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Polycarbonate intro ──────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUp()} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">Polycarbonate Lenses</span>
            <h2
              className="font-display font-black uppercase leading-tight text-gray-900 mt-1"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              The Only Lens Material<br />Built for Sport
            </h2>
            <p className="text-gray-500 text-sm mt-5 max-w-2xl leading-relaxed">
              Originally developed for aerospace — used in space shuttle windshields and astronaut helmet visors — polycarbonate was engineered to withstand extremes that glass and standard plastic simply cannot. We put that same material in every REDCAT® lens because eye protection shouldn't be an afterthought. When a pickleball traveling at 40 mph, a piece of trail gravel, or a cycling debris strike hits a polycarbonate lens, the material deforms microscopically to absorb the blow — then holds. That's not marketing language. That's materials physics.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/5 mt-14">
            {POLY_PROPERTIES.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  variants={fadeUp(i * 0.1)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white p-8"
                >
                  <p className="text-[10px] font-bold tracking-widest uppercase text-rc-red mb-5">{p.stat}</p>
                  <Icon size={22} className="text-gray-200 mb-5" />
                  <h3 className="font-display font-black uppercase text-lg tracking-wide text-gray-900 mb-3 leading-tight">{p.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Comparison table ──────────────────────────────── */}
      <section className="py-16 px-6 bg-[#F9F9F7] border-y border-black/5">
        <div className="max-w-screen-xl mx-auto">
          <motion.h2
            variants={fadeUp()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display font-black uppercase text-2xl md:text-3xl text-gray-900 mb-10"
          >
            Polycarbonate vs. the Alternative
          </motion.h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="text-left py-3 pr-8 text-xs tracking-widest uppercase text-gray-400 font-semibold w-[180px]">Feature</th>
                  <th className="text-left py-3 pr-8 text-xs tracking-widest uppercase font-black text-gray-900">REDCAT® Polycarbonate</th>
                  <th className="text-left py-3 text-xs tracking-widest uppercase text-gray-400 font-semibold">Standard Plastic (CR-39)</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(([feature, redcat, standard]) => (
                  <tr key={feature} className="border-b border-black/5">
                    <td className="py-4 pr-8 text-xs font-bold tracking-widest uppercase text-gray-500 align-top">{feature}</td>
                    <td className="py-4 pr-8 text-sm text-gray-900 align-top">{redcat}</td>
                    <td className="py-4 text-sm text-gray-400 align-top">{standard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Lens Color Science ───────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUp()} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">Color-Tuned Technology</span>
            <h2
              className="font-display font-black uppercase leading-tight text-gray-900 mt-1"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              Six Lenses.<br />Six Ways to See More.
            </h2>
            <p className="text-gray-500 text-sm mt-4 max-w-2xl leading-relaxed">
              Color-tuned, not just filtered. Every REDCAT® lens is engineered to amplify specific wavelengths that matter for a given sport by up to 37%. The result isn't a tint — it's a performance advantage calibrated to what you're doing.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/5">
            {LENS_SCIENCE.map((lens, i) => (
              <motion.div
                key={lens.name}
                variants={fadeUp(i * 0.08)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white p-8 flex flex-col gap-5"
              >
                <img
                  src={LENS_IMAGES[lens.name]}
                  alt={lens.name}
                  className="w-24 h-14 object-contain"
                  loading="lazy"
                />
                <div>
                  <h3 className="font-display font-black uppercase text-xl tracking-widest text-gray-900 mb-0.5">{lens.name}</h3>
                  <p className="text-[10px] text-rc-red font-bold tracking-widest uppercase mb-3">{lens.sport}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{lens.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp(0.3)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 bg-rc-red text-white font-display font-black uppercase px-8 py-4 text-sm tracking-widest hover:bg-red-700 transition-colors"
              data-testid="technology-quiz-cta"
            >
              Find Your Lens <ChevronRight size={16} />
            </Link>
            <Link
              to="/frames"
              className="inline-flex items-center gap-2 border border-black/20 text-gray-700 font-display uppercase px-8 py-4 text-sm tracking-widest hover:border-black/40 transition-colors"
            >
              Frame Technology <ChevronRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CRF / CAF — The Science Behind the Claim ─────── */}
      <section className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUp()} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">Hue.Ai White Paper</span>
            <h2
              className="font-display font-black uppercase leading-tight text-white mt-1"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              The Number Nobody<br />Else Publishes.
            </h2>
            <p className="text-white/55 text-sm mt-5 max-w-2xl leading-relaxed">
              Almost every eyewear brand claims &ldquo;enhanced color.&rdquo; Almost none publish a figure you can verify. Hue.Ai's CTO Keenan Valentine, PhD, and Paul M. Karpecki, OD, FAAO, Chief Clinical Editor of <em>Review of Optometry</em>, published a white paper proposing two measurable metrics for any lens. We publish ours.
            </p>
          </motion.div>

          {/* CRF / CAF definition cards */}
          <div className="grid md:grid-cols-2 gap-px bg-white/5 mb-14">
            {[
              {
                abbr: "CRF",
                name: "Color Resolution Factor",
                desc: "How many visually distinguishable colors a lens transmits, compared to a clear lens (100% baseline). A score above 120% means a person can definitively perceive higher color contrast.",
                stat: ">120%",
                statLabel: "threshold for demonstrably high contrast",
              },
              {
                abbr: "CAF",
                name: "Color Accuracy Factor",
                desc: "How accurately the lens transmits color, compared to a clear lens (100% baseline). A score of 95% or above means color stays true to life. Below 80% means significant distortion.",
                stat: "≥95%",
                statLabel: "for true-to-life color accuracy",
              },
            ].map((metric, i) => (
              <motion.div
                key={metric.abbr}
                variants={fadeUp(i * 0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-[#141414] p-8 md:p-10"
              >
                <p className="font-display font-black text-5xl text-rc-red mb-1">{metric.abbr}</p>
                <p className="text-xs font-bold tracking-widest uppercase text-white/50 mb-5">{metric.name}</p>
                <p className="text-sm text-white/60 leading-relaxed mb-7">{metric.desc}</p>
                <div>
                  <p className="font-display font-black text-3xl text-white">{metric.stat}</p>
                  <p className="text-[10px] text-white/35 tracking-widest uppercase mt-1">{metric.statLabel}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Comparison table */}
          <motion.div variants={fadeUp(0.15)} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3 className="font-display font-black uppercase text-lg text-white mb-6">How the Numbers Stack Up</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-8 text-[10px] tracking-widest uppercase text-white/35 font-semibold w-[200px]">Lens</th>
                    <th className="text-left py-3 pr-8 text-[10px] tracking-widest uppercase text-white/35 font-semibold">CRF (Color Resolution)</th>
                    <th className="text-left py-3 text-[10px] tracking-widest uppercase text-white/35 font-semibold">CAF (Color Accuracy)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-4 pr-8 text-xs font-bold tracking-widest uppercase text-rc-red align-top">REDCAT® Hue Colorboost</td>
                    <td className="py-4 pr-8 align-top">
                      <span className="font-display font-black text-xl text-white">138%</span>
                      <span className="text-white/40 text-xs ml-2">+38% vs. clear</span>
                    </td>
                    <td className="py-4 align-top">
                      <span className="font-display font-black text-xl text-white">99%</span>
                      <span className="text-white/40 text-xs ml-2">essentially perfect</span>
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 pr-8 text-xs font-semibold text-white/40 align-top">Common rose-tinted lens</td>
                    <td className="py-4 pr-8 align-top">
                      <span className="font-display font-black text-xl text-white/40">96%</span>
                      <span className="text-white/25 text-xs ml-2">below baseline</span>
                    </td>
                    <td className="py-4 align-top">
                      <span className="font-display font-black text-xl text-white/40">56%</span>
                      <span className="text-white/25 text-xs ml-2">significant distortion</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-8 text-xs font-semibold text-white/25 align-top">Clear lens (baseline)</td>
                    <td className="py-4 pr-8 align-top"><span className="font-display font-black text-xl text-white/25">100%</span></td>
                    <td className="py-4 align-top"><span className="font-display font-black text-xl text-white/25">100%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-white/35 text-xs mt-5 leading-relaxed max-w-2xl">
              Source: Keenan Valentine, PhD &amp; Paul M. Karpecki, OD, FAAO — <em>Color Resolution Factor and Color Accuracy Factor: A Framework for Evaluating Color-Enhancing Lenses</em> (Hue.Ai white paper, 2024).
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp(0.25)} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12 flex flex-col sm:flex-row gap-4">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 bg-rc-red text-white font-display font-black uppercase px-8 py-4 text-sm tracking-widest hover:bg-red-700 transition-colors"
            >
              Find Your Lens <ChevronRight size={16} />
            </Link>
            <Link
              to="/blog/enhancing-color-vision"
              className="inline-flex items-center gap-2 border border-white/20 text-white/70 font-display uppercase px-8 py-4 text-sm tracking-widest hover:border-white/40 hover:text-white transition-colors"
            >
              Read the Science <ChevronRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
