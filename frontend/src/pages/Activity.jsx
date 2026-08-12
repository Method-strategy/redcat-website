import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Eye, Shield, Sun, Zap } from "lucide-react";
import { useProductsByActivity } from "@/hooks/useShopify";
import { useSEO } from "@/hooks/useSEO";

const FEATURE_ICONS = { eye: Eye, shield: Shield, sun: Sun, zap: Zap };
const CDN = "https://cdn.shopify.com/s/files/1/0774/1784/0936/files";

const ACTIVITY_CONFIG = {
  pickleball: {
    name: "Pickleball",
    headline: "See the Ball Like It Glows.",
    sub: "LumiGlo & FireGlo lenses",
    description: "Redcat's LumiGlo lenses amplify yellow-green tones to make the high-vis yellow ball practically glow. FireGlo lenses boost warm tones to make red, orange, or pink pickleballs really pop if those are your jam. Both are available in outdoor and indoor variants to cover your game in any light condition.",
    heroImage: "https://images.unsplash.com/photo-1756477558468-b3e485757470?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920",
    lenses: ["LumiGlo Outdoor", "LumiGlo Indoor", "FireGlo Outdoor", "FireGlo Indoor"],
    color: "#7BC743",
    featuredImages: {
      leap: `${CDN}/leap_matte_black_lumiglo_outdoor_1.jpg`,
      strike: `${CDN}/strike_matte_smoke_translucent_fireglo_indoor_1.jpg`,
    },
  },
  tennis: {
    name: "Tennis",
    headline: "Track the Ball. Win the Point.",
    sub: "LumiGlo lenses",
    description: "LumiGlo lenses boost yellow-green hues so the tennis ball stands out sharply against any court surface — clay, hard, or grass. See it sooner. React faster.",
    heroImage: "https://redcateyewear.com/cdn/shop/files/AdobeStock_321178379.jpg?crop=center&height=900&v=1721052329&width=1920",
    lenses: ["LumiGlo Outdoor", "LumiGlo Indoor"],
    color: "#C8D400",
    featuredImages: {
      leap: `${CDN}/leap_matte_black_lumiglo_outdoor_1.jpg`,
      strike: `${CDN}/strike_matte_crystal_lumiglo_outdoor_1.jpg`,
    },
  },
  cycling: {
    name: "Cycling",
    headline: "See Every Road Detail.",
    sub: "CarbonGlo lenses",
    description: "CarbonGlo is the primary lens for road cycling — sharpening aquas, greens, and blue-gray tones for road surface clarity, pothole definition, and obstacle contrast. Add PolarGlo to eliminate glare off wet roads, parked cars, and glass.",
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920",
    lenses: ["CarbonGlo", "PolarGlo"],
    color: "#00C9D4",
    featuredImages: {
      beast: `${CDN}/beast_cyan_frame_gray_with_green_oil_slick_mirror_lenses_1.jpg`,
      roar: `${CDN}/roar_matte_met_cyan_gray_green_oil_slick_mirror_1.jpg`,
      strike: `${CDN}/strike_matte_black_gray_no_mirror_1.jpg`,
    },
  },
  "mountain-biking": {
    name: "Mountain Biking",
    headline: "Read the Trail. Ride Faster.",
    sub: "BronzeGlo & FireGlo lenses",
    description: "In full sun, BronzeGlo or FireGlo Outdoor amplify warm tones to sharpen trail texture, rock hazards, and root detection. In shaded singletrack and tree canopy, switch to FireGlo Indoor — it boosts contrast without over-brightening, keeping vision calibrated through rapid light changes.",
    heroImage: "https://redcateyewear.com/cdn/shop/files/mountain-bike-cycling-and-fitness.jpg?crop=center&height=900&v=1719939492&width=1920",
    lenses: ["BronzeGlo Outdoor", "FireGlo Outdoor", "FireGlo Indoor"],
    color: "#7BC743",
    featuredImages: {
      beast: `${CDN}/Beast_Black_Frame_Brown_with_Red_Mirror_Lenses_1.jpg`,
      roar: `${CDN}/roar_matte_blk_brown_red_2_mirror_1.jpg`,
      strike: `${CDN}/strike_matte_smoke_translucent_fireglo_indoor_1.jpg`,
    },
    featuresSub: "Trail Vision Science",
    featuresTitle: "Lens Choice by Light Condition",
    featuresAccent: "#7BC743",
    stats: [["Full Sun", "BronzeGlo Outdoor"], ["Low Light", "FireGlo Indoor"], ["TR-90", "Impact-flex frame"], ["CE / ISO", "Certified performance"]],
    features: [
      { icon: "sun", title: "Full Sun: BronzeGlo", body: "BronzeGlo amplifies warm amber tones, sharpening rock textures, root hazards, and dirt trail definition under direct sunlight." },
      { icon: "zap", title: "Full Sun: FireGlo Outdoor", body: "FireGlo Outdoor boosts reds, oranges, and earthy tones — particularly effective on red dirt, sandstone, and exposed trail surfaces." },
      { icon: "shield", title: "Shaded Trails: FireGlo Indoor", body: "Under dense tree canopy, FireGlo Indoor enhances contrast in low-light without the tint of an outdoor lens — vision stays sharp when the trail goes dark." },
      { icon: "eye", title: "Rapid Light Changes", body: "Redcat's non-polarized lenses avoid the blinding effect polarized lenses cause on wet roots and glossy rocks — critical for fast trail reading." },
    ],
  },
  golf: {
    name: "Golf",
    headline: "Read Every Green. Track Every Ball.",
    sub: "CarbonGlo lenses",
    description: "CarbonGlo lenses amplify aqua and green tones so you're reading the course — not guessing at it. Ball tracking against the sky snaps into focus, fairway detail sharpens, and every green's grain is yours to read. Add PolarGlo to eliminate glare off the water and wet fairway and you're playing with an unfair advantage.",
    heroImage: "https://images.unsplash.com/photo-1611374243147-44a702c2d44c?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1920",
    lenses: ["CarbonGlo", "PolarGlo"],
    color: "#00C9D4",
    featuredImages: {
      beast: `${CDN}/beast_cyan_frame_gray_with_green_oil_slick_mirror_lenses_1.jpg`,
      roar: `${CDN}/roar_matte_met_green_gray_blue_mirror_1.jpg`,
      strike: `${CDN}/strike_matte_tortoise_gray_no_mirror_1.jpg`,
    },
  },
  outdoors: {
    name: "Outdoors",
    headline: "See More. Go Further.",
    sub: "All Redcat lenses",
    description: "Color vision fades as you age — Redcat® slows that down. Whether you're out on the trail, behind the wheel, or just living wide open, our lenses restore the contrast and vibrancy your eyes have been quietly losing. The world looks the way it used to. Maybe better.",
    heroImage: "https://redcateyewear.com/cdn/shop/files/Redcat_BEAST_Aron_in_the_Wild.png?crop=center&height=900&v=1764667927&width=1920",
    lenses: ["BronzeGlo", "CarbonGlo", "PolarGlo"],
    color: "#D90012",
    featuredImages: {
      beast: `${CDN}/beast_red_frame_brown_with_red_mirror_lenses_1.jpg`,
      roar: `${CDN}/roar_matt_met_red_brown_red_mirror_1.jpg`,
    },
  },
  driving: {
    name: "Driving",
    headline: "See Every Hazard. React Faster.",
    sub: "BronzeGlo lenses",
    description: "BronzeGlo lenses amplify warm amber tones — sharpening contrast on road markings, signage, and hazards in low-angle sun, overcast skies, and dawn/dusk conditions. PolarGlo eliminates windshield glare entirely. See further. React sooner. Drive safer.",
    heroImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1920",
    lenses: ["BronzeGlo", "PolarGlo"],
    color: "#C8812E",
    featuredImages: {
      beast: `${CDN}/beast_cyan_frame_brown_with_red_mirror_lenses_1.jpg`,
      roar: `${CDN}/roar_matte_met_cyan_brown_red_mirror_v2_1.jpg`,
      strike: `${CDN}/strike_matte_black_brown_no_mirror_1.jpg`,
    },
    featuresSub: "BronzeGlo Science",
    featuresTitle: "Why BronzeGlo Wins on the Road",
    featuresAccent: "#C8812E",
    stats: [["30%", "Earlier hazard detection"], ["UV400", "Full spectrum protection"], ["PolarGlo", "Glare-free driving"], ["CE / ISO", "Certified performance"]],
    features: [
      { icon: "eye", title: "Low-Angle Sun Glare", body: "BronzeGlo cuts through the blinding low-angle sun of early morning and late afternoon driving — the most dangerous light condition on the road." },
      { icon: "shield", title: "Hazard Contrast Boost", body: "Warm amber tones amplify road markings, orange cones, brake lights, and pedestrian hi-vis vests — making hazards visible up to 30% sooner." },
      { icon: "sun", title: "All-Conditions Clarity", body: "From overcast highways to high-noon glare, BronzeGlo maintains consistent contrast so your eyes aren't constantly adapting." },
      { icon: "zap", title: "PolarGlo Glare Elimination", body: "Add PolarGlo polarized lenses to eliminate reflective glare off wet roads, hoods, and windshields — the #1 cause of driver fatigue." },
    ],
  },
};

const STATIC_PRODUCTS = [
  { id: "1", handle: "beast", title: "Beast", priceRange: { minVariantPrice: { amount: "204.99" } }, images: [{ url: `${CDN}/beast_red_frame_brown_with_red_mirror_lenses_1.jpg` }] },
  { id: "2", handle: "roar", title: "Roar", priceRange: { minVariantPrice: { amount: "184.99" } }, images: [{ url: `${CDN}/roar_matte_met_cyan_gray_green_oil_slick_mirror_1.jpg` }] },
  { id: "3", handle: "leap", title: "Leap", priceRange: { minVariantPrice: { amount: "144.99" } }, images: [{ url: `${CDN}/leap_matte_metallic_red_gray_polar_blue_mirror_1.jpg` }] },
  { id: "4", handle: "strike", title: "Strike", priceRange: { minVariantPrice: { amount: "119.99" } }, images: [{ url: `${CDN}/strike_matte_tortoise_gray_polar_green_mirror_1.jpg` }] },
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay } },
});

export default function Activity() {
  const { activity } = useParams();
  const config = ACTIVITY_CONFIG[activity] || ACTIVITY_CONFIG.outdoors;
  const { products: liveProducts, isLoading } = useProductsByActivity(activity);
  const LUMIGLO_HANDLES = ["strike", "leap"];
  const allProducts = !isLoading && liveProducts.length > 0 ? liveProducts : STATIC_PRODUCTS;
  const displayProducts = (activity === "pickleball" || activity === "tennis")
    ? allProducts.filter((p) => LUMIGLO_HANDLES.includes(p.handle))
    : allProducts;

  useSEO({
    title: `${config.name} Sunglasses | Redcat® ${config.lenses[0]} Lenses`,
    description: config.description,
    keywords: `${config.name.toLowerCase()} sunglasses, ${config.name.toLowerCase()} eyewear, ${config.lenses.join(", ").toLowerCase()}, sport sunglasses`,
    image: config.heroImage,
    path: `/activities/${activity}`,
  });

  // Pick the best product image for this activity's lens context
  const getActivityImage = (product) =>
    config.featuredImages?.[product.handle] || product.images?.[0]?.url || "";

  return (
    <div className="bg-white" data-testid="activity-page">
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
          {config.headline && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42 }}
              className="font-display text-xl md:text-2xl font-bold uppercase tracking-wider mt-3"
              style={{ color: config.color || "#D90012" }}
            >
              {config.headline}
            </motion.p>
          )}
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

      {/* Recommended lenses bar */}
      <div className="bg-[#F5F0E8] border-y border-black/8 py-5 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center gap-4">
          <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Recommended Lenses:</span>
          {config.lenses.map((lens) => (
            <span
              key={lens}
              className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 border border-black/10 text-gray-600 bg-white"
            >
              {lens}
            </span>
          ))}
        </div>
      </div>

      {/* Activity features block (dark — editorial) */}
      {config.features && (
        <section className="py-20 px-6 bg-[#060606]" data-testid="activity-features">
          <div className="max-w-screen-xl mx-auto">
            <motion.div
              variants={fadeUp()}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="mb-14"
            >
              <span
                className="text-xs font-bold tracking-[0.3em] uppercase mb-3 block"
                style={{ color: config.featuresAccent || config.color }}
              >
                {config.featuresSub || "Lens Science"}
              </span>
              <h2
                className="font-display font-black uppercase leading-tight text-white"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
              >
                {config.featuresTitle || `Why ${config.name} Demands Better Lenses`}
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
              {config.features.map((feat, i) => {
                const Icon = FEATURE_ICONS[feat.icon] || Eye;
                return (
                  <motion.div
                    key={feat.title}
                    variants={fadeUp(i * 0.1)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="bg-[#0D0D0D] p-8"
                  >
                    <Icon size={22} className="mb-5" style={{ color: config.featuresAccent || config.color }} />
                    <h3 className="font-display text-lg font-black uppercase tracking-wider text-white mb-3">{feat.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{feat.body}</p>
                  </motion.div>
                );
              })}
            </div>

            {config.stats && (
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
                {config.stats.map(([val, label]) => (
                  <div key={label} className="bg-[#0D0D0D] px-8 py-7 text-center">
                    <p className="font-display text-4xl font-black" style={{ color: config.featuresAccent || config.color }}>{val}</p>
                    <p className="text-[10px] text-white/45 uppercase tracking-widest mt-2">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

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
            className="font-display font-black uppercase leading-tight text-gray-900"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Models for {config.name}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/5">
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.id || product.handle}
              variants={fadeUp(i * 0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-white group"
            >
              <Link
                to={`/products/${product.handle}`}
                data-testid={`activity-product-${product.handle}`}
              >
                <div className="product-img-wrap aspect-square overflow-hidden bg-[#FAFAFA] flex items-center justify-center p-4">
                  <img
                    src={getActivityImage(product)}
                    alt={product.images?.[0]?.altText || product.title}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 border-t border-black/5">
                  <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1">Redcat Eyewear</p>
                  <h3 className="font-display text-2xl font-black uppercase tracking-wider text-gray-900 group-hover:text-rc-red transition-colors duration-200">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-500">
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
