import { Link } from "react-router-dom";

const footerLinks = {
  SHOP: [
    { label: "All Products", href: "/collections" },
    { label: "BEAST™", href: "/products/beast" },
    { label: "ROAR™", href: "/products/roar" },
    { label: "LEAP™", href: "/products/leap" },
    { label: "STRIKE™", href: "/products/strike" },
  ],
  ACTIVITIES: [
    { label: "Pickleball", href: "/activities/pickleball" },
    { label: "Tennis", href: "/activities/tennis" },
    { label: "Cycling", href: "/activities/cycling" },
    { label: "Mountain Biking", href: "/activities/mountain-biking" },
    { label: "Golf", href: "/activities/golf" },
  ],
  SUPPORT: [
    { label: "Brand Story", href: "/brand" },
    { label: "FAQ", href: "https://redcateyewear.com/pages/faq" },
    { label: "Warranty & Returns", href: "https://redcateyewear.com/pages/warranty-and-returns" },
    { label: "Customer Support", href: "https://redcateyewear.com/pages/contact" },
    { label: "Blog", href: "https://redcateyewear.com/blogs/redcat-edge" },
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
            <Link to="/" className="font-display text-3xl font-black tracking-widest uppercase text-white">
              REDCAT<span className="text-rc-red">®</span>
            </Link>
            <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-xs">
              Elite performance eyewear with color-tuned lens technology. See faster. Be faster. Made in Italy.
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
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4">{section}</h4>
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
          <p className="text-xs text-white/30 tracking-wide">
            &copy; {new Date().getFullYear()} Redcat Eyewear. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-white/30">CE Certified</span>
            <span className="text-xs text-white/30">Made in Italy</span>
            <span className="text-xs text-white/30">Lifetime Warranty</span>
            <span className="text-xs text-white/30">UV400</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
