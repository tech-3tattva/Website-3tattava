# 3Tattava — PRD

## Original problem statement
> Revamp the whole website ditto totally according to the 3tattava website framework.

## Stack
React (CRA) frontend + FastAPI + MongoDB. Supervisor-managed services on ports 3000 / 8001. CDN: CloudFront (`media.3tattava.com`).

## Personas
1. Modern professional (Shahjeet — Fast Ritual)
2. Traditional seeker (RockResin — Deep Ritual)
3. Athlete (Mona / WTF ecosystem)
4. Curious learner (Research & Testing, Knowledge Center)
5. Admin / operator

## Implemented — Iteration 1 (Jan 2026)
14-section Home · Shop · 4 Product Detail pages · Our Story · Knowledge Center · Research & Testing · Community · Find Us · VaidyaConnect · Dosha Quiz · Performance Assessment · Cart→Checkout→Order Confirmation · Admin · 404. 18/18 backend pass.

## Implemented — Iteration 2 (Jan 2026)
Logo wordmark + 3T monogram. Real Leaflet/OSM map with custom gold pins. Anthropic Claude (claude-haiku-4-5) chatbot with SSE streaming + light markdown + session memory. AWS SES emails (newsletter / order / assessment / booking). WhatsApp green float. Admin Product CRUD UI. JSON-encoded SSE tokens. 32/32 backend pass.

## Implemented — Iteration 3 (Jan 2026)
- **Razorpay** wired end-to-end (placeholder mode auto-verifies with mock signature; ready for real keys). Payment-method radio selector in Checkout (Razorpay default + COD fallback).
- **n8n CRM webhook** plugged into newsletter / assessment / booking / order / order-paid / cart-abandoned events as fire-and-forget asyncio tasks.
- **Cart-abandonment recovery** — 12-min idle timer in CartContext, POST /api/cart/abandoned with per-email-per-day dedupe, branded SES recovery email template.
- **Razorpay webhook endpoint** at POST /api/payments/razorpay/webhook with signature verification.
- **Admin endpoints**: GET /api/admin/cart-recovery added.
- **Product seed → upsert** so packaging/image updates apply on every deploy.
- **Regulatory & packaging info** integrated into product schema (`regulatory.mfg_lic`, manufacturer + marketer addresses, care email/phone, full Ayurvedic Proprietary Medicine disclaimer). Rendered in a dedicated section on each PDP (`data-testid="product-regulatory"`).
- **Real product imagery** via CloudFront CDN — Rockresin-hero.jpeg, rockresin-float.jpeg, shahjeet-box.png, shahjeet-sachet.png, resin-mountain.png, resin-pulled.png, banner webps.
- **Background videos** on Home Hero (hero-bg.mp4) and Weeks section (week-bg.mp4) with graceful fallback poster.
- 54/54 backend pass (22 new + 32 regression). Full UI Razorpay placeholder round-trip verified in real browser.

## Configuration
Env vars in `/app/backend/.env`:
- `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`
- `ADMIN_TOKEN=3tattava-admin-2026`
- `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SES_FROM_EMAIL=orders@3tattava.com`
- `ANTHROPIC_API_KEY`, `ANTHROPIC_CHAT_MODEL=claude-haiku-4-5-20251001`
- `N8N_LEAD_WEBHOOK_URL`
- `RAZORPAY_KEY_ID=rzp_test_placeholder`, `RAZORPAY_KEY_SECRET=placeholder`, `RAZORPAY_WEBHOOK_SECRET=placeholder` (swap for real test/live)
- `WHATSAPP_NUMBER=919810012345`, `PUBLIC_SITE_URL`

## Backlog
**P1**
- Swap Razorpay placeholder keys for real test/live keys.
- Verify SES domain in AWS console + move out of sandbox.
- Migrate admin auth from shared bearer token to JWT (env already has `ADMIN_JWT_SECRET`) + per-admin accounts.
- Emergent-managed Google Auth for customer accounts (saved addresses, order history).
- Subscription auto-renew engine for Shahjeet monthly plan.
- VaidyaConnect calendar (Calendly / Cal.com).

**P2**
- Podcast Hub CMS, Gifting flow, LeadCaptureModal, Cookie banner.
- Admin: rich-text editor for product long_desc + UI for cart-recovery tab.
- Rate-limiting on public POSTs.
- SEO sitemap + structured data.
- PDF assessment report attached to result email.
- Replace generated favicon with real 3T monogram.

## Conventions
- All interactive elements have `data-testid` (kebab-case).
- All datetimes are ISO-8601 strings; never raw datetime objects.
- Mongo `_id` always projected out.
- CDN URLs use `media.3tattava.com` (S3 bucket itself is private).
- Fire-and-forget side effects use `asyncio.create_task(...)` — never block the request path.
- Razorpay placeholder mode accepts only `mock-ok` signature for verify.

Last updated: Jan 2026 — iteration 3 (Razorpay + n8n + cart recovery + S3 media + packaging data).

## Implemented — Iteration 4 (Jan 2026 · UX Polish)
- **Logo system**: dedicated `<Logo />` component (Logo.jsx) — uses the artistic wordmark consistently in Header + Footer, with auto inversion on dark contexts, hover gold-shimmer pass, and standardized sizes (sm/md/lg/xl). Removed text-styled fallback.
- **Scroll-reveal microanimations**: reusable `<ScrollReveal />` (Intersection-Observer based, honours `prefers-reduced-motion`) wraps Founder, Athlete, Evidence, Pillars, Knowledge preview cards — content fades + slides in with staggered delays as the user scrolls.
- **Balance · Build · Become scroll companion**: fixed-right `<PillarJourney />` indicator that ties the page to the philosophy. As user scrolls, a gold gradient thread fills + the active pillar dot enlarges with halo + the Sanskrit label slides in. Auto-hides at top + near footer. Honours mobile (hidden < md).
- **Find Us — geolocation**: "Find My Nearest Center" CTA requests browser geo permission, draws a blue user-position marker with pulsing ring + 5km radius circle on Leaflet, sorts locations by Haversine distance, auto-flies map to nearest, and shows a "Nearest to you" banner above the listing with one-click Get Directions.
- **Mobile responsiveness audit**: hero text uses fluid clamp(); all major sections moved from gap-12 to gap-10 md:gap-12; Find Us list+map layout reorders on `lg:` breakpoint (map above list on small screens, side-by-side on large); founder image height reduced on mobile; chatbot and WhatsApp floats sit at opposite bottom corners (no overlap).
- **Vector decoration**: gold mountain silhouette SVG layer in Find Us hero, decorative `blob-gold` radial glow in Founder section, `<BalanceBuildBecomeGlyph />` component available for future use (connecting-thread SVG with circle/chevron/starburst marks).
- Pillars cards: changed from hairline-grid style to spaced cards with subtle scale-on-active.

## Next tasks (suggested)
1. Razorpay real test keys (drop the placeholder).
2. SES domain verification + cart-abandonment cron.
3. Admin JWT auth (envs already exist).
4. Replace generated favicon with the actual 3T monogram.
5. Apply ScrollReveal to remaining pages (ProductDetail, OurStory) for site-wide consistency.

## Implemented — Iteration 5 (Jan 2026 · Cinematic Storytelling)
- **`<ThreeActs />` scroll narrative** — a 3 × 100vh scroll-pinned stage that replaces the previous boxy PillarsSection. As the user descends, the page physically embodies Balance → Build → Become:
  - Act I · Samatva · Balance · "Restore the foundations." · accent #7AAA8A (calm green) · icons Energy / Sleep / Calm
  - Act II · Bala · Build · "Develop strength." · accent #CD872A (terracotta-gold) · icons Stamina / Focus / Discipline
  - Act III · Utkarsha · Become · "Reach higher potential." · accent #C9A84C (deep gold) · icons Peak / Mastery / Longevity
- Each act has: massive Sanskrit character with hue-matched glow, large display headline, directive line, single italic micro-story, and a trio of icon medallions that replace text bullets.
- Left-rail vertical chapter navigator (Act I / II / III) — current dot enlarges with halo, label fades in; clickable to skip ahead.
- Cross-fading radial hue backdrops shift the section tone as the active act changes.
- Ghost "0X" anchor + chapter-ring SVG that draws when each act becomes active.
- Bottom progress thread is a tri-stop gradient (green → terracotta → gold) that fills as the user scrolls through the section — visualises the journey at all times.
- Manifesto + CTA reveal on Act III nearing completion ("Performance is not a destination. It is a continuous process of becoming." → "Find Your Starting Stage").
- All transitions use the same `cubic-bezier(0.16,1,0.3,1)` easing as the rest of the site for consistency.
