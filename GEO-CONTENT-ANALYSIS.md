# GEO Content Quality & E-E-A-T Analysis — 3tattava.com
Date: 2026-06-09
Analyst: Claude Code (geo-content skill)
Source: Live site fetch + full local codebase review

---

## Content Score: 44/100 — Below Average

> Multiple E-E-A-T gaps are significantly limiting AI citability and search visibility.
> The brand positioning is strong; the content infrastructure is not yet built to support it.

---

## E-E-A-T Breakdown

| Dimension | Score | Key Finding |
|---|---|---|
| Experience | 13/25 | Founder narrative is compelling but most site content lacks first-person proof |
| Expertise | 15/25 | Dr. Kashish's BAMS credential is present but thin — no dedicated bio, citations missing |
| Authoritativeness | 2/25 | Critical gap — no press, no external citations, no Wikipedia, brand is new |
| Trustworthiness | 14/25 | Legal pages exist; FSSAI number is a placeholder; testimonial names are "[Placeholder Name]" |

---

## Topical Authority Modifier: 0 (Emerging — 5-10 pages, limited clustering)

Education hub has 20+ articles planned but most appear unpublished.
Live site has a thin content footprint vs. the ambition in the codebase.

---

## Company Overview (Identified from Site + Codebase)

| Field | Value |
|---|---|
| Company | 3TATTAVA Ayurveda Pvt. Ltd. |
| Founder | Dr. Kashish Gupta, BAMS |
| Tagline | "Performance Ayurveda for Modern Humans." |
| Domain | www.3tattava.com |
| Email | care@3tattava.com |
| Registrations | MCA · DPIIT Startup India · Udyam MSME |
| Certifications | FSSAI, GMP (AYUSH), NABL Lab-Tested, Export Quality |
| Category | Ayurveda / Health Supplements / Nutraceuticals |

### Products Identified

| Product | Price | Key Claim | Rating |
|---|---|---|---|
| SHODHIT SHILAJIT RESIN (20g) | ₹1,299 (MRP ₹1,499) | ≥70% fulvic acid, 80+ minerals, Triphala Shodhan purified | 4.9/5 (312 reviews) |
| SHAHJEET STICKS (30 sticks) | ₹999 (MRP ₹1,199) | 600mg Shilajit/stick + raw honey, India's First format | 4.8/5 (218 reviews) |
| The Starter Kit | ₹1,799 | Resin + Sticks bundle, saves ₹499 (21%) | — |
| Monthly Subscription | ₹799/month | 25% off, cancel anytime | — |

### Brand Voice Rules (from source code)
The brand content file explicitly defines:
- **USE**: Performance Ayurveda, ritual, cellular, foundation, mineral, real energy, bioavailable, precision, engineered, root cause
- **AVOID**: ancient secret, ancient wisdom, holistic, mindful transformation, spiritual journey, healing energy, detox, cleanse, miracle, cure

This disciplined positioning is a strong GEO asset — AI platforms favor precise, consistent brand language.

---

## Pages Analyzed

| Page | Est. Word Count | Readability | Heading Structure | Citability Rating |
|---|---|---|---|---|
| Homepage (/) | ~800 words | Good (60-65 est.) | Pass — clear H1/H2/H3 | Medium |
| About (/about) | ~600 words | Good | Pass | Medium-Low |
| Shilajit Resin (/products/shodhit-shilajit-resin) | ~700 words | Good | Pass | Medium |
| Shahjeet Sticks (/products/shahjeet-sticks) | ~650 words | Good | Pass | Medium |
| Education Hub (/education) | ~300 words visible | Good | Pass | Low |
| Education Articles (e.g. /education/shilajit-for-men) | ~150 words | Good | Warn — too short | Low |

---

## E-E-A-T Detailed Findings

### Experience — 13/25

**Strengths:**
- Dr. Kashish's founder quote is powerful and specific: "I stopped seeing patients because one consultation can't fix a generation. The same pattern in 20 people every day — no real energy, broken sleep, dependency on stimulants."
- The 4-step sourcing journey (Sourcing → Purification → Lab Testing → Your Ritual) demonstrates process knowledge
- Week-by-week results timeline (Weeks 1-2, 3-4, 6-8, 10-12) shows clinical thinking
- 3-step rituals for both products (Tear/Squeeze/Perform; Dip/Hook/Swirl) demonstrate practical product experience

**Weaknesses:**
- The "90-day personal Shilajit protocol with clinical blood work documentation" is claimed in credentials but the actual data is never published — this is the single most valuable E-E-A-T asset on the entire site and it is invisible
- Education articles are 3 paragraphs (~150 words) — far too short to demonstrate experience
- Testimonials use "[Placeholder Name]" — real names with real experiences would score 4/4 instead of 2/4
- No process documentation of how formulations were tested or iterated
- Founder photo is a placeholder file (`/assests/img5.png`) — no authentic photo of Dr. Kashish visible

**Critical Quick Win:** Publish Dr. Kashish's clinical blood work data from the 90-day protocol. A single page with actual before/after mineral panel results would add 10+ E-E-A-T points and become the most citable page on the entire site.

---

### Expertise — 15/25

**Strengths:**
- Correct use of Ayurvedic terminology: Shodhana, Triphala Shodhan, Anupana, Rasayana, Prakriti, Vata/Pitta/Kapha throughout
- BAMS (Bachelor of Ayurvedic Medicine & Surgery) credential consistently shown
- Specific technical metrics: ≥70% fulvic acid, 600mg per stick, 80+ ionic minerals, sourced at 10,000–16,000 ft
- NABL lab testing and AYUSH-GMP facility manufacturing mentioned
- Comparison tables demonstrate competitive expertise (vs. Capsules, Powders)
- Dosha intelligence section shows domain depth

**Weaknesses:**
- The claim "Fulvic acid increases nutrient absorption by up to 28x" (brand-content.ts line 62) has NO citation. This is a bold, specific claim that will be flagged as unverified by AI citation engines — and could damage credibility if wrong
- Education articles exist as 3-paragraph stubs. "Shilajit for Men" is 3 sentences per paragraph. A BAMS-credentialed doctor writing at this depth looks like AI-generated filler
- No dedicated Dr. Kashish bio/author page — only mentions in headlines and credential lines. No clinical experience years, no college/university, no list of conditions treated
- FSSAI license number is literally "[XXXXX]" in the source code — this is a live trust credibility hole
- Comparison table for SHODHIT RESIN lists competitor metrics as "Rarely stated" without naming any competitors — too vague to be citable

---

### Authoritativeness — 2/25

This is the most critical gap and the expected weakness for a new startup.

**What exists:**
- DPIIT Startup India recognition (government-backed legitimacy signal)
- Udyam MSME registration (adds to entity recognition)
- MCA company registration
- "India's First" claim for Shilajit Honey Sticks (unverified externally)

**What is missing:**
- No press coverage, no news mentions, no media features
- No external links from Ayurveda, fitness, or health publications
- No Wikipedia page or mention
- No Dr. Kashish profiles on LinkedIn or authoritative medical directories
- No peer-reviewed or Ayurveda journal citations
- No speaker/conference credentials
- No industry body membership (e.g., AYUSH, ASSOCHAM, CII)
- VaidyaConnect (doctor consultation network) is in the nav but the page has no content in the codebase — this could become a major authority signal if built properly

**Realistic path to authority:** Guest posts on Healthline India, Times of India Health, NDTV Good Times, or any AYUSH-linked publication. Even one well-placed media mention is worth more than 100 blog posts for authoritativeness signals.

---

### Trustworthiness — 14/25

**Strengths:**
- HTTPS valid (2/2)
- Privacy Policy present and linked (2/2)
- Terms of Use present (1/1)
- Email contact (care@3tattava.com) clearly visible
- WhatsApp support available
- Lab testing transparency (QR code on packs linking to batch-specific lab reports — excellent signal if implemented)
- "We don't edit reviews. We don't pay for testimonials." — strong trust statement

**Weaknesses:**
- **FSSAI License number shows as "[XXXXX]"** in footer source — this is a live credibility hole. Any customer or AI parser reading the footer sees a placeholder, not a real license number
- **Testimonials use "[Placeholder Name]"** — three main testimonials all have placeholder names. These should have been replaced before launch
- Physical address not visible on site or footer — Indian e-commerce sites are required to display registered business address under Consumer Protection (e-Commerce) Rules
- No Returns/Refunds policy content visible beyond the link (linked but uncrawlable if page is thin)
- Business model transparency: no disclosure about when/how affiliate or influencer promotions are done
- The "28x absorption" claim referenced above — if untrue, it undermines the entire trustworthiness score

---

## Content Quality Issues

| Issue | Location | Severity | Fix |
|---|---|---|---|
| FSSAI license number is "[XXXXX]" | Footer (brand-content.ts:259) | Critical | Replace with actual license number immediately |
| Testimonial names are "[Placeholder Name]" | brand-content.ts:148,159,170 | Critical | Replace with real customer names/initials |
| "28x nutrient absorption" claim — no citation | brand-content.ts:62 | High | Add citation: link to the specific study, or change to "significantly increases" |
| Education articles are ~150 words | /education/* | High | Each article should be minimum 1,500 words |
| Founder photo is a placeholder | FounderSection.tsx:38 | High | Replace with real photo of Dr. Kashish |
| No Dr. Kashish author page | Site-wide | High | Create /about/dr-kashish with full credentials |
| Physical address missing from footer | Footer | Medium | Add registered company address |
| "India's First" claim unverified | Multiple pages | Medium | Link to verifiable evidence or soften the claim |
| Fulvic acid % inconsistency | homepage (60%+) vs product page (≥70%) | Medium | Standardize across all pages |
| VaidyaConnect page has no content | /vaidyaconnect | Medium | Build this page — it's a major authority differentiator |

---

## AI Content Concerns

The education articles as currently coded show signs of thin/AI-generated content:

**Example from education-content.ts:**
```
"Shilajit has been prized in Ayurveda as a rasayana, a rejuvenative substance used to 
restore vitality and support long-term resilience."
```
This is generic phrasing that could apply to any Ayurvedic product.

**Patterns detected:**
- Perfect 3-paragraph structure with no variation
- No specific examples, numbers, or personal anecdotes in articles
- Each article is roughly the same length and tone
- Hedging language: "can be beneficial", "may help", "valued for supporting"
- No author attribution on individual education articles
- No publication dates

**Verdict:** Education content reads as template/AI-generated filler. For an Ayurvedic doctor-founded brand, every education article should have Dr. Kashish's authentic voice, clinical observations, and specific patient patterns he observed.

---

## Freshness Assessment

| Page | Published | Last Updated | Status |
|---|---|---|---|
| Homepage | No date visible | No date visible | No Date — Warning |
| /about | No date visible | No date visible | No Date |
| /products/shodhit-shilajit-resin | No date visible | No date visible | No Date |
| /products/shahjeet-sticks | No date visible | No date visible | No Date |
| /education articles | No date visible | No date visible | Critical — No dates on any articles |

**Issue:** Not a single page on the site has a visible `datePublished` or `dateModified`. Per Google's Quality Rater Guidelines and AI citability research, undated content is treated as less reliable. The structured data should include `dateModified` for all pages.

---

## Citability Assessment

### Most Citable Passages (currently on site)

1. **Week-by-week results timeline** — specific, measurable, time-bound claims. "Week 1–2: most people notice the afternoon energy crash starting to fade." AI platforms love these structured, specific outcome claims.

2. **Founder quote** — "I stopped seeing patients because one consultation can't fix a generation. The same pattern in 20 people every day — no real energy, broken sleep, dependency on stimulants." This is specific, attributable, and citable.

3. **Sourcing chain** — 4-step process (Sourcing → Purification → Lab Testing → Ritual) with specific altitude (10,000–16,000 ft) and method (Triphala Shodhan). Concrete and verifiable.

4. **Trust strip metrics** — "80+ Trace Minerals · 60%+ Fulvic Acid · NABL Lab-Certified" — structured, fact-dense, citable.

5. **Shahjeet Sticks hook** — "600mg of pure Himalayan Shilajit per stick, infused with natural honey. Tear. Squeeze. Perform." — specific dosage + clear format differentiation.

### Least Citable Pages

1. **/education articles** — too short, too generic, no data, no author, no dates
2. **/about** — good narrative but no external evidence or credentials beyond BAMS
3. **/dosha-quiz** — no content visible in analysis
4. **/vaidyaconnect** — no content built yet

---

## Improvement Recommendations

### Quick Wins (can be done this week)

1. **Fix FSSAI placeholder** — Replace "[XXXXX]" in footer with the actual license number. Takes 5 minutes. Removes a live credibility hole.

2. **Replace placeholder testimonial names** — Replace "[Placeholder Name]" in brand-content.ts with real customer names (or at minimum first name + city, e.g., "Rahul M., Bangalore"). This is in brand-content.ts lines 148, 159, 170.

3. **Add datePublished + dateModified** to all page structured data. Even adding the current date as dateModified signals freshness to AI crawlers.

4. **Standardize fulvic acid claim** — Site says "60%+" in some places and "≥70%" in others (product page). Pick one number and use it everywhere. The higher verified figure (≥70%) should be the standard.

5. **Add physical address to footer** — Required by law and a trust signal. Add to FOOTER object in brand-content.ts.

6. **Add citation to 28x absorption claim** — Link to the specific fulvic acid bioavailability study, or replace with "studies show significant increases in nutrient absorption" until the citation is found.

---

### Content Gaps (high priority — next 30 days)

| Missing Content | Priority | Why It Matters |
|---|---|---|
| Dr. Kashish's 90-day blood work data page | Critical | This is the most powerful E-E-A-T asset and is invisible |
| Full Dr. Kashish bio page (/about/dr-kashish) | High | BAMS alone is not enough — needs college, clinical years, research |
| Expand education articles to 1,500+ words each | High | Current ~150-word stubs are uncitable |
| VaidyaConnect page with real content | High | Huge authority differentiator — doctor network is rare in this space |
| Lab reports public page (/lab-reports) | High | Linked in footer but page appears empty — show actual NABL reports |
| Press/media page | Medium | Any media coverage should be aggregated here for authority signals |
| FAQ page with comprehensive Q&A | Medium | Currently linked but content unknown — should be 1,000+ words |
| "What Is Shilajit?" pillar article (2,500+ words) | Medium | Most searched Shilajit query — needs to be comprehensive |
| Shilajit for Women pillar (1,500+ words) | Medium | 50% of Indian women iron deficient is a compelling hook — needs a full article |

---

### Author / E-E-A-T Improvements (next 60 days)

1. **Publish Dr. Kashish's clinical blood work** — Before/after mineral panels, testosterone levels, ferritin. This turns a claim into proof.

2. **Create a dedicated author page** for Dr. Kashish with: BAMS college and graduation year, internship and clinical experience, any Ayurvedic certifications beyond BAMS, why he chose Shilajit as the core product, and links to any published work.

3. **Pursue one press placement** — A single article on Times of India Health, Healthline India, or similar changes the authoritativeness score from 2 to 8+ overnight.

4. **Add author bylines to all education articles** — "Written by Dr. Kashish Gupta, BAMS" on each article with a link to the author page.

5. **Claim LinkedIn and Google Business Profile** — These are indexed by AI platforms for entity recognition. 3TATTAVA Ayurveda Pvt. Ltd. should have verified profiles on both.

6. **Submit to Startup India directory listing** — DPIIT recognition is mentioned but not leveraged. The official Startup India listing is an authoritative backlink.

---

## Summary Scorecard

| Category | Score | Grade |
|---|---|---|
| Experience | 13/25 | C — Founder story strong; product content weak |
| Expertise | 15/25 | C+ — Good terminology; no cited research; thin articles |
| Authoritativeness | 2/25 | F — New brand; zero external validation |
| Trustworthiness | 14/25 | C+ — Legal pages present; placeholders undermine credibility |
| **Topical Authority** | **+0** | Emerging |
| **FINAL SCORE** | **44/100** | **Below Average** |

**The core problem is not the brand — it's the proof.** The positioning ("India's first Performance Ayurveda brand") is differentiated. The products have real certifications. The founder has real credentials. But almost none of the actual evidence is visible, citable, or structured for AI to extract. Building the proof layer — blood work, lab reports, doctor bio, real testimonials, long-form articles — will move this score from 44 to 70+ within 90 days.
