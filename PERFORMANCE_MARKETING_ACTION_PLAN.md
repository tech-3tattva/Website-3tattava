# 3TATTAVA — Performance Marketing Action Plan & Execution Log

**Basis:** Manus AI analysis (`Three_Tattava_Campaign_Strategy.md`, `Three_Tattava_Ad_Copy_Testing_Playbook.md`), verified Meta CSVs (`three_tattava_campaign_metrics.csv`, `three_tattava_audience_breakdowns.csv`), reporting cut-off 25 Jul 2026.
**Prepared as:** performance-marketing analyst + executor. Website changes below are **implemented locally, not deployed** (per instruction).

---

## 1. Diagnosis — the money is fine; the journey after the click is broken

The two "leads" in Ads Manager are **phantom** — they sit on an anomalous WhatsApp/Unknown platform row (134,258 impressions to a reach of 45 → frequency 2,984). Stripping that row and reading the **real Facebook delivery** for B1_Traffic_Prelaunch:

| Stage (clean, Facebook-only) | Value | Read |
|---|---:|---|
| Impressions | 36,778 | real reach base |
| Inline link clicks | 3,978 | **10.8% link-CTR** — excellent |
| Cost / link click | ₹0.22 | traffic is cheap |
| Website landing page views | 1,039 | **26.1% page-load rate → 74% of clicks never load the page** |
| Real verified leads | 0 | the 2 reported are phantom |
| LPV → Lead | ~0% | the page does not convert |

Recipe-A spent ₹788 sending 852 clicks to the **Instagram profile** (0 landing views, 0 leads) — a pure detour for waitlist acquisition.

**Two constraints, both website-fixable:**
1. **Click → page load (26% → target >70%)** — speed / redirect / a heavy homepage that isn't a landing page.
2. **Page view → waitlist lead (~0% → target 5%)** — the ad promises "founding waitlist" but the homepage leads with "START YOUR RITUAL" + ₹1,399 products; no matching offer.

---

## 2. What I implemented in code (website levers) — LOCAL, not deployed

| # | Lever (from strategy §7/§8) | Implementation | Status |
|---|---|---|---|
| A | **Dedicated mobile-first waitlist page** as the ad destination | New route `/waitlist` (`app/waitlist/page.tsx` + `components/waitlist/WaitlistLanding.tsx`): hero+form first, trust strip, what-you-get, product clarity, lab-report proof, short FAQ, repeat CTA + sticky mobile bar, thank-you state. Global nav/cart/footer stripped on this route via `ChromeGate` for speed + focus. | ✅ built |
| B | **Page-load speed** for paid traffic | The `/waitlist` page is a lean client island — no IntroSplash / GSAP / lenis / autoplay video; minimal framer-motion; form above the fold. Directly targets the 26% page-load rate. | ✅ built |
| C | **Genuine waitlist incentive** ("what members receive" §7) | Every new account gets a unique one-time **₹200 founding code** (see §3). The waitlist page advertises "₹200 off your first order at launch" as the concrete reason to join. | ✅ built |
| D | **Granular funnel tracking** (§8: form_view/start/error/submit) | Waitlist form fires `form_view` + `ViewContent` on view, `form_start` + `InitiateCheckout` on first focus, `Lead` + `generate_lead` on submit, `form_error` on failure (Meta Pixel + GA4), each once. Exposes the exact abandonment point. | ✅ built |
| E | **UTM + click-id capture** (§8 attribution) | `lib/attribution.ts` captures `utm_*`, `fbclid`, `_fbc`, `_fbp`, referrer, landing path (session-persisted) and posts them with each waitlist signup; backend `waitlist.routes.js` stores them + forwards `utm_campaign` to n8n. Lets you trace ad → CRM. | ✅ built |
| F | **Verified Lead event** (§8, §Day-0) | Meta Pixel standard `Lead` + GA4 `generate_lead` already fire on real form submit (prior work); now also on the dedicated page with product/category params + dedupe-friendly structure. | ✅ built (browser side) |
| G | **Thank-you state + secondary action** (§7) | On submit success the page shows "You're on the list" + optional Instagram follow / lab-report link — secondary actions only *after* submit. | ✅ built |

**Note on the homepage:** it stays a full brand site; paid waitlist ads should point at `/waitlist`, not `/`. The homepage also now surfaces the ₹200 offer via a notification popup (§3) to lift organic conversion.

---

## 3. Promo feature (₹200 one-time founding code) — LOCAL, not deployed

Doubles as the waitlist incentive and a launch-day conversion lever.

- **Issuance:** every new user (email / phone-OTP / Google signup) gets a unique code `W200XXXXXX` (flat ₹200, single-use, owner-bound), stored in the `Coupon` ledger + mirrored on the user.
- **Homepage notification:** `WelcomeOfferNotification` shows the code (logged-in), invites signup (logged-out), or shows "used ✓" + a link to order history (after redemption).
- **Enforcement:** validate/apply endpoints require the owner and block reuse; the code is marked used at order capture (demo + Cashfree verify + webhook).
- **Order history:** existing `/account/orders` shows past orders; welcome-coupon orders get a "Welcome ₹200 offer" badge; the account page shows offer status.

---

## 4. Ad-ops actions the TEAM must do in Meta (cannot be done in code)

Prioritised; these are the other half of the strategy (§9, §13, §14).

**Today / Day 0**
1. **Do NOT scale B1 yet.** Verify the WhatsApp/Unknown anomaly + the 2 "leads" in **Events Manager** (source, URL, event_id, timestamp, dedup). Treat them as invalid until proven.
2. **Stop the Instagram-profile path** (Recipe-A) as a waitlist route. Keep only as a separate, separately-budgeted profile-growth campaign if desired.
3. Fix the ad's final URL to the canonical **`https://www.3tattava.com/waitlist`** (not `http://`, not `/`).

**Days 1–3**
4. Point all acquisition ads at `/waitlist`. Confirm one test submission reconciles across site → Events Manager → n8n/CRM (UTMs now flow).
5. **Switch objective Traffic → Leads**, conversion location Website, optimize for the verified `Lead` event. (Pixel/CAPI `Lead` is live in code.)
6. Recut both videos to **9:16, 12–20s, hardcoded subtitles, product visible by 0:03, one CTA "Sign Up"** using the proof-first + taste-first scripts in the playbook. Ship ≥4 variants.
7. Launch prospecting (Leads → Website), broad serviceable India, ages 24–44, all genders; add a small retargeting ad set (7–14-day LPV-without-Lead + engagers); **exclude existing leads**.

**Days 4–14**
8. Hold edits days 4–6; monitor spend, event health, page-load rate, form errors.
9. Day 7: decide broad-vs-interest and proof-vs-taste on **verified CPL**.
10. Days 8–14: scale winners ~15–20% / 48h while CPL + quality hold; refresh weak first frames; test a Meta Instant Form as a benchmark only if page-load is still weak.

**UTM template for every ad URL:**
`?utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}`

---

## 5. KPI targets (internal diagnostic, from strategy §11)

| Metric | Current | First-repair target | Strong target |
|---|---:|---:|---:|
| Link click → landing page view | 26% | >50% | >70% |
| Landing page view → Lead | ~0% | 2–3% | 5%+ |
| Lead verification | unconfirmed | 100% testable | 100% reconciled |
| Profile-detour waitlist ads | 1 campaign | 0 | 0 |
| Ads with subtitles + single CTA | ~0 | 100% | 100% |

**Operating rules:** don't judge Ads Manager until test submissions reconcile; set a Target CPL from unit economics; pause a variant after ~1.5× Target CPL with no verified lead; scale winners gradually.

---

## 6. Status summary

- **Website / code levers (A–G) + promo feature:** implemented locally, verified by build/typecheck, **not deployed** (awaiting your go-ahead).
- **Ad-ops (§4):** requires Meta Ads Manager / Events Manager access — handed to the performance team with exact steps above.
