# Redcat Eyewear — PRD

## Original Problem Statement
Build a landing page and complete website rebuild for Redcat Eyewear (originally a Shopify site). The ultimate goal is an Astro migration to an SSG site connected to the Shopify cart. Requires high-end Awwwards-level design, smooth scrolling, kinetic hero, Framer Motion, and real product data. Pages include Homepage, Brand page, Product pages, and Activity pages.

## Core Requirements
- Awwwards Site-of-the-Day level design with bold art direction
- Framer Motion for animations, Lenis for smooth scrolling
- Pages: Homepage, Brand, Individual Products, Activity/Collections
- Shopify Storefront API integration for live products and cart (Currently MOCKED)
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
│   └── server.py (FastAPI + STATIC_PRODUCTS mock with variantImages)
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js  (darkMode: ["class"])
│   ├── .env
│   └── src/
│       ├── App.js (ThemeProvider + CartProvider + BrowserRouter)
│       ├── index.css (light mode default, .dark overrides)
│       ├── context/
│       │   ├── CartContext.jsx
│       │   └── ThemeContext.jsx (NEW - localStorage persistence)
│       ├── components/
│       │   ├── Navbar.jsx (always dark, has Sun/Moon toggle)
│       │   ├── Footer.jsx (always dark)
│       │   └── CartDrawer.jsx
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
- Backend mocked product API (Shopify API token was unauthorized)
- Custom Lenis hook replacing @lenis/react (package conflict fix)

### Phase 2 (Session 2 — User Feedback Overhaul) — Feb 2026
- **Light/Dark Mode**: Default light, dark mode toggle (Sun/Moon) in Navbar. ThemeContext with localStorage persistence. `dark` class on `<html>`. All pages use `dark:` Tailwind variants.
- **Image Fix**: Changed all product card/gallery images from `object-cover` to `object-contain` with `bg-white dark:bg-rc-surface` containers. Product photography on white backgrounds now shown in full without cropping.
- **Marquee Removed**: Scrolling marquee section deleted from Homepage
- **Hero Text**: Updated to exact user-specified copy about "color-tuned lens technology"
- **ColorBoost renamed**: All instances of "ColorBoost" in UI copy changed to "color-tuned technology". Footer, stats, section headings updated.
- **Dynamic Variant Images**: Backend `server.py` STATIC_PRODUCTS updated with `variantImages` per variant (3 angles + accessories image). Product.jsx gallery uses `currentVariant.variantImages` and resets on variant change. Smart `handleOptionChange` auto-selects compatible lens when frame color changes.
- Navbar/Footer explicitly stay dark in both themes.

---

## Key API Endpoints
- `GET /api/products` — Returns 4 products with full variant data
- `GET /api/products/{handle}` — Single product with variantImages per variant
- `POST /api/cart` — Mocked (redirects to live Shopify URL)
- `POST /api/newsletter` — Newsletter signup

## Key Technical Notes
- **Shopify Storefront API**: MOCKED (token `303a91a885eb4c3811b4b8ae068c7234` on `abf950-4.myshopify.com` returned 404/UNAUTHORIZED)
- **Dark mode**: Tailwind `darkMode: ["class"]`, class added to `document.documentElement`
- **CDN**: Images served directly from `https://cdn.shopify.com/s/files/1/0774/1784/0936/files/`
- **Variant images**: BEAST + ROAR have confirmed 3-angle images. LEAP + STRIKE have 1-angle + accessories.

---

## Prioritized Backlog

### P0 (Complete)
- [x] Light theme with white background
- [x] Dark/light mode toggle
- [x] Product image cropping fix
- [x] Remove marquee
- [x] Update hero copy
- [x] Rename ColorBoost → color-tuned technology
- [x] Dynamic variant images

### P1
- [ ] Restore live Shopify Storefront API (needs valid token from user)
- [ ] Live cart checkout flow

### P2
- [ ] Activity Quiz ("Which lens is right for my sport?")
- [ ] Astro/SSG migration (original long-term goal)

### P3 / Backlog
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] SEO meta tags per page
- [ ] Analytics integration
