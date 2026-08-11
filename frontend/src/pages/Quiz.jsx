import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

// ─── Lens data ────────────────────────────────────────────────────────────────
const LENS_DATA = {
  LumiGlo: {
    color: "#9ACD32",
    tagline: "Makes yellow-green balls practically glow.",
    detail: "Boosts yellow-green hues by up to 35%. The choice for pickleball and tennis played with standard balls in any light.",
  },
  "LumiGlo Indoor": {
    color: "#B5E853",
    tagline: "Tuned for indoor courts and artificial light.",
    detail: "Same yellow-green boost as LumiGlo, engineered for indoor fluorescent and LED environments.",
  },
  FireGlo: {
    color: "#FF5500",
    tagline: "Picks up pink, orange, and red balls instantly.",
    detail: "Amplifies warm ball colors by up to 30%. Ideal for bright-colored pickleball and padel.",
  },
  BronzeGlo: {
    color: "#C87941",
    tagline: "Sharpens warm terrain and depth contrast.",
    detail: "Amplifies reds, oranges, and browns — ideal for trail running, hiking, and general outdoors.",
  },
  CarbonGlo: {
    color: "#5BAFD6",
    tagline: "Boosts aquas, greens, and cool tones.",
    detail: "Enhances cool-spectrum contrast by up to 37%. Perfect for cycling, golf, and road visibility.",
  },
  PolarGlo: {
    color: "#8ECAE6",
    tagline: "Eliminates glare. Still color-tuned.",
    detail: "Polarized and color-tuned. Cuts reflection off water, asphalt, and wet surfaces without dulling the world.",
  },
};

const MODEL_DATA = {
  beast: { name: "Beast", tagline: "Shield wrap for cycling & MTB", price: "$204.99" },
  roar: { name: "Roar", tagline: "Wrap shield for racket sports", price: "$184.99" },
  leap: { name: "Leap", tagline: "Versatile all-sport wrap frame", price: "$144.99" },
  strike: { name: "Strike", tagline: "Classic lightweight wrap", price: "$119.99" },
};

// ─── Quiz steps ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "sport",
    question: "What's your primary sport?",
    options: [
      { id: "pickleball", label: "Pickleball", sub: "Indoor or outdoor" },
      { id: "tennis", label: "Tennis", sub: "Court & clay" },
      { id: "cycling", label: "Cycling", sub: "Road & trail" },
      { id: "mountain-biking", label: "Mountain Biking", sub: "Off-road & enduro" },
      { id: "golf", label: "Golf", sub: "Fairway & green" },
      { id: "running", label: "Running", sub: "Road & trail" },
    ],
  },
  {
    id: "environment",
    question: "Where do you mostly play?",
    options: [
      { id: "sunny", label: "Bright Sun", sub: "Clear days, hard shadows" },
      { id: "overcast", label: "Overcast", sub: "Flat light, cloudy" },
      { id: "indoors", label: "Indoors", sub: "Gym or indoor court" },
      { id: "water", label: "Near Water", sub: "Ocean, lake, or pool" },
    ],
  },
  {
    id: "goal",
    question: "What matters most to you?",
    options: [
      { id: "tracking", label: "See the Ball Better", sub: "React faster, fewer misses" },
      { id: "glare", label: "Cut the Glare", sub: "Reflective surfaces or bright sun" },
      { id: "clarity", label: "All-Around Clarity", sub: "Richer, sharper, more vivid" },
    ],
  },
];

// ─── Recommendation engine ────────────────────────────────────────────────────
function getRecommendation(sport, environment, goal) {
  const BASE = {
    pickleball:       { lens: "LumiGlo",   model: "roar",   link: "/products/roar" },
    tennis:           { lens: "LumiGlo",   model: "leap",   link: "/products/leap" },
    cycling:          { lens: "CarbonGlo", model: "beast",  link: "/products/beast" },
    "mountain-biking":{ lens: "CarbonGlo", model: "beast",  link: "/products/beast" },
    golf:             { lens: "CarbonGlo", model: "leap",   link: "/products/leap" },
    running:          { lens: "BronzeGlo", model: "strike", link: "/products/strike" },
  };

  let rec = BASE[sport] || { lens: "BronzeGlo", model: "strike", link: "/products/strike" };

  // Environment overrides
  if (environment === "indoors" && (sport === "pickleball" || sport === "tennis")) {
    rec = { ...rec, lens: "LumiGlo Indoor" };
  }
  if (environment === "water") {
    rec = { ...rec, lens: "PolarGlo" };
  }

  // Goal overrides
  if (goal === "glare") {
    rec = { ...rec, lens: "PolarGlo" };
  } else if (goal === "tracking" && sport === "pickleball") {
    rec = { ...rec, lens: "FireGlo" };
  }

  return rec;
}

// ─── Animation variants ───────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

// ─── Main Quiz component ──────────────────────────────────────────────────────
export default function Quiz() {
  useSEO({
    title: "Find Your Perfect Lens | Redcat® Eyewear Lens Selector",
    description: "Answer 3 quick questions and get a personalized lens recommendation from Redcat® Eyewear. Built for your sport, your light, your performance.",
    keywords: "pickleball sunglasses lens quiz, best cycling sunglasses, golf lens recommendation, sport sunglasses finder",
    path: "/quiz",
  });

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState({ sport: null, environment: null, goal: null });
  const [selected, setSelected] = useState(null);

  const isResult = step === STEPS.length;
  const rec = isResult ? getRecommendation(answers.sport, answers.environment, answers.goal) : null;
  const lens = rec ? LENS_DATA[rec.lens] : null;
  const model = rec ? MODEL_DATA[rec.model] : null;

  const handleSelect = useCallback((optId) => {
    setSelected(optId);
  }, []);

  const handleNext = useCallback(() => {
    if (!selected) return;
    const key = STEPS[step].id;
    const nextAnswers = { ...answers, [key]: selected };
    setAnswers(nextAnswers);
    setSelected(null);
    setDirection(1);
    setStep((s) => s + 1);
  }, [selected, step, answers]);

  const handleBack = useCallback(() => {
    if (step === 0) return;
    setDirection(-1);
    setStep((s) => s - 1);
    const prevKey = STEPS[step - 1].id;
    setSelected(answers[prevKey]);
  }, [step, answers]);

  const handleReset = useCallback(() => {
    setStep(0);
    setDirection(-1);
    setAnswers({ sport: null, environment: null, goal: null });
    setSelected(null);
  }, []);

  return (
    <div
      className="min-h-screen bg-rc-dark flex flex-col pt-[var(--navbar-h)]"
      data-testid="quiz-page"
    >
      {/* Progress */}
      {!isResult && (
        <div className="w-full px-6 pt-8 pb-0">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    i <= step ? "bg-rc-red" : "bg-white/15"
                  }`}
                />
              ))}
            </div>
            <p className="text-white/40 text-xs tracking-widest uppercase">
              Step {step + 1} of {STEPS.length}
            </p>
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <AnimatePresence mode="wait" custom={direction}>
          {!isResult ? (
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl"
            >
              {/* Question */}
              <h1
                className="font-display font-black text-white uppercase mb-8 text-center"
                style={{ fontSize: "clamp(1.6rem, 5vw, 3rem)", lineHeight: 1.1 }}
              >
                {STEPS[step].question}
              </h1>

              {/* Options grid */}
              <div
                className={`grid gap-3 ${
                  STEPS[step].options.length === 3
                    ? "grid-cols-1 sm:grid-cols-3"
                    : STEPS[step].options.length === 4
                    ? "grid-cols-2"
                    : "grid-cols-2 sm:grid-cols-3"
                }`}
              >
                {STEPS[step].options.map((opt) => (
                  <button
                    key={opt.id}
                    data-testid={`quiz-option-${opt.id}`}
                    onClick={() => handleSelect(opt.id)}
                    className={`relative flex flex-col items-start justify-end p-5 min-h-[100px] sm:min-h-[120px] border text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rc-red rounded-sm ${
                      selected === opt.id
                        ? "border-rc-red bg-rc-red/15 text-white"
                        : "border-white/15 bg-rc-surface text-white/70 hover:border-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {selected === opt.id && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-rc-red flex items-center justify-center">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                    <div>
                      <div className="font-display font-black uppercase text-base sm:text-lg tracking-wide leading-tight mb-0.5">
                        {opt.label}
                      </div>
                      <div className="text-xs text-white/40">{opt.sub}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={handleBack}
                  disabled={step === 0}
                  className="flex items-center gap-2 text-white/40 hover:text-white disabled:opacity-0 transition-colors text-sm"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  data-testid="quiz-next-btn"
                  onClick={handleNext}
                  disabled={!selected}
                  className="flex items-center gap-2.5 bg-rc-red text-white font-display font-black uppercase px-8 py-4 text-sm tracking-widest hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {step === STEPS.length - 1 ? "See My Lens" : "Next"} <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl"
              data-testid="quiz-result"
            >
              {/* Result header */}
              <p className="text-white/40 text-xs tracking-[0.3em] uppercase text-center mb-3">
                Your Recommended Lens
              </p>

              {/* Lens card */}
              <div
                className="rounded-sm p-8 mb-5 text-center"
                style={{ background: `linear-gradient(135deg, ${lens?.color}22, ${lens?.color}08)`, border: `1px solid ${lens?.color}33` }}
              >
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-5 ring-4"
                  style={{ background: lens?.color, ringColor: `${lens?.color}44` }}
                />
                <h2
                  className="font-display font-black uppercase text-white mb-2"
                  style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", lineHeight: 1 }}
                >
                  {rec?.lens}
                </h2>
                <p className="text-white/70 text-base mb-1">{lens?.tagline}</p>
                <p className="text-white/40 text-sm max-w-sm mx-auto">{lens?.detail}</p>
              </div>

              {/* Frame recommendation */}
              <div className="border border-white/10 bg-rc-surface p-5 rounded-sm flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/40 text-xs tracking-widest uppercase mb-0.5">
                    Recommended Frame
                  </p>
                  <p className="font-display font-black uppercase text-white text-xl tracking-wide">
                    {model?.name}
                  </p>
                  <p className="text-white/50 text-sm">{model?.tagline}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/30 text-xs mb-0.5">Starting at</p>
                  <p className="text-white font-display font-black text-2xl">{model?.price}</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={rec?.link || "/collections"}
                  data-testid="quiz-shop-cta"
                  className="flex-1 flex items-center justify-center gap-2 bg-rc-red text-white font-display font-black uppercase px-8 py-4 text-sm tracking-widest hover:bg-red-700 transition-colors"
                >
                  Shop {model?.name} <ArrowRight size={16} />
                </Link>
                <Link
                  to="/collections"
                  className="flex-1 flex items-center justify-center gap-2 border border-white/20 text-white/70 font-display uppercase px-8 py-4 text-sm tracking-widest hover:border-white/40 hover:text-white transition-colors"
                >
                  Browse All
                </Link>
              </div>

              {/* Retake */}
              <button
                onClick={handleReset}
                data-testid="quiz-retake-btn"
                className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-sm mx-auto mt-6 w-full justify-center"
              >
                <RotateCcw size={14} /> Retake quiz
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
