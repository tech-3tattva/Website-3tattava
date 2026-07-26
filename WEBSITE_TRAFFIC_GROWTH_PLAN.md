# 3TATTAVA — Website Traffic Growth & Ads Strategy

**Prepared as:** performance-marketing analyst + executor
**Inputs:** GA4 landing-page report (29 Jun–26 Jul 2026), the earlier Meta Ads analysis, and live market research on the India Shilajit/Ayurveda D2C category (2026).
**Status of the site:** pre-launch — products gated behind a waitlist, ₹0 revenue. So the near-term goal is **waitlist growth + brand/traffic + SEO foundation**, not ROAS. Everything below is calibrated to that.

---

## 1. Where you stand (GA4 + Meta, cross-validated)

| Signal | Value (28 days) | Read |
|---|---|---|
| Sessions | 1,591 (~57/day) | Traffic is **very low** — top-of-funnel is the constraint |
| Landing split | **92.6% land on `/`**, 2.8% on `/waitlist` | Ads/organic dump onto the homepage, not the built waitlist LP |
| Avg engagement/session | **12s** (homepage 11s) | **Critical** — visitors leave almost instantly |
| Content pages | research-testing **49s**, education **47s**, products **34s** | Content holds attention **3–4× longer** than the homepage — but gets ~1–5 sessions each (starved) |
| Key events | **3 total** = 0.19% of sessions | Bottom funnel dead — **exactly matches** the 0.19% Meta lead rate → the leak is systemic, not random |
| New vs returning | ~96% new | **No retention/remarketing loop** |
| /waitlist engagement | 3s | The LP is barely fed and bounces — needs traffic + a speed/hook check |

**Diagnosis:** you don't have a traffic problem you can fix by "spending more." You have (a) too little traffic, (b) that traffic lands on the wrong page and disengages in ~12s, and (c) near-zero conversion. Pour more spend in now and you burn it. **Fix the leaks, then scale.**

---

## 2. What the market is doing right now (India, 2026)

**Demand is surging and in your favour:**
- Shilajit is one of India's **most-searched** Ayurvedic supplements; India market ~USD 30.5M (2025), category CAGR ~9–10%.
- **Resin form is the fastest-growing** sub-segment (~10.6% CAGR) — RockResin sits in the winning format.
- Online retail growing ~10.2% CAGR; 100+ brands now sell shilajit → **quality/purity + third-party testing is THE #1 differentiator**, and most brands under-deliver on it.

**This is 3Tattava's built-in wedge.** Your NABL lab reports + Dr. Kashish (BAMS) + Triphala purification + "proof-first" is *exactly* what the category rewards and what competitors fake.

**Competitor playbook (who you're up against):**
- **Kapiva** — premium "Modern Ayurveda", ~35% of revenue to digital, heavy **content + SEO**, celebrity (Tiger Shroff) + **gym/performance** angle. Directly attacks steroid/shortcut behaviour.
- **Upakarma** — closest rival: **pure resin + NABL lab-tested + heavy digital + every marketplace** (Amazon/Flipkart/Nykaa/1MG/Healthkart). Same "pure, tested" story you use — you must out-proof them.
- **Man Matters** — men's-health **quiz-funnel** acquisition (your assessment quiz is the same weapon).
- **Dr. Vaidya's** — value/affordability + male-vitality.

**Channel economics (2026 benchmarks):**
- Meta CPMs up 40–60% since 2023; wellness CAC ~₹500–800; **winners ship 15–20 fresh creatives/month**; **Founder-story (<15s, hook in first 2–3s) is the #1 format**.
- **Google Search = highest-intent**, ROAS 4.5–8× — captures people already typing "shilajit". **Google Shopping** = highest-ROAS for a live catalogue (₹5–15 CPC) — unlocks at launch.
- **Influencer has become a performance channel** — micro/nano (10k–200k), cost-per-sale via unique codes, compliance-first.
- **Retention > acquisition**; supplements reach profitability faster via repeat purchase.
- **FSSAI / ASCI compliance** gates every claim — your doctor-led, evidence-first content is an advantage here, not a constraint.

---

## 3. The strategy — own "Proof-First Performance Ayurveda"

One positioning, everywhere: **the shilajit you can verify.** Doctor-formulated (Dr. Kashish, BAMS), NABL third-party reports on the page, Triphala-purified, resin + honey-stick formats. This is the single thing the market rewards and competitors can't easily copy. Every ad, article, and landing section ladders to it.

Because you're pre-launch, the funnel goal is **email/phone on the founding waitlist** (with the ₹200 founding code as the incentive — already built), plus **seeding SEO + brand search** so launch day converts warm demand instead of cold.

---

## 4. Channel plan — what to run, in order

### Phase 0 — Fix the leaks (Week 1, before scaling spend)
1. **Point ALL paid traffic to `/waitlist`**, never `/`. (The dedicated LP is built and fast; the homepage is a brand site that bounces at 11s.)
2. **Investigate the 12s engagement / 3s on /waitlist** — check real-device mobile load speed, and that the hook + form are above the fold on 360px screens. (Meta showed only 26% of clicks even become page-views — same root cause.)
3. **Verify Lead tracking end-to-end** (Meta Pixel `Lead` + GA4 `generate_lead` are already wired) and mark `generate_lead` as a **Key event** in GA4 so conversions actually register (right now GA logs 3 — that's the tracking + the leak).
4. **Google Search Console:** request indexing for `/`, `/education/*`, `/research-testing` (content is your SEO asset).

### Phase 1 — Paid acquisition (Weeks 1–4)
| Priority | Channel | Objective / destination | Budget guide | Why |
|---|---|---|---|---|
| 1 | **Google Search** | Search → `/waitlist` (or product at launch) | 35% (~₹300–500/day) | **Highest intent, biggest current gap.** You are invisible to people already searching "shilajit". Bid on brand + category ("pure shilajit resin", "best shilajit brand", "shilajit benefits", "NABL tested shilajit") + competitor-conquest (Kapiva/Upakarma/Dr Vaidya's). ROAS 4.5–8× at launch. |
| 2 | **Meta — Leads (not Traffic)** | Leads → `/waitlist` | 40% (~₹400–500/day) | Fixes the earlier mistake (Traffic objective + Instagram-profile detour). Proof-first + founder-story creative, <15s, exclude existing leads, retarget engagers. |
| 3 | **Meta/Google retargeting** | site visitors + video viewers → `/waitlist` | (within the above) | Fixes the 96%-new / no-return leak. |

### Phase 2 — Content/SEO engine (Weeks 2–8, compounding, highest long-term ROI)
Your education pages already hold **47s** — that's a moat competitors spent years building. Feed it:
- Publish/optimize high-intent articles: **"what is shilajit", "shilajit benefits for men", "best time to take shilajit", "how to identify pure/fake shilajit", "shilajit resin vs capsule vs gummy", "shilajit vs ashwagandha", "NABL lab report — how to read it".**
- Answer-first + FAQ/Article schema (already built) → wins Google + AI Overviews.
- Internal-link every article → `/waitlist` + product pages. This turns free search traffic into waitlist signups. **This is how Kapiva & Upakarma win — replicate it with your proof advantage.**

### Phase 3 — Influencer as a performance channel (Weeks 2–8)
- Micro/nano **Ayurveda + gym/fitness** creators (10k–200k), **cost-per-signup/sale via unique ₹200 codes** — your influencer/PromoCode + referral system is already built for exactly this.
- Compliance-first briefs (educate → then offer). Founder (Dr. Kashish) collabs = authenticity Kapiva buys with celebrities, you get with credibility.

### Phase 4 — Retention loop (ongoing)
- WhatsApp + email nurture for the waitlist (n8n already wired) → warm them to launch.
- Build remarketing/lookalike audiences from waitlist signups (first-party) once you have volume.

### At launch (unlock)
- Un-gate products + add **Product/price schema** → turn on **Google Shopping + Performance Max** (highest-ROAS catalogue formats) and list on **Amazon** (treat as a search engine — where Upakarma dominates).

---

## 5. Budget allocation (pre-launch, ~₹800–1,500/day)
- **35% Google Search** (capture existing intent — your biggest miss today)
- **40% Meta Leads + retargeting** (waitlist volume)
- **15% Influencer/UGC** (authentic reach + creative fuel)
- **10% Testing** (new hooks/audiences)
- Shift toward **Google Shopping/PMax + ROAS** the day products go live.

---

## 6. Creative angles (proof-first, ship 15–20/month, <15s, hook in 2–3s)
1. **Founder story** — Dr. Kashish, why he built it (the #1-performing D2C format in 2026).
2. **"Proof before promise"** — the NABL report full-screen next to the jar.
3. **"How to spot fake shilajit"** — educational, high-share, positions you as the honest expert (directly exploits the "100+ brands, quality varies" market anxiety).
4. **Taste-objection / convenience** — Shahjeet honey stick: Tear · Squeeze · Perform.
5. **Performance angle** — beat Kapiva's celebrity play with *proof + doctor*, not a face.

---

## 7. Targets (diagnostic, next 60 days)
| Metric | Now | Target |
|---|---|---|
| Sessions/day | ~57 | 200+ (search + content + fixed paid) |
| Avg engagement/session | 12s | 45–60s+ |
| Ad click → landing-page view | 26% | >70% |
| Landing-page → waitlist lead | 0.19% | 3–5% |
| Returning users | ~4% | 15%+ (retargeting + nurture) |
| Indexed SEO articles ranking | few | 10+ high-intent queries on page 1–2 |

---

## 8. What's website work vs ad-ops
- **Already built (ready to use):** dedicated `/waitlist` LP, Meta Pixel `Lead` + GA4 `generate_lead`, UTM/click-id capture, ₹200 founding promo, influencer/referral codes, assessment quiz + profile, SEO content + schema, sitemap.
- **Small website to-dos I can do on request:** mark `generate_lead` as a GA4 Key event guidance, homepage/`/waitlist` mobile-speed pass, publish/optimize the SEO article set, add Product schema + un-gate at launch.
- **Ad-ops (your team, needs Meta/Google account access):** build the Google Search campaign, switch Meta to Leads → `/waitlist`, produce the creative set, set up influencer codes, request indexing in GSC. (I have no ad-account access — these are execution steps for the team.)

**Bottom line:** the category demand and your proof-first positioning are ideal; the money problem today is *too little traffic landing on the wrong page and leaving in 12s*. Turn on **Google Search (intent) + content/SEO (compounding) + Meta Leads → /waitlist (volume)**, fix the engagement leak first, and you convert a surging market instead of paying to bounce it.
