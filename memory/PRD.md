# Redcat Eyewear — PRD

## Original Problem Statement
Build a landing page and complete website rebuild for Redcat Eyewear (originally a Shopify site). The ultimate goal is an Astro migration to an SSG site connected to the Shopify cart. Requires high-end Awwwards-level design, smooth scrolling, kinetic hero, Framer Motion, and real product data. Pages include Homepage, Brand page, Product pages, and Activity pages.

## Core Requirements
- Awwwards Site-of-the-Day level design with bold art direction
- Framer Motion for animations, Lenis for smooth scrolling
- Pages: Homepage, Brand, Individual Products, Activity/Collections
- Shopify checkout integration (now live via cart permalink redirect)
- STRICT ALL-WHITE theme (Dark Mode explicitly removed)
- Dynamic variant image switching (3 views + accessories per variant)
- Precise product mapping: sport-to-lens and sport-to-model (e.g., Pickleball = Leap/Strike only)

## User Personas
Sports-active consumers (pickleball, MTB, cycling, tennis, golf, driving) seeking premium performance eyewear with specific lens technology for their sport.

## Critical Rules
- **THEME**: ALL-WHITE only. No dark: Tailwind classes
- **TRADEMARK**: "REDCAT" all caps in marketing headings, "Redcat" in body copy and logo. ® in body text only.
- **BRAND**: Never link out to old Shopify blog/support pages — all content migrated natively to this React site

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
│   ├── tailwind.config.js
│   └── src/
│       ├── App.js (ThemeProvider + CartProvider + BrowserRouter)
│       ├── index.css
│       ├── context/ (CartContext.jsx, ThemeContext.jsx)
│       ├── components/ (Navbar.jsx, Footer.jsx, CartDrawer.jsx, Logo.jsx)
│       ├── hooks/ (useShopify.js, useLenis.js, useSEO.js)
│       └── pages/
│           ├── Home.jsx
│           ├── Brand.jsx
│           ├── Product.jsx
│           ├── Activity.jsx
│           ├── Collections.jsx
│           ├── Quiz.jsx
│           ├── Technology.jsx
│           ├── Frames.jsx
│           ├── LensGallery.jsx
│           ├── Blog.jsx          ← NEW Phase 14
│           ├── BlogPost.jsx      ← NEW Phase 14
│           ├── FAQ.jsx           ← NEW Phase 14
│           ├── Contact.jsx       ← NEW Phase 14
│           └── WarrantyReturns.jsx ← NEW Phase 14
```

---

## What's Been Implemented

### Phase 1–7 (Sessions 1–7)
See CHANGELOG for full history. Core: React scaffold, live Shopify API, checkout, variant images, quiz, SEO.

### Phase 8 (Session 8 — White Theme Redesign)
- Dark mode removed — all-white theme enforced
- Homepage hero redesigned: split layout, Aron MTB image right-flushed
- Activity product card images fixed per sport context

### Phase 9 (Session 9 — Hero Fix + Pickleball Filter)
- Hero image cropping fixed (object-contain object-right-top)
- Pickleball filter: only Leap + Strike shown

### Phase 10 (Session 10 — Tennis Filter, Copy Rewrites, Quiz Fix)
- Tennis filter: Leap + Strike only
- Quiz pickleball model bug fixed → returns Leap

### Phase 11 (Session 11 — Activity Filters, Driving)
- ACTIVITY_MODEL_FILTER lookup table (MTB: Beast/Roar/Strike, Cycling: Beast/Roar, Driving: Beast/Roar)
- Driving page + BronzeGlo lens science section

### Phase 12 (Session 12 — Ball/Lens Images, Quiz Icons)
- LENS_IMAGES constant across Activity.jsx and Quiz.jsx
- Pickleball Ball×Lens editorial panels
- Quiz sport icons (lucide-react)

### Phase 13 (Session 13 — Technology/Frames/Lenses pages)
- /technology, /frames, /lenses pages created
- Navbar TECHNOLOGY dropdown
- Tennis Ball×Lens section, Golf CarbonGlo panel
- Driving hero upgrade

### Phase 14 (Session 14 — Support Section, Blogs, Trust/Reviews) — Feb 2026
- **Blog.jsx** (`/blog`): Index page listing 4 native articles with editorial cards
- **BlogPost.jsx** (`/blog/:slug`): Full article renderer with all 4 scraped Shopify blog articles:
  1. Pickleball Eye Safety (`/blog/pickleball-eye-safety`)
  2. Color Vision Science (`/blog/enhancing-color-vision`)
  3. Best Lens for Pickleball (`/blog/pickleball-game`)
  4. Polarized Lenses (`/blog/polarized-sunglasses`)
  Each article has: lede, h2 sections, comparison tables, and FAQ accordion
- **FAQ.jsx** (`/faq`): 4-category accordion page (About REDCAT, Lenses, Orders, Warranty)
- **Contact.jsx** (`/contact`): Contact form (console.log submit) + contact info (support@redcateyewear.com, (678) 208-8232, Instagram, Facebook)
- **WarrantyReturns.jsx** (`/warranty-and-returns`): Full lifetime warranty text with TOC sidebar
- **Navbar SUPPORT dropdown**: Blog, FAQ, Contact Us, Warranty & Returns
- **Footer internal links**: Support column now routes to native React pages
- **Home.jsx Trust Strip**: 3-block strip (Lifetime Warranty, Made in Italy, UV400 Protection) added after hero
- **Home.jsx Google Reviews**: "Heard on the Court" section — 2 real customer reviews (Joshua Briseno + John B.) before newsletter
- **Technology.jsx CRF/CAF section**: Dark section "The Number Nobody Else Publishes" — CRF/CAF definition cards + data table (REDCAT 138% CRF / 99% CAF vs. rose lens 96%/56%)
- Testing: iteration_19 — 95% pass (3 LOW items, all functional flows passed)

---

## Key Technical Notes
- **Shopify Storefront API**: Working — 22 live products
- **Checkout**: LIVE via `redcateyewear.com/cart/{id}:{qty}` permalink
- **Email Signup**: UI complete (console.log submit), NOT wired to Klaviyo/Mailchimp yet
- **Contact Form**: UI complete (console.log submit), NOT wired to backend yet

---

## Key API Endpoints
- `POST https://abf950-4.myshopify.com/api/2026-07/graphql.json` (Shopify Live API)
- `GET /api/products`, `GET /api/products/{handle}` (Backend)
- `POST /api/newsletter` (Newsletter endpoint)

---

## Prioritized Backlog

### P0 (Complete)
- [x] Live Shopify Storefront API
- [x] Cart + real checkout
- [x] All-white theme
- [x] Activity page filters (pickleball, tennis, MTB, cycling, driving)
- [x] Quiz with sport→lens→model recommendation
- [x] SEO per page
- [x] Technology / Frames / Lenses pages
- [x] Blog (4 articles, native React)
- [x] Support pages (FAQ, Contact, Warranty & Returns)
- [x] Navbar SUPPORT dropdown
- [x] Home trust strip + Google reviews
- [x] CRF/CAF science section on Technology page

### P1 (In Progress / Next)
- [ ] Wire email signup to Klaviyo or Mailchimp
- [ ] Wire contact form to backend email provider
- [ ] Mountain Biking page corrections (lens recommendations + dark feature section)

### P2
- [ ] Image size optimization (ROAR + BEAST PNGs)
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] Analytics integration

### P3 / Backlog
- [ ] Astro/SSG migration (original long-term goal)
- [ ] Admin Shopify cleanup (™ symbols in product names)
