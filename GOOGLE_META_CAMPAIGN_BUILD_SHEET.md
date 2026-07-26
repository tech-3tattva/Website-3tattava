# 3TATTAVA — Google Search + Meta Leads Campaign Build Sheet

**Purpose:** A paste-ready execution doc. A team member with Google Ads + Meta Ads Manager access can build both campaigns end-to-end from this file with no further questions.

**Status:** PRE-LAUNCH. Products gated behind a founding waitlist. Goal = **waitlist signups + qualified traffic**, NOT ROAS. Every ad points to the founding waitlist LP.

**Positioning wedge (say it everywhere):** *Proof-First Performance Ayurveda* — the Shilajit you can verify. Dr. Kashish (BAMS) doctor-formulated · NABL third-party lab reports · Triphala-purified · resin (RockResin) + honey sticks (Shahjeet).

**Single ad destination:** `https://www.3tattava.com/waitlist` (fast, has email/phone form + ₹200 founding offer; Meta Pixel `Lead` + GA4 `generate_lead` fire on submit; UTM/click-id capture is live). **Exception:** informational/benefit search terms route to the matching `/education/*` article, which then links to `/waitlist`.

**Total budget guide:** ~₹800–1,500/day → **35% Google Search · 40% Meta Leads+retargeting · 15% influencer · 10% testing.** This sheet covers the Google Search (~₹300–500/day) and Meta (~₹400–500/day) portions.

> **Compliance is load-bearing (FSSAI + ASCI).** Educational tone only. NO disease/cure claims, NO testosterone/"boost T" guarantees, NO before/after, NO "guaranteed results", NO doctor implying treatment of illness. See the Do-Not-Do checklist in Section C. Every line of copy below is written to be FSSAI/ASCI-safe — keep it that way when you localise or expand.

---

## SECTION A — GOOGLE SEARCH CAMPAIGN

### A1. Campaign settings

| Setting | Value |
|---|---|
| **Campaign type** | Search |
| **Objective** | "Leads" (or build **without a goal's guidance** and set the conversion action manually — same result) |
| **Networks** | **Search Network ONLY.** UNCHECK "Include Google Display Network." UNCHECK "Include Google search partners" for the first 30 days (cleaner data; re-test partners later). |
| **Locations** | **India** (all). Target by *presence* ("People in or regularly in your targeted locations"), NOT "presence or interest." Add a **location bid adjustment +15–20% on Delhi NCR** (serviceable focus — Delhi, Gurugram, Noida, Ghaziabad, Faridabad) as a nested location. |
| **Languages** | **English + Hindi** (many Hindi-UI users search shilajit terms in English/Hinglish — include both so you don't miss reach). |
| **Bidding — with conversion history** | **Maximize conversions**, optimising for the `Lead` conversion action. (Switch to **Maximize conversions with a Target CPA** once you have ~30 leads/30 days; start tCPA around ₹120–200 and loosen if volume drops.) |
| **Bidding — NO conversion history (Day 1)** | **Maximize clicks with a Max CPC cap of ₹22** (range ₹18–25). Run this for the first ~10–14 days / until ≥15 imported Lead conversions, THEN switch to Maximize conversions. Do NOT start on a conversion-based smart-bid strategy with zero conversion data — it will under-deliver. |
| **Daily budget** | **₹300–500/day** (start ₹400). Campaign-level budget; single campaign. |
| **Ad rotation** | "Optimize: prefer best performing ads." |
| **Ad schedule** | All day to start (thin data). After 2 weeks, review the hour/day report and trim dead hours if needed. |
| **Devices** | All. Expect ~80% mobile — ensure `/waitlist` mobile hook + form are above the fold (coordinate with site team). |
| **Conversion action** | See A2. |
| **Final URL** | `https://www.3tattava.com/waitlist` (except the Benefit/informational ad group → article URL; see A3-6). |
| **Brand exclusions / brand lists** | N/A for Search; keep DSA off for now. |

### A2. Conversion action (set BEFORE launch)

**Preferred path — import GA4 `generate_lead`:**
1. Google Ads → **Tools → Data manager → Google Analytics 4 → Link** the GA4 property.
2. GA4: confirm **`generate_lead` is marked as a Key event** (site team confirms it fires on waitlist submit).
3. Google Ads → **Goals → Conversions → New conversion action → Import → GA4 web → select `generate_lead`.**
4. Settings: **Category = Submit lead form**, **Count = One** (one lead per click — a person is one lead), **Attribution = Data-driven** (fallback last-click), **Conversion window = 30 days**, **Include in "Conversions" = Yes** (this is what Smart Bidding optimises to). Mark as **Primary**.

**Fallback path — native Google tag Lead event** (if GA4 import lag is a problem): install the Google tag on the site, define a website conversion on the **waitlist form-submit event / thank-you state**, same settings as above. Use ONE method as Primary to avoid double-counting; keep the other as "Secondary / observe."

**Verify end-to-end before spending:** submit a real test lead, confirm it appears in GA4 realtime AND lands in Google Ads "All conv." within 24–48h. Do not scale until a test conversion is confirmed.

### A3. Ad groups, keywords & match types

**Match-type strategy:** Lead with **Phrase** + a few **Exact** on your money terms; add **Broad** ONLY on brand and a couple of proven category heads AFTER Smart Bidding is on (broad needs conversion signal to behave). Notation: `[exact]`, `"phrase"`, `broad` (no symbols). Keep each ad group tightly themed so the RSA matches intent.

#### Ad Group 1 — BRAND  *(destination: /waitlist · bid low, brand is cheap · Broad OK here)*
```
[3tattava]
[3 tattava]
"3tattava"
"3 tattava"
"3tattava shilajit"
"3 tattava shilajit"
"tattava shilajit"
"3tattava resin"
"3tattava rockresin"
"3tattava shahjeet"
"3tattava waitlist"
"3tattava founding offer"
3tattava           (broad)
3 tattava shilajit (broad)
```

#### Ad Group 2 — CATEGORY · RESIN  *(destination: /waitlist · your winning format)*
```
"pure shilajit resin"
"himalayan shilajit resin"
"shilajit resin online"
"buy shilajit resin"
"shilajit resin"
"original shilajit resin"
"real shilajit resin"
"classically purified shilajit"
"shilajit resin india"
"best shilajit resin"
"shilajit paste"
"authentic shilajit resin"
[pure shilajit resin]
[buy shilajit resin]
[shilajit resin online]
```

#### Ad Group 3 — CATEGORY · GENERIC  *(destination: /waitlist · high volume, add negatives aggressively)*
```
"pure shilajit"
"best shilajit"
"original shilajit"
"shilajit"
"buy shilajit online"
"shilajit online"
"real shilajit"
"authentic shilajit"
"genuine shilajit"
"best shilajit brand"
"pure himalayan shilajit"
"shilajit india"
[pure shilajit]
[best shilajit]
[original shilajit]
```

#### Ad Group 4 — HONEY STICKS / FORMAT  *(destination: /waitlist)*
```
"shilajit honey sticks"
"shilajit sachets"
"shilajit honey"
"shilajit sticks"
"honey shilajit"
"shilajit single serve"
"shilajit on the go"
"shilajit sachet online"
"buy shilajit sachets"
"shahjeet"
[shilajit honey sticks]
[shilajit sachets]
```

#### Ad Group 5 — PROOF / QUALITY INTENT  *(destination: /waitlist · your wedge — highest-converting theme)*
```
"nabl tested shilajit"
"lab tested shilajit"
"third party tested shilajit"
"how to check pure shilajit"
"how to identify pure shilajit"
"how to test shilajit purity"
"is my shilajit real"
"certified shilajit"
"shilajit lab report"
"shilajit purity test"
"how to spot fake shilajit"
"authentic shilajit test"
[nabl tested shilajit]
[lab tested shilajit]
```

#### Ad Group 6 — BENEFIT / INFORMATIONAL  *(destination: the matching /education/* ARTICLE, NOT /waitlist)*
> **Why:** these searchers are researching, not buying. Sending them to a waitlist LP wastes the click. Route to the doctor-written article that answers the query; the article internal-links to `/waitlist`. Point each keyword cluster's RSA `Final URL` at the relevant article (site team confirms exact slugs).
```
"shilajit benefits"
"shilajit benefits for men"
"shilajit for men"
"benefits of shilajit"
"best time to take shilajit"
"how to take shilajit"
"shilajit dosage"
"what is shilajit"
"shilajit uses"
"shilajit for women"
"shilajit vs ashwagandha"
"shilajit resin vs capsule"
```
*(Split into 2–3 sub-ad-groups if you want per-article Final URLs: "benefits", "how-to-take/dosage", "what-is/compare".)*

#### Ad Group 7 — COMPETITOR CONQUEST  *(destination: /waitlist · SEPARATE campaign or clearly labelled ad group · Phrase/Exact only, low budget cap)*
```
"kapiva shilajit"
"upakarma shilajit"
"dr vaidya shilajit"
"dr vaidya's shilajit"
"kapiva shilajit resin"
"upakarma shilajit resin"
"man matters shilajit"
"dabur shilajit"
[kapiva shilajit]
[upakarma shilajit]
[dr vaidya shilajit]
```
> **⚠ Policy note (read before launching):** You MAY bid on competitor brand terms as **keywords**. You may NOT use a competitor's trademark **in your ad text** — the RSA for this group (A4-Competitor) is written comparison-style with NO brand names. Expect **higher CPCs and lower Quality Scores** (your landing page isn't about them); cap this ad group's contribution (~10–15% of Search spend) and watch CPL. If a competitor files a trademark complaint on keywords, pause and switch to pure comparison/category terms. Keep this ad group in its own campaign if you want a hard budget wall around it.

### A4. Shared NEGATIVE keyword list (apply as a campaign/account-level negative list)

Create a negative keyword LIST named `NEG_Shared_Shilajit` and attach to the Search campaign. Match types shown; most as phrase/broad negatives.

**Free / freebie / non-buyers**
```
free
free sample
free shipping only
freebie
```
**Safety / side-effect / medical-scare (informational, not buyer — and compliance-risky to serve ads against)**
```
side effects
side effect
harmful
dangerous
is shilajit safe   (route via SEO, not paid)
shilajit banned
shilajit fda
```
**Jobs / research / academic / brand-irrelevant**
```
jobs
job
vacancy
salary
wikipedia
meaning
in hindi meaning
quora
reddit
pdf
research paper
study
```
**Format you don't sell (remove any you DO sell)**
```
capsule
capsules
tablet
tablets
gummies
gummy
powder
```
**Price-shopping / discount-junk / low-intent**
```
cheap
cheapest
lowest price
price list
wholesale
bulk
distributor
franchise
dealer
```
**Competitor own-brand where you DON'T want to appear (only if NOT running the conquest group; otherwise let the conquest group serve)**
```
patanjali
patanjali shilajit
dabur shilajit   (move to conquest if you decide to bid it)
```
**Unrelated / irrelevant intents**
```
gold shilajit price   (gold-jewelry cross-match)
shilajit stone
shilajit rock price
recipe
how to make shilajit
diy shilajit
```
> Review the **Search Terms report** every 2–3 days for the first 3 weeks and keep mining negatives — generic "shilajit" pulls a lot of junk.

### A5. Responsive Search Ads (RSAs)

Build **1 RSA per ad group** (add a 2nd variant per ad group after week 1 for testing). Google limits: **15 headlines (≤30 chars), 4 descriptions (≤90 chars).** Pin sparingly — pin ONE brand/proof headline to position 1 only in Brand + Competitor groups; otherwise leave unpinned so Google can optimise. Every headline/description below is within limits and FSSAI/ASCI-safe.

---

#### RSA — Ad Group 1: BRAND
**Headlines (15):**
1. 3TATTAVA Official Store
2. 3TATTAVA Shilajit
3. Buy 3TATTAVA Shilajit
4. 3TATTAVA Founding Offer
5. Join the 3TATTAVA Waitlist
6. 3 Tattava Shilajit Resin
7. Proof-First Shilajit
8. NABL-Tested Shilajit
9. Doctor-Formulated Resin
10. Triphala-Purified Resin
11. Founding Offer: ₹200 Off
12. Verified Himalayan Shilajit
13. The Shilajit You Can Verify
14. Reserve Your Founding Price
15. Lab-Tested Resin & Sticks

**Descriptions (4):**
1. Classically purified Himalayan Shilajit resin. NABL third-party lab-tested.
2. Doctor-formulated by Dr. Kashish, BAMS. Triphala-purified. Reserve ₹200 off.
3. The Shilajit you can verify — real NABL reports, not marketing. Early access.
4. RockResin & Shahjeet honey sticks. Founding waitlist open. Lock your price.

*(Pin "3TATTAVA Official Store" to Headline position 1.)*

---

#### RSA — Ad Group 2: CATEGORY · RESIN
**Headlines (15):**
1. Pure Shilajit Resin
2. Himalayan Shilajit Resin
3. Buy Shilajit Resin Online
4. Classically Purified Resin
5. NABL-Tested Shilajit Resin
6. Lab-Tested Resin
7. Real Himalayan Shilajit
8. Triphala-Purified Resin
9. Doctor-Formulated Resin
10. Shilajit Resin, Verified
11. The Resin You Can Verify
12. Founding Offer: ₹200 Off
13. Original Shilajit Resin
14. Not Diluted. Lab-Proven.
15. Reserve Founding Price

**Descriptions (4):**
1. Classically purified Himalayan Shilajit resin with real NABL reports on page.
2. Doctor-formulated, Triphala-purified resin. Join the founding waitlist today.
3. See the third-party report before you buy. Proof-first resin. Reserve ₹200 off.
4. The fastest-growing resin form, done right. Founding waitlist now open.

---

#### RSA — Ad Group 3: CATEGORY · GENERIC
**Headlines (15):**
1. Pure Himalayan Shilajit
2. Original Shilajit
3. Best Shilajit, Verified
4. NABL-Tested Shilajit
5. Lab-Tested Shilajit
6. Doctor-Formulated Shilajit
7. Triphala-Purified Shilajit
8. Real, Verifiable Shilajit
9. The Shilajit You Can Verify
10. Proof-First Shilajit
11. Founding Offer: ₹200 Off
12. Himalayan Shilajit Resin
13. Shilajit, Third-Party Tested
14. How to Spot Real Shilajit
15. Skip the Fakes. Get Proof.

**Descriptions (4):**
1. 100+ brands, quality varies. See our NABL third-party reports before you buy.
2. Doctor-formulated Himalayan Shilajit, Triphala-purified. Founding waitlist open.
3. Proof-first Shilajit you can actually verify. Reserve your ₹200 founding offer.
4. Classically purified resin & honey sticks. Early access on the founding waitlist.

---

#### RSA — Ad Group 4: HONEY STICKS / FORMAT
**Headlines (12):**
1. Shilajit Honey Sticks
2. Shahjeet Honey Sticks
3. Shilajit Sachets
4. Tear. Squeeze. Perform.
5. Shilajit, No Bitter Taste
6. On-the-Go Shilajit
7. Honey Shilajit Sticks
8. NABL-Tested Honey Sticks
9. Easy Daily Shilajit
10. Founding Offer: ₹200 Off
11. Doctor-Formulated Sticks
12. Single-Serve Shilajit

**Descriptions (4):**
1. Shahjeet honey Shilajit sticks — tear, squeeze, done. No mess, no bitter taste.
2. Single-serve Shilajit sticks, NABL third-party tested. Founding waitlist open.
3. Convenient daily Shilajit in honey. Reserve your ₹200 founding offer today.
4. Doctor-formulated, Triphala-purified — now in an easy honey stick. Early access.

---

#### RSA — Ad Group 5: PROOF / QUALITY INTENT
**Headlines (12):**
1. NABL-Tested Shilajit
2. Lab-Tested Shilajit Resin
3. See the Lab Report First
4. How to Check Pure Shilajit
5. Third-Party Tested Resin
6. Proof Before Promise
7. Real NABL Reports, On Page
8. Verify Your Shilajit
9. Spot Fake Shilajit
10. Doctor-Formulated Proof
11. Certified Pure Shilajit
12. Founding Offer: ₹200 Off

**Descriptions (4):**
1. Every batch NABL third-party lab-tested. Read the actual report on the page.
2. Learn how to check for pure Shilajit — and see our proof. Founding waitlist open.
3. Proof before promise: real reports, doctor-formulated, Triphala-purified.
4. Don't guess if it's real — verify it. Reserve your ₹200 founding offer.

---

#### RSA — Ad Group 6: BENEFIT / INFORMATIONAL  *(Final URL = /education article, softer CTA)*
**Headlines (12):**
1. What Is Shilajit?
2. Shilajit Benefits Guide
3. Shilajit for Men: Facts
4. Best Time to Take Shilajit
5. Shilajit Dosage Guide
6. Doctor-Written Shilajit Guide
7. Shilajit: The Evidence
8. How Shilajit Works
9. Shilajit, Explained
10. Read Before You Buy
11. Shilajit vs Ashwagandha
12. Resin vs Capsule vs Gummy

**Descriptions (4):**
1. Doctor-written guide to Shilajit — benefits, dosage, and how to verify quality.
2. Evidence-first answers on Shilajit, by Dr. Kashish, BAMS. No hype, just facts.
3. Learn what to look for in Shilajit, then join our founding waitlist for access.
4. Understand the forms, timing and purity checks before you choose a Shilajit.

---

#### RSA — Ad Group 7: COMPETITOR CONQUEST  *(NO competitor names in copy — comparison framing only)*
**Headlines (10):**
1. Compare Shilajit Brands
2. Shilajit, But Verifiable
3. NABL-Tested Shilajit
4. The Proof-First Choice
5. See Our Lab Reports
6. Doctor-Formulated Shilajit
7. Switch to Verified Shilajit
8. Pure Resin, Real Reports
9. Founding Offer: ₹200 Off
10. Shilajit You Can Verify

**Descriptions (4):**
1. Choosing a Shilajit? Compare on proof: NABL third-party reports, doctor-made.
2. Real lab reports on the page, not just claims. Join the founding waitlist.
3. Proof-first Himalayan Shilajit resin. Reserve your ₹200 founding offer.
4. Classically purified, Triphala-purified, NABL-tested. See the difference.

*(Pin "The Proof-First Choice" or "Shilajit, But Verifiable" to Headline 1 so no competitor-adjacent auto-combination looks like impersonation.)*

### A6. Assets (add at CAMPAIGN level; they show across ad groups)

**Sitelinks (4–6; link text ≤25 chars, each with 2 descriptions ≤35 chars):**
| Sitelink text | Final URL | Description line 1 | Description line 2 |
|---|---|---|---|
| How We Verify Purity | /research-testing | NABL third-party lab reports | Tested every batch |
| Meet Dr. Kashish | /our-story | BAMS, doctor-formulated | Proof-first Ayurveda |
| Founding ₹200 Offer | /waitlist | Lock your founding price | Early access, limited |
| How to Spot Fake Shilajit | /education (article) | Doctor-written guide | Verify before you buy |
| RockResin & Shahjeet | /waitlist | Resin + honey sticks | Reserve early access |
| Shilajit Benefits | /education (article) | Evidence-first, no hype | Read the doctor's guide |

**Callouts (8; ≤25 chars each):**
```
NABL Third-Party Tested
Doctor-Formulated
Triphala-Purified
Classically Purified
Real Lab Reports on Page
₹200 Founding Offer
Resin & Honey Sticks
Made in India
```

**Structured snippets (2 headers):**
```
Header "Types": RockResin, Shahjeet Honey Sticks, Shilajit Resin, Honey Sachets
Header "Styles": Classically Purified, Triphala-Purified, NABL-Tested, Doctor-Formulated
```

**Other assets:** add **Business name + Logo** (brand assets). Skip call/location assets (no phone-sale/store). Skip promotion asset unless you want the ₹200 offer as a formal promotion extension (optional — "Founding offer, ₹200 off").

---

## SECTION B — META LEADS CAMPAIGN

### B1. Campaign structure

| Level | Setting |
|---|---|
| **Objective** | **Leads** (NOT Traffic, NOT Engagement — this was the earlier mistake). |
| **Conversion location** | **Website** (NOT Instant Forms — we want the on-site `/waitlist` form so GA4 + Pixel + UTM capture fire and the ₹200 offer context shows). |
| **Performance goal / optimise for** | **Maximise number of conversions →** the Pixel **`Lead`** event. (If `Lead` volume is too thin in the first days, temporarily optimise for `Landing Page Views` on the prospecting set for ~3–4 days to seed the pixel, then switch back to `Lead`.) |
| **Pixel** | Existing 3Tattava pixel; event = `Lead` (fires on waitlist submit — site team confirmed). Confirm the event shows "Active" and "Received in last 24h" in Events Manager before spending. Set **`Lead` as the tracked conversion event.** |
| **Budget** | **Advantage Campaign Budget (CBO) OFF to start** (control learning at ad-set level), OR CBO ON with the 70/30 split enforced via min/max — recommend **ad-set budgets** first. Split **70% prospecting / 30% retargeting.** e.g. at ₹450/day → **Prospecting ₹315, Retargeting ₹135.** |
| **Placements** | **Advantage+ placements** (let Meta optimise; feed vertical creative for all). |
| **Attribution** | 7-day click / 1-day view (default). |
| **Special ad category** | **None** (wellness/supplement is not a restricted category — but health-claim rules still apply; see Do-Not-Do). |
| **Destination URL** | `https://www.3tattava.com/waitlist` + the Meta UTM template (Section C1) in the ad's "URL parameters" field. |

### B2. Ad sets

**Ad Set 1 — PROSPECTING · BROAD  (largest share of the 70%)**
- **Audience:** Advantage+ audience / broad. Location **India**. **Age 24–44. All genders.**
  - *Note for the team:* do NOT hard-restrict to male. Shilajit skews male in *delivery*, but that's the algorithm following conversions, not the truth of the audience — women buy for partners/parents and Shahjeet has broad appeal. Start all-genders and let delivery decide; only narrow if data forces it.
- **Detailed targeting:** none (broad) — or use Advantage+ audience with your interest list as a *suggestion*, not a cap.
- **Optimise:** `Lead`. **Budget:** ~45% of daily (bulk of prospecting).

**Ad Set 2 — PROSPECTING · INTEREST  (rest of the 70%)**
- **Audience:** India, 24–44, all genders. **Interests (OR):** Ayurveda, Shilajit, Dietary supplement, Bodybuilding, Physical fitness / Gym, Wellness, Herbal medicine, Men's health, Testosterone (as *interest topic* only — do NOT claim to raise it), Ashwagandha.
- **Optimise:** `Lead`. **Budget:** ~25% of daily.
- Purpose: a warm-ish seed + a comparison read against pure broad. Kill it if broad wins after 2 weeks.

**Ad Set 3 — RETARGETING  (the 30%)**
- **Audiences (Custom Audiences, OR-combined):**
  - Website visitors **last 7–14 days** (all pages).
  - **Video viewers** — watched ≥25% (or ≥15s) of any prospecting video, last 14 days.
  - **Instagram + Facebook engagers**, last 14 days.
- **EXCLUDE:** `Lead` completers (waitlist submitters) — custom audience of people who fired `Lead`, and/or the first-party waitlist list once uploaded. Also exclude in prospecting sets so you don't pay to re-acquire signed-up users.
- **Optimise:** `Lead`. **Budget:** 30% of daily.
- Creative: proof + urgency + objection-handling (fake-shilajit, lab report, "founding price closing").

### B3. Creative briefs — 5 concepts

All: **9:16 vertical, burned-in subtitles (sound-off default), hook in first 2–3s, ≤30s (aim 15s), CTA button = "Sign Up".** Ship variants; winners get scaled. Founder/proof formats are the 2026 #1 performers.

---

**Concept 1 — FOUNDER STORY (Dr. Kashish)** · *the flagship*
- **Hook (0–3s):** Dr. Kashish, direct to camera: *"I'm an Ayurvedic doctor — and most Shilajit sold in India wouldn't pass a lab test."*
- **15s beats:** (3–6s) credential + why he built it → (6–10s) the problem: 100+ brands, purity varies, buyers can't tell → (10–14s) what we do: Triphala purification + NABL third-party testing, hold up jar + report → (14–15s) *"Join the founding waitlist."*
- **On-screen text:** "Dr. Kashish · BAMS" / "NABL third-party tested" / "Founding waitlist open"
- **CTA:** Sign Up · **Format:** 9:16, subtitles.

**Concept 2 — PROOF BEFORE PROMISE**
- **Hook (0–3s):** *"Anyone can say 'pure'. Can they show you the report?"* (a real NABL report slaps onto screen next to the jar)
- **15s beats:** (3–8s) scroll the actual lab report, highlight "third-party / NABL" → (8–12s) *"We put our proof on the page — before you buy."* → (12–15s) resin + sticks + founding offer.
- **On-screen text:** "Real NABL report" / "Proof, not marketing" / "₹200 founding offer"
- **CTA:** Sign Up · **Format:** 9:16, subtitles.

**Concept 3 — HOW TO SPOT FAKE SHILAJIT** · *high-share, educational*
- **Hook (0–3s):** *"3 quick ways to check if your Shilajit is the real thing."*
- **15s beats:** (3–12s) three fast, factual checks (e.g. dissolves clean in warm water, texture/purity cues, "ask for a third-party lab report") — framed as consumer education, NO health claims → (12–15s) *"Or skip the guesswork — we show our NABL report. Founding waitlist open."*
- **On-screen text:** "1 · 2 · 3" checks / "Always ask for the lab report" / "See ours →"
- **CTA:** Sign Up · **Format:** 9:16, subtitles.

**Concept 4 — TASTE / CONVENIENCE (Shahjeet honey stick)**
- **Hook (0–3s):** *"Shilajit… without the bitter taste?"* (hand tears a stick)
- **15s beats:** (3–8s) tear → squeeze → straight from the stick, honey texture → (8–12s) *"Same proof-first Shilajit. NABL-tested. Now easy."* → (12–15s) *"Tear. Squeeze. Perform. Join the waitlist."*
- **On-screen text:** "Tear · Squeeze · Perform" / "No bitter taste" / "NABL-tested"
- **CTA:** Sign Up · **Format:** 9:16, subtitles.

**Concept 5 — PERFORMANCE / GYM (proof, not a celebrity)**
- **Hook (0–3s):** *"Everyone's got a Shilajit. Almost no one's got the lab report."*
- **15s beats:** (3–8s) gym/routine b-roll, a jar in a gym bag — lifestyle, no claims → (8–12s) *"We beat the hype with proof — doctor-formulated, NABL-tested."* → (12–15s) founding waitlist + ₹200.
- **On-screen text:** "Proof > hype" / "Doctor-formulated · NABL-tested" / "Founding offer inside"
- **CTA:** Sign Up · **Format:** 9:16, subtitles.
- **⚠ Compliance:** show routine/ritual only. NO muscle-gain, testosterone, stamina, or performance-outcome guarantee.

---

### B4. Ad copy library (mix-and-match; all FSSAI/ASCI-safe)

**Primary text — 10 variants** (aim first line to land the hook before the "…more" fold, ~125 chars):
1. Not all Shilajit is real. We put our NABL third-party lab reports on the page — see the proof before you decide. Founding waitlist now open (₹200 offer inside). 🔗
2. Doctor-formulated by Dr. Kashish (BAMS). Triphala-purified. NABL third-party tested. This is the Shilajit you can actually verify. Join the founding waitlist.
3. 100+ Shilajit brands. Quality varies wildly. Ours comes with a real lab report — not a marketing claim. Reserve your ₹200 founding offer.
4. Classically purified Himalayan Shilajit resin, tested by an independent NABL lab. Proof before promise. Early access on the founding waitlist.
5. Bitter Shilajit? Not anymore. Shahjeet honey sticks — tear, squeeze, done. Same NABL-tested purity, zero mess. Join the founding waitlist.
6. Before you buy any Shilajit, ask one question: can they show you the lab report? We can. Doctor-formulated, Triphala-purified, NABL-tested.
7. We're pre-launch and opening a founding waitlist. Lock the ₹200 founding offer, get early access to proof-first Shilajit resin & honey sticks.
8. Ayurveda, done honestly. A BAMS doctor formulated it, Triphala purified it, and an independent NABL lab tested it. See the proof — join the waitlist.
9. How do you know your Shilajit is real? You check the report. We show ours on the page. Founding waitlist open — reserve your ₹200 offer.
10. Proof-first Performance Ayurveda. Himalayan Shilajit resin you can verify — real NABL reports, doctor-formulated. Sign up for founding early access.

**Headlines — 6 variants** (shown under creative; keep ~27–40 chars):
1. The Shilajit You Can Verify
2. NABL-Tested Himalayan Shilajit
3. Proof Before Promise
4. Join the Founding Waitlist
5. Doctor-Formulated Shilajit
6. See the Lab Report Yourself

**Descriptions — 4 variants** (link description, short; ~25–30 chars):
1. Founding ₹200 offer inside
2. Third-party lab-tested
3. Reserve early access
4. Triphala-purified resin

**CTA button:** Sign Up (all ads).

---

## SECTION C — SHARED (UTM, naming, calendar, KPIs, compliance)

### C1. UTM templates (paste exactly)

**Base destination (both platforms):** `https://www.3tattava.com/waitlist`

**GOOGLE ADS — set once as the campaign "Final URL suffix"** (Campaign Settings → Additional settings → Campaign URL options → Final URL suffix). This appends to every ad + asset and survives redirects; `gclid` is auto-appended by Google:
```
utm_source=google&utm_medium=cpc&utm_campaign=GS_IN_Leads_Waitlist_202607&utm_term={keyword}&utm_content={creative}&utm_matchtype={matchtype}&utm_network={network}&utm_device={device}
```
- `{keyword}`, `{creative}`, `{matchtype}` (`e`/`p`/`b`), `{network}` (`g`/`s`), `{device}` (`m`/`c`/`t`) are Google ValueTrack — leave literally as-is; Google fills them.
- For the **Benefit/informational** ad group, the Final URL is the article, but the SAME suffix applies — GA4 still attributes it to `google / cpc`.
- Update `utm_campaign` value if you split the Competitor group into its own campaign → `GS_IN_Leads_Comp_202607`.

**META ADS — paste into each ad's "URL parameters" field** (Ad level → Tracking → URL parameters). Meta auto-appends `fbclid`:
```
utm_source=meta&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&utm_placement={{placement}}&utm_site_source={{site_source_name}}
```
- `{{campaign.name}}`, `{{adset.name}}`, `{{ad.name}}`, `{{placement}}`, `{{site_source_name}}` are Meta dynamic params — leave literally as-is.
- Because these pull the names you set, follow the naming convention below so UTMs stay readable in GA4.

### C2. Naming convention

**Campaigns:** `{Platform}_{Geo}_{Objective}_{Destination}_{YYYYMM}`
```
GS_IN_Leads_Waitlist_202607          (Google Search — main)
GS_IN_Leads_Comp_202607              (Google Search — competitor conquest, if separated)
Meta_IN_Leads_Waitlist_202607        (Meta Leads)
```
**Ad groups (Google) / Ad sets (Meta):** `{Type}_{Theme-or-Audience}_{MatchType-or-Detail}`
```
Google:  AG_Brand_Mixed · AG_CatResin_Phrase · AG_CatGeneric_Phrase · AG_Honey_Phrase ·
         AG_Proof_Phrase · AG_Benefit_Article · AG_Comp_Exact
Meta:    AS_Prospect_Broad_24-44 · AS_Prospect_Interest_24-44 · AS_RTG_7-14d_Excl-Leads
```
**Ads:** `{Concept-or-Type}_{Format}_v{n}`
```
Google:  RSA_CatResin_v1 · RSA_Brand_v1 · RSA_Proof_v1
Meta:    Founder_9x16_v1 · ProofBeforePromise_9x16_v1 · SpotFake_9x16_v1 ·
         HoneyStick_9x16_v1 · GymProof_9x16_v1
```

### C3. 14-day launch + test calendar

| Day | Action |
|---|---|
| **Pre-flight (Day 0)** | Confirm GA4 `generate_lead` is a Key event; Meta `Lead` event Active in Events Manager; UTM capture verified with a live test submit on `/waitlist`; conversion action imported/primary in Google Ads. **Do not spend until a test lead is confirmed end-to-end.** |
| **Day 1 — LAUNCH (start lean)** | **Google:** launch Brand + Category-Resin + Category-Generic + Proof ad groups (Maximize Clicks, ₹22 CPC cap), ₹400/day. **Meta:** launch Prospecting-Broad + Prospecting-Interest with Concepts 1 (Founder) + 2 (Proof) + 3 (Spot-Fake), ₹315/day prospecting. **Hold:** Google Competitor group, Google Benefit/Info group, Meta Retargeting, Concepts 4 & 5. |
| **Days 2–3** | Mine Google **Search Terms report** daily → add negatives. Confirm leads/clicks flowing + UTMs landing correctly in GA4. Do NOT touch bids/budgets yet (learning). |
| **Day 4** | Add **Meta Concept 4 (Honey stick) + 5 (Gym)** to prospecting to widen creative test. Google: add the **Benefit/Info ad group** (article destinations) now that money terms are stable. |
| **Day 5** | Meta ad sets should exit **learning** (~50 `Lead` events) — if a set is "Learning Limited," it's budget/audience too thin; consolidate rather than add more. |
| **Day 7 — FIRST READ** | Turn ON **Meta Retargeting** ad set (you now have 7-day site-visitor + video-viewer + engager pools) with ₹135/day. **First results review** (see KPIs): pause bottom-quartile RSAs/creatives; expand negatives; note best hooks. |
| **Days 8–10** | Google: if ≥15 imported Lead conversions, **switch bidding to Maximize Conversions.** Launch the **Competitor Conquest** group (own campaign/hard cap, ~₹60–80/day) and watch CPL + QS. Meta: duplicate the top creative into a fresh ad, kill losers. |
| **Day 11–13** | Scale winners **+20–30%/day max** (avoid resetting learning). Shift budget from the losing prospecting ad set (broad vs interest) to the winner. Add 2–3 fresh creative variants of the top concept. |
| **Day 14 — FULL READ + DECISION** | Compare CPL by platform/ad group/ad set/creative. Reallocate to lowest-CPL, on-target sources. Lock the 15–20-creatives/month cadence. Decide: keep Competitor group? keep Interest set? tighten age/geo? Set next 14-day plan. |

**Reading cadence rule:** don't judge before **50 conversions or 7 days** per ad set/ad group (whichever first). Change ONE thing at a time.

### C4. KPI targets

| KPI | Definition | Target | Read as |
|---|---|---|---|
| **CPL (Cost per Lead)** | spend ÷ waitlist leads | **₹80–200** (Google should beat Meta; Meta ₹150–300 early is OK vs ₹500–800 category CAC) | The north star. Above ₹300 sustained → fix creative/landing, not budget. |
| **Page-load / LPV rate** | landing-page views ÷ link clicks | **>70%** (was 26% on the old traffic setup) | <70% = mobile speed/redirect leak on `/waitlist` — escalate to site team, not an ad problem. |
| **LPV → Lead (LP conversion rate)** | leads ÷ landing-page views | **3–5%** (was 0.19%) | The LP's job. Below 2% = hook/form/offer above-the-fold problem. |
| **CTR** | Google Search: **>6–8%** on brand, **>3%** on category/proof · Meta: **>1%** (link CTR) | Low Google CTR = weak RSA/relevance; low Meta CTR = weak hook (first 3s). |
| **Google Quality Score** | keyword-level | **7+** on category/proof; brand 9–10 | <5 = tighten ad-group theme + RSA-to-keyword match. |
| **Meta hook rate / hold** | 3s video plays ÷ impressions; 15s retention | 3s **>30%**, ThruPlay strong | Diagnoses creative before CPL does. |
| **Frequency (Meta)** | impressions ÷ reach | keep prospecting **<2.0/week** | Rising freq + rising CPL on a small retargeting pool = creative fatigue, refresh. |
| **Lead volume** | total waitlist signups from paid | trend up week-on-week | Volume is the pre-launch goal — CPL is the efficiency guardrail, not the sole target. |

### C5. Do-Not-Do compliance checklist (FSSAI + ASCI)

**NEVER, in any ad, headline, description, creative, caption, or on-screen text:**
- ❌ **Disease/cure/treatment claims** — no "cures", "treats", "heals", "remedy for [condition]", "fixes ED / infertility / diabetes / arthritis", "boosts immunity against disease". Shilajit is a food supplement, not a drug.
- ❌ **Testosterone / hormone guarantees** — no "boosts testosterone", "raises T levels", "increases male hormones". "Testosterone" may only appear as an *audience interest topic* in Meta targeting, never as a promised outcome.
- ❌ **Performance-outcome guarantees** — no "guaranteed muscle gain", "X% more stamina", "instant energy", "get shredded", "guaranteed results", "or your money back on results".
- ❌ **Before/after imagery or transformation claims** — no body transformations, weight/muscle before-after, "in 30 days you will…".
- ❌ **"Clinically proven / FDA / doctor-recommended-to-treat"** unless you hold the exact substantiation. "NABL third-party *tested*" (purity/quality) is fine and true; "clinically proven to [benefit]" is not — don't use it.
- ❌ **Absolute superiority without proof** — avoid unqualified "the best / #1 / world's purest". Prefer verifiable, hedged framing ("proof-first", "the Shilajit you can verify", "NABL third-party tested").
- ❌ **Fear/health-scare targeting** ("suffering from low energy/ED? this fixes it").
- ❌ **Fake urgency/false scarcity** beyond the genuine founding offer. The ₹200 founding offer + limited founding waitlist is real — describe it honestly.
- ❌ **Competitor trademarks in ad TEXT** (Google & Meta) — bidding on them as keywords is allowed; naming them in copy is not. Comparison must be generic ("compare on proof").
- ❌ **Testimonials implying medical benefit** or unverifiable user results.

**ALWAYS:**
- ✅ Keep the site's existing **hedged, educational tone.**
- ✅ Frame benefits as **traditional Ayurvedic use / general wellness support**, not medical treatment.
- ✅ Lead with what's **verifiable**: NABL third-party testing, doctor-formulated (Dr. Kashish, BAMS), Triphala purification, classical purification, Himalayan sourcing, the ₹200 founding offer.
- ✅ Route health-question searches ("is shilajit safe", "side effects") to **educational content**, not paid conversion ads.
- ✅ Ensure the `/waitlist` LP carries the required **FSSAI/disclaimer** language so ad-to-LP claims stay consistent.

---

*Build order: (1) verify tracking end-to-end → (2) Google Search (Section A) → (3) Meta Leads (Section B) → (4) run the 14-day calendar (C3), reading against the KPIs (C4), never breaking the Do-Not-Do rules (C5).*
