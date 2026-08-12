# Redcat Eyewear — PRD

## Original Problem Statement
Build a landing page and complete website rebuild for Redcat Eyewear (originally a Shopify site). The ultimate goal is an Astro migration to an SSG site connected to the Shopify cart. Requires high-end Awwwards-level design, smooth scrolling, kinetic hero, Framer Motion, and real product data. Pages include Homepage, Brand page, Product pages, and Activity pages.

## Core Requirements
- Awwwards Site-of-the-Day level design with bold art direction
- Framer Motion for animations, Lenis for smooth scrolling
- Pages: Homepage, Brand, Individual Products, Activity/Collections
- Shopify checkout integration (now live via cart permalink redirect)
- White background (light default) with dark mode toggle
- Dynamic variant image switching (3 views + accessories per variant)

## User Personas
Sports-active consumers (pickleball, MTB, cycling, tennis, golf) seeking premium performance eyewear with specific lens technology for their sport.

---

## Architecture
```
/app/
├── backend/
│   ├── requirements.txt
│   ├── .env
│   └── server.py (FastAPI + STATIC_PRODUCTS mock with real Shopify variant IDs)
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js  (darkMode: ["class"])
│   ├── .env
│   └── src/
│       ├── App.js (ThemeProvider + CartProvider + BrowserRouter)
│       ├── index.css (light mode default, .dark overrides)
│       ├── context/
│       │   ├── CartContext.jsx (localStorage cart + Shopify checkout URL)
│       │   └── ThemeContext.jsx (localStorage persistence)
│       ├── components/
│       │   ├── Navbar.jsx (always dark, Sun/Moon toggle)
│       │   ├── Footer.jsx (always dark)
│       │   └── CartDrawer.jsx (dark overlay, real checkout link)
│       ├── hooks/
│       │   ├── useShopify.js
│       │   └── useLenis.js
│       └── pages/
│           ├── Home.jsx
│           ├── Brand.jsx
│           ├── Product.jsx
│           ├── Activity.jsx
│           └── Collections.jsx
```

---

## What's Been Implemented

### Phase 1 (Session 1 — Initial Build)
- Full scaffolding: React + FastAPI + Tailwind + Framer Motion + Lenis
- Navbar, Footer, CartDrawer, CartContext
- All 5 pages: Home, Brand, Product, Activity, Collections
- Backend mocked product API

### Phase 2 (Session 2 — UI Overhaul) — Feb 2026
- Light/Dark Mode with localStorage persistence
- Image cropping fix (object-contain for product photography)
- Marquee removed, hero copy updated, ColorBoost → color-tuned technology
- Dynamic variant images (3 angles + accessories) per variant
- Smart variant option auto-selection when changing frame color

### Phase 3 (Session 3 — Live Checkout) — Feb 2026
- **Real Shopify Checkout**: Cart is localStorage-based. Checkout URL builds `https://redcateyewear.com/cart/{variantId}:{qty}` — confirmed live redirect to Shopify checkout
- **Real variant IDs**: All 4 products updated with real Shopify numeric variant IDs fetched from live store
- **Multi-item support**: Multiple products → `cart/ID1:qty1,ID2:qty2`
- **CartDrawer**: Shows product image, title, variant, price, qty controls; always-dark overlay
- Cart persists via localStorage across page refreshes

### Phase 4 (Session 4 — Trademark Compliance + Live Shopify API) — Feb 2026
- **Logo fixed**: `REDCAT®` → `Redcat` in Navbar and Footer (Caterpillar trademark compliance)
- **® rule**: Redcat® kept in body paragraph text only, stripped from all headings/subheads/nav
- **™ stripped**: All ™ removed from nav links, headings, subheads; footer trademark notice added
- **Golf activity image**: Replaced with active golfer Unsplash photo (photo-1611374243147)
- **Light mode brightened**: CSS variables bumped to near-white, bg-gray-50 → bg-[#FAFAFA]
- **Shopify Storefront API LIVE**: Fixed header (`Shopify-Storefront-Private-Token`), correct token, API 2026-07
- **22 live products** from Shopify; frontend filters to 4 main handles
- **Variant image enrichment**: Live variants merged with curated multi-angle variantImages
- **Cart GID fix**: `getCheckoutUrl` strips Shopify GID prefix to numeric ID

### Phase 5 (Session 5 — Logo, Quiz, SEO) — Feb 2026
- **Real logo lockup**: Cat silhouette (PNG, transparent bg) + "redcat" CSS text in brand red, Logo.jsx component used in Navbar + Footer
- **Activity Lens Quiz** (`/quiz`): 3-step quiz (Sport → Environment → Goal), recommendation engine returns lens + frame model + CTA; FIND YOUR LENS in nav + footer
- **Full SEO overhaul**: index.html updated with title/meta/OG/Twitter/schema (Organization + WebSite JSON-LD); `useSEO` hook for per-page meta + canonical + JSON-LD; Product pages get full Product schema with variants; Activity pages get per-page SEO
- **Fonts preconnect + cat icon preload** added to index.html for LCP
- **Footer lede updated**: "Performance sport sunglasses engineered with color-tuned lens technology."

### Phase 8 (Session 8 — White Theme Redesign + Image Matching Fix) — Feb 2026
- **Dark mode removed**: ThemeContext gutted to always force light. localStorage "rc_theme" cleared. No more `dark:` Tailwind classes active.
- **Aron hero**: Homepage hero redesigned as split layout — "SEE FASTER." / "BE FASTER." text block left, Aron MTB rider image right-flushed on white background
- **Activity product card images**: `getActivityImage()` uses `config.featuredImages[product.handle]` to show the correct lens context per activity (cycling → CarbonGlo gray lenses, MTB → BronzeGlo amber, pickleball → LumiGlo/FireGlo)
- **Hero images corrected**: Cycling page now uses Unsplash road cycling photo. MTB keeps Shopify CDN MTB image. Both distinct.
- **REDCAT all caps on Brand page**: h1 changed from "Redcat" to "REDCAT" (marketing text, not brand mark)
- **Period spacing fix**: `clean_desc()` strips HTML tags with spaces, preventing "sentence.Next sentence" pattern from Shopify API
- **Greige accent rows**: `bg-[#F5F0E8]` warm tan used for alt sections (not cool gray)
- **Navbar white**: White background, dark text, no dark toggle button, Driving in Activities dropdown
- **Collections.jsx rewritten**: Complete overwrite to fix JSX double-return error from previous search_replace, now fully white-themed
- **Activity.jsx product card label**: Changed from misleading `{config.lenses[0]}` to "Redcat Eyewear"
- Testing: iteration_13 — 87% pass (Beast/Roar pickleball label fixed post-test)

### Phase 9 (Session 9 — Hero Fix + Pickleball Filter) — Feb 2026
- **Hero image desktop fix**: Removed `overflow-hidden` from `w-1/2` container that was clipping the Aron image's left edge. Container now `w-[55%]`, image uses `object-contain object-right-top` — fully visible, no cropping.
- **Mobile hero**: Aron image added as full-bleed mobile background (lg:hidden) with `object-cover` + dark left-gradient overlay for contrast. "SEE FASTER." text is white on mobile, black on desktop via responsive Tailwind classes.
- **Pickleball product filter**: Activity.jsx now filters `displayProducts` to only `["strike", "leap"]` when `activity === "pickleball"`. Beast and Roar no longer appear on Pickleball page.
- **Pickleball description rewrite**: Updated to user-provided copy emphasizing LumiGlo/FireGlo lens benefits for yellow and colored balls.
- **Pickleball featuredImages cleanup**: Removed Beast/Roar entries from pickleball config (only Leap + Strike images remain).
- Testing: iteration_14 — 100% pass

### Phase 10 (Session 10 — Tennis Filter, Copy Rewrites, Quiz Fix) — Feb 2026
- **Tennis page filter**: Added tennis to LUMIGLO_HANDLES filter — now shows only Leap + Strike (Roar removed). Removed Roar from tennis featuredImages config.
- **Pickleball hero image**: Swapped dark glasses-closeup CDN image for Unsplash outdoor action shot (photo-1756477558468 — player mid-swing, yellow ball visible).
- **Golf description rewrite**: "CarbonGlo lenses amplify aqua and green tones so you're reading the course — not guessing at it..." with PolarGlo glare benefit added.
- **Outdoors description rewrite**: "Color vision fades as you age — Redcat® slows that down..." — emotional, benefit-led copy.
- **Quiz pickleball model bug fixed**: `getRecommendation()` was returning `roar` for pickleball (which doesn't carry LumiGlo/FireGlo lenses). Fixed to return `leap` for both pickleball and tennis.
- **Quiz LENS_DATA copy**: All 7 lens entries rewritten with punchy taglines and vivid detail copy (e.g. "like it has a light inside it" for LumiGlo Outdoor).
- **Quiz MODEL_DATA copy**: All 4 frame taglines rewritten to be sport-specific and benefit-led.
- Testing: iteration_15 — 100% pass (9/9 tests)

### Phase 11 (Session 11 — Activity Filters, Driving Copy, Quiz BG) — Feb 2026
- **Refactored activity model filter**: Replaced per-sport LUMIGLO_HANDLES logic with a single `ACTIVITY_MODEL_FILTER` lookup table in Activity.jsx — clean, extensible.
- **MTB page filter**: Now shows Beast + Roar + Strike only (Leap removed — not a cycling-specific frame).
- **Cycling page filter**: Now shows Beast + Roar only (2 curated cycling models).
- **Driving description rewrite**: "BronzeGlo lenses make low-angle sun your problem no more. Amber-tuned to cut through dawn glare, late-afternoon blaze..." — energetic lede matching pickleball/golf copy style.
- **Quiz background image**: Added full-bleed Unsplash sport photo (volleyball above clouds, photo-1558546798) at 12% opacity behind quiz cards. Progress bar and content given `relative z-10` to stay legible.
- Testing: iteration_16 — 100% pass (7/7 tests)

### Phase 12 (Session 12 — Ball/Lens Images, Activity Filters, Quiz Icons) — Feb 2026
- **LENS_IMAGES constant**: All 6 lens images (LumiGlo Outdoor/Indoor, FireGlo Outdoor/Indoor, CarbonGlo, BronzeGlo) mapped in Activity.jsx and Quiz.jsx using CDN_ASSETS URLs from uploaded customer assets.
- **Pickleball ball×lens section**: New "Your Ball. Your Lens." section on the pickleball page. Two editorial panels — Hi-Vis Yellow-Green (ball + LumiGlo lens pair) and Orange/Pink/Red (3 balls + FireGlo lens pair). 8 images total, triggered by activity==='pickleball'.
- **Recommended Lenses bar**: All activity pages now show actual lens images as chips alongside lens names (img element per lens). BronzeGlo Outdoor alias added to LENS_IMAGES for MTB page compatibility.
- **Driving page filter**: Added `driving: ["beast","roar"]` to ACTIVITY_MODEL_FILTER — now shows 2 curated products.
- **MTB/Cycling descriptions rewritten**: MTB "Full sun turns technical trail into a blur..."; Cycling "Road surfaces, obstacles, and hazards become sharper through CarbonGlo..."
- **Homepage activity grid**: ACTIVITIES array `lens` field updated to benefit copy — "See the ball glow", "Kill the road glare", "Track every shot", "Read every green", "Own the low-angle sun".
- **Quiz sport icons**: Imported Bike, Mountain, Flag, Zap, Disc from lucide-react. SPORT_STEP options include Icon components. Quiz buttons now show icons at top, text at bottom.
- **Quiz lens image in result**: LENS_DATA extended with `image` URLs. Result card shows actual lens img instead of colored circle (fallback to circle if no image).
- Testing: iteration_17 — 100% pass (9/9 tests) + BronzeGlo Outdoor alias fix applied

---
- **Mountain Biking page corrected**: Lens recommendations updated to BronzeGlo Outdoor & FireGlo Outdoor (full sun) + FireGlo Indoor (shaded trails). Added 4-feature dark section (same pattern as Driving page). Description rewritten with accurate light-condition guidance.
- **Cycling page corrected**: Primary lens changed to CarbonGlo only (removed BronzeGlo from recommended list). Description updated to emphasize road-surface clarity.
- **Per-variant image system**: Rewrote `v()` helper + all VI maps (BEAST_VI, ROAR_VI, LEAP_VI, STRIKE_VI) with `{frame}/{lens}` keys — selecting a lens now shows the exact product image (e.g. CarbonGlo Black Matte shows gray lens, not BronzeGlo amber).
- **Full variant catalog**: STATIC_PRODUCTS expanded from ~7 variants/product to 23–34 variants per product, matching all meta.docx SKUs with correct images and accurate pricing ($119–$234.99).
- **Updated product descriptions**: All 4 products now use the authoritative meta.docx description copy instead of generic placeholder text.
- **`get_product()` enrichment**: Updated to build `static_vi_map` with both `{frame}/{lens}` exact keys and `{frame}` fallback keys — live Shopify API variants also get per-lens correct images.
- **Added `vi1()` helper**: Single-angle image helper for LEAP variants that only have 1 photo.

---
- **robots.txt created**: `/public/robots.txt` with `User-agent: *` / `Allow: /` / Sitemap ref (SEO score fix)
- **Footer contrast fixed**: `text-white/30` → `text-white/55`, `text-white/40` → `text-white/60`, `text-white/18` → `text-white/40` (Accessibility fix)
- **Hero image LCP fix**: Added `fetchpriority="high"` + `decoding="async"` to hero img in Home.jsx
- **Hero image preload**: Added `<link rel="preload">` for hero image in index.html (Lighthouse LCP)
- **Async font loading**: Converted render-blocking `<link rel="stylesheet">` for Google Fonts to `preload+onload` pattern in index.html
- **Removed duplicate @import**: Removed `@import` Google Fonts from index.css (was double-loading fonts)
- **React.lazy() code splitting**: Brand, Product, Activity, Collections, Quiz lazy-loaded in App.js to reduce main bundle size
- **BronzeGlo Driving Page** (`/activities/driving`): Full activity page with headline "See Every Hazard. React Faster.", BronzeGlo & PolarGlo lens recommendations, unique 4-feature "BronzeGlo Science" dark section, stat strip (30%, UV400, PolarGlo, CE/ISO)
- **Activity.jsx headline rendering**: `config.headline` now rendered as styled subtitle below the h1 name for all activity pages
- **Footer**: Added Driving link to Activities column
- **Homepage**: Added DRIVING card (5th) to activities grid, updated to `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`

---
- `GET /api/products/{handle}` — Single product with variantImages per variant
- `POST /api/cart` — Backend endpoint exists but cart is now handled client-side
- `POST /api/newsletter` — Newsletter signup

## Key Technical Notes
- **Shopify Storefront API**: Still mocked (token provided by user doesn't have API access; needs Storefront scopes enabled in Shopify Admin → Develop Apps)
- **Checkout**: LIVE via `redcateyewear.com/cart/{id}:{qty}` permalink (confirmed HTTP 302 → Shopify checkout)
- **Variant IDs**: Real numeric Shopify IDs (BEAST Black = 48760812339496, etc.)
- **Dark mode**: Tailwind `darkMode: ["class"]`, class on `document.documentElement`
- **CDN**: Images direct from `https://cdn.shopify.com/s/files/1/0774/1784/0936/files/`

---

## Prioritized Backlog

### P0 (Complete)
- [x] Light theme / dark mode toggle
- [x] Product image fix (object-contain)
- [x] Remove marquee, update copy, rename ColorBoost
- [x] Dynamic variant images
- [x] Real Shopify checkout (cart permalink)
- [x] Real Shopify variant IDs
- [x] Logo trademark fix (Redcat, no all-caps, no ® in logo)
- [x] Remove ™/® from all subheads/headings/nav (footer notice added)
- [x] Light mode brightened
- [x] Golf activity image → active golfer
- [x] Live Shopify Storefront API (header fix + scope fix)
- [x] Cart GID numeric ID fix

### P1
- [ ] Clean up ™ symbols in Shopify Admin product/variant names (store-side change)

### P2
- [ ] Activity Quiz ("Which lens is right for my sport?")
- [ ] Astro/SSG migration (original long-term goal)

### P3 / Backlog
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] SEO meta tags per page
- [ ] Analytics integration
