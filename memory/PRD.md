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

---

## Key API Endpoints
- `GET /api/products` — Returns 4 products with full variant data (real Shopify IDs)
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

### P1
- [ ] Restore Shopify Storefront API (needs Storefront API scopes enabled + token regenerated in Shopify Admin)
- [ ] When API works: live product sync, real inventory levels

### P2
- [ ] Activity Quiz ("Which lens is right for my sport?")
- [ ] Astro/SSG migration (original long-term goal)

### P3 / Backlog
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] SEO meta tags per page
- [ ] Analytics integration
