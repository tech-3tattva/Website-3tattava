# 3Tattava — PRD

## Original problem statement
> Revamp the whole website ditto totally according to the 3tattava website framework.

User provided the 3Tattava Framework PDF (50+ pages) + DESIGN.md (luxury-dark + gold spec).

## Stack
React (CRA) frontend + FastAPI + MongoDB. Supervisor-managed services on ports 3000 / 8001.

## Personas
1. Modern professional (Shahjeet — Fast Ritual)
2. Traditional seeker (RockResin — Deep Ritual)
3. Athlete (Mona / WTF ecosystem)
4. Curious learner (Research & Testing, Knowledge Center)
5. Admin / operator

## Implemented — Iteration 1 (Jan 2026)
- 14-section Home (Hero · TrustStrip · Product Split · Founder · Athlete · WTF · Evidence · Pillars · Choose Ritual · Weeks · Support · Testimonials · Knowledge · FAQ · Final CTA)
- Shop, Product Detail (RockResin, Shahjeet, Starter Kit, Subscription), Our Story, Knowledge Center + article detail, Research & Testing, Community, Find Us, VaidyaConnect, Dosha Quiz, Performance Assessment, Cart→Checkout→Order Confirmation, Admin, 404
- Backend: public + admin endpoints, idempotent seed (4 products, 2 doctors, 6 articles, 29 locations)
- Brand tokens, Archivo + Fraunces + Noto Serif Devanagari, gold-particle hero, marquee testimonials, grain overlays
- Validation: 18/18 backend tests + all frontend smoke flows pass

## Implemented — Iteration 2 (Jan 2026)
- **Logo**: real 3Tattava wordmark (CDN-hosted) in Header & Footer with auto inversion on dark backgrounds
- **Real Leaflet/OpenStreetMap** on Find Us with custom gold pin icons (active state has a 38px halo), CartoDB Voyager tiles, Popups w/ Get Directions, FlyTo on card click
- **Anthropic Claude chatbot** (`claude-haiku-4-5-20251001`) — floating launcher (3T monogram), SSE-streamed responses with JSON-encoded tokens (preserves whitespace), lightweight markdown rendering (**bold** + [links](url)), 4 starter suggestions, session_id persisted in localStorage, on-brand system prompt with full product context
- **WhatsApp** green floating button at `wa.me/919810012345`
- **AWS SES transactional emails** (boto3, async-wrapped) for: newsletter welcome, order confirmation, Performance Assessment result, doctor booking confirmation. Branded HTML templates (ink + gold + Archivo). Fire-and-forget via `asyncio.create_task` — never blocks the response.
- **Admin Product CRUD UI**: new "Products" tab in /admin lists all SKUs with Edit/Delete + "New Product" modal (slug, name, tagline, ritual, price, compare_at, category, image URL, descriptions, benefits list, badges list, accent color, in_stock, is_featured). Hits POST/PUT/DELETE `/api/admin/products[/{slug}]`. Path slug is authoritative on update.
- New admin tabs: `assessments`, `contacts`
- Code-review fixes from iteration 2: PUT honours path slug; chat_service no longer prepends history into user message (relies on LlmChat session_id)
- Validation: 32/32 backend tests pass + all new frontend flows verified end-to-end

## Backlog
**P1**
- Razorpay (Indian market) payment with the test keys user provided
- Emergent-managed Google Auth for customer accounts (saved addresses, order history, wishlist persistence)
- Real subscription auto-renew engine (Shahjeet monthly)
- Markdown polish in chatbot (lists, headings)
- SES domain verification + production sending
- VaidyaConnect calendar integration (Calendly / Cal.com)
- Email PDF attachment for Performance Assessment results

**P2**
- Podcast Hub + episode CMS
- Gifting flow
- LeadCaptureModal & IntroSplash overlays
- Cookie / privacy banner
- Rate-limiting on public POSTs
- Sitemap + structured data per page
- Admin: rich text editor for product long_desc / FAQs
- Multi-admin user management (replace shared token with JWT + per-admin accounts)

## Conventions
- All interactive elements have `data-testid`, kebab-case.
- All datetime stored as ISO-8601 strings.
- Mongo `_id` always projected out.
- Production secrets go in `.env` — never in code. User-supplied secrets rotated after exposure.

Last updated: Jan 2026 — iteration 2 (map + chatbot + emails + admin CRUD).
