# 3Tattava — PRD

## Original problem statement
> Revamp the whole website ditto totally according to the 3tattava website framework. Get all the assets required from web and ask me if required.

User uploaded the 3Tattava Framework PDF (50+ pages) and a comprehensive DESIGN.md with the full brand system (luxury-dark + gold, Archivo + Fraunces + Noto Serif Devanagari, complete color tokens, IA, component library, footer bands, product pages, etc.).

## Confirmed user choices (iteration 1)
- Scope: **Full marketing + Cart/Checkout + Admin + Dosha Quiz + VaidyaConnect**
- Stack: **React (CRA) + FastAPI + MongoDB**
- Imagery: **Web-sourced premium visuals** (Unsplash editorial)
- Integrations: **Newsletter capture + Performance Assessment quiz**
- Backend data: **MongoDB-seeded products served via /api/products**

## Architecture
- **Frontend** — React 19 + react-router 7 + Tailwind + Framer Motion + Lucide icons. Single CartContext (localStorage). All API calls via `lib/api.js` using `REACT_APP_BACKEND_URL`.
- **Backend** — FastAPI + Motor (Mongo). All routes prefixed `/api`. Seed-on-startup for products / doctors / knowledge / locations (idempotent). Admin endpoints under `/api/admin/*` guarded by `Authorization: Bearer ${ADMIN_TOKEN}`.

## User personas
1. **The Modern Professional** — high-functioning, time-starved. Lands on Shahjeet (Fast Ritual).
2. **The Traditional Wellness Seeker** — values depth, ritual, lineage. Lands on RockResin (Deep Ritual).
3. **The Athlete** — discipline, recovery, consistency. Lands on the Mona / WTF ecosystem.
4. **The Curious Learner** — wants science first. Lands on Research & Testing and Knowledge Center.
5. **The Admin / Operator** — needs ops dashboard.

## What's implemented (Jun 2026 — iteration 1)
### Pages
- `/` — Home with **14 sections** (Hero, TrustStrip, Product Split, Founder, Athlete, WTF Ecosystem, Evidence, Pillars, Choose Ritual + Compare, Weeks, Support System, Testimonials Marquee, Knowledge Preview, FAQ, Final CTA).
- `/shop` (+ `/products`) — Grid w/ category filters.
- `/products/:slug` — Full PDP (gallery, benefits, qty, Add to Cart, How-to-use, 7 Pillars, Specs/Ingredients/Lab Tests tabs, FAQs).
- `/our-story` (+ `/about`) — Founder timeline + Master Brand Statement + Mission/Vision.
- `/knowledge-center` — 6 seeded articles with category filters.
- `/education/:slug` — Article detail.
- `/research-testing` — Evidence Pillars + Tests + Lab Reports showcase + Scan/Verify/Trust.
- `/community` — Athlete (Mona) section, events, community stories.
- `/find-us` — 29 WTF locations + stylized NCR map w/ pin highlight + city filter.
- `/vaidyaconnect` — 2 doctors + booking modal.
- `/dosha-quiz` — 7-question Vata/Pitta/Kapha quiz with dominant-dosha result.
- `/assessment` — 4-question Performance Assessment with score + stage + recommended ritual.
- `/checkout` (3-step: Cart → Address → Payment, COD).
- `/order-confirmation/:id`.
- `/admin` — Token-auth dashboard with stats + orders / leads / newsletter / bookings tabs.
- `/*` — Custom 404 ("Lost In The Himalayas").

### Backend endpoints
- Public: `GET /api/products`, `GET /api/products/:slug`, `GET /api/doctors`, `GET /api/doctors/:slug`, `GET /api/knowledge`, `GET /api/knowledge/:slug`, `GET /api/locations`, `GET /api/orders/:id`.
- Submit: `POST /api/newsletter`, `POST /api/leads`, `POST /api/assessment`, `POST /api/dosha-quiz`, `POST /api/contact`, `POST /api/orders`, `POST /api/doctors/book`.
- Admin (Bearer): `POST /api/admin/verify`, `GET /api/admin/stats`, `/orders`, `/leads`, `/newsletter`, `/bookings`.

### Brand system applied (per DESIGN.md)
- Color tokens: `--ink #1c1304`, `--cream #f7f0e2`, `--gold #C8963E`, `--gold-dark #A67B2F`, `--3t-black`, `--3t-shahjeet #CD872A`, `--terracotta #b35e34`, `--sand #eae5db`.
- Fonts: **Archivo** variable (wdth 75–100, wght 300–800), **Fraunces** italic display, **Noto Serif Devanagari** for Sanskrit (समत्व / बल / उत्कर्ष).
- Patterns: hero gold-particle float, marquee testimonials, animated shimmer on gold-gradient text, honey-drip animation on Shahjeet panel, mouse-tilt 3D on product split, grain texture overlay, custom scrollbar.

### Validation
- Backend test suite: **18/18 pass** at `/app/backend/tests/test_3tattava_api.py`.
- Frontend testing-agent smoke: **all critical flows green** (home, nav, shop, PDP, cart → place order, newsletter, assessment, dosha quiz, vaidya booking, admin login).

## Backlog (deferred)
**P1**
- User accounts (JWT or Emergent Google Auth) + saved addresses / order history.
- Real payment gateway (Razorpay / Stripe) — currently COD only.
- Subscription engine (auto-renew Shahjeet monthly).
- Wishlist persistence.
- Search page implementation.
- VaidyaConnect: real calendar slots + Calendly/Cal.com integration.
- Admin product CRUD UI.
- Email send-out for newsletter / order confirmation / assessment result (Resend or SendGrid).
- Track Order page.

**P2**
- Podcast Hub page + episode CMS.
- Gifting page.
- Live chat widget + WhatsApp deep-link.
- LeadCaptureModal + IntroSplash overlays.
- Rate-limiting on public POSTs.
- Cookie / privacy banner.
- SEO sitemap + structured data per page.

## Next tasks (suggested)
1. Wire up real payments via Razorpay (Indian market) or Stripe with Crypto.
2. Add Emergent-managed Google Auth so customers can save orders / track / reorder.
3. Build Admin product CRUD so the team can update SKUs, prices and lab batches without redeploying.
4. Add Email transactional layer (Resend) for newsletter welcome + order confirmation + assessment PDF.
5. Replace the stylized NCR map with a real interactive Leaflet/Mapbox map.

## Conventions
- All interactive elements have `data-testid` (kebab-case, function-named).
- All datetime stored as ISO-8601 strings in Mongo (avoid raw `datetime.utcnow`).
- Mongo `_id` always excluded via projection.
- No checked-in secrets — admin token defaults to `3tattava-admin-2026` for dev, override via `ADMIN_TOKEN` env.

Last updated: Jan 2026 — iteration 1 (initial revamp).
