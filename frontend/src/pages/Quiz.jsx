import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

// ─── Lens data ────────────────────────────────────────────────────────────────
const LENS_DATA = {
  "LumiGlo Outdoor": {
    base: "LumiGlo",
    color: "#9ACD32",
    tagline: "Makes hi-vis yellow-green balls practically glow in full sun.",
    detail: "Boosts yellow-green hues by up to 35%. Designed for outdoor play in full sun or overcast light with standard hi-vis pickleball and tennis balls.",
  },
  "LumiGlo Indoor": {
    base: "LumiGlo",
    color: "#B5E853",
    tagline: "Same yellow-green boost, tuned for indoor and low-light play.",
    detail: "Engineered for indoor courts, gyms, and low-light environments. Amplifies hi-vis yellow-green balls under artificial or dim lighting.",
  },
  "FireGlo Outdoor": {
    base: "FireGlo",
    color: "#FF5500",
    tagline: "Amplifies red, orange, and pink balls in full sun.",
    detail: "Boosts warm ball colors by up to 30% in bright outdoor conditions. Ideal for playing with red, orange, or pink pickleballs in full sun or overcast.",
  },
  "FireGlo Indoor": {
    base: "FireGlo",
    color: "#FF7A33",
    tagline: "Red, orange, and pink ball boost for indoor and low-light play.",
    detail: "The indoor version of FireGlo. Tuned for gym courts and low-light environments. Amplifies red, orange, and pink pickleball colors under artificial light.",
  },
  BronzeGlo: {
    base: "BronzeGlo",
    color: "#C87941",
    tagline: "Full-sun lens. Amplifies warm tones and safety colors.",
    detail: "Boosts reds, oranges, and pinks — including safety colors like brake lights, stop signs, and orange cones. A solid general-purpose outdoor lens for driving and everyday activity.",
  },
  CarbonGlo: {
    base: "CarbonGlo",
    color: "#5BAFD6",
    tagline: "Boosts aquas, greens, and cool tones for terrain clarity.",
    detail: "Enhances cool-spectrum contrast by up to 37%. The lens for cycling, mountain biking, golf, and any activity where reading the terrain or ball against sky matters.",
  },
  PolarGlo: {
    base: "PolarGlo",
    color: "#8ECAE6",
    tagline: "Cuts glare. Still color-tuned.",
    detail: "Polarized and color-tuned. Eliminates reflection off water, asphalt, and wet surfaces without dulling the world.",
  },
};

const MODEL_DATA = {
  beast:  { name: "Beast",  tagline: "Shield wrap for cycling & MTB", price: "$204.99" },
  roar:   { name: "Roar",   tagline: "Wrap shield for racket sports",  price: "$184.99" },
  leap:   { name: "Leap",   tagline: "Versatile all-sport wrap frame", price: "$144.99" },
  strike: { name: "Strike", tagline: "Classic lightweight wrap",        price: "$119.99" },
};

// ─── Recommendation engine ────────────────────────────────────────────────────
// sport, ballColor (null for non-ball sports), lighting → { lens, model, link }
function getRecommendation(sport, ballColor, lighting) {
  const isIndoor = lighting === "indoor";

  // Racket sports: driven by ball color + lighting
  if (sport === "pickleball" || sport === "tennis") {
    const model  = sport === "pickleball" ? "roar" : "leap";
    if (ballColor === "pink") {
      return {
        lens:  isIndoor ? "FireGlo Indoor" : "FireGlo Outdoor",
        model, link: `/products/${model}`,
      };
    }
    // yellow (default) or mixed → LumiGlo
    return {
      lens:  isIndoor ? "LumiGlo Indoor" : "LumiGlo Outdoor",
      model, link: `/products/${model}`,
    };
  }

  // Cycling / MTB
  if (sport === "cycling" || sport === "mtb") {
    return { lens: "CarbonGlo", model: "beast", link: "/products/beast" };
  }

  // Golf
  if (sport === "golf") {
    return { lens: "CarbonGlo", model: "leap", link: "/products/leap" };
  }

  // Running or Driving/General → BronzeGlo (full-sun / safety colors)
  return { lens: "BronzeGlo", model: "strike", link: "/products/strike" };
}

// ─── Quiz step definitions ────────────────────────────────────────────────────
// Step 0: Sport (always shown)
// Step 1: Ball color (racket sports) OR Lighting (other sports)
// Step 2: Lighting (racket sports only — skipped for others)

const RACKET_SPORTS = ["pickleball", "tennis"];

const SPORT_STEP = {
  id: "sport",
  question: "What's your primary sport or activity?",
  options: [
    { id: "pickleball",  label: "Pickleball",        sub: "Indoor or outdoor" },
    { id: "tennis",      label: "Tennis",             sub: "Court & clay" },
    { id: "cycling",     label: "Cycling",            sub: "Road & trail" },
    { id: "mtb",         label: "Mountain Biking",    sub: "Off-road & enduro" },
    { id: "golf",        label: "Golf",               sub: "Fairway & green" },
    { id: "running",     label: "Running & General",  sub: "Road, trail, everyday" },
  ],
};

const BALL_COLOR_STEP = {
  id: "ballColor",
  question: "What color ball do you typically play with?",
  options: [
    { id: "yellow", label: "Hi-Vis Yellow-Green", sub: "Standard USAPA / tennis ball" },
    { id: "pink",   label: "Red, Orange, or Pink", sub: "Selkirk, Onix, colored balls" },
    { id: "both",   label: "We Use Both",          sub: "Mixed sessions or leagues" },
  ],
};

const LIGHTING_STEP = {
  id: "lighting",
  question: "What's the lighting like when you play?",
  options: [
    { id: "sunny",   label: "Full Sun",           sub: "Clear outdoor days" },
    { id: "overcast",label: "Overcast or Cloudy", sub: "Outdoor, flat light" },
    { id: "indoor",  label: "Indoors or Low Light",sub: "Gym, covered court, evening" },
  ],
};

const ENV_STEP = {
  id: "lighting",
  question: "What's your typical environment?",
  options: [
    { id: "sunny",   label: "Bright Sun",          sub: "Outdoor, clear days" },
    { id: "overcast",label: "Overcast or Mixed",   sub: "Variable outdoor light" },
    { id: "indoor",  label: "Low Light",            sub: "Dusk, evening, or covered" },
  ],
};

// ─── Animation variants ───────────────────────────────────────────────────────
const slideVariants = {
  enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

// ─── Main Quiz component ──────────────────────────────────────────────────────
export default function Quiz() {
  useSEO({
    title: "Find Your Redcats | Redcat® Eyewear Lens Selector",
    description: "Answer a few questions and get a personalized lens recommendation from Redcat® Eyewear — built for your sport, your ball color, and your light.",
    keywords: "pickleball sunglasses lens quiz, best cycling sunglasses, golf lens recommendation, sport sunglasses finder",
    path: "/quiz",
  });

  const [step, setStep]           = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers]     = useState({ sport: null, ballColor: null, lighting: null });
  const [selected, setSelected]   = useState(null);
  const [done, setDone]           = useState(false);

  // Build the dynamic step list based on chosen sport
  const isRacket = RACKET_SPORTS.includes(answers.sport);
  const steps = done
    ? []
    : step === 0
    ? [SPORT_STEP]
    : isRacket
    ? [SPORT_STEP, BALL_COLOR_STEP, LIGHTING_STEP]
    : [SPORT_STEP, ENV_STEP];

  const totalSteps = isRacket || step === 0 ? 3 : 2;
  const currentStepDef = steps[step] || null;

  const rec   = done ? getRecommendation(answers.sport, answers.ballColor, answers.lighting) : null;
  const lens  = rec  ? LENS_DATA[rec.lens]   : null;
  const model = rec  ? MODEL_DATA[rec.model] : null;

  const handleSelect = useCallback((id) => setSelected(id), []);

  const handleNext = useCallback(() => {
    if (!selected) return;
    const key       = currentStepDef.id;
    const next      = { ...answers, [key]: selected };
    setAnswers(next);
    setSelected(null);
    setDirection(1);

    const nextIsRacket = RACKET_SPORTS.includes(next.sport);
    const maxSteps     = nextIsRacket ? 3 : 2;
    if (step + 1 >= maxSteps) {
      setDone(true);
    } else {
      setStep((s) => s + 1);
    }
  }, [selected, step, answers, currentStepDef]);

  const handleBack = useCallback(() => {
    if (step === 0) return;
    setDirection(-1);
    setStep((s) => s - 1);
    setDone(false);
    const prevKey = steps[step - 1]?.id;
    if (prevKey) setSelected(answers[prevKey]);
  }, [step, answers, steps]);

  const handleReset = useCallback(() => {
    setStep(0); setDirection(-1);
    setAnswers({ sport: null, ballColor: null, lighting: null });
    setSelected(null); setDone(false);
  }, []);

  return (
    <div className="min-h-screen bg-rc-dark flex flex-col pt-[var(--navbar-h)]" data-testid="quiz-page">
      {/* Progress */}
      {!done && (
        <div className="w-full px-6 pt-8 pb-0">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-rc-red" : "bg-white/15"}`} />
              ))}
            </div>
            <p className="text-white/40 text-xs tracking-widest uppercase">
              Step {step + 1} of {totalSteps}
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <AnimatePresence mode="wait" custom={direction}>
          {!done ? (
            <motion.div key={step} custom={direction} variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl"
            >
              <h1 className="font-display font-black text-white uppercase mb-8 text-center"
                style={{ fontSize: "clamp(1.5rem, 4.5vw, 2.8rem)", lineHeight: 1.1 }}>
                {currentStepDef?.question}
              </h1>

              <div className={`grid gap-3 ${
                (currentStepDef?.options?.length || 0) <= 3
                  ? "grid-cols-1 sm:grid-cols-3"
                  : "grid-cols-2 sm:grid-cols-3"
              }`}>
                {currentStepDef?.options?.map((opt) => (
                  <button key={opt.id} data-testid={`quiz-option-${opt.id}`}
                    onClick={() => handleSelect(opt.id)}
                    className={`relative flex flex-col items-start justify-end p-5 min-h-[100px] border text-left transition-all duration-200 focus:outline-none rounded-sm ${
                      selected === opt.id
                        ? "border-rc-red bg-rc-red/15 text-white"
                        : "border-white/15 bg-rc-surface text-white/70 hover:border-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {selected === opt.id && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-rc-red flex items-center justify-center">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    )}
                    <div>
                      <div className="font-display font-black uppercase text-base sm:text-lg tracking-wide leading-tight mb-0.5">{opt.label}</div>
                      <div className="text-xs text-white/40">{opt.sub}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mt-8">
                <button onClick={handleBack} disabled={step === 0}
                  className="flex items-center gap-2 text-white/40 hover:text-white disabled:opacity-0 transition-colors text-sm">
                  <ArrowLeft size={16}/> Back
                </button>
                <button data-testid="quiz-next-btn" onClick={handleNext} disabled={!selected}
                  className="flex items-center gap-2.5 bg-rc-red text-white font-display font-black uppercase px-8 py-4 text-sm tracking-widest hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
                  {step + 1 >= totalSteps ? "Find My Redcats" : "Next"} <ArrowRight size={16}/>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-2xl" data-testid="quiz-result">
              <p className="text-white/40 text-xs tracking-[0.3em] uppercase text-center mb-3">Your Recommended Lens</p>

              {/* Lens card */}
              <div className="rounded-sm p-8 mb-5 text-center"
                style={{ background: `linear-gradient(135deg, ${lens?.color}22, ${lens?.color}08)`, border: `1px solid ${lens?.color}33` }}>
                <div className="w-14 h-14 rounded-full mx-auto mb-5" style={{ background: lens?.color }}/>
                <h2 className="font-display font-black uppercase text-white mb-2"
                  style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", lineHeight: 1 }}>
                  {rec?.lens}
                </h2>
                <p className="text-white/70 text-base mb-1">{lens?.tagline}</p>
                <p className="text-white/40 text-sm max-w-sm mx-auto">{lens?.detail}</p>
              </div>

              {/* Frame recommendation */}
              <div className="border border-white/10 bg-rc-surface p-5 rounded-sm flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/40 text-xs tracking-widest uppercase mb-0.5">Recommended Frame</p>
                  <p className="font-display font-black uppercase text-white text-xl tracking-wide">{model?.name}</p>
                  <p className="text-white/50 text-sm">{model?.tagline}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/30 text-xs mb-0.5">Starting at</p>
                  <p className="text-white font-display font-black text-2xl">{model?.price}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={rec?.link || "/collections"} data-testid="quiz-shop-cta"
                  className="flex-1 flex items-center justify-center gap-2 bg-rc-red text-white font-display font-black uppercase px-8 py-4 text-sm tracking-widest hover:bg-red-700 transition-colors">
                  Shop {model?.name} <ArrowRight size={16}/>
                </Link>
                <Link to="/collections"
                  className="flex-1 flex items-center justify-center gap-2 border border-white/20 text-white/70 font-display uppercase px-8 py-4 text-sm tracking-widest hover:border-white/40 hover:text-white transition-colors">
                  Browse All
                </Link>
              </div>

              <button onClick={handleReset} data-testid="quiz-retake-btn"
                className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-sm mx-auto mt-6 w-full justify-center">
                <RotateCcw size={14}/> Retake quiz
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
