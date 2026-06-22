# 3TATTAVA — OUR STORY PAGE
## Complete Page Architecture, Content & Claude Code Execution Guide

**Route:** `/our-story`  
**Meta Title:** Our Story — Dr. Kashish & 3TATTAVA | Performance Ayurveda  
**Meta Description:** How a qualified Ayurveda doctor (BAMS, CBPACS) and former NCISM Consultant left government service to build India's first Performance Ayurveda brand. The 3TATTAVA story.

---

## CURRENT STATE (From Screenshots)

The existing Our Story page has 5 sections:

1. **Hero** — Dark-to-terracotta gradient. "Why an Ayurveda Doctor Stopped Seeing Patients." Subtitle italic.
2. **Founder Story** — Dark bg split: video placeholder left, "The Problem Nobody's Fixing" text right.
3. **Sourcing & Lab Testing** — Cream bg. "From 16,000 Feet to Your Morning Ritual." Four cards.
4. **Founder Credentials** — Cream bg. Broken image placeholder. Quote. Full credential block.
5. **Footer** — Standard site footer.

**Problems with current state:**
- The page is only 5 sections — too thin for what should be the brand's most emotionally powerful page.
- The founder photo is a broken placeholder image (grey box with question mark icon).
- The story content is generic — it doesn't include any of the real NCISM journey, the Gymveda failure, the ₹1 lakh loan, or the market transparency insight that makes Dr. Kashish's story compelling.
- The Sourcing & Lab Testing section belongs on the Research & Testing page, not here. It dilutes the narrative.
- Mona Agarwal is completely absent from this page.
- No timeline visualization of Dr. Kashish's career.
- The page reads as informational, not emotional. It tells you facts but doesn't make you feel the journey.

---

## NEW PAGE ARCHITECTURE — 12 SECTIONS

The redesigned Our Story page follows a narrative arc:

**Act 1 — The Origin** (Why he started)  
**Act 2 — The Journey** (What he went through)  
**Act 3 — The Ecosystem** (What he built and who joined)

Each section flows into the next with transitional copy. No section is standalone — they read as chapters of one story.

---

## SECTION 1 — HERO

**Background:** Keep the current dark-to-terracotta gradient. It is the warmest hero on the site and correctly signals "personal story" vs the cinematic dark hero on homepage. No change needed.

**Layout:** Centre-aligned text. Full-viewport height. Text sits in the vertical centre.

### Content

**Eyebrow:**
```
THE 3TATTAVA STORY
```

**H1:**
```
Why an Ayurveda Doctor Stopped
Seeing Patients
```

**Subtitle (italic, gold #C8963E):**
```
And built India's first Performance Ayurveda brand instead.
```

**Credential line (below subtitle, smaller, cream/off-white, italic):**
```
Dr. Kashish Gupta. BAMS, CBPACS (Govt. of NCT Delhi).
90-day personal Shilajit protocol with clinical blood work documentation.
Former Consultant, National Commission for Indian System of Medicine,
Ministry of AYUSH, Government of India.
```

**Scroll indicator:** Small animated chevron at bottom centre, pulsing gently.

### What Changes From Current
- Remove the three tab buttons below the hero (CELLULAR ENERGY | PHYSICAL PERFORMANCE | LONG-TERM VITALITY) — they go nowhere and break the narrative flow.
- The credential line already exists on the current page below the hero. Keep it but move it INTO the hero as the final text element, so it's the last thing they read before scrolling.

### Claude Code Prompt
```
In the Our Story hero section:
1. Remove the three tab/pill buttons (CELLULAR ENERGY, PHYSICAL PERFORMANCE, LONG-TERM VITALITY).
2. Move the credential paragraph (Dr. Kashish. BAMS, CBPACS...) inside the hero container, positioned below the italic subtitle with 40px spacing.
3. Style the credential text: Archivo wdth 100 wght 300, font-size 15px, color rgba(247,240,226,0.7), max-width 600px, text-align center, line-height 1.7.
4. Add scroll indicator: div at bottom centre, contains a small SVG chevron (12px wide), animated with translateY 0→8px→0 on a 2s infinite ease-in-out loop, opacity 0.5.
```

---

## SECTION 2 — THE PROBLEM NOBODY'S FIXING (Founder Story)

**Background:** Dark brown (#2a1f14 range — warmer than pure ink). Split layout: video left (50%), text right (50%).

**Layout:** Keep the current split layout. It works.

### Content — RIGHT SIDE

**Eyebrow:**
```
FOUNDER STORY
```

**H2:**
```
The Problem Nobody's Fixing
```

**Body (exact copy — updated from transcript + framework):**
```
Sitting in his clinic, Dr. Kashish saw the same pattern in 20 patients
every day. No real energy. Broken sleep. Dependency on stimulants.
Hormonal disasters. And the worst part — they all thought this was normal.

One consultation can't fix a generation. So he stopped seeing patients
and started building something.

Something rooted in what actually works — Ayurveda's mineral science
and adaptogenic intelligence — but designed for the way people actually
live. Not powders you'll forget. Not capsules you don't trust. Something
you'll actually want to take every single morning.

That's 3TATTAVA.
```

### Content — LEFT SIDE

**Video placeholder** with play button overlay. Below the video:
```
WATCH DR. KASHISH'S STORY
```

**Video note:** Until the real video is shot, this plays the HeyGen AI avatar version of Dr. Kashish telling this story. When the real video is ready, swap the src. The component should accept a `videoSrc` prop.

### What Changes From Current
- No structural change. The current layout is correct.
- The body copy stays the same (it's already good).
- Ensure the video player has a proper poster image (not a black rectangle). Use a still frame or Dr. Kashish's portrait as poster.

---

## SECTION 3 — THE REAL JOURNEY (NEW — From Audio Transcript)

**This section does not exist on the current page. It must be built from scratch.**

This is the most important addition. The audio transcript reveals a story that no competitor can match — Dr. Kashish wasn't just a doctor who started a supplement brand. He was the youngest consultant NCISM had ever seen, managed the entire AYUSH regulatory system, handled four national boards, and saw firsthand how the Ayurvedic market had become a "bubble" of non-compliant products. He left power and position to fix the problem himself.

**Background:** Cream (#f7f0e2). Full-width section. Text-centric — this is a reading section.

**Layout:** Single column, max-width 720px, centred. Long-form narrative with a pull quote breaking the text. Think editorial magazine longform.

### Content

**Eyebrow:**
```
THE JOURNEY
```

**H2:**
```
From Government Office to Glass Jar
```

**Body — Paragraph 1:**
```
Most people discover Ayurveda after something goes wrong. Dr. Kashish
wanted to explore what happens when Ayurvedic wisdom is used before
problems begin — to support energy, longevity, recovery, resilience
and long-term performance.
```

**Body — Paragraph 2:**
```
He entered Ayurveda expecting to learn medicine. What he discovered
was something much bigger. During five years of BAMS education at
CBPACS (Govt. of NCT Delhi), he realized Ayurveda was never only
about treating illness. At its core, it was about helping people
function at their highest potential.
```

**Body — Paragraph 3:**
```
After graduation, he joined the National Commission for Indian
System of Medicine (NCISM) under the Ministry of AYUSH as a Junior
Technical Officer — assigned to manage assessment, teacher
promotions, appointments, and college accreditations for the state
of Maharashtra. Over 100 colleges. Technical Officer code 0067.
```

**Body — Paragraph 4:**
```
He completed in one hour what took others three days. The efficiency
didn't go unnoticed. When the previous officer left, he was handed
the Unani department. When a senior consultant went on maternity
leave, he stepped in again. When the Appeal Section had a backlog
of 100 college appeals, he cleared it in under two months.
```

**PULL QUOTE (full-width, large italic, gold left border):**
```
"I entered the Commission as a mouse. I wanted to leave as an
elephant — regardless of the hardships."

— Dr. Kashish Gupta
```

**Body — Paragraph 5:**
```
The Chairman and Secretary promoted him to Consultant — the youngest
NCISM had ever seen. He managed four national boards simultaneously:
Ayurveda, Ethics and Registration, Unani Sidha Sopa, and the Medical
Assessment Rating Board. He handled legal issues, high court matters,
counselling problems, and the grievance portal for the entire AYUSH
system. A staff of 128 people. Pan-India responsibility.
```

**Body — Paragraph 6:**
```
But the salary stayed at ₹35,000. He accepted it because he was
never after money. He wanted position, influence, and the ability
to see the system from the inside.
```

**Body — Paragraph 7:**
```
And from the inside, what he saw troubled him deeply.
```

### Claude Code Prompt
```
Create a new section component: OurStoryJourney.tsx

Layout: Cream background (#f7f0e2). Single column, max-width 720px, margin 0 auto.
Padding: 120px top/bottom, 24px left/right on mobile.

H2: Archivo wdth 100 wght 700, size clamp(32px, 5vw, 52px), color #1c1304, margin-bottom 48px.
Eyebrow: Archivo wdth 75 wght 500, 11px, letter-spacing 0.22em, uppercase, color #C8963E, margin-bottom 16px.

Body paragraphs: Archivo wdth 100 wght 400, 17px, line-height 1.8, color #1c1304, margin-bottom 28px.

Pull quote: Separate container, margin 56px 0, padding-left 32px, border-left 4px solid #C8963E. Quote text: Archivo Italic wdth 100 wght 300, size clamp(22px, 3vw, 32px), color #1c1304, line-height 1.5. Attribution: Archivo wdth 100 wght 400, 14px, color rgba(28,19,4,0.5), margin-top 12px.

Place this section AFTER the Founder Story video section and BEFORE the next section.
```

---

## SECTION 4 — THE MARKET PROBLEM (NEW — From Audio Transcript)

**This section does not exist on the current page. Built from the transcript's market insight.**

**Background:** Dark ink (#1c1304). Full-width. This is the "villain" section — it establishes what's wrong with the Ayurvedic supplement market.

**Layout:** Single column, max-width 720px, centred. Dark background creates visual contrast after the cream reading section above.

### Content

**Eyebrow (gold on dark):**
```
WHAT HE SAW FROM THE INSIDE
```

**H2 (cream on dark):**
```
The Ayurvedic Market Had Become a Bubble
```

**Body — Paragraph 1 (cream on dark):**
```
Working at NCISM gave Dr. Kashish a view that no brand founder has
ever had. He watched the entire AYUSH regulatory system from the
inside — every compliance gap, every shortcut, every brand selling
products under the Ayurvedic label that were filled with modern
nutraceuticals and only a fraction of actual Ayurvedic ingredients.
```

**Body — Paragraph 2:**
```
Brands were using the 18–19 drugs allowed by FSSAI to bypass
strict AYUSH regulations. Influencers and showmanship replaced
substance. Products lacked a solid foundation. Transparency
was almost nonexistent.
```

**Body — Paragraph 3:**
```
He had reached the highest position possible at NCISM without a
postgraduate degree. He could have stayed — power, position,
Pan-India authority. Instead, he decided to build what the market
was missing.
```

**PULL QUOTE (gold text, no border — standalone statement):**
```
"Most brands just used influencers and showmanship while their
products lacked a solid foundation. I decided to build the
foundation first."
```

**Body — Paragraph 4:**
```
This was not his first attempt. In 2022, he had tried a brand
called Gymveda. It failed — a lack of patience, regularity, and
a ₹1 lakh loan from his uncle that didn't stretch far enough.
That failure taught him everything the Commission couldn't:
that building a brand requires the same discipline he demanded
from the 128 people who worked under him.
```

**Body — Paragraph 5:**
```
3TATTAVA was born from that second attempt. Not from marketing
strategy. From frustration with an industry he knew from the
inside out.
```

### Claude Code Prompt
```
Create: OurStoryMarketProblem.tsx

Layout: Dark background #1c1304. Single column, max-width 720px, centred.
Padding: 120px top/bottom.

Eyebrow: gold #C8963E, same specs as Section 3.
H2: cream #f7f0e2, Archivo wdth 100 wght 700, clamp(32px, 5vw, 52px).
Body: cream rgba(247,240,226,0.85), Archivo wdth 100 wght 400, 17px, line-height 1.8.

Pull quote: No border. Gold #C8963E text. Archivo Italic wdth 100 wght 300, size clamp(24px, 3.5vw, 36px). Centred. Margin 64px 0.

Place AFTER the Journey section.
```

---

## SECTION 5 — WHAT PERFORMANCE AYURVEDA MEANS (NEW — From Audio Transcript)

**Background:** Cream (#f7f0e2). This section transitions from the problem to the philosophy.

### Content

**Eyebrow:**
```
THE PHILOSOPHY
```

**H2:**
```
What Performance Ayurveda Actually Means
```

**Body — Paragraph 1:**
```
To Dr. Kashish, Performance Ayurveda is not a marketing term. It is
the application of natural healthcare to solve the day-to-day problems
that hamper a person's performance — energy, recovery, sleep, stress,
resilience, and long-term vitality.
```

**Body — Paragraph 2:**
```
It is based on a classical Ayurvedic concept that has guided Indian
medicine for millennia:
```

**Sanskrit Block (centred, large, with translation):**
```
स्वस्थस्य स्वास्थ्य रक्षणम्, आतुरस्य विकार प्रशमनम्

Swasthasya Swasthya Rakshanam, Aturasya Vikara Prashamanam

"Protect the health of the healthy.
Manage the ailments of the ill."
```

**Body — Paragraph 3:**
```
Most of modern healthcare focuses on the second half — managing
problems after they appear. 3TATTAVA focuses on the first half —
supporting health before problems begin. Making sure a person's
daily lifestyle, mineral intake, recovery, and rituals are strong
enough that the body can perform at its natural best.
```

**Body — Paragraph 4:**
```
That is what Balance. Build. Become. means. Not a slogan.
A clinical philosophy applied to daily life.
```

### Claude Code Prompt
```
Create: OurStoryPhilosophy.tsx

Layout: Cream #f7f0e2 background. Max-width 720px centred.

Sanskrit block: Centred container with margin 48px 0. Devanagari text: Archivo (or fallback Noto Sans Devanagari) wght 400, size 24px, color #C8963E, line-height 1.6. Transliteration below: Archivo Italic wdth 100 wght 300, 16px, color rgba(28,19,4,0.5). English translation: Archivo wdth 100 wght 400, 18px, color #1c1304, margin-top 16px, font-style italic.

Note: The Devanagari text requires a font that supports it. Archivo may not have Devanagari glyphs. Use @font-face fallback to Noto Sans Devanagari (Google Fonts) for the Sanskrit text only.
```

---

## SECTION 6 — DR. KASHISH TIMELINE (NEW — Visual Timeline)

**Background:** Cream (#f7f0e2) continuing from Section 5.

**Layout:** Vertical timeline with alternating left-right cards on desktop, single column on mobile. A thin gold vertical line (#C8963E, 2px) runs down the centre. Each milestone is a card connected to the line with a small gold dot.

### Content — Timeline Milestones

**Milestone 1:**
```
NOV 2016 — OCT 2021
Ayurveda Education — BAMS
Alumni of Chaudhary Brahm Prakash Ayurvedic Charak Sansthan (CBPACS)
Govt. of NCT New Delhi

"I entered Ayurveda expecting to learn medicine. What I discovered
was something much bigger."
```

**Milestone 2:**
```
OCT 2021 — NOV 2022
Internship — CBPACS & RTRMH
Clinical rotations across Ayurvedic departments. First exposure to
the gap between classical Ayurvedic potential and modern patient needs.
```

**Milestone 3:**
```
JULY 2022 — NOV 2022
Founded Gymveda (First Attempt)
An early attempt at bridging Ayurveda and fitness. Failed due to
lack of patience, regularity, and insufficient capital. The failure
became the foundation of everything that followed.
```

**Milestone 4:**
```
DEC 2022 — JAN 2023
Clinical Exposure — Resident Medical Officer
Bulandshahar. Direct patient care. Saw the same pattern in hundreds
of patients: low energy, broken sleep, stimulant dependency, mineral
depletion. Everyone thought it was normal.
```

**Milestone 5:**
```
FEB 2023 — OCT 2025
Consultant (I/C) — NCISM, Ministry of AYUSH
National Commission for Indian System of Medicine. Managed four
national boards: Ayurveda, Ethics & Registration, Unani Sidha Sopa,
Medical Assessment Rating Board. Pan-India responsibility. Staff of
128. Youngest consultant NCISM had ever seen.
```

**Milestone 6:**
```
JULY 2022 — FEB 2026
Performance Ayurveda Research
Parallel to government service: 90-day personal Shilajit protocol
with clinical blood work documentation. Researching Shodhana methods,
fulvic acid bioavailability, and mineral-based performance support.
```

**Milestone 7 (final, larger card, gold border):**
```
2026
Founded 3TATTAVA
India's first Performance Ayurveda brand. Doctor-led. Athlete-backed.
Lab-tested. Built from the inside knowledge of what the market was
missing: transparency, process, and authentic Ayurvedic preparation.

SankalpaSiddhi Ayupharma Pvt. Ltd.
```

### Claude Code Prompt
```
Create: OurStoryTimeline.tsx

Layout: Cream bg. Max-width 900px centred. Vertical timeline.

Desktop: A 2px vertical gold line (#C8963E) runs down the centre. Cards alternate left and right. Each card connects to the line via a horizontal 20px line ending in a 12px gold circle (filled). Card styling: white bg (#ffffff), border 1px solid rgba(28,19,4,0.08), border-radius 8px, padding 32px, box-shadow 0 4px 20px rgba(28,19,4,0.06), max-width 400px.

Mobile: Single column. Timeline line runs on the left (24px from edge). All cards on the right. Gold dot on the line.

Date label: Archivo wdth 75 wght 600, 11px, uppercase, letter-spacing 0.14em, color #C8963E.
Card title: Archivo wdth 100 wght 700, 20px, color #1c1304, margin-top 8px.
Card body: Archivo wdth 100 wght 400, 15px, line-height 1.7, color rgba(28,19,4,0.75).
Card quote (if present): Archivo Italic, 14px, color rgba(28,19,4,0.5), margin-top 12px.

Final milestone card: Larger (max-width 500px or full width on mobile). Border-left 4px solid #C8963E instead of standard border. Gold gradient background on the date label.

Animation: Cards enter with opacity 0 → 1, translateY(30px) → 0, triggered on scroll (IntersectionObserver, threshold 0.2). 400ms ease-out. Each card staggers by 100ms.
```

---

## SECTION 7 — MONA AGARWAL — FOUNDING ATHLETE (NEW)

**Background:** Dark ink (#1c1304). Full-width. This section introduces the athlete pillar.

**Layout:** Two columns on desktop — image left (45%), text right (55%). On mobile: image full-width top, text below.

### Content

**Eyebrow (gold):**
```
FOUNDING ATHLETE AMBASSADOR
```

**H2 (cream):**
```
Built For People Who Demand More
From Themselves
```

**Athlete name block:**
```
Mona Agarwal
Paralympic Bronze Medalist
```

**Body (cream):**
```
Elite performance is rarely about motivation. It is built through
consistency, recovery, discipline and showing up every day.

These same principles form the foundation of Performance Ayurveda.

That is why Paralympic Bronze Medalist Mona Agarwal joined 3TATTAVA
as our Founding Athlete Ambassador.

Together, we aim to promote a culture of sustainable performance,
resilience and long-term vitality.
```

**PERFORMANCE PILLARS — Four small icon cards below the text:**
```
DISCIPLINE          RECOVERY           RESILIENCE          CONSISTENCY
Doing the work      Preparing for      Performing under    Small actions.
daily.              tomorrow.          pressure.           Big results.
```

**PULL QUOTE (gold, centred below pillars):**
```
"Success is not built on one great day. It is built on what you
do consistently every day."
```

**Video embed below (full-width dark container):**
```
WATCH MONA'S PERFORMANCE STORY
```
*2–3 minute video. Not about product. About adversity, training, mindset, recovery, consistency.*

**COMPLIANCE NOTE (invisible to user, visible in code comments):**
```
<!-- DO NOT write that Mona uses RockResin or Shahjeet unless confirmed.
DO NOT link her medal to any product. DO NOT make sports-performance
claims. She is an ambassador for the PHILOSOPHY, not the product. -->
```

**Trust bar below Mona section:**
```
PERFORMANCE ECOSYSTEM — SUPPORTED THROUGH:
✓ Founding Athlete Ambassador  ✓ Expert-Led Guidance
✓ Fitness Community Partnerships  ✓ Evidence-Based Ayurveda
```

### Image Requirements
- Mona Agarwal: Professional athlete photo. Training or competition mode. NOT promotional pose holding product. NOT influencer style. NOT selfie. Prefer: focused expression, competition, medal moment, or training action shot.
- If photo not available yet: use a dark placeholder with her name and "Paralympic Bronze Medalist" text only — no stock photo substitution.

---

## SECTION 8 — SOURCING & LAB TESTING (MOVED — Currently Section 3)

**This section currently exists on the Our Story page. Keep it but reposition it here, after the people story is told.**

**Background:** Cream (#f7f0e2).

### Content — Keep Current

**Eyebrow:**
```
SOURCING & LAB TESTING
```

**H2:**
```
From 16,000 Feet to Your Morning Ritual
```

**Subtitle (italic):**
```
300 years of the Himalayas, compressed into one substance.
```

**Four cards — update content from packaging labels:**

**Card 01 — Sourcing:**
```
Raw Shilajit (Asphaltum Punjabanum) is harvested from Himalayan
deposits at 10,000–16,000ft altitude — where mineral concentration
and resin maturity peak. The ore is sourced from verified Himalayan
sites with known geological provenance.
```

**Card 02 — Purification (Triphala Shodhan):**
```
Every batch undergoes classical Triphala Shodhan purification — as
prescribed in Ashtanga Hridayam. Conducted by URMI Lifesciences LLP
(Mfg. Lic. No. RJ-926AYU E, Rajasthan), an AYUSH-GMP certified
facility. This removes heavy metals and rock impurities while
preserving fulvic acid integrity.
```

**Card 03 — NABL Lab Testing:**
```
Before a single jar ships, every batch is tested by an independent
NABL-accredited third-party laboratory for: fulvic acid concentration
(≥70%), heavy metals (Lead, Mercury, Arsenic — below AYUSH limits),
microbial contamination, and stability. NABL Batch Report: #RK2024-08.
```

**Card 04 — Packaging & QR Verification:**
```
Glass jar (never plastic — plastic leaches into resin). Every pack
carries a QR code linking to the batch-specific NABL 3rd-party lab
report. Marketed by SankalpaSiddhi Ayupharma Pvt. Ltd., 690A/1
Kabool Nagar, Shahdara, Delhi. Manufactured in an AYUSH-GMP
certified, US-FDA registered facility.
```

**Trust badges below cards:**
```
✓ NABL 3RD-PARTY LAB TESTED
✓ AYUSH-GMP CERTIFIED
✓ US-FDA REGISTERED FACILITY
✓ TRIPHALA SHODHAN PURIFIED
```

**CTA:**
```
VIEW OUR LATEST LAB REPORT →
```

### What Changes From Current
- Content in cards 02, 03, and 04 updated with exact details from packaging labels (manufacturer name, licence number, marketed-by entity, batch number).
- Section moves from position 3 to position 8 in the page flow. In the current page, this section appears too early — before the reader cares about sourcing. After reading the founder's journey, NCISM story, and market problem, they now have context for why testing matters.

---

## SECTION 9 — MEET THE FOUNDER (MOVED + FIXED — Currently Section 5)

**Background:** Cream (#f7f0e2).

**Layout:** Two columns — photo left (40%), text right (60%).

### Content

**Eyebrow:**
```
MEET THE FOUNDER
```

**H2:**
```
Formulated by Dr. Kashish Gupta, BAMS
```

**Quote (gold left border, italic):**
```
"I didn't start 3TATTAVA to sell Shilajit. I started it because
modern life is demanding more energy, more resilience, and more
consistency than ever before. Ayurveda has answers. But those
answers must be practical, transparent and relevant to today's
world. RockResin is our attempt to bridge that gap."
```

**Credential line:**
```
Qualified Ayurveda Doctor (BAMS) · 90-day personal Shilajit
protocol with clinical blood work documentation · Founder, 3TATTAVA
```

**Full credentials block (below a thin divider):**
```
Dr. Kashish Gupta, BAMS

Qualified Ayurveda Doctor (Bachelor of Ayurvedic Medicine and Surgery)
Alumni: CBPACS — Chaudhary Brahm Prakash Ayurvedic Charak Sansthan,
  Govt. of NCT Delhi
Former Consultant: National Commission for Indian System of Medicine,
  Ministry of AYUSH, Government of India
90-day personal Shilajit protocol with clinical blood work documentation
Performance Ayurveda Educator · Podcast Host
```

**CTA:**
```
READ DR. KASHISH'S FULL STORY →
```
*(This links to a future long-form article in the Knowledge Center)*

### CRITICAL FIX — The Photo
The current page has a **broken image placeholder** (grey box with question mark). This is the most important trust signal on the entire site. Options:

1. **Best case:** Real professional portrait of Dr. Kashish. Brief: formal but warm, face clearly lit, clean background (white wall or library shelf), NOT a selfie. White coat OR formal kurta.
2. **Interim fix if photo not ready:** Use the RockOil packaging photo that currently exists in the codebase — it shows the product jar with a coin/seal. While not ideal, it's better than a broken image.
3. **Absolute minimum:** Remove the image container entirely until a real photo is available. A broken placeholder is worse than no image.

### Claude Code Prompt
```
In the Founder section of Our Story:

1. Check if the image src resolves. If it returns 404 or fails to load:
   - Add an onError handler to the img tag
   - On error, hide the image container entirely (display: none)
   - Expand the text column to full width
   
2. Add the full credential block below the existing short credentials,
   separated by a thin horizontal rule (1px solid rgba(28,19,4,0.1)).
   
3. Credentials formatting: Each line is a separate paragraph.
   "Dr. Kashish Gupta, BAMS" in Archivo bold 18px.
   Remaining lines: Archivo wght 400, 15px, line-height 1.8,
   color rgba(28,19,4,0.7).
```

---

## SECTION 10 — BALANCE · BUILD · BECOME PHILOSOPHY (NEW)

**Background:** Dark ink (#1c1304). Full-width. Three columns on desktop, stacked on mobile.

### Content

**Eyebrow (gold):**
```
THE JOURNEY OF PERFORMANCE
```

**H2 (cream, centred):**
```
Balance · Build · Become
```

**Subtitle (cream, centred, italic):**
```
Not overnight. Not through shortcuts. Not through hacks.
Through daily rituals that help you balance your foundations,
build resilience and become your strongest self.
```

**Three cards — dark background, gold accent numbers:**

**Card 1:**
```
BALANCE
समत्व (Samatva)

Restore The Foundation

Before strength comes stability. Before performance comes recovery.
Before growth comes balance. Support the foundations that modern
lifestyles often disrupt: energy, recovery, sleep, digestion,
stress resilience.
```

**Card 2:**
```
BUILD
बल (Bala)

Develop Resilience

Once the foundation is stable, the next step is growth. Build the
capacity to train harder, focus longer and recover better. Physical
strength, mental resilience, consistency, endurance, daily performance.
```

**Card 3:**
```
BECOME
उत्कर्ष (Utkarsha)

Reach Higher Potential

Performance is not a destination. It is a continuous process of
becoming. Support the habits, rituals and mindset that help you
evolve into your strongest self. Longevity, vitality, leadership,
purpose, lifelong growth.
```

**Mid-section statement (between cards, full-width, large italic):**
```
Ayurveda Was Never Just About Treating Illness.
It Was About Supporting Human Potential.
```

---

## SECTION 11 — FINAL CTA

**Background:** Cream (#f7f0e2). Centred text.

### Content

**H2:**
```
Ready To Balance. Build. Become.
```

**Subtitle:**
```
You now understand the philosophy, the science, the community,
and the rituals. The next step is yours.
```

**Three CTA buttons in a row:**
```
[SHOP COLLECTION]     [TAKE ASSESSMENT]     [FIND EXPERIENCE CENTER]
   (gold filled)        (outlined)              (outlined)
```

**Brand statement below (large, italic):**
```
We Don't Believe In Quick Fixes.
We Believe In Daily Rituals.
```

---

## SECTION 12 — FOOTER

Standard site footer. No changes from global footer component.

---

## COMPLETE SECTION ORDER SUMMARY

| # | Section | Background | Status |
|---|---------|-----------|--------|
| 1 | Hero | Dark → terracotta gradient | EXISTS — minor updates |
| 2 | The Problem Nobody's Fixing | Dark brown | EXISTS — keep as-is |
| 3 | The Real Journey (NCISM story) | Cream | **NEW — from transcript** |
| 4 | The Market Problem | Dark ink | **NEW — from transcript** |
| 5 | What Performance Ayurveda Means | Cream | **NEW — from transcript** |
| 6 | Dr. Kashish Timeline | Cream | **NEW** |
| 7 | Mona Agarwal — Founding Athlete | Dark ink | **NEW — from framework** |
| 8 | Sourcing & Lab Testing | Cream | EXISTS — repositioned from #3 |
| 9 | Meet the Founder | Cream | EXISTS — photo fix needed |
| 10 | Balance · Build · Become | Dark ink | **NEW — from framework** |
| 11 | Final CTA | Cream | **NEW** |
| 12 | Footer | Standard | EXISTS |

**Background rhythm (top → bottom):**
Dark → Dark → Cream → Dark → Cream → Cream → Dark → Cream → Cream → Dark → Cream → Dark

This creates a natural breathing pattern — never more than two cream sections in a row, and dark sections punctuate the narrative at moments of tension (the market problem, Mona's section, the philosophy reveal).

---

## JSON-LD SCHEMA FOR THIS PAGE

```json
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "Our Story — 3TATTAVA",
  "description": "How Dr. Kashish Gupta built India's first Performance Ayurveda brand.",
  "mainEntity": {
    "@type": "Person",
    "name": "Dr. Kashish Gupta",
    "jobTitle": "Founder & Ayurveda Physician",
    "honorificSuffix": "BAMS",
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Chaudhary Brahm Prakash Ayurvedic Charak Sansthan (CBPACS)",
      "parentOrganization": "Govt. of NCT Delhi"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "SankalpaSiddhi Ayupharma Pvt. Ltd.",
      "brand": "3TATTAVA"
    },
    "knowsAbout": ["Ayurveda", "Performance Ayurveda", "Shilajit", "AYUSH"],
    "description": "Qualified Ayurveda Doctor (BAMS). Former Consultant, NCISM, Ministry of AYUSH. Founder of 3TATTAVA."
  },
  "publisher": {
    "@type": "Organization",
    "name": "3TATTAVA",
    "legalName": "SankalpaSiddhi Ayupharma Pvt. Ltd."
  }
}
```

---

## DESIGNER BRIEF — VISUAL ASSETS FOR OUR STORY

| Asset | Where It Appears | Spec | Priority |
|-------|-----------------|------|----------|
| Dr. Kashish portrait | Section 9 (and reusable across site) | Professional, face lit, clean bg, 800×1000px min | **CRITICAL — currently broken** |
| Dr. Kashish video | Section 2 video player | 60–90s to-camera, telling the founding story | HIGH |
| Mona Agarwal athlete photo | Section 7 | Competition/training, not promotional, 800×1000px | HIGH |
| Mona video | Section 7 video embed | 2–3 min, about adversity/mindset/recovery | MEDIUM |
| Himalayan landscape | Section 8 background (subtle, 8% opacity) | High-altitude, blue-black mountains, 1920×800px | MEDIUM |
| Timeline milestone icons | Section 6 | 6 small SVG icons for each career phase | LOW |

---

## CLAUDE CODE MASTER PROMPT — OUR STORY PAGE REBUILD

```
I'm rebuilding the Our Story page at app/our-story/page.tsx.

CURRENT STATE: The page has 5 sections. I need to expand it to 12 sections.
Keep sections 1 (Hero), 2 (Founder Story), existing Sourcing section (move to position 8),
and existing Founder section (move to position 9, fix broken image).

ADD 6 NEW SECTIONS (create as separate components in components/our-story/):

1. OurStoryJourney.tsx — "From Government Office to Glass Jar"
   Cream bg, max-width 720px centred, long-form editorial text with pull quote.
   
2. OurStoryMarketProblem.tsx — "The Ayurvedic Market Had Become a Bubble"
   Dark ink bg, max-width 720px centred, dark narrative section.
   
3. OurStoryPhilosophy.tsx — "What Performance Ayurveda Actually Means"
   Cream bg, includes Sanskrit text block with Devanagari + transliteration.
   
4. OurStoryTimeline.tsx — Dr. Kashish's career timeline
   Cream bg, vertical timeline with alternating cards, gold connecting line.
   7 milestones from 2016 to 2026. Scroll-triggered entrance animations.
   
5. OurStoryAthlete.tsx — Mona Agarwal section
   Dark ink bg, two-column layout, 4 performance pillar icons, pull quote,
   video embed. Include HTML comment: do NOT link Mona to product claims.
   
6. OurStoryBBB.tsx — Balance Build Become philosophy
   Dark ink bg, three-column cards with Sanskrit terms and descriptions.
   
7. OurStoryCTA.tsx — Final conversion section
   Cream bg, three CTA buttons, brand statement.

SECTION ORDER in page.tsx:
Hero → FounderStory → Journey → MarketProblem → Philosophy → Timeline →
Athlete → SourcingLabTesting (existing, repositioned) →
MeetTheFounder (existing, image fix) → BBB → CTA → Footer

FONT: Archivo Variable throughout.
DESIGN TOKENS: --ink #1c1304, --gold #C8963E, --cream #f7f0e2
NO GREEN (#2D4A3E) anywhere.

For the existing Founder image that shows a broken placeholder:
Add onError handler → hide image container → expand text to full width.

All content for each section is provided in the component files I'll create.
Start with the page.tsx restructure, then build each component one at a time.
```
