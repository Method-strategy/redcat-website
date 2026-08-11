# Redcat Eyewear — Full Site Rebuild PRD

## Original Problem Statement
Complete website rebuild for redcateyewear.com, originally a Shopify site. Intent is to ultimately migrate to Astro SSG + Shopify Headless for optimal SEO, AI search, and performance.

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Framer Motion (animations) + Lenis (smooth scroll)
- **Backend**: FastAPI + MongoDB (newsletter subscribers, proxy for Shopify API)
- **Shopify**: Storefront API proxy — static fallback active (token needs upgrading)
- **Font**: Barlow Condensed (display) + DM Sans (body) — Google Fonts
- **Design**: Near-black bg (#0A0A0A), brand red (#D90012), cyan (#00C9D4)

## Pages Implemented
- `/` — Homepage (hero, marquee, ColorBoost feature, products grid, manifesto, activities, Italy section, newsletter)
- `/brand` — Brand story (hero, pillars, tech feature, lens guide, Italy split)
- `/products/:handle` — Product detail (gallery, variant selectors, Add to Cart, specs tabs)
- `/activities/:activity` — Activity pages (pickleball, tennis, cycling, mountain-biking, golf)
- `/collections` — All products with activity filter tabs

## Components
- Navbar (glass, sticky, dropdowns, mobile menu)
- CartDrawer (Framer Motion slide-in, quantity controls)
- CartContext (Shopify cart state, localStorage persistence)
- Footer (links grid, brand certifications)

## Shopify Integration Status
- **Products API**: Static fallback active (BEAST, ROAR, LEAP, STRIKE)
- **Cart API**: Requires valid Storefront API public access token
- **Store domain**: abf950-4.myshopify.com (found via page source)
- **Current token**: 303a91a885eb4c3811b4b8ae068c7234 → returns UNAUTHORIZED
- **Fix needed**: In Shopify Admin → Apps → Headless → generate Storefront API public access token

## Astro Migration Path (Optimal for SEO/AI Search)
- Astro SSG generates static HTML read by GPT, Perplexity, Gemini crawlers
- Product JSON-LD schema injected server-side (name, price, availability, reviews)
- 0KB JS by default, interactive islands for cart/filters
- Shopify Storefront API data fetched at build time via getStaticPaths()
- Deploy to Cloudflare Pages / Vercel Edge for < 100ms global loads
- Component migration: React → Astro components (1:1 mapping)
- Cart, Navbar = Astro islands with client:load directive

## What Was Implemented (Feb 2026)
- [x] Full site rebuild with all pages
- [x] Awwwards-level hero with Framer Motion kinetic text reveal
- [x] Editorial marquee with CSS animation
- [x] Real Shopify CDN product photography
- [x] Numbered technology manifesto sections
- [x] Activity-based product filtering
- [x] Cart drawer with Framer Motion
- [x] Newsletter subscription (MongoDB storage)
- [x] Static product data fallback
- [x] Lenis smooth scrolling
- [x] Parallax hero via useScroll + useTransform
- [x] Responsive design (mobile menu, responsive grid)

## Backlog
### P0 (Blocking for Production)
- Get proper Shopify Storefront API public access token
- Wire up live cart/checkout flow
- Add Shopify product images as variants change

### P1 (High Value)
- Astro SSG migration
- Product JSON-LD schema (SEO)
- Page transition animations between routes
- Product image zoom on hover/click
- Lens selector visual guide on product page

### P2 (Nice to Have)
- Wishlist/favorites
- Product comparison
- Reviews integration
- Blog/edge content pages
- Search functionality
