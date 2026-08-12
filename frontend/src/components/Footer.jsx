import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const footerLinks = {
  SHOP: [
    { label: "All Products", href: "/collections" },
    { label: "Beast", href: "/products/beast" },
    { label: "Roar", href: "/products/roar" },
    { label: "Leap", href: "/products/leap" },
    { label: "Strike", href: "/products/strike" },
  ],
  ACTIVITIES: [
    { label: "Pickleball", href: "/activities/pickleball" },
    { label: "Tennis", href: "/activities/tennis" },
    { label: "Cycling", href: "/activities/cycling" },
    { label: "Mountain Biking", href: "/activities/mountain-biking" },
    { label: "Golf", href: "/activities/golf" },
    { label: "Driving", href: "/activities/driving" },
  ],
  SUPPORT: [
    { label: "Brand Story", href: "/brand" },
    { label: "Find Your Redcats", href: "/quiz" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Warranty & Returns", href: "/warranty-and-returns" },
    { label: "Contact Us", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#060606] border-t border-white/8 pt-20 pb-10" data-testid="footer">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <Logo size="lg" />
            <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-xs">
              Performance sport sunglasses engineered with color-tuned lens technology. See the ball like it glows. Made in Italy.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://redcateyewear.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-rc-red text-white text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-rc-red transition-colors duration-200"
                data-testid="footer-shop-cta"
              >
                Shop Now
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/60 mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/55 tracking-wide">
            &copy; {new Date().getFullYear()} Redcat® Eyewear. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-white/55">CE Certified</span>
            <span className="text-xs text-white/55">Made in Italy</span>
            <span className="text-xs text-white/55">Lifetime Warranty</span>
            <span className="text-xs text-white/55">UV400</span>
          </div>
        </div>
        <p className="text-[10px] text-white/40 mt-5 leading-relaxed max-w-2xl">
          LumiGlo, FireGlo, BronzeGlo, CarbonGlo, and PolarGlo are trademarks of Redcat® Eyewear. Beast, Roar, Leap, and Strike are product names of Redcat® Eyewear. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
