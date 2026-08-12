import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, ChevronDown } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { BLOG_POSTS_META } from "@/pages/Blog";

/* ─── All article content ────────────────────────────────────── */
const ARTICLES = {
  "pickleball-eye-safety": {
    sections: [
      { type: "lede", text: "Short answer: pickleball puts a hard plastic ball and a swinging paddle in a small court at close range, and the eye is the one part of your face with no bone in front of it. Eyewear with impact-resistant polycarbonate lenses, a durable frame, and enough coverage to stop something coming in from the side is the practical answer. Regular fashion sunglasses are not, because the lens material is usually the wrong stuff." },
      { type: "h2", text: "The risk is a function of the court, not your skill level" },
      { type: "p", text: "Pickleball compresses a fast game into a small space. The non-volley zone puts players seven feet apart, exchanging shots at close range, often with paddles moving through the same air as faces. The ball is rigid plastic. A mishit or a deflection travels a very short distance before it arrives." },
      { type: "p", text: "That geometry doesn't care how good you are. A 2023 UBS report cited in Ophthalmology Times projected roughly 67,000 emergency room visits annually related to pickleball injuries across all types. Eye injuries are among them, and ophthalmologists have been flagging the trend as participation climbs." },
      { type: "p", text: "The eye is uniquely exposed. Your brow, cheekbone, and nose protect it from most angles, but a ball coming straight in has a clear path. Unlike a bruised knee, an eye injury does not reliably heal back to where it started." },
      { type: "h2", text: "What actually makes eyewear protective" },
      { type: "table", headers: ["Feature", "Why it matters"], rows: [
        ["Polycarbonate lenses", "Polycarbonate is the impact-resistant lens material. Standard glass or acrylic lenses can shatter and drive fragments toward the eye, which is worse than no lens at all. This is the single most important spec."],
        ["A frame that flexes", "A brittle frame snaps on impact. TR-90 is a flexible thermoplastic that absorbs and distributes force rather than shattering. It's also light enough that you'll actually wear it."],
        ["Coverage", "A ball that misses the lens and hits your eye anyway isn't protecting you. Wrap and shield geometries close the peripheral gap where a lot of incidental contact comes from."],
        ["UV400", "Not an impact issue, but a long-term one. UV400 blocks essentially all UVA and UVB, which are linked to cataracts and macular degeneration over years of outdoor play."],
        ["Light enough to wear", "The best eyewear is the pair you don't take off in the third game because your nose hurts. Weight and fit are protection features, not comfort luxuries."],
      ]},
      { type: "h2", text: "Where Redcat® stands" },
      { type: "p", text: "Redcat® eyewear is made in Italy and CE certified. That matters more than it sounds. Most sport eyewear in this price range is manufactured in China to whatever spec the brand asked for. CE certification means the product was tested to a European conformity standard, not just described as safe in a product listing." },
      { type: "p", text: "Every Redcat® lens is impact-resistant polycarbonate. Every frame is TR-90 — flexible, lightweight, sweat-resistant, and hypoallergenic. It bends where a cheaper frame would break. Full-coverage geometry and UV400 across every lens with no exceptions." },
      { type: "h2", text: "Protection is the floor. Contrast is the point." },
      { type: "p", text: "Here's the thing about protective eyewear: if it makes it harder to see the ball, players take it off. That's the actual failure mode. The gear that protects you is worthless in a drawer." },
      { type: "p", text: "So the lens has to earn its place on your face by improving your game, not just guarding it. Redcat® lenses are built on Hue Lens Colorboost technology, which is spectrally tuned to amplify the specific wavelengths that matter. LumiGlo™ boosts the yellows and greens of a standard hi-vis pickleball. FireGlo™ boosts the pinks, reds, and oranges of the alternate ball colors. The ball separates from the court instead of blending into it, and you pick it up sooner." },
      { type: "p", text: "Every lens in the Redcat® line exceeds a Color Resolution Factor (CRF) of 120% — the threshold above which a person can definitively perceive higher color contrast. Most brands claim enhanced color and publish no number at all." },
      { type: "h2", text: "Choosing your model" },
      { type: "table", headers: ["Model", "Coverage", "Best for"], rows: [
        ["BEAST", "Maximum", "The largest shield in the line. Most peripheral coverage."],
        ["ROAR", "Maximum", "Full shield geometry, slightly different profile."],
        ["LEAP", "High", "Featherweight vented wrap with adjustable nose pads."],
        ["STRIKE", "Moderate", "Squared frame that plays on court and off."],
      ]},
      { type: "faq", items: [
        { q: "Do you really need eye protection for pickleball?", a: "The ball is rigid plastic, the court is small, and paddles move fast at close range. Eye injuries are a documented and rising category as participation grows. Given that impact-resistant eyewear costs a fraction of a single eye injury and improves your ability to track the ball, the case is straightforward." },
        { q: "Are regular sunglasses good enough for pickleball?", a: "Usually not. The issue is lens material. Many fashion sunglasses use lenses that can crack or shatter under impact, which can be worse than wearing nothing. Polycarbonate is the impact-resistant material, and it's what you want on a court." },
        { q: "What lens material is best for pickleball glasses?", a: "Polycarbonate. It's the standard impact-resistant lens material and it's what Redcat® uses across the line." },
        { q: "Does eyewear slow you down on the court?", a: "Only if it's the wrong eyewear. Weight, fit, and lens clarity determine whether you forget it's there. A contrast-tuned lens actively helps you track the ball, so the right pair makes you faster, not slower." },
        { q: "What does CE certified mean?", a: "CE certification means the product has been tested against a European conformity standard rather than simply marketed as safe. Redcat® eyewear is made in Italy and CE certified." },
        { q: "Does UV400 matter if I only play a few times a week?", a: "It adds up. UV exposure is cumulative over years and is associated with cataracts and macular degeneration. Every Redcat® lens is UV400, so it isn't a decision you have to make." },
      ]},
    ],
  },

  "enhancing-color-vision": {
    sections: [
      { type: "lede", text: "Short answer: color vision is how your eyes separate objects from their backgrounds, and it declines with age as the lens inside your eye yellows. That decline is gradual, normal, and mostly invisible until you're trying to track a fast-moving ball. A spectrally tuned contrast lens can restore some of the separation you've lost, which is why contrast-enhancing eyewear tends to make a bigger difference for players over 40 than for players in their twenties." },
      { type: "h2", text: "How color vision actually works" },
      { type: "p", text: "Your retina carries two kinds of light-sensing cells. Rods handle low light and motion. Cones handle color and fine detail. You have three types of cones, each sensitive to a different range of wavelengths, roughly corresponding to red, green, and blue. Every color you perceive is your brain combining signals from those three." },
      { type: "p", text: "Cones are less sensitive in dim light than rods, but they resolve finer detail and respond faster to change. That speed is what makes color vision a performance issue and not just an aesthetic one. Contrast is the practical output of all this. It's how a ball stops being part of the court and starts being an object you can track." },
      { type: "h2", text: "Why your color vision fades" },
      { type: "p", text: "The lens inside your eye yellows with age. It's a normal, universal process, and it happens slowly enough that most people never notice it happening. A yellowing lens filters out short wavelengths, which means blues and greens are the first to go. Distinguishing between similar shades gets harder." },
      { type: "p", text: "On a court, this shows up as a ball that doesn't pop the way it used to. You pick it up a fraction later. You commit a fraction later. Over a match, that adds up, and most players attribute it to reflexes rather than vision. The important part: this is a contrast problem, not an acuity problem. Your prescription can be perfect and your contrast can still be degraded." },
      { type: "h2", text: "Color vision deficiency, and what it isn't" },
      { type: "p", text: "Color vision deficiency (CVD), commonly called color blindness, is a separate condition from age-related decline. It's usually inherited, it's present from birth, and it involves cone cells that don't function in the typical range. Red-green CVD is the most common form." },
      { type: "p", text: "One honest note, because this category is full of overclaiming: Hue Lens Colorboost technology is a color contrast technology engineered for typical color vision. Hue's published methodology is explicitly calculated for an observer without color vision deficiency. It's designed to increase the contrast available to a normal visual system, not to correct an inherited deficiency. Those are different problems, and we'd rather tell you that than sell you something on a promise we can't back." },
      { type: "h2", text: "What a contrast lens actually does" },
      { type: "p", text: "A traditional tint accentuates colors near its own hue and dims the ones opposite. It shifts everything toward the lens color. Push it hard enough and you get contrast at the cost of accuracy, which is why a strong tint can feel disorienting and cause fatigue over hours." },
      { type: "p", text: "A spectrally tuned lens targets specific wavelengths, amplifying the ones that matter while preserving the overall color balance. More separation, without distorting the whole scene." },
      { type: "h2", text: "The number that separates real contrast from marketing" },
      { type: "p", text: "Almost every eyewear brand claims enhanced color. Almost none publish a figure you can verify. Hue.Ai's CTO Keenan Valentine, PhD, and Paul M. Karpecki, OD, FAAO, published a white paper proposing two measurable metrics for any lens:" },
      { type: "table", headers: ["Metric", "What it measures", "Benchmark"], rows: [
        ["CRF (Color Resolution Factor)", "How many distinguishable colors the lens transmits, versus a clear lens", "Above 120% means demonstrably high color contrast"],
        ["CAF (Color Accuracy Factor)", "How accurately the lens transmits color, versus a clear lens", "95% or above means color stays true; under 80% means significant distortion"],
      ]},
      { type: "p", text: "A clear lens is 100% CRF by definition. An example Hue Lens Colorboost lens measures a CRF of 138%, meaning 38% more color resolution, while holding a CAF of 99% — color accuracy essentially equal to clear glass. Getting both is the hard part. A common rose-colored lens scores a CRF of 96% with a CAF of just 56%: essentially no contrast gain, and noticeably distorted color. That's what an aggressive tint buys you. Every lens in the Redcat® line clears the 120% CRF threshold." },
      { type: "table", headers: ["Setting", "What contrast does for you"], rows: [
        ["Pickleball and tennis", "The ball separates from the court instead of blending in. You acquire it sooner and track it longer."],
        ["Golf", "Reading grain, slope, and texture on a green is a contrast task."],
        ["Cycling and driving", "Road surface, debris, and brake lights resolve faster against their background."],
        ["Everyday", "Less visual work to separate what you're looking at from what's behind it, which means less fatigue over a long day outdoors."],
      ]},
      { type: "faq", items: [
        { q: "Does color vision get worse with age?", a: "Yes. The lens inside your eye yellows over time, filtering out short wavelengths and reducing color contrast. Blues and greens are affected first. It's normal, gradual, and one of the reasons contrast-enhancing lenses tend to help older athletes more than younger ones." },
        { q: "What is the difference between color blindness and age-related color vision decline?", a: "Color blindness (CVD) is usually inherited, present from birth, and involves cone cells that don't respond in the typical range. Age-related decline is a yellowing of the eye's lens that reduces contrast over decades. Different causes, different effects, different solutions." },
        { q: "Can lenses cure color blindness?", a: "No. There is no cure for inherited color vision deficiency. Hue Lens Colorboost technology is a contrast technology engineered for typical color vision, and its published methodology is calculated for an observer without CVD. If you have diagnosed CVD, an eye care professional is the right place to start." },
        { q: "Do color-enhancing lenses actually improve athletic performance?", a: "The mechanism is well established: higher color contrast means faster target acquisition and better tracking. The problem is that most brands never quantify their claims. Look for a published metric like CRF. Above 120% is the threshold for demonstrably high color contrast." },
        { q: "What is CRF?", a: "Color Resolution Factor. It measures how many visually distinguishable colors a lens transmits compared to a clear lens, which is 100% by definition. It's calculated from the lens's transmission spectrum, so it can be independently verified rather than simply asserted." },
      ]},
    ],
  },

  "pickleball-game": {
    sections: [
      { type: "lede", text: "Short answer: the best lens for pickleball is the one tuned to the color of the ball you play with. Green and yellow balls call for a green-tuned lens. Pink, red, and orange balls call for a rose-tuned lens. The reason is contrast. A lens that amplifies the ball's specific wavelengths makes it separate from the court instead of blending into it, and that separation is what your eyes convert into reaction time." },
      { type: "h2", text: "Why color vision matters on a pickleball court" },
      { type: "p", text: "Pickleball is a reaction sport. The kitchen line compresses the game into short distances and fast exchanges, so the time between seeing the ball and moving toward it is small. Anything that shortens visual acquisition shows up directly in your play." },
      { type: "p", text: "Color vision is how your eyes separate objects from their background. Specialized cells called cones handle it. Cones are less sensitive in dim light than the rods that carry your night vision, but they resolve finer detail and respond faster to change. Your ability to pick a moving ball out of a busy background is a cone job, and cones do it through color contrast." },
      { type: "h2", text: "Your color vision declines with age, and pickleball skews older" },
      { type: "p", text: "Color vision naturally declines as we age because the lens inside the eye yellows over time. A yellowing lens filters out short wavelengths, flattens contrast, and makes it harder to separate a ball from a similarly toned court surface." },
      { type: "p", text: "Pickleball's participation skews toward exactly the age range where this decline is measurable. So a large share of players are competing with a visual system that's quietly losing the contrast it needs, on a sport that punishes slow acquisition. A contrast-tuned lens isn't a luxury for those players. It's a correction." },
      { type: "h2", text: "What a color contrast lens actually does" },
      { type: "p", text: "A tinted lens and a contrast lens are not the same thing. A traditional tint accentuates the colors near its own hue and dims the ones opposite. It shifts everything you see toward the color of the lens. That's why a strong tint can make the world feel warm or cold and, over hours, cause visual fatigue." },
      { type: "p", text: "A spectrally tuned lens works differently. It targets specific wavelengths, amplifying the ones that matter for the task while preserving the rest of the color balance. Done well, you get more separation between the ball and the court without distorting everything else on the court with it. Hue Lens Colorboost technology, the lens technology in Redcat® eyewear, is engineered this way." },
      { type: "h2", text: "The number nobody else publishes" },
      { type: "p", text: "This is the part that separates a real contrast claim from marketing language. Hue.Ai's CTO Keenan Valentine, PhD, and Paul M. Karpecki, OD, FAAO, published a white paper proposing two measurable metrics for any lens:" },
      { type: "table", headers: ["Metric", "What it measures", "Benchmark"], rows: [
        ["CRF (Color Resolution Factor)", "How many distinguishable colors a lens transmits, relative to a clear lens", "Above 120% means demonstrably high color contrast"],
        ["CAF (Color Accuracy Factor)", "How accurately the lens transmits color, relative to a clear lens", "95% or above means color stays true; below 80% means the lens is significantly skewing what you see"],
      ]},
      { type: "p", text: "A clear lens scores 100% CRF by definition. A Hue Lens Colorboost example measures a CRF of 138% with a CAF of 99% — 38% more color resolution than clear glass, with essentially perfect color accuracy. A common rose-colored lens scores a CRF of 96% with a CAF of 56%: near zero net contrast gain, and noticeably distorted color. Every lens in the Redcat® line clears the 120% CRF threshold. Ask any other brand for their number." },
      { type: "h2", text: "Matching the lens to your ball" },
      { type: "table", headers: ["Lens", "Boosts", "Best for"], rows: [
        ["LumiGlo™ Outdoor", "Yellow and green wavelengths", "Hi-vis green and yellow balls in bright sun — the primary pickleball lens"],
        ["LumiGlo™ Indoor", "Yellow and green wavelengths", "Green and yellow balls indoors, on overcast days, and in flat light"],
        ["FireGlo™ Indoor", "Pinks, reds, and oranges", "Pink, red, and orange balls, and low light"],
        ["FireGlo™ Outdoor", "Pinks, reds, and oranges", "Pink, red, and orange balls in brighter conditions"],
        ["BronzeGlo™", "Broad warm-spectrum contrast", "All-around outdoor play, driving, and golf"],
        ["CarbonGlo™", "Neutral, true-color contrast", "Bright sun where you want contrast without a color cast"],
        ["PolarGlo™", "Polarized plus contrast", "Glare off wet courts and hard surfaces"],
      ]},
      { type: "p", text: "The effect is straightforward. With the right lens, the ball appears to glow against the court. You pick it up sooner, you track it longer, and you commit to your shot earlier." },
      { type: "faq", items: [
        { q: "What lens color is best for pickleball?", a: "It depends on your ball. For the standard hi-vis green or yellow ball, a green-tuned lens like LumiGlo™ gives the most separation between ball and court. For pink, red, or orange balls, a rose-tuned lens like FireGlo™ does the same job. Matching the lens to the ball's wavelength is what creates the contrast advantage." },
        { q: "Do color-enhancing sunglasses actually improve pickleball performance?", a: "The mechanism is well established: higher color contrast means faster target acquisition and better tracking. Look for a published metric like CRF. A lens above 120% CRF has demonstrably high color contrast. A brand that won't publish a number is asking you to take its word for it." },
        { q: "What is CRF, and why does it matter?", a: "CRF stands for Color Resolution Factor. It measures how many visually distinguishable colors a lens transmits compared to a clear lens. A clear lens is 100%. Above 120% is the threshold where a person can definitively perceive higher contrast. It's calculated from the lens's transmission spectrum, so it's verifiable rather than promotional." },
        { q: "Should I wear sunglasses for indoor pickleball?", a: "Indoor courts and low light are where a lighter, contrast-tuned lens earns its keep. A dark outdoor lens is the wrong tool indoors. A higher light-transmission lens tuned to your ball color increases contrast without darkening the court." },
        { q: "Does age affect my pickleball vision?", a: "Yes. The lens inside your eye yellows with age, which reduces color contrast and makes it harder to separate the ball from the background. This is a normal part of aging, and it's one of the reasons contrast-enhancing lenses tend to make a bigger difference for players over 40." },
        { q: "Are Redcat® lenses polarized?", a: "Some are. PolarGlo™ lenses are polarized and cut glare from wet courts and reflective surfaces, and they carry the same Hue Lens Colorboost technology as the rest of the line. The non-polarized lenses give you contrast without the glare filter." },
      ]},
    ],
  },

  "polarized-sunglasses": {
    sections: [
      { type: "lede", text: "Short answer: polarized lenses cut glare off flat surfaces like water, wet roads, and snow. They're excellent for fishing, boating, and driving. They're a poor choice in a cockpit, around LCD screens, and in low light. And here's the part most brands leave out: polarization does not improve color contrast. Those are two different jobs, and knowing the difference is what tells you which lens you actually need." },
      { type: "h2", text: "What polarization actually does" },
      { type: "p", text: "Glare is light that has been reflected off a flat surface and organized into horizontal waves. It's the harsh, washed-out brightness coming off a lake, a wet road, a snowfield, or a car hood. A polarized lens carries a chemical filter that blocks horizontal light waves and lets vertical ones through. The glare disappears. What's left is a calmer, more comfortable view with less squinting. That's the whole mechanism. It's a filter for one specific kind of light." },
      { type: "h2", text: "What polarization does not do" },
      { type: "p", text: "Polarization is often described as \"enhancing contrast\" or \"boosting color.\" It doesn't. Removing glare can make a scene feel sharper because you've taken away a distraction, but the lens isn't adding any color information. Color contrast comes from spectral tuning, which is a completely separate engineering problem. A lens can be polarized and still be visually flat. Most are." },
      { type: "p", text: "So the real question isn't \"polarized or not.\" It's whether your lens does both jobs." },
      { type: "h2", text: "Pros and cons" },
      { type: "table", headers: ["", ""], rows: [
        ["Cuts glare", "Off water, wet roads, snow, sand, and hoods. This is what polarization is for, and it does it well."],
        ["Reduces eye strain", "Less glare means less squinting over a long day outdoors."],
        ["LCD screens go dark", "Phones, GPS units, and dashboard displays can wash out or black out entirely at certain angles."],
        ["Too dark in low light", "A polarized lens is usually a darker lens. In overcast or dusk conditions it can take away more than it gives."],
        ["Can mask surface texture", "On snow and ice, polarization can flatten the visual cues that tell you where the slick patches are."],
      ]},
      { type: "h2", text: "When to wear polarized" },
      { type: "table", headers: ["Activity", "Why"], rows: [
        ["Fishing and boating", "Glare off water is the single best case for polarization. It also lets you see beneath the surface."],
        ["Driving", "Cuts glare off wet pavement, other vehicles, and your own hood."],
        ["Beach and open water", "Sand and water are reflective, and the relief is immediate."],
        ["Everyday wear in bright sun", "If you're glare-sensitive, polarization makes ordinary daylight more comfortable."],
      ]},
      { type: "h2", text: "When to skip polarized" },
      { type: "table", headers: ["Situation", "Why"], rows: [
        ["Flying an aircraft", "Polarized lenses interfere with cockpit instrument displays and can create artifacts in laminated windscreens."],
        ["Anything screen-heavy", "If you're constantly reading a phone, a GPS, or a dash display, polarization will fight you."],
        ["Low light and overcast", "You want light transmission, not a filter. A lighter contrast-tuned lens is the better tool."],
        ["Skiing and snowboarding", "Reading texture in snow matters more than killing glare, and polarization can hide the ice."],
        ["Dry-court racquet sports", "On a dry pickleball or tennis court there's no significant flat-surface glare to cut. What you actually need is contrast — so the ball separates from the court. A wet court is a different story."],
      ]},
      { type: "h2", text: "PolarGlo™: polarized lenses that also do the contrast job" },
      { type: "p", text: "Redcat® PolarGlo™ lenses are built on Hue Lens Colorboost technology, which means they're doing both jobs at once instead of trading one for the other. The lens inside PolarGlo™ Blue Mirror carries a 37% color boost — the highest of any lens in the Redcat® line. Our polarized lens is also our highest-contrast lens. That's the opposite of the usual tradeoff, and it's a number you can check rather than an adjective you have to trust." },
      { type: "p", text: "PolarGlo™ is available across the STRIKE and LEAP models. If your day involves water, wet roads, or long hours in bright sun, PolarGlo™ is the right lens. If you're on a dry court, look at LumiGlo™ or FireGlo™ instead — tuned to the color of your ball. Different problems, different lenses. We'd rather sell you the right one." },
      { type: "faq", items: [
        { q: "Are polarized sunglasses worth it?", a: "For water, driving, snow, and bright reflective environments, yes. Polarization solves glare better than anything else. For low light, screen-heavy work, aviation, and dry-court sports, a non-polarized contrast lens is usually the better choice. It depends entirely on what you're doing." },
        { q: "Do polarized lenses improve contrast?", a: "Not by themselves. Polarization removes glare, which can make a scene feel clearer, but it doesn't add color contrast. Color contrast comes from spectral tuning of the lens, which is a separate technology. A lens can be polarized and still transmit flat, low-contrast color. If you want both, you need a lens that's engineered for both." },
        { q: "Why can't I see my phone with polarized sunglasses?", a: "LCD screens emit polarized light. When your lens filter and the screen's polarization are misaligned, the display goes dark. Tilting your head often brings it back, which is why polarized wearers do that odd sideways tilt at a gas pump." },
        { q: "Are polarized sunglasses good for pickleball?", a: "On a dry court, not especially. There's no significant flat-surface glare to cut, and what actually helps is a lens tuned to make the ball separate from the court. On a wet court, or if you're playing into low sun, polarization earns its place. For most dry outdoor play, a contrast-tuned lens like LumiGlo™ or FireGlo™ does more for your game." },
        { q: "Are polarized lenses darker?", a: "Usually, yes. The polarizing filter reduces overall light transmission, which is part of why they're less suitable for overcast conditions and dusk. If you need contrast in low light, look for a higher light-transmission lens rather than a polarized one." },
      ]},
    ],
  },
};

/* ─── Section renderers ───────────────────────────────────────── */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-black/8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        data-testid="faq-item-toggle"
      >
        <span className="text-sm font-semibold text-gray-900 pr-4">{q}</span>
        <ChevronDown size={14} className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1">
          <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

function Section({ section }) {
  switch (section.type) {
    case "lede":
      return (
        <p className="text-base md:text-lg text-gray-800 font-semibold leading-relaxed border-l-4 border-rc-red pl-6 my-8">
          {section.text}
        </p>
      );
    case "h2":
      return (
        <h2 className="font-display font-black uppercase text-2xl md:text-3xl text-gray-900 mt-14 mb-5 leading-tight">
          {section.text}
        </h2>
      );
    case "p":
      return (
        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-5">
          {section.text}
        </p>
      );
    case "table":
      return (
        <div className="overflow-x-auto my-8 border border-black/8">
          <table className="w-full text-sm border-collapse">
            {section.headers[0] && (
              <thead>
                <tr className="bg-[#F5F0E8] border-b border-black/10">
                  {section.headers.map((h, i) => (
                    <th key={i} className="text-left px-5 py-3 text-[10px] tracking-widest uppercase text-gray-600 font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {section.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-black/5 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-5 py-3.5 text-sm align-top ${ci === 0 ? "font-semibold text-gray-900 w-[35%]" : "text-gray-500"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "faq":
      return (
        <div className="mt-14 pt-10 border-t border-black/8">
          <h2 className="font-display font-black uppercase text-2xl text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {section.items.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay } },
});

export default function BlogPost() {
  const { slug } = useParams();
  const meta = BLOG_POSTS_META.find((p) => p.slug === slug);
  const article = ARTICLES[slug];

  useSEO({
    title: meta ? `${meta.title} | Redcat Edge` : "Blog | Redcat® Eyewear",
    description: meta?.excerpt || "",
    keywords: meta?.tags.join(", ") || "",
    path: `/blog/${slug}`,
  });

  if (!meta || !article) return <Navigate to="/blog" replace />;

  const otherPosts = BLOG_POSTS_META.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="bg-white overflow-x-hidden" data-testid="blog-post-page">

      {/* Hero */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end pb-14 overflow-hidden">
        <img
          src={meta.image}
          alt={meta.title}
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 w-full">
          <motion.div variants={fadeUp()} initial="hidden" animate="visible">
            <div className="flex items-center gap-4 mb-4">
              <Link to="/blog" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors">
                <ArrowLeft size={11} /> The Redcat Edge
              </Link>
              <span className="text-white/30">·</span>
              <span className="text-white/60 text-xs">{meta.date}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/60 text-xs">{meta.readTime}</span>
            </div>
            <h1
              className="font-display font-black text-white leading-tight max-w-3xl"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)" }}
            >
              {meta.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Article body */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {article.sections.map((section, i) => (
            <Section key={i} section={section} />
          ))}

          {/* Product CTAs */}
          <div className="mt-16 pt-10 border-t border-black/8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 bg-rc-red text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors duration-200"
            >
              Shop All Models <ArrowRight size={13} />
            </Link>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 border border-black/15 text-gray-700 px-8 py-4 text-xs font-bold tracking-widest uppercase hover:border-black/30 transition-colors duration-200"
            >
              Find Your Lens <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* More from the blog */}
      {otherPosts.length > 0 && (
        <section className="py-20 px-6 bg-[#F5F0E8] border-t border-black/5">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-display font-black uppercase text-2xl text-gray-900">More from the Edge</h2>
              <Link to="/blog" className="text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5">
                All Articles <ArrowRight size={11} />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-px bg-black/5">
              {otherPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group bg-white block"
                  data-testid={`related-post-${post.slug}`}
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={post.image} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] text-gray-400 font-medium tracking-wide mb-2">{post.date} · {post.readTime}</p>
                    <h3 className="font-display font-black text-lg text-gray-900 leading-tight group-hover:text-rc-red transition-colors duration-200">{post.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
