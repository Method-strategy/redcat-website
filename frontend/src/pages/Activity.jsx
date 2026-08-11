import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useProductsByActivity } from "@/hooks/useShopify";
import { useSEO } from "@/hooks/useSEO";

const ACTIVITY_CONFIG = {
  pickleball: {
    name: "Pickleball",
    headline: "See the Ball Like It Glows.",
    sub: "LumiGlo & FireGlo lenses",
    description: "Our LumiGlo lenses boost high-visibility green balls by up to 35%, making them practically glow. FireGlo amplifies pink, orange, and red balls by up to 30%. Both available in indoor and outdoor options.",
    heroImage: "https://redcateyewear.com/cdn/shop/files/LEAP_Pickleball_-_Dark_Blue_with_Dark_Green_Lenses_3840x2160_12ac36d4-ede4-4785-811b-4ac3d3ec569c.jpg?crop=center&height=900&v=1713192324&width=1920",
    lenses: ["LumiGlo Outdoor", "LumiGlo Indoor", "FireGlo Outdoor", "FireGlo Indoor"],
    color: "#7BC743",
  },
  tennis: {
    name: "Tennis",
    headline: "Track the Ball. Win the Point.",
    sub: "LumiGlo lenses",
    description: "LumiGlo lenses boost yellow-green hues so the tennis ball stands out sharply against any court surface — clay, hard, or grass. See it sooner. React faster.",
    heroImage: "https://redcateyewear.com/cdn/shop/files/AdobeStock_321178379.jpg?crop=center&height=900&v=1721052329&width=1920",
    lenses: ["LumiGlo Outdoor", "LumiGlo Indoor"],
    color: "#C8D400",
  },
  cycling: {
    name: "Cycling",
    headline: "See Every Road Detail.",
    sub: "CarbonGlo & BronzeGlo lenses",
    description: "CarbonGlo boosts cool tones — aquas, greens, and blue-gray — perfect for road and trail visibility. BronzeGlo amplifies warm tones, sharpening hazard detection. Add PolarGlo for glare elimination.",
    heroImage: "https://redcateyewear.com/cdn/shop/files/mountain-bike-cycling-and-fitness.jpg?crop=center&height=900&v=1719939492&width=1920",
    lenses: ["CarbonGlo", "BronzeGlo", "PolarGlo"],
    color: "#00C9D4",
  },
  "mountain-biking": {
    name: "Mountain Biking",
    headline: "Read the Trail. Ride Faster.",
    sub: "CarbonGlo lenses",
    description: "CarbonGlo enhances trail visibility by boosting greens, aquas, and terrain contrast so you can read the trail farther ahead. Our AirFlo vent system keeps vision clear on extended climbs.",
    heroImage: "https://redcateyewear.com/cdn/shop/files/mountain-bike-cycling-and-fitness.jpg?crop=center&height=900&v=1719939492&width=1920",
    lenses: ["CarbonGlo", "BronzeGlo"],
    color: "#7BC743",
  },
  golf: {
    name: "Golf",
    headline: "Track Every Shot.",
    sub: "CarbonGlo lenses",
    description: "CarbonGlo boosts green-aqua tones for exceptional course visibility, ball tracking against the sky, and hazard definition. See the grain on every green.",
    heroImage: "https://images.unsplash.com/photo-1611374243147-44a702c2d44c?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
    lenses: ["CarbonGlo", "PolarGlo"],
    color: "#00C9D4",
  },
  outdoors: {
    name: "Outdoors",
    headline: "See More. Go Further.",
    sub: "All Redcat lenses",
    description: "Whether you're hiking, driving, or just living life, Redcat® color-tuned lenses counteract the natural decline in color vision, restoring vibrancy and contrast to everything you see.",
    heroImage: "https://redcateyewear.com/cdn/shop/files/Redcat_BEAST_Aron_in_the_Wild.png?crop=center&height=900&v=1764667927&width=1920",
    lenses: ["BronzeGlo", "CarbonGlo", "PolarGlo"],
    color: "#D90012",
  },
};

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay } },
});

const CDN = "https://cdn.shopify.com/s/files/1/0774/1784/0936/files";
const STATIC_PRODUCTS = [
  { id: "1", handle: "beast", title: "Beast", priceRange: { minVariantPrice: { amount: "204.99" } }, images: [{ url: `${CDN}/beast_red_frame_brown_with_red_mirror_lenses_1.jpg` }] },
  { id: "2", handle: "roar", title: "Roar", priceRange: { minVariantPrice: { amount: "184.99" } }, images: [{ url: `${CDN}/roar_matte_met_cyan_gray_green_oil_slick_mirror_1.jpg` }] },
  { id: "3", handle: "leap", title: "Leap", priceRange: { minVariantPrice: { amount: "144.99" } }, images: [{ url: `${CDN}/leap_matte_metallic_red_gray_polar_blue_mirror_1.jpg` }] },
  { id: "4", handle: "strike", title: "Strike", priceRange: { minVariantPrice: { amount: "119.99" } }, images: [{ url: `${CDN}/strike_matte_tortoise_gray_polar_green_mirror_1.jpg` }] },
];

export default function Activity() {
  const { activity } = useParams();
  const config = ACTIVITY_CONFIG[activity] || ACTIVITY_CONFIG.outdoors;
  const { products: liveProducts, isLoading } = useProductsByActivity(activity);
  const displayProducts = !isLoading && liveProducts.length > 0 ? liveProducts : STATIC_PRODUCTS;

  useSEO({
    title: `${config.name} Sunglasses | Redcat® ${config.lens.split("&")[0].trim()} Lenses`,
    description: config.description,
    keywords: `${config.name.toLowerCase()} sunglasses, ${config.name.toLowerCase()} eyewear, ${config.lenses.join(", ").toLowerCase()}, sport sunglasses`,
    image: config.heroImage,
    path: `/activities/${activity}`,
  });

  return (
    <div className="bg-white dark:bg-rc-dark" data-testid="activity-page">
      {/* Hero */}
      <section className="relative h-[75vh] min-h-[520px] flex items-end overflow-hidden pt-[var(--navbar-h)]">
        <img src={config.heroImage} alt={config.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 pb-14 w-full">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="w-6 h-px bg-rc-red" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">{config.sub}</span>
          </motion.div>
          <div className="line-mask">
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="font-display font-black uppercase text-white leading-[0.9]"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              {config.name}
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-base text-white/55 mt-5 max-w-lg leading-relaxed"
          >
            {config.description}
          </motion.p>
        </div>
      </section>

      {/* Recommended lenses */}
      <div className="bg-[#FAFAFA] dark:bg-rc-surface border-y border-black/10 dark:border-white/10 py-5 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center gap-4">
          <span className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-white/30">Recommended Lenses:</span>
          {config.lenses.map((lens) => (
            <span
              key={lens}
              className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 border border-black/10 dark:border-white/15 text-gray-600 dark:text-white/70"
            >
              {lens}
            </span>
          ))}
        </div>
      </div>

      {/* Products */}
      <section className="py-20 px-6 max-w-screen-xl mx-auto">
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-10"
        >
          <h2
            className="font-display font-black uppercase leading-tight text-gray-900 dark:text-white"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Models for {config.name}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/5 dark:bg-white/8">
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.id || product.handle}
              variants={fadeUp(i * 0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-white dark:bg-rc-dark group"
            >
              <Link
                to={`/products/${product.handle}`}
                data-testid={`activity-product-${product.handle}`}
              >
                <div className="product-img-wrap aspect-square overflow-hidden bg-white dark:bg-rc-surface flex items-center justify-center p-4">
                  <img
                    src={product.images?.[0]?.url || ""}
                    alt={product.images?.[0]?.altText || product.title}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 border-t border-black/5 dark:border-white/8">
                  <h3 className="font-display text-2xl font-black uppercase tracking-wider text-gray-900 dark:text-white group-hover:text-rc-red transition-colors duration-200">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-500 dark:text-white/50">
                      From ${parseFloat(product.priceRange?.minVariantPrice?.amount || 0).toFixed(2)}
                    </p>
                    <ArrowRight size={14} className="text-rc-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
