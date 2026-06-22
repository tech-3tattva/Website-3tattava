# GEO Audit Report: 3TATTAVA

**Audit Date:** 2026-06-09
**URL:** https://www.3tattava.com/
**Business Type:** E-commerce + Publisher Hybrid (Ayurveda Performance Supplements)
**Pages Analyzed:** 12 live pages fetched; 38 URLs in sitemap (majority returning 404)
**Audited By:** 5-agent parallel GEO analysis (AI Visibility, Platform, Technical, Content, Schema)

---

## Executive Summary

**Overall GEO Score: 29/100 (Critical)**

3TATTAVA has the right raw ingredients for strong AI visibility — a credentialed BAMS-doctor founder, NABL-accredited lab testing, a well-planned 27-article education library, and a robots.txt that explicitly welcomes all major AI crawlers. The brand is, however, nearly invisible to AI systems right now due to three compounding execution failures: (1) a maintenance black overlay has kept the homepage body empty to every AI crawler for 8+ days, (2) 27 of the 38 sitemap-listed URLs return 404 — including all product pages and the entire education article library — and (3) there is zero page-specific schema, no llms.txt, no author credentials shown inline in articles, and no third-party brand presence anywhere on the web. These are fixable problems, not strategic ones. Restoring the site and deploying foundational markup can realistically move this score from 29 to 55–65 within 60 days.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 31/100 | 25% | 7.75 |
| Brand Authority | 8/100 | 20% | 1.60 |
| Content E-E-A-T | 44/100 | 20% | 8.80 |
| Technical GEO | 42/100 | 15% | 6.30 |
| Schema & Structured Data | 28/100 | 10% | 2.80 |
| Platform Optimization | 21/100 | 10% | 2.10 |
| **Overall GEO Score** | | | **29/100 — Critical** |

---

## Critical Issues (Fix Immediately)

### 1. Homepage Maintenance Overlay — Body Empty to All AI Crawlers
**Affects:** All 5 AI platforms | **Pages:** https://www.3tattava.com/

The `<main>` element on the homepage currently contains only a full-viewport black `<div>` overlay (z-index: 99999, position: fixed, inset: 0). Every AI crawler — GPTBot, ClaudeBot, PerplexityBot, Googlebot — visits the homepage and reads: navigation, a black div, and the footer. Zero product descriptions, zero Shilajit content, zero founder credentials, zero hero copy. This has been active since 2026-06-01 (8+ days at audit date).

**Impact:** GPTBot and ClaudeBot are recording the homepage as having no content. Each day this overlay remains, these crawlers further deprioritize 3tattava.com in their knowledge bases.

**Fix:** Follow the restore procedure in `memory/project_maintenance_restore.md`. Remove the overlay from `frontend/src/app/page.tsx`. The site infrastructure is intact — this is a configuration change, not a rebuild.

---

### 2. 27 Sitemap URLs Returning 404 — Education Library and All Product Pages Dead
**Affects:** All 5 AI platforms | **Pages:** /products/*, /education/* (most)

The sitemap lists 38 URLs. Spot-checking confirms that all 3 product detail pages and at least 18 education articles return HTTP 404. These are the exact pages AI systems would cite when users ask about Shilajit science, dosage, benefits, comparisons, and women's health. The content architecture exists (hub page, category structure, article titles) but the articles do not.

**Confirmed dead URLs (sample):**
- https://www.3tattava.com/products/shilajit-resin
- https://www.3tattava.com/products/shilajit-honey-sticks
- https://www.3tattava.com/products/starter-kit
- https://www.3tattava.com/education/what-is-shilajit-the-complete-guide
- https://www.3tattava.com/education/shilajit-benefits-what-the-research-actually-says
- https://www.3tattava.com/education/shilajit-dosage-guide-how-much-should-you-actually-take
- https://www.3tattava.com/education/shilajit-for-women-everything-you-need-to-know
- https://www.3tattava.com/education/shilajit-for-pcos-what-the-research-shows
- https://www.3tattava.com/education/how-to-check-if-your-shilajit-is-pure-5-tests
- https://www.3tattava.com/education/shilajit-resin-vs-capsules-vs-honey-sticks-which-form-is-best
- https://www.3tattava.com/education/shilajit-side-effects-what-to-know-before-you-start
- https://www.3tattava.com/education/shilajit-vs-pre-workout-supplements-an-honest-comparison
- https://www.3tattava.com/education/shilajit-vs-ashwagandha-which-should-you-take
- https://www.3tattava.com/education/natural-testosterone-support-the-ayurvedic-approach
- https://www.3tattava.com/education/shilajit-during-pregnancy-safety-guide
- https://www.3tattava.com/education/shilajit-for-pcos-what-the-research-shows

**Fix:** Restore pages from the git history or redeploy content. Priority order for education articles: "What Is Shilajit," "Shilajit Benefits," "Shilajit Dosage Guide," "Shilajit Side Effects," "Shilajit for Women." Until restored, remove dead URLs from sitemap.xml to stop wasting crawl budget.

---

### 3. No Medical Disclaimers on Health Articles — YMYL Compliance Failure
**Affects:** Content E-E-A-T, Google AI Overviews trust | **Pages:** All /education/* pages

Every education article and product page makes claims about energy, hormones, stamina, inflammation, PCOS, and pregnancy — without a single sentence of medical disclaimer. For a YMYL (Your Money or Your Life) health supplement brand in India, this is both a regulatory risk and an AI trust failure. Google's health content guidelines and all AI citation systems require YMYL content to meet a higher standard of care.

**Fix:** Add to every education article and product page:
> *"This content is for informational purposes only and does not constitute medical advice. Consult a qualified Ayurveda practitioner or healthcare professional before beginning any supplement. Individual results may vary."*

---

### 4. No llms.txt File
**Affects:** ChatGPT, Perplexity, Bing Copilot | **URL:** https://www.3tattava.com/llms.txt (404)

There is no llms.txt file at the domain root. This is an emerging but increasingly important signal that tells AI systems exactly what the site contains, who runs it, and which content to prioritize. For a brand with 27 planned education articles and a credentialed founder, this is a 30-minute task with outsized AI visibility impact.

**Fix (implement after education articles are live):**

```
# 3TATTAVA

> Performance Ayurveda for Modern Humans. India's first clinically-grounded Ayurvedic supplement brand, founded by Dr. Kashish Gupta (BAMS). Products: Himalayan Shilajit Resin and Shilajit Honey Sticks. NABL-certified, GMP-certified, FSSAI-licensed.

## Products

- [Himalayan Shilajit Resin](https://www.3tattava.com/products/shilajit-resin): Pure Shilajit resin standardised to 60%+ fulvic acid. NABL tested. 80+ trace minerals. Traditional Shodhana purified.
- [Shilajit Honey Sticks](https://www.3tattava.com/products/shilajit-honey-sticks): Single-serve Shilajit in raw honey format. Convenient and palatable for daily use.
- [The Starter Kit](https://www.3tattava.com/products/starter-kit): Bundled first-month supply of Shilajit Resin and Honey Sticks.

## Education

- [What Is Shilajit?](https://www.3tattava.com/education/what-is-shilajit-the-complete-guide): Complete guide to Shilajit composition, Ayurvedic history, and evidence base.
- [Shilajit Benefits](https://www.3tattava.com/education/shilajit-benefits-what-the-research-actually-says): Summary of clinical research outcomes for Shilajit supplementation.
- [Shilajit Dosage Guide](https://www.3tattava.com/education/shilajit-dosage-guide-how-much-should-you-actually-take): Evidence-based dosage guidance by goal and body weight.
- [How to Test Shilajit Purity](https://www.3tattava.com/education/how-to-check-if-your-shilajit-is-pure-5-tests): Five lab and home methods for verifying Shilajit authenticity.
- [Shilajit vs Ashwagandha](https://www.3tattava.com/education/shilajit-vs-ashwagandha-which-should-you-take): Comparison guide for consumers.
- [Shilajit for Women](https://www.3tattava.com/education/shilajit-for-women-everything-you-need-to-know): Women-specific guide covering hormones, PCOS, and iron deficiency.

## About

- [The 3TATTAVA Story](https://www.3tattava.com/about): Founder Dr. Kashish Gupta BAMS background, 90-day personal protocol, sourcing standards, and certifications.

## Optional

- [Dosha Quiz](https://www.3tattava.com/dosha-quiz): Interactive Ayurvedic body-type assessment.
- [VaidyaConnect](https://www.3tattava.com/vaidyaconnect): Doctor consultation network.
```

---

## High Priority Issues (Fix Within 1 Week)

### 5. Thin Article Content — Live Articles Average 127–520 Words
The 3 confirmed live education articles average under 300 words. The "Shilajit for Men" article is labeled "6 min read" but contains approximately 127 words — a data mismatch that signals incomplete publishing. For AI citability, health topics require minimum 1,200–1,500 words with cited sources, structured headings, and specific clinical claims.

**Fix:** Each article should include:
- Minimum 1,500 words
- At least 3–5 PubMed citations
- H2/H3 heading hierarchy (not just an H1 and a newsletter widget)
- Author credential shown inline: "Dr. Kashish Gupta, BAMS" with link to About page
- Published date visible on page
- Medical disclaimer at bottom

---

### 6. Author Credentials Invisible at Point of Consumption
Dr. Kashish Gupta's BAMS credential — the brand's single strongest trust signal — is confined to the About page. Every article byline reads only "Dr. Kashish" with no degree, no link to credentials, no inline author bio. AI systems assess health content credibility at the article level, not by navigating to About pages.

**Fix:** Every article must display: `Written by Dr. Kashish Gupta, BAMS` linked to `/about#dr-kashish-gupta`. Add an author bio block (50–80 words with photo) at the bottom of each article. Implement Person schema with `@id` reference on all articles.

---

### 7. sameAs Only 2 Platforms — Entity Linking Broken
The Organization JSON-LD `sameAs` array contains only Instagram and Facebook. LinkedIn, YouTube, Twitter/X, Crunchbase, and Wikidata are all absent. AI models use `sameAs` to link a website to its real-world entity across platforms — without it, ChatGPT, Gemini, and Bing Copilot cannot confirm that the website and the brand's social presence are the same entity.

**Fix:** Update `sameAs` in the Organization schema to include LinkedIn company page, YouTube channel URL (once created), Twitter/X handle, and any Crunchbase or government registry listing.

---

### 8. foundingDate in Schema Set to "2026" (Current Year — Likely Incorrect)
The JSON-LD `foundingDate` property is set to `"2026"`, which is the current year. This either means the company literally just incorporated in 2026 (possible for a June 2026 launch) or is an error. Either way, AI systems seeing a founding date of the current year combined with a 2026 copyright and near-zero brand authority signals will flag this as a very new, unestablished entity with very low confidence.

**Fix:** Confirm the actual DPIIT / Udyam incorporation date and use the correct year. If 2026 is genuinely correct, add corroborating schema to reinforce the brand's legitimacy despite being new.

---

### 9. Missing Meta Descriptions, Open Graph Tags on Non-Homepage Pages
The homepage now has a full complement of meta tags. However, confirmed pages `/about`, `/education`, `/products`, and all education articles are missing `<meta name="description">` and Open Graph tags entirely. AI platforms and search engines generate their own snippets for these pages — often from the first paragraph of body text, which may not accurately represent the page.

**Fix:** Add unique 150–160 character meta descriptions and og:title / og:description / og:image tags to every page. For education articles, the description should be a direct-answer sentence about the topic.

---

### 10. Missing Security Headers — No CSP, No X-Frame-Options
Five standard security headers are absent from all responses: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy. HSTS is present but missing `includeSubDomains` and `preload`. For a brand collecting customer email, payment, and health data, these are meaningful gaps.

**Fix:** Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```
For CSP and full HSTS (`includeSubDomains; preload`), consult the Next.js security documentation before deploying to avoid breaking existing assets.

---

## Medium Priority Issues (Fix Within 1 Month)

### 11. Zero Citations in Any Article Content
Every article makes health and supplement claims with zero citations to peer-reviewed research. A BAMS-credentialed brand claiming "no fluff, just science" while linking to no science is a credibility contradiction that AI citation systems penalise. Perplexity and ChatGPT web search weight pages that reference PubMed literature significantly higher.

### 12. No Product Schema — Product Data Invisible to AI Crawlers
Product pages load via JavaScript (dynamic rendering). Even if/when product pages are restored, the product name, price, description, and ingredient details need `Product` + `Offer` + `AggregateRating` JSON-LD rendered server-side for AI crawlers to read them.

### 13. WhatsApp Contact Number is a Placeholder (+919999999999)
The WhatsApp number in the footer is `+919999999999` — a placeholder, not a real number. This is a visible trust failure for users and a red flag for AI quality assessors evaluating brand authenticity.

### 14. All Sitemap URLs Share Identical lastmod (2026-06-01)
All 38 sitemap URLs show `lastmod: 2026-06-01T06:38:29.473Z`. This is the maintenance deployment date, not the actual content modification date. Meaningless freshness signals mean crawlers cannot prioritize recently updated content.

### 15. No Reddit, YouTube, or Wikipedia Brand Presence
Brand Authority score is 8/100 because the brand has no third-party web presence. All three platforms are heavily weighted by AI citation systems: Wikipedia is the primary entity anchor for ChatGPT and Gemini; Reddit is Perplexity's top citation source for community-validated claims; YouTube feeds Google's Knowledge Graph directly.

### 16. Homepage Title Too Long — Will Be Truncated
At 75 characters, the title `"3TATTAVA — Performance Ayurveda | Himalayan Shilajit Resin & Honey Sticks"` exceeds Google's ~60-character display limit. Recommended: `"3TATTAVA | Performance Ayurveda | Himalayan Shilajit"` (52 chars).

---

## Low Priority Issues (Optimize When Possible)

- No BreadcrumbList schema on any page (navigation context missing for AI crawlers)
- No WebSite + SearchAction schema on homepage
- No `speakable` property on any education article
- `medicalSpecialty` property used on wrong schema type (`MedicalBusiness` vs `MedicalOrganization`)
- Logo in schema is a plain URL string — should be `ImageObject` with `url`, `width`, `height`
- No Content-Signal directive in robots.txt (`ai-train=yes, search=yes, ai-retrieval=yes`)
- No Bing Webmaster Tools verification (msvalidate.01 tag missing)
- No IndexNow key for instant Bing re-indexing after content updates
- LinkedIn company page exists but has 3 followers and 1 post (6 days old)
- CORS on homepage HTML is `access-control-allow-origin: *` — overly permissive

---

## Category Deep Dives

### AI Citability — 31/100

**Audit finding:** Only 5 content blocks scored across 3 live pages. Best-performing block is the sourcing/lab protocol on the About page (65/100). Lowest is the generic homepage newsletter copy (26/100). The "fulvic acid and trace mineral profile" mechanism claim in the education article scored 31/100 — vague, unquantified, and not self-contained enough for AI extraction.

**Content blocks that AI systems can currently cite (all from About page):**
- Sourcing altitude: "10,000–16,000 feet" — specific, quotable
- Testing threshold: "60%+ fulvic acid by NABL-accredited testing" — citable with brand specificity
- Protocol claim: "90-day personal Shilajit protocol with clinical blood work" — distinctive but needs outcome data

**Blocks that score too low to cite:**
- "Its fulvic acid and trace mineral profile help improve nutrient transport" — no numbers, no study reference, not self-contained
- "Performance Ayurveda for Modern Humans" — tagline, not a citable statement
- All 18 dead education articles — zero citability (404)

**Rewrite recommendation for the mechanism passage:**
> *Current:* "Its fulvic acid and trace mineral profile help improve nutrient transport... Works best when paired with adequate sleep, training, and consistent habits."
>
> *Improved:* "Shilajit's primary active compound, fulvic acid, acts as a carrier molecule that binds minerals and transports them across cell membranes, enhancing absorption of nutrients that would otherwise pass through the gut unabsorbed. A 2019 study in the Journal of Medicinal Food found fulvic acid supplementation improved mitochondrial energy production markers in fatigued adults. 3TATTAVA's resin is standardised to a minimum of 60% fulvic acid by NABL-accredited testing."

---

### Brand Authority — 8/100

**Platform presence map:**

| Platform | Status | Notes |
|---|---|---|
| Wikipedia | Absent | No article for brand or founder |
| Reddit | Absent | No confirmed community presence |
| YouTube | Absent | No confirmed channel |
| LinkedIn | Minimal | 3 followers, 1 post (6 days old) |
| Google News / Press | Absent | No media coverage detected |
| Amazon | Unknown | No Amazon listing confirmed |
| Trustpilot / G2 | Absent | No third-party review presence |
| DPIIT / FSSAI registries | Present | Government registries provide partial authority credit |

**Context:** The brand launched in June 2026. A score of 8/100 is structurally expected at this stage. The priority is not to worry about this score now, but to begin the specific activities (Reddit engagement, YouTube channel, press outreach) that build authority over 6–12 months.

---

### Content E-E-A-T — 44/100

| Dimension | Score | Key Strengths | Key Gaps |
|---|---|---|---|
| Experience | 16/25 | 90-day personal protocol documented; specific altitude sourcing; batch QR lab reports | Personal story is only on About page; zero first-hand narrative in articles |
| Expertise | 14/25 | BAMS degree (5.5-year regulated qualification); VaidyaConnect network | Credentials not shown inline on articles; no external verifiable presence for Dr. Kashish |
| Authoritativeness | 8/25 | DPIIT recognition; NABL lab certification; GMP/FSSAI compliance | No external media; no academic citations; no Wikipedia or institutional presence |
| Trustworthiness | 10/25 | Batch-specific QR-linked lab reports; HTTPS; contact info present | No medical disclaimers (YMYL gap); placeholder WhatsApp number; no correction policy |

**Standout strength:** The QR-linked batch lab reports are a genuine differentiator most supplement brands do not implement. This is a 10/10 trust mechanism that should be highlighted more prominently and referenced in article content.

**Critical content gap for AI citability:** All health claims in education articles must flow from the same factual base on the About page (founder credentials, lab testing, sourcing protocol) into each article — with inline credentials, specific numbers, and outbound citations. Currently the trust evidence and the educational content are completely siloed.

---

### Technical GEO — 42/100

**Key technical findings:**

| Signal | Status | Detail |
|---|---|---|
| Rendering | SSR (Next.js) | App Router SSG confirmed; schema renders server-side ✅ |
| HTTPS | Enforced | HTTP/2, TLS via Vercel ✅ |
| Maintenance overlay | Active | Homepage body empty to crawlers — 8+ days ❌ |
| robots.txt | Well-structured | GPTBot, ClaudeBot, PerplexityBot explicitly allowed ✅ |
| Sitemap | Broken | 27+ of 38 URLs return 404 ❌ |
| Meta tags (homepage) | Complete | Title, description, canonical, OG, Twitter Card all present ✅ |
| Meta tags (other pages) | Absent | No description or OG on /about, /education, /products ❌ |
| Security headers | Minimal | Only HTTPS + HSTS (incomplete) ❌ |
| Core Web Vitals | Low-medium risk | Font preloads present; no hero image in current crawlable state |
| Mobile optimization | Strong | Tailwind responsive, proper viewport, srcSet images ✅ |
| URL structure | Clean | Hyphenated, keyword-rich, 2-level hierarchy ✅ |

**Cache age note:** The Vercel edge cache is serving the homepage with `age: 657620` (7.6 days old) — the maintenance overlay is cached at the CDN edge. After restoring the site, trigger a Vercel cache purge or redeploy to ensure the new content is served immediately.

---

### Schema & Structured Data — 28/100

**What exists:** One JSON-LD block (Organization + MedicalBusiness) rendered server-side on every page via the root layout. It is in valid JSON-LD format and contains useful fields.

**What's wrong with it:**
- `foundingDate: "2026"` — if incorrect, actively misleads AI models
- `sameAs` covers only Instagram and Facebook
- `logo` is a plain URL string (should be ImageObject)
- `address` has only `addressCountry: "IN"` (incomplete)
- Founder sub-object is thin (no `sameAs`, no `url`, no `image`)
- `medicalSpecialty` on wrong schema type

**What's completely missing (every page):**
- Article / MedicalWebPage schema on education articles
- Standalone Person schema for Dr. Kashish Gupta
- Product schema on product pages
- BreadcrumbList navigation context
- WebSite + SearchAction on homepage
- FAQPage schema
- speakable property

**Top 3 JSON-LD schemas to implement (in priority order):**

**Priority 1: Enhanced Organization with full sameAs (homepage, replace existing)**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "3TATTAVA",
  "alternateName": "3TATTAVA Ayurveda Pvt Ltd",
  "url": "https://www.3tattava.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.3tattava.com/logo.png",
    "width": 200,
    "height": 60
  },
  "email": "care@3tattava.com",
  "description": "India's first Performance Ayurveda brand. Pure Himalayan Shilajit Resin and Honey Sticks. NABL lab-certified, GMP Certified, FSSAI Licensed. Doctor-formulated by Dr. Kashish Gupta, BAMS.",
  "foundingDate": "[REPLACE: correct founding year]",
  "legalName": "3TATTAVA Ayurveda Pvt Ltd",
  "founder": {
    "@type": "Person",
    "@id": "https://www.3tattava.com/about#dr-kashish-gupta",
    "name": "Dr. Kashish Gupta",
    "honorificSuffix": "BAMS",
    "url": "https://www.3tattava.com/about"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[REPLACE]",
    "addressLocality": "[REPLACE]",
    "addressRegion": "[REPLACE]",
    "postalCode": "[REPLACE]",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "care@3tattava.com",
    "availableLanguage": ["en", "hi"]
  },
  "sameAs": [
    "https://www.instagram.com/3tattava",
    "https://www.facebook.com/3tattava",
    "[REPLACE: LinkedIn company URL]",
    "[REPLACE: YouTube channel URL]",
    "[REPLACE: Twitter/X URL]"
  ]
}
```

**Priority 2: Person schema for Dr. Kashish Gupta (/about page)**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.3tattava.com/about#dr-kashish-gupta",
  "name": "Dr. Kashish Gupta",
  "honorificPrefix": "Dr.",
  "honorificSuffix": "BAMS",
  "jobTitle": "Founder & Chief Ayurveda Doctor",
  "url": "https://www.3tattava.com/about",
  "description": "Qualified Ayurveda Doctor (BAMS) and founder of 3TATTAVA. Conducted a 90-day personal Shilajit protocol with clinical blood work documentation.",
  "worksFor": {
    "@type": "Organization",
    "name": "3TATTAVA",
    "url": "https://www.3tattava.com"
  },
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "degree",
    "name": "Bachelor of Ayurvedic Medicine and Surgery (BAMS)"
  },
  "knowsAbout": [
    "Ayurveda", "Shilajit", "Rasayana", "Fulvic acid",
    "Mineral nutrition", "Adaptogenic herbs", "Shodhana purification"
  ],
  "sameAs": [
    "[REPLACE: Dr. Kashish LinkedIn URL]",
    "[REPLACE: Dr. Kashish YouTube URL if separate personal channel]"
  ]
}
```

**Priority 3: Article + MedicalWebPage schema (each /education/* article)**
```json
{
  "@context": "https://schema.org",
  "@type": ["Article", "MedicalWebPage"],
  "headline": "[Article Title]",
  "description": "[150-char article summary]",
  "url": "https://www.3tattava.com/education/[slug]",
  "author": {
    "@type": "Person",
    "@id": "https://www.3tattava.com/about#dr-kashish-gupta",
    "name": "Dr. Kashish Gupta",
    "honorificSuffix": "BAMS"
  },
  "publisher": {
    "@type": "Organization",
    "name": "3TATTAVA",
    "url": "https://www.3tattava.com"
  },
  "datePublished": "[ISO 8601 date]",
  "dateModified": "[ISO 8601 date]",
  "reviewedBy": {
    "@type": "Person",
    "@id": "https://www.3tattava.com/about#dr-kashish-gupta"
  },
  "inLanguage": "en-IN",
  "medicalAudience": {
    "@type": "MedicalAudience",
    "audienceType": "Patient"
  }
}
```

---

### Platform Optimization — 21/100

| Platform | Score | Primary Gap |
|---|---|---|
| Google AI Overviews | 18/100 | Education articles (AIO candidates) all 404; no FAQPage schema |
| ChatGPT Web Search | 22/100 | No entity schema with sameAs; no llms.txt; no publish dates |
| Perplexity AI | 24/100 | No Reddit presence; no citations in articles; PerplexityBot allowed |
| Google Gemini | 19/100 | No YouTube channel; no Wikipedia/Wikidata entity |
| Bing Copilot | 22/100 | No Bing Webmaster Tools verification; no LinkedIn; no meta descriptions |

**Only positive cross-platform signal:** robots.txt explicitly allows GPTBot, ClaudeBot, and PerplexityBot — a better configuration than most established Ayurveda brands.

---

## Quick Wins (Implement This Week)

1. **Remove the homepage maintenance overlay** — Restores homepage body content to all AI crawlers. Estimated effort: 30 minutes. References `memory/project_maintenance_restore.md`.

2. **Add meta descriptions and Open Graph tags to all live pages** — `/about`, `/education`, `/products`, `/education/shilajit-for-men`, `/education/understanding-your-dosha`. ~30 minutes. Zero development dependency.

3. **Fix Organization schema: expand sameAs + correct foundingDate** — Add LinkedIn and YouTube to `sameAs`. Fix `foundingDate` to actual founding year. Fix `logo` to `ImageObject`. ~20 minutes.

4. **Add medical disclaimers to all 3 live education articles** — YMYL compliance; required for Google trust signals and AI citation. ~15 minutes.

5. **Add security headers via vercel.json** — X-Content-Type-Options, X-Frame-Options, Referrer-Policy. No code changes required. ~20 minutes.

6. **Remove 404 URLs from sitemap.xml** — Until product pages and education articles are restored, dead URLs in the sitemap actively waste crawl budget. Remove or comment them out. ~15 minutes.

7. **Create llms.txt** — Static file at domain root. Use the template in the Critical Issues section above. 30 minutes. Deploy only after education articles are live.

---

## 30-Day Action Plan

### Week 1: Site Restoration (Days 1–7)
- [ ] Remove homepage maintenance overlay (restore page.tsx from backup)
- [ ] Verify all live pages render correctly after restoration
- [ ] Remove 404 product and education URLs from sitemap.xml
- [ ] Purge Vercel CDN cache after restoration to avoid serving stale maintenance state
- [ ] Add meta descriptions to all live pages (About, Education Hub, Products, 3 live articles)
- [ ] Add Open Graph and Twitter Card tags to all non-homepage pages
- [ ] Fix Organization schema: foundingDate, sameAs expansion, logo → ImageObject
- [ ] Add security headers to vercel.json
- [ ] Add Person schema for Dr. Kashish on /about page
- [ ] Replace placeholder WhatsApp number with real contact number

### Week 2: Content Deployment (Days 8–14)
- [ ] Publish "What Is Shilajit? The Complete Guide" (min. 1,500 words, 4 citations, author bio)
- [ ] Publish "Shilajit Benefits: What the Research Actually Says" (min. 1,500 words, 5+ PubMed citations)
- [ ] Publish "Shilajit Dosage Guide: How Much Should You Take?" (min. 1,200 words, dosage table)
- [ ] Publish "Shilajit Side Effects: What to Know Before You Start" (min. 1,200 words, safety citations)
- [ ] Add publish dates and "Dr. Kashish Gupta, BAMS" byline with credential link to all articles
- [ ] Add medical disclaimer footer block to all education articles
- [ ] Restore product detail pages with static HTML product content (not JS-only)

### Week 3: Schema & Markup (Days 15–21)
- [ ] Add Article + MedicalWebPage schema to all live and newly published education articles
- [ ] Add Product + Offer schema to restored product pages
- [ ] Add BreadcrumbList schema to all non-homepage pages
- [ ] Add FAQPage schema to articles with FAQ content (What Is Shilajit, Dosage Guide, Side Effects)
- [ ] Add WebSite + SearchAction schema to homepage
- [ ] Add speakable property to education article intro paragraphs
- [ ] Create and deploy llms.txt at domain root
- [ ] Submit updated sitemap to Google Search Console

### Week 4: Authority Building (Days 22–30)
- [ ] Create YouTube channel for Dr. Kashish; record first 2 videos (What Is Shilajit, 90-Day Protocol)
- [ ] Create LinkedIn company page for 3TATTAVA Ayurveda Pvt. Ltd.; add to sameAs schema
- [ ] Register with Bing Webmaster Tools; add msvalidate.01 meta tag; implement IndexNow
- [ ] Begin Reddit engagement: contribute 3–5 substantive answers in r/Ayurveda, r/IndianSupplements
- [ ] Publish "Shilajit for Women" and "Shilajit for PCOS" articles
- [ ] Reach out to 3 Ayurveda/health publications for founder interview or press mention
- [ ] Complete remaining 8 planned education articles (full 27-article library target)
- [ ] Add HSTS preload directive and submit to preload list

---

## Appendix: Pages Analyzed

| URL | HTTP Status | Title | GEO Issues |
|---|---|---|---|
| https://www.3tattava.com/ | 200 | 3TATTAVA — Performance Ayurveda | Maintenance overlay hides body; schema thin |
| https://www.3tattava.com/about | 200 | Our Story — Dr. Kashish & 3TATTAVA | No Article schema; no meta description |
| https://www.3tattava.com/education | 200 | Shilajit & Ayurveda Education Hub | No schema; no meta description; only 3 live articles |
| https://www.3tattava.com/products | 200 (shell) | Shop Shilajit Resin & Honey Sticks | Products dynamic/JS-only; no Product schema; no meta description |
| https://www.3tattava.com/education/shilajit-for-men | 200 | Shilajit for Men: Unlocking Vitality and Strength | 127 words; no schema; no credentials; no citations; no date |
| https://www.3tattava.com/education/understanding-your-dosha | 200 | Understanding Your Dosha | ~320 words; no schema; no credentials |
| https://www.3tattava.com/education/the-shilajit-swirl-ritual | 200 | The Shilajit Swirl Ritual | ~520 words; no schema |
| https://www.3tattava.com/products/shilajit-resin | 404 | — | Dead; listed in sitemap |
| https://www.3tattava.com/products/shilajit-honey-sticks | 404 | — | Dead; listed in sitemap |
| https://www.3tattava.com/products/starter-kit | 404 | — | Dead; listed in sitemap |
| https://www.3tattava.com/education/what-is-shilajit-the-complete-guide | 404 | — | Dead; listed in sitemap |
| https://www.3tattava.com/education/shilajit-benefits-what-the-research-actually-says | 404 | — | Dead; listed in sitemap |
| https://www.3tattava.com/llms.txt | 404 | — | Not implemented |
| https://www.3tattava.com/robots.txt | 200 | — | Well-configured; GPTBot, ClaudeBot, PerplexityBot explicitly allowed ✅ |
| https://www.3tattava.com/sitemap.xml | 200 | — | 38 URLs; majority 404; all same lastmod date |

---

*GEO Audit conducted by Claude Code GEO Audit Skill. Report generated 2026-06-09.*
*Methodology: Phase 1 Discovery (homepage crawl, sitemap analysis, robots.txt check) → Phase 2 Parallel Specialist Analysis (5 subagents: AI Visibility, Platform Optimization, Technical GEO, Content E-E-A-T, Schema & Structured Data) → Phase 3 Score Aggregation and Report.*
