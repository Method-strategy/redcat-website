import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay } },
});

const WARRANTY_SECTIONS = [
  {
    title: "What's Covered",
    body: "Redcat Eyewear LLC (\"Redcat\") warrants to the original purchaser that Redcat® eyewear products will be free from defects in materials and workmanship for the lifetime of the product under normal use and service.",
  },
  {
    title: "What's Not Covered",
    body: "This warranty does not cover damage caused by accident, misuse, abuse, negligence, normal wear and tear, or unauthorized repair or modification.",
  },
  {
    title: "How to Make a Claim",
    body: "If you believe your Redcat® eyewear has a defect covered by this warranty, contact Redcat Customer Support at support@redcateyewear.com or (678) 208-8232. You will be asked to provide proof of purchase and a description of the defect. Redcat will determine, in its sole discretion, whether the product is covered by the warranty and, if so, whether to repair or replace the product.",
  },
  {
    title: "Sole Remedy",
    body: "If a product is determined to be defective and covered by this warranty, Redcat's sole obligation and your sole remedy will be the repair or replacement of the product, at Redcat's option. Redcat will not be liable for any incidental, consequential, or special damages arising from the use or inability to use the product.",
  },
  {
    title: "Warranty Limitations",
    body: "This warranty is non-transferable and applies only to products purchased from our online store at redcateyewear.com or authorized Redcat® retailers. This warranty gives you specific legal rights, and you may also have other rights which vary from state to state.",
  },
  {
    title: "Disclaimer",
    body: "EXCEPT AS EXPRESSLY PROVIDED IN THIS WARRANTY, REDCAT MAKES NO OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.",
  },
  {
    title: "Governing Law",
    body: "This warranty shall be governed by and construed in accordance with the laws of the State of Georgia, without regard to its conflict of laws provisions.",
  },
];

export default function WarrantyReturns() {
  useSEO({
    title: "Warranty & Returns | Redcat® Eyewear",
    description: "Redcat® offers a limited lifetime warranty against manufacturer's defects to the original owner. Learn how to make a claim.",
    keywords: "redcat warranty, eyewear returns, lifetime warranty sport sunglasses",
    path: "/warranty-and-returns",
  });

  return (
    <div className="bg-white overflow-x-hidden" data-testid="warranty-page">

      {/* Hero */}
      <section className="pt-[calc(var(--navbar-h)+5rem)] pb-20 px-6 border-b border-black/5">
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUp()} initial="hidden" animate="visible" className="flex items-start gap-5">
            <div className="hidden sm:flex w-14 h-14 bg-[#F5F0E8] items-center justify-center flex-shrink-0 mt-2">
              <Shield size={24} className="text-rc-red" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">Support</span>
              <h1
                className="font-display font-black uppercase leading-[0.9] text-gray-900 mt-2"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
              >
                Warranty<br />&amp; Returns
              </h1>
            </div>
          </motion.div>

          {/* Short-form warranty callout */}
          <motion.div
            variants={fadeUp(0.15)}
            initial="hidden"
            animate="visible"
            className="mt-10 bg-[#F5F0E8] px-8 py-7 max-w-2xl"
          >
            <p className="text-[10px] font-bold tracking-widest uppercase text-rc-red mb-2">The Short Version</p>
            <p className="text-lg font-semibold text-gray-900 leading-snug">
              Lifetime warranty to the original owner against any manufacturer's defects for the life of your Redcat® Eyewear.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Full Warranty */}
      <section className="py-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="lg:grid lg:grid-cols-3 gap-16">

            {/* Sidebar */}
            <motion.div
              variants={fadeUp()}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-1 mb-12 lg:mb-0"
            >
              <div className="sticky top-[calc(var(--navbar-h)+2rem)]">
                <h2 className="font-display font-black uppercase text-lg text-gray-900 mb-5">Contents</h2>
                <ul className="space-y-2">
                  {WARRANTY_SECTIONS.map((s) => (
                    <li key={s.title}>
                      <a
                        href={`#${s.title.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-xs text-gray-500 hover:text-rc-red transition-colors font-medium tracking-wide"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 pt-8 border-t border-black/8">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">Make a Claim</p>
                  <a
                    href="mailto:support@redcateyewear.com"
                    className="block text-sm font-semibold text-rc-red hover:text-gray-900 transition-colors mb-1"
                  >
                    support@redcateyewear.com
                  </a>
                  <a
                    href="tel:+16782088232"
                    className="block text-sm font-semibold text-gray-700 hover:text-rc-red transition-colors"
                  >
                    (678) 208-8232
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Warranty content */}
            <div className="lg:col-span-2">
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Redcat Eyewear LLC</p>
              <h2 className="font-display font-black uppercase text-2xl text-gray-900 mb-8">Limited Lifetime Warranty Against Manufacturer's Defects</h2>

              <div className="space-y-10">
                {WARRANTY_SECTIONS.map((s, i) => (
                  <motion.div
                    key={s.title}
                    id={s.title.toLowerCase().replace(/\s+/g, "-")}
                    variants={fadeUp(i * 0.05)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="border-l-2 border-black/8 pl-6"
                  >
                    <h3 className="font-display font-black uppercase text-base tracking-widest text-gray-900 mb-3">{s.title}</h3>
                    <p className={`text-sm leading-relaxed ${s.title === "Disclaimer" ? "text-gray-400 text-xs uppercase tracking-wide" : "text-gray-600"}`}>
                      {s.body}
                    </p>
                  </motion.div>
                ))}

                {/* Contact info */}
                <motion.div
                  variants={fadeUp(0.3)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="border border-black/8 p-7 mt-4"
                >
                  <p className="text-[10px] font-bold tracking-widest uppercase text-rc-red mb-3">Contact Information</p>
                  <p className="text-sm font-semibold text-gray-900">Redcat Eyewear LLC</p>
                  <p className="text-sm text-gray-500 mt-1">890 Fox Meadow Ln</p>
                  <p className="text-sm text-gray-500">Lawrenceville, GA 30043</p>
                  <div className="mt-4 space-y-1">
                    <a href="tel:+16782088232" className="block text-sm text-gray-700 hover:text-rc-red transition-colors font-medium">
                      (678) 208-8232
                    </a>
                    <a href="mailto:support@redcateyewear.com" className="block text-sm text-rc-red hover:text-gray-900 transition-colors font-medium">
                      support@redcateyewear.com
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* CTA */}
              <motion.div
                variants={fadeUp(0.35)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-12 flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-rc-red text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors"
                >
                  Contact Support <ArrowRight size={13} />
                </Link>
                <Link
                  to="/faq"
                  className="inline-flex items-center gap-2 border border-black/12 text-gray-700 px-8 py-4 text-xs font-bold tracking-widest uppercase hover:border-black/25 transition-colors"
                >
                  View FAQ <ArrowRight size={13} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
