import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export const BLOG_POSTS_META = [
  {
    slug: "pickleball-eye-safety",
    title: "Pickleball Eye Injuries Are Real. Here's What Actually Protects You.",
    date: "August 14, 2024",
    excerpt: "Pickleball puts a hard plastic ball and a swinging paddle in a small court at close range. The eye is the one part of your face with no bone in front of it. Here's what actually protects you.",
    image: "https://redcateyewear.com/cdn/shop/articles/injuryed_man_on_court_2_fdbe364c-70cb-488c-9b83-83ee55e0637c.jpg?crop=center&height=800&v=1783973764&width=1600",
    tags: ["Eye Safety", "Pickleball", "Polycarbonate"],
    readTime: "7 min read",
  },
  {
    slug: "enhancing-color-vision",
    title: "How Color Vision Works, Why It Fades, and What You Can Do About It.",
    date: "August 2, 2024",
    excerpt: "Color vision is how your eyes separate objects from their backgrounds — and it declines with age. A spectrally tuned lens can restore some of what you've lost, especially for players over 40.",
    image: "https://redcateyewear.com/cdn/shop/articles/Enhancing_Color_Vision_post_9c963ac7-c7e4-4652-b802-a60d9d98efb9.jpg?crop=center&height=800&v=1783973921&width=1600",
    tags: ["Color Vision", "Technology", "Science"],
    readTime: "8 min read",
  },
  {
    slug: "pickleball-game",
    title: "The Best Lens Color for Pickleball: What the Science Actually Says",
    date: "July 30, 2024",
    excerpt: "The best lens for pickleball is the one tuned to the color of the ball you play with. Yellow balls — use LumiGlo™. Pink or orange — FireGlo™. Here's why, with the numbers to back it up.",
    image: "https://redcateyewear.com/cdn/shop/articles/Pickleball_Game_post_77fc65c8-3d27-45f3-b1c9-fc8fefd67095.webp?crop=center&height=800&v=1783972981&width=1600",
    tags: ["Pickleball", "Lenses", "LumiGlo", "FireGlo"],
    readTime: "9 min read",
  },
  {
    slug: "polarized-sunglasses",
    title: "Polarized Lenses: When They Help, When They Hurt, and What They Don't Do",
    date: "August 1, 2024",
    excerpt: "Polarized lenses cut glare off flat surfaces. They're excellent for fishing, boating, and driving — and a poor choice on a dry pickleball court. Here's when to reach for them and when not to.",
    image: "https://redcateyewear.com/cdn/shop/articles/Redcat_PolarGlo_Lenses_8f08bff5-cfc6-436b-b204-9de148acf88e.jpg?crop=center&height=800&v=1783973296&width=1600",
    tags: ["PolarGlo", "Polarized", "Glare"],
    readTime: "8 min read",
  },
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay } },
});

export default function Blog() {
  useSEO({
    title: "Redcat Edge Blog | Sport Eyewear Science & Performance Guides",
    description: "The Redcat Edge — deep dives into lens science, color vision, eye safety, and sport performance. Built for serious athletes who want to understand their gear.",
    keywords: "pickleball eye safety, color vision, polarized sunglasses, lens color pickleball, sport eyewear science",
    path: "/blog",
  });

  return (
    <div className="bg-white overflow-x-hidden" data-testid="blog-index-page">

      {/* Hero */}
      <section className="pt-[calc(var(--navbar-h)+5rem)] pb-16 px-6 border-b border-black/5">
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUp()} initial="hidden" animate="visible">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">The Redcat Edge</span>
            <h1
              className="font-display font-black uppercase leading-[0.9] text-gray-900 mt-2"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
            >
              Science.<br />Sport.<br />
              <span className="text-rc-red">Edge.</span>
            </h1>
          </motion.div>
          <motion.p
            variants={fadeUp(0.2)}
            initial="hidden"
            animate="visible"
            className="text-gray-500 text-sm mt-5 max-w-xl leading-relaxed"
          >
            Deep dives into lens science, color vision, eye safety, and sport performance. For players who want to understand exactly why their gear works.
          </motion.p>
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-2 gap-px bg-black/5">
            {BLOG_POSTS_META.map((post, i) => (
              <motion.article
                key={post.slug}
                variants={fadeUp(i * 0.08)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="bg-white group"
                data-testid={`blog-card-${post.slug}`}
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium tracking-wide">
                        <Calendar size={10} />
                        <span>{post.date}</span>
                      </div>
                      <span className="text-[10px] text-gray-300">·</span>
                      <span className="text-[10px] text-gray-400 font-medium tracking-wide">{post.readTime}</span>
                    </div>
                    <h2 className="font-display font-black text-xl text-gray-900 leading-tight group-hover:text-rc-red transition-colors duration-200 mb-3">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] font-semibold tracking-widest uppercase text-rc-red border border-rc-red/20 px-2.5 py-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-gray-400 group-hover:text-rc-red transition-colors">
                        Read <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-16 px-6 bg-[#F5F0E8] border-t border-black/5">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-black uppercase text-2xl text-gray-900">Find Your Lens</h3>
            <p className="text-sm text-gray-500 mt-1">Take the 60-second sport quiz and get a precise recommendation.</p>
          </div>
          <Link
            to="/quiz"
            className="inline-flex items-center gap-2 bg-rc-red text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors duration-200 whitespace-nowrap"
          >
            Find Your Redcats <ArrowRight size={13} />
          </Link>
        </div>
      </section>
    </div>
  );
}
