import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

const FAQ_CATEGORIES = [
  {
    label: "About REDCAT®",
    items: [
      {
        q: "What is Hue Lens Colorboost technology?",
        a: "Hue Lens Colorboost is a spectral tuning technology that amplifies specific color wavelengths to increase color contrast — without distorting overall color balance. Unlike a simple tint, it targets the exact wavelengths that matter for a given sport while preserving everything else. It's licensed from Hue.Ai and used across every Redcat® lens in the lineup.",
      },
      {
        q: "Where are Redcat® glasses made?",
        a: "Every Redcat® frame is designed and manufactured in Italy, CE-certified. TR-90 thermoplastic construction, hand-finished by skilled craftspeople. Not designed in California and made somewhere cheaper — made in Italy, full stop.",
      },
      {
        q: "What is CE certification?",
        a: "CE certification means the product has been tested against a European conformity standard rather than simply marketed as safe. It covers optical quality, UV protection, mechanical strength, and surface quality. For sport eyewear, it's a meaningful threshold — not just a sticker.",
      },
      {
        q: "What frame material does Redcat® use?",
        a: "TR-90 — a flexible thermoplastic that absorbs impact rather than snapping. It's 30–40% lighter than standard plastics, hypoallergenic, and sweat-resistant. The frame bends where a cheaper material would crack.",
      },
      {
        q: "Does Redcat® offer a warranty?",
        a: "Yes — a limited lifetime warranty against manufacturer's defects, to the original owner. If something fails under normal use, we'll repair or replace it. See our full Warranty & Returns page for details.",
      },
    ],
  },
  {
    label: "Lenses & Technology",
    items: [
      {
        q: "What does CRF (Color Resolution Factor) mean?",
        a: "CRF measures how many visually distinguishable colors a lens transmits compared to a clear lens, which is 100% by definition. Anything above 120% represents demonstrably higher color contrast. Every lens in the Redcat® line clears that threshold. It's calculated from the lens's spectral transmission profile — verifiable, not a marketing claim.",
      },
      {
        q: "What lens should I wear for pickleball?",
        a: "It depends on your ball color. For hi-vis green or yellow balls: LumiGlo™ Outdoor (bright sun) or LumiGlo™ Indoor (covered courts, flat light). For pink, red, or orange balls: FireGlo™ Outdoor or FireGlo™ Indoor. The lens that amplifies your ball's specific wavelengths is the one that creates the contrast advantage.",
      },
      {
        q: "Are polarized lenses good for pickleball?",
        a: "On a dry court, not especially. There's no significant flat-surface glare to eliminate, and what you actually need is contrast to separate the ball from the court. On wet courts or playing into low sun, polarization helps. Our PolarGlo™ lens is polarized and also carries Hue Lens Colorboost technology — so it does both jobs at once.",
      },
      {
        q: "Do Redcat® lenses help with color blindness?",
        a: "Hue Lens Colorboost technology is engineered for typical color vision — its published methodology is explicitly calculated for an observer without color vision deficiency. It's designed to amplify contrast for a normal visual system, not to correct an inherited deficiency. Those are different problems, and we'd rather tell you that than overclaim.",
      },
      {
        q: "Does color vision decline with age?",
        a: "Yes. The lens inside your eye yellows over time, filtering out short wavelengths and reducing your ability to distinguish similar colors. Blues and greens are affected first. It's normal and gradual — but it's one reason contrast-tuned lenses tend to make a bigger measurable difference for players over 40.",
      },
      {
        q: "What's the difference between LumiGlo™ Outdoor and LumiGlo™ Indoor?",
        a: "Both amplify yellow-green wavelengths for hi-vis balls. The Outdoor version is calibrated for bright sun and open courts — darker tint, more sun filtration. The Indoor version has higher light transmission for covered facilities and flat artificial lighting. Same contrast science, different light conditions.",
      },
    ],
  },
  {
    label: "Orders & Shipping",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse our products, select your frame and lens combination, add to cart, and proceed to checkout. Your order processes securely through Shopify on redcateyewear.com.",
      },
      {
        q: "Do you ship internationally?",
        a: "We currently ship within the United States. If you're outside the US and interested in Redcat® eyewear, contact us at support@redcateyewear.com and we'll let you know the latest on international availability.",
      },
      {
        q: "How quickly will my order ship?",
        a: "Most orders ship within 1–3 business days. You'll receive a tracking number as soon as your order is on its way.",
      },
      {
        q: "Can I change or cancel my order after placing it?",
        a: "Contact us as quickly as possible at support@redcateyewear.com or (678) 208-8232. We process orders quickly, but we'll do our best to accommodate changes before shipment.",
      },
    ],
  },
  {
    label: "Warranty & Returns",
    items: [
      {
        q: "What does the lifetime warranty cover?",
        a: "The limited lifetime warranty covers defects in materials and workmanship for the life of the product under normal use and service. It does not cover damage from accidents, misuse, abuse, negligence, normal wear and tear, or unauthorized repairs.",
      },
      {
        q: "How do I make a warranty claim?",
        a: "Contact Redcat Customer Support at support@redcateyewear.com or (678) 208-8232. You'll need to provide proof of purchase and a description of the defect. We'll review and determine whether to repair or replace the product, at our discretion.",
      },
      {
        q: "Is the warranty transferable?",
        a: "No. The warranty is non-transferable and applies only to the original purchaser from redcateyewear.com or an authorized Redcat® retailer.",
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/8 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left hover:text-rc-red transition-colors group"
        data-testid="faq-accordion-item"
      >
        <span className="text-sm font-semibold text-gray-900 pr-6 group-hover:text-rc-red transition-colors">{q}</span>
        <ChevronDown size={14} className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.22 }}
          className="overflow-hidden"
        >
          <p className="text-sm text-gray-500 leading-relaxed pb-5 max-w-2xl">{a}</p>
        </motion.div>
      )}
    </div>
  );
}

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay } },
});

export default function FAQ() {
  useSEO({
    title: "FAQ | Redcat® Eyewear",
    description: "Answers about Redcat® lens technology, ordering, shipping, warranty claims, and more.",
    keywords: "redcat faq, sport sunglasses help, pickleball lens questions, eyewear warranty",
    path: "/faq",
  });

  return (
    <div className="bg-white overflow-x-hidden" data-testid="faq-page">

      {/* Hero */}
      <section className="pt-[calc(var(--navbar-h)+5rem)] pb-16 px-6 border-b border-black/5">
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUp()} initial="hidden" animate="visible">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">Support</span>
            <h1
              className="font-display font-black uppercase leading-[0.9] text-gray-900 mt-2"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
            >
              Frequently<br />Asked Questions
            </h1>
          </motion.div>
          <motion.p
            variants={fadeUp(0.15)}
            initial="hidden"
            animate="visible"
            className="text-gray-500 text-sm mt-5 max-w-xl leading-relaxed"
          >
            Can't find what you're looking for? Email us at{" "}
            <a href="mailto:support@redcateyewear.com" className="text-rc-red hover:underline font-semibold">support@redcateyewear.com</a>
            {" "}or call{" "}
            <a href="tel:+16782088232" className="text-rc-red hover:underline font-semibold">(678) 208-8232</a>.
          </motion.p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="space-y-16">
            {FAQ_CATEGORIES.map((cat, ci) => (
              <motion.div
                key={cat.label}
                variants={fadeUp(ci * 0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-rc-red">{cat.label}</span>
                  <div className="flex-1 h-px bg-black/5" />
                </div>
                <div className="divide-y-0">
                  {cat.items.map((item, ii) => (
                    <FAQItem key={ii} q={item.q} a={item.a} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Still need help CTA */}
          <motion.div
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-20 bg-[#F5F0E8] p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div>
              <h3 className="font-display font-black uppercase text-2xl text-gray-900">Still have questions?</h3>
              <p className="text-sm text-gray-500 mt-1">Our team responds within one business day.</p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-rc-red text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors whitespace-nowrap"
            >
              Contact Us <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
