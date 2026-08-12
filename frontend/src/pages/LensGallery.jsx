import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

const CDN_ASSETS = "https://customer-assets-v7afamib.emergentagent.net/job_redcat-astro-build/artifacts";

const LENSES = [
  {
    name: "LumiGlo Outdoor",
    image: `${CDN_ASSETS}/5cgbmphe_PC-G1608%20LumiGlo%20Outdoor.webp`,
    accent: "#9ACD32",
    tagline: "Yellow-green balls practically glow.",
    sports: ["Pickleball", "Tennis"],
    env: "Outdoor — full sun & overcast",
    detail: "Amplifies yellow-green wavelengths by up to 35%. The hi-vis ball stops looking like a moving object and starts looking lit.",
  },
  {
    name: "LumiGlo Indoor",
    image: `${CDN_ASSETS}/7ojiofny_PC-G3902%20LumiGlo%20Indoor.webp`,
    accent: "#B5E853",
    tagline: "Same pop. Calibrated for indoor courts.",
    sports: ["Pickleball", "Tennis"],
    env: "Indoor — gym courts & covered facilities",
    detail: "Same yellow-green amplification as Outdoor, calibrated for flat artificial lighting. The ball stays sharp. No squinting.",
  },
  {
    name: "FireGlo Outdoor",
    image: `${CDN_ASSETS}/tnnn27ci_PC-V3001%20FireGlo%20Outdoor.webp`,
    accent: "#FF5500",
    tagline: "Pink, orange, red balls? They catch fire.",
    sports: ["Pickleball"],
    env: "Outdoor — full sun & overcast",
    detail: "Boosts warm ball colors by up to 30% in bright conditions. If you play with a colored ball outdoors, this is your lens. It's not subtle.",
  },
  {
    name: "FireGlo Indoor",
    image: `${CDN_ASSETS}/9yg7mbam_PC-R4704%20FireGlo%20Indoor.webp`,
    accent: "#FF7A33",
    tagline: "Warm balls stay vivid under gym lights.",
    sports: ["Pickleball"],
    env: "Indoor — gym courts & covered facilities",
    detail: "FireGlo tuned for indoor courts. Red, orange, and pink pickleballs stay trackable under flat artificial lighting.",
  },
  {
    name: "CarbonGlo",
    image: `${CDN_ASSETS}/s1chu67m_PC-SG1511%20CarbonGlo.webp`,
    accent: "#5BAFD6",
    tagline: "Every road detail. Every green's grain.",
    sports: ["Cycling", "Golf", "Outdoors"],
    env: "Outdoor — all-day light conditions",
    detail: "Amplifies aqua and green-spectrum tones by up to 37%. Road surfaces, course contours, trail hazards — all sharper.",
  },
  {
    name: "BronzeGlo",
    image: `${CDN_ASSETS}/vi0k8fqs_PCPL-B2003-v%20BronzeGlo.webp`,
    accent: "#C87941",
    tagline: "Low-angle sun? Not your problem.",
    sports: ["Driving", "MTB", "Trail"],
    env: "Outdoor — sun, dawn & dusk",
    detail: "Amber-tuned for full sun, low-angle glare, and variable outdoor light. Sharpens warm-tone hazards — brake lights, road markings, trail obstacles.",
  },
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay } },
});

export default function LensGallery() {
  useSEO({
    title: "Lens Gallery | Redcat® Eyewear",
    description: "All six Redcat® color-tuned lenses in one place. Find the lens for your sport — from LumiGlo pickleball science to BronzeGlo driving clarity.",
    keywords: "LumiGlo, FireGlo, CarbonGlo, BronzeGlo, sport sunglasses lenses, color tuned lenses",
    path: "/lenses",
  });

  return (
    <div className="bg-white overflow-x-hidden" data-testid="lenses-page">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="pt-[calc(var(--navbar-h)+5rem)] pb-16 px-6 bg-white border-b border-black/5">
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUp()} initial="hidden" animate="visible">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">Lens Collection</span>
            <h1
              className="font-display font-black uppercase leading-[0.88] text-gray-900 mt-2"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
            >
              Six Lenses.<br />Six Ways<br />to See More.
            </h1>
          </motion.div>
          <motion.p
            variants={fadeUp(0.2)}
            initial="hidden"
            animate="visible"
            className="text-gray-500 text-base mt-6 max-w-lg leading-relaxed"
          >
            Not just tinted. Color-tuned. Every REDCAT® lens is engineered to amplify specific wavelengths for a specific sport. Pick yours or let the quiz decide.
          </motion.p>
          <motion.div variants={fadeUp(0.3)} initial="hidden" animate="visible" className="mt-6">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 text-rc-red font-bold text-xs tracking-widest uppercase hover:gap-3 transition-all"
              data-testid="lenses-quiz-cta-top"
            >
              Not sure which one? Take the quiz <ChevronRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Lens Grid ──────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/5">
            {LENSES.map((lens, i) => (
              <motion.div
                key={lens.name}
                data-testid={`lens-card-${lens.name.toLowerCase().replace(/\s+/g, "-")}`}
                variants={fadeUp(i * 0.08)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white p-8 flex flex-col"
              >
                {/* Lens image */}
                <div className="mb-6 h-20 flex items-center">
                  <img
                    src={lens.image}
                    alt={lens.name}
                    className="h-full w-auto object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Name + accent */}
                <h2 className="font-display font-black uppercase text-2xl tracking-widest text-gray-900 mb-1">
                  {lens.name}
                </h2>
                <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: lens.accent }}>
                  {lens.tagline}
                </p>

                {/* Sport tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {lens.sports.map((s) => (
                    <span
                      key={s}
                      className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 border border-black/10 text-gray-500"
                    >
                      {s}
                    </span>
                  ))}
                  <span className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 bg-black/4 text-gray-400 border border-black/5">
                    {lens.env}
                  </span>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed flex-1">{lens.detail}</p>

                {/* Divider + CTA */}
                <div className="mt-6 pt-5 border-t border-black/5">
                  <Link
                    to="/quiz"
                    className="text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-rc-red transition-colors flex items-center gap-1.5"
                  >
                    Find frames with {lens.name.split(" ")[0]} <ChevronRight size={11} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#060606]">
        <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">60-Second Quiz</span>
            <h2
              className="font-display font-black uppercase leading-tight text-white mt-2"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              We'll match the lens<br />to your game.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 bg-rc-red text-white font-display font-black uppercase px-8 py-4 text-sm tracking-widest hover:bg-red-700 transition-colors"
              data-testid="lenses-quiz-cta-bottom"
            >
              Find Your Lens <ChevronRight size={16} />
            </Link>
            <Link
              to="/technology"
              className="inline-flex items-center gap-2 border border-white/20 text-white/70 font-display uppercase px-8 py-4 text-sm tracking-widest hover:border-white/50 hover:text-white transition-colors"
            >
              Lens Science
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
