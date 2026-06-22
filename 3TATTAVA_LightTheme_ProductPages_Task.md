# 3TATTAVA — Light Theme Homepage + Product Pages
## Claude Code Task File | Complete UI Transformation

---

## CONTEXT

**Brand:** 3TATTAVA — India's first Performance Ayurveda brand
**Stack:** Next.js 14 (App Router), MongoDB, Vercel
**Task:** Transform homepage to light cream palette + build both product pages with routing

### NEW DESIGN TOKEN SYSTEM (Replace ALL dark variables)

```css
--cream:    #f7f0e2    /* primary page background */
--white:    #ffffff    /* card/panel background */
--taupe:    #b7a392    /* secondary UI accents, borders */
--ink:      #1c1304    /* all body text */
--ink-soft: rgba(28,19,4,0.60)  /* muted text */
--gold:     #C8963E    /* brand gold */
--gold-dark:#A67B2F    /* gold hover states */
--gold-soft:#E4C079    /* gold highlights */
--gold-dim: rgba(200,150,62,0.12)  /* gold tint backgrounds */
--green:    #2D4A3E    /* brand green */
--line:     rgba(28,19,4,0.10)   /* all borders and dividers */

/* Golden Gradient (from color palette image) */
--gold-gradient: linear-gradient(105deg, #a67b2f 0%, #e4c079 45%, #c8963e 70%, #a67b2f 100%)
```

---

## STEP 0 — READ CODEBASE FIRST

```bash
find . -type f \( -name "*.tsx" -o -name "*.ts" \) | grep -v node_modules | grep -v .next | head -60
find . -path "*/app/*" -name "page.tsx" | grep -v node_modules
find . -path "*/components/*" | grep -v node_modules | head -40
cat app/page.tsx 2>/dev/null || cat pages/index.tsx 2>/dev/null
cat next.config.js 2>/dev/null
```

---

## STEP 1 — CREATE GLOBAL CSS VARIABLES

In your `app/globals.css` or wherever CSS variables are defined, replace/add:

```css
:root {
  --cream:    #f7f0e2;
  --white:    #ffffff;
  --taupe:    #b7a392;
  --ink:      #1c1304;
  --ink-soft: rgba(28,19,4,0.60);
  --gold:     #C8963E;
  --gold-dark:#A67B2F;
  --gold-soft:#E4C079;
  --gold-dim: rgba(200,150,62,0.12);
  --green:    #2D4A3E;
  --line:     rgba(28,19,4,0.10);
  --gold-gradient: linear-gradient(105deg, #a67b2f 0%, #e4c079 45%, #c8963e 70%, #a67b2f 100%);
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Jost', system-ui, sans-serif;
}

body {
  background: var(--cream);
  color: var(--ink);
}
```

---

## STEP 2 — UPDATE HOMEPAGE (app/page.tsx)

Find the homepage file. The homepage currently uses dark backgrounds. Make these changes:

### 2.1 — Hero Section background change

Find the HeroSection component. Change:
- `background: #1A1A1A` or `background: #0f0f0f` → **keep as-is for hero only**
- The hero can stay dark (it has video behind it) — dark hero on light page creates great contrast

### 2.2 — Features Section (Cellular Energy cards)

Find the FeaturesSection component. Change:
- Section background: `background: var(--cream)` instead of `#1A1A1A`
- Text column background: `background: var(--white)` instead of `#1A1A1A`
- All `color: #F5F0EB` text → `color: var(--ink)`
- All `color: rgba(245,240,235,...)` → `color: var(--ink-soft)`
- Card borders: `border: 1px solid var(--line)` instead of dark borders
- Eyebrow text stays: `color: var(--gold-dark)`
- Watermark numbers: `color: var(--taupe)` at `opacity: 0.15`

### 2.3 — Week by Week Section

Find the WeekByWeek component. Change:
- Keep the video background (it provides the dark texture they want just in that section)
- The cream/dark contrast between sections is intentional — dark video section breaks up the light pages nicely
- Cards: `background: rgba(247,240,226,0.92)` (cream with opacity over video)
- `backdrop-filter: blur(16px)`
- Card text: `color: var(--ink)` (dark text on light card)
- Card borders: `border: 1px solid rgba(200,150,62,0.3)`
- Left accent bar stays gold

### 2.4 — Social Proof / Reviews Section

Background: `var(--white)`, text: `var(--ink)`
Review cards: `background: var(--cream)`, border: `1px solid var(--line)`

### 2.5 — Doctor / Founder Section

Background: `var(--cream)`, text: `var(--ink)`

### 2.6 — Announcement Bar (top strip)

```tsx
// Light version of announcement bar
<div style={{
  background: 'var(--ink)',
  color: '#ffffff',
  fontSize: 12,
  letterSpacing: '0.05em',
}}>
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:28, height:40 }}>
    <span><strong style={{color:'var(--gold-soft)'}}>NABL</strong> Lab Certified</span>
    <span>·</span>
    <span>Free Shipping Above ₹999</span>
    <span>·</span>
    <span>Doctor-Formulated by <strong style={{color:'var(--gold-soft)'}}>Dr. Kashish (BAMS)</strong></span>
  </div>
</div>
```

### 2.7 — Navigation

```tsx
// Light nav
<nav style={{
  background: 'rgba(247,240,226,0.95)',
  backdropFilter: 'blur(16px)',
  borderBottom: '1px solid var(--line)',
  position: 'sticky',
  top: 0,
  zIndex: 60,
}}>
```

Logo: `color: var(--ink)`, gold accent on "3"
Nav links: `color: var(--ink-soft)`, hover: `color: var(--gold-dark)`
CTA button: `background: var(--gold)`, `color: #ffffff`

### 2.8 — All Buttons Routing

Find every CTA button on the homepage and add proper Next.js routing:

```tsx
import { useRouter } from 'next/navigation'

const router = useRouter()

// Hero buttons
<button onClick={() => router.push('/products/shodhit-shilajit-resin')}>
  Shop Shilajit Resin
</button>
<button onClick={() => router.push('/products/shahjeet-sticks')}>
  Try Honey Sticks
</button>

// Week by Week CTA
<button onClick={() => router.push('/products/shodhit-shilajit-resin')}>
  Start Your Ritual — ₹999
</button>
```

---

## STEP 3 — CREATE PRODUCT PAGE LAYOUT COMPONENT

Create `components/product/ProductPageLayout.tsx` — this is the SHARED layout used by both products.

The structure comes from the uploaded HTML (code.html). Convert it to Next.js/React with the light palette.

```tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

interface ProductData {
  slug: string
  name: string             // e.g. "SHODHIT SHILAJIT RESIN"
  subtitle: string         // e.g. "Pure Himalayan Resin · 20g Jar"
  tagline: string          // italic subtitle
  hook: string             // 2-line description
  price: number            // e.g. 1299
  mrp: number              // e.g. 1499
  weight: string           // e.g. "20g"
  stock: number
  rating: number           // e.g. 4.9
  reviewCount: number
  chips: { label: string; value: string }[]
  bundlePrice: number
  bundleDesc: string
  bundleSaving: string
  mainImage: string        // CloudFront URL
  thumbImages: { label: string; url: string; caption: string }[]
  differentiators: { num: string; title: string; desc: string }[]
  ritual: { step: string; title: string; desc: string }[]
  labPoints: string[]
  faqs: { q: string; a: string }[]
  comparisonRows: { metric: string; us: string; c1: string; c2: string }[]
  compCol1: string         // e.g. "Capsules"
  compCol2: string         // e.g. "Powders"
  deliveryPoints: { icon: string; title: string; desc: string }[]
  trustMetrics: { value: string; label: string }[]
  finalCta: string
  seoTitle: string
  seoDescription: string
  breadcrumbName: string
}

export default function ProductPageLayout({ product }: { product: ProductData }) {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<'one' | 'bundle'>('one')
  const [qty, setQty] = useState(1)
  const [activeThumb, setActiveThumb] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showSticky, setShowSticky] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const price = selectedOption === 'one' ? product.price : product.bundlePrice

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Fade-up on scroll for all sections
    gsap.utils.toArray('.pdp-fade').forEach((el: any) => {
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' }
        }
      )
    })

    // Diff cards stagger
    gsap.utils.toArray('.dcard').forEach((el: any, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%' }
        }
      )
    })

    // Sticky bar
    const handleScroll = () => setShowSticky(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  const checkout = () => {
    // TODO: integrate with Razorpay
    alert(`Adding ${qty}x ${product.name} to cart — Razorpay integration coming`)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');

        :root {
          --cream: #f7f0e2;
          --white: #ffffff;
          --taupe: #b7a392;
          --ink: #1c1304;
          --ink-soft: rgba(28,19,4,0.60);
          --gold: #C8963E;
          --gold-dark: #A67B2F;
          --gold-soft: #E4C079;
          --gold-dim: rgba(200,150,62,0.12);
          --green: #2D4A3E;
          --line: rgba(28,19,4,0.10);
          --gold-gradient: linear-gradient(105deg, #a67b2f 0%, #e4c079 45%, #c8963e 70%, #a67b2f 100%);
          --font-display: 'Cormorant Garamond', Georgia, serif;
          --font-body: 'Jost', system-ui, sans-serif;
          --maxw: 1240px;
        }

        .pdp-page * { box-sizing: border-box; }
        .pdp-page { background: var(--cream); color: var(--ink); font-family: var(--font-body); line-height: 1.6; overflow-x: hidden; }
        .pdp-page h1, .pdp-page h2, .pdp-page h3, .pdp-page h4 { font-family: var(--font-display); line-height: 1.15; }

        .pdp-wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 24px; }

        /* ── ANNOUNCE BAR ── */
        .pdp-announce {
          background: var(--ink);
          color: #fff;
          font-size: 12px;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          height: 40px;
          flex-wrap: wrap;
          padding: 0 16px;
        }
        .pdp-announce b { color: var(--gold-soft); }

        /* ── NAV ── */
        .pdp-nav {
          position: sticky;
          top: 0;
          z-index: 60;
          background: rgba(247,240,226,0.96);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--line);
        }
        .pdp-nav-inner {
          max-width: var(--maxw);
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 68px;
          gap: 24px;
        }
        .pdp-logo {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          color: var(--ink);
          cursor: pointer;
          letter-spacing: 0.02em;
        }
        .pdp-logo span { color: var(--gold); }
        .pdp-navlinks { display: flex; gap: 28px; font-size: 14px; font-weight: 500; color: var(--ink-soft); }
        .pdp-navlinks a { color: inherit; text-decoration: none; transition: color 0.2s; }
        .pdp-navlinks a:hover { color: var(--gold-dark); }
        .pdp-nav-cta {
          background: var(--gold);
          color: #fff;
          border: none;
          font-family: var(--font-body);
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 600;
          padding: 10px 22px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .pdp-nav-cta:hover { background: var(--gold-dark); }

        /* ── BREADCRUMB ── */
        .pdp-crumb {
          font-size: 13px;
          color: var(--ink-soft);
          padding: 20px 0 8px;
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .pdp-crumb a { color: inherit; text-decoration: none; cursor: pointer; }
        .pdp-crumb a:hover { color: var(--gold-dark); }
        .pdp-crumb span { color: var(--ink); font-weight: 600; }

        /* ── PDP GRID ── */
        .pdp-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 56px;
          padding: 16px 0 80px;
          align-items: start;
        }
        @media(max-width:1024px) { .pdp-grid { grid-template-columns: 1fr; gap: 40px; } }

        /* ── GALLERY ── */
        .pdp-gallery { position: sticky; top: 88px; }
        @media(max-width:1024px) { .pdp-gallery { position: static; } }

        .g-main-img {
          width: 100%;
          aspect-ratio: 1/1;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--line);
          background: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .g-main-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .g-main-img:hover img { transform: scale(1.03); }
        .g-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: var(--gold);
          color: #fff;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 4px;
          z-index: 2;
        }

        /* Thumbnail placeholder when no real image */
        .g-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          text-align: center;
          background: var(--white);
        }
        .g-placeholder-jar {
          width: 140px;
          height: 160px;
          border-radius: 10px;
          background: var(--ink);
          border: 2px solid var(--gold);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 28px;
          position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
        .g-placeholder-jar::before {
          content: '';
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          width: 88px;
          height: 22px;
          border-radius: 4px;
          background: var(--gold);
        }
        .g-placeholder-jar span {
          font-family: var(--font-display);
          font-size: 13px;
          letter-spacing: 0.15em;
          color: var(--gold);
          font-weight: 700;
        }

        .g-thumbs {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin-top: 14px;
        }
        .g-thumb {
          aspect-ratio: 1/1;
          border-radius: 8px;
          border: 1.5px solid var(--line);
          cursor: pointer;
          overflow: hidden;
          background: var(--white);
          transition: border-color 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--ink-soft);
        }
        .g-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .g-thumb:hover { border-color: var(--taupe); }
        .g-thumb.active { border-color: var(--gold); border-width: 2px; box-shadow: 0 0 0 3px var(--gold-dim); }

        /* ── BUY BOX ── */
        .buy-box {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 8px 32px rgba(28,19,4,0.05);
        }
        .buy-rating {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--ink-soft);
          font-weight: 500;
          margin-bottom: 14px;
        }
        .buy-stars { color: var(--gold); letter-spacing: 2px; font-size: 16px; }
        .buy-rating a { color: var(--ink-soft); text-decoration: underline; }
        .buy-rating a:hover { color: var(--gold-dark); }
        .in-stock { color: var(--green); font-weight: 700; font-size: 12px; margin-left: auto; }

        .buy-name {
          font-family: var(--font-display);
          font-size: clamp(32px, 4vw, 44px);
          font-weight: 700;
          color: var(--ink);
          line-height: 1.1;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }
        .buy-subtitle {
          font-family: var(--font-display);
          font-size: 18px;
          font-style: italic;
          color: var(--gold-dark);
          margin-bottom: 20px;
        }
        .buy-hook {
          font-size: 16px;
          color: var(--ink-soft);
          line-height: 1.65;
          margin-bottom: 24px;
        }
        .buy-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 28px;
        }
        .buy-chip {
          font-size: 12px;
          font-weight: 600;
          border: 1.5px solid var(--line);
          border-radius: 6px;
          padding: 7px 13px;
          color: var(--ink);
          display: flex;
          gap: 5px;
          align-items: center;
          background: var(--white);
        }
        .buy-chip b { color: var(--gold-dark); }

        .price-row {
          display: flex;
          align-items: baseline;
          gap: 14px;
          margin-bottom: 6px;
        }
        .buy-price {
          font-family: var(--font-display);
          font-size: 44px;
          font-weight: 700;
          color: var(--ink);
          line-height: 1;
        }
        .buy-mrp {
          font-size: 18px;
          color: var(--ink-soft);
          text-decoration: line-through;
        }
        .prelaunch-tag {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold-dark);
          background: var(--gold-dim);
          padding: 5px 12px;
          border-radius: 4px;
          font-weight: 700;
        }
        .buy-tax {
          font-size: 13px;
          color: var(--ink-soft);
          margin-bottom: 28px;
          font-weight: 500;
        }

        /* Options */
        .buy-opts { display: grid; gap: 12px; margin-bottom: 24px; }
        .buy-opt {
          border: 1.5px solid var(--line);
          border-radius: 10px;
          padding: 18px 20px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
          background: var(--white);
        }
        .buy-opt:hover { border-color: var(--taupe); }
        .buy-opt.selected {
          border-color: var(--gold);
          border-width: 2px;
          background: var(--gold-dim);
        }
        .buy-opt-l { display: flex; align-items: center; gap: 14px; }
        .opt-radio {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid var(--gold);
          flex: 0 0 auto;
          position: relative;
          transition: all 0.2s;
        }
        .buy-opt.selected .opt-radio::after {
          content: '';
          position: absolute;
          inset: 3px;
          border-radius: 50%;
          background: var(--gold);
        }
        .opt-title { font-size: 16px; font-weight: 700; color: var(--ink); }
        .opt-desc { font-size: 13px; color: var(--ink-soft); margin-top: 2px; }
        .opt-price { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--ink); }
        .opt-save {
          font-size: 11px;
          color: var(--green);
          background: rgba(45,74,62,0.1);
          padding: 3px 10px;
          border-radius: 4px;
          font-weight: 700;
          margin-left: 8px;
        }

        /* Qty */
        .qty-wrap {
          display: flex;
          align-items: center;
          border: 1.5px solid var(--line);
          border-radius: 8px;
          width: fit-content;
          margin-bottom: 20px;
          overflow: hidden;
          background: var(--white);
        }
        .qty-btn {
          background: none;
          border: none;
          color: var(--ink);
          font-size: 22px;
          width: 48px;
          height: 48px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.15s;
          line-height: 1;
        }
        .qty-btn:hover { background: var(--cream); }
        .qty-val { width: 44px; text-align: center; font-weight: 700; font-size: 16px; color: var(--ink); }

        /* CTA Buttons */
        .cta-stack { display: grid; gap: 12px; margin-bottom: 16px; }
        .btn-primary {
          width: 100%;
          background: var(--gold-gradient);
          color: #fff;
          border: none;
          font-family: var(--font-body);
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 18px 32px;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(200,150,62,0.35);
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(200,150,62,0.45); }
        .btn-primary:active { transform: translateY(0); }
        .btn-secondary {
          width: 100%;
          background: transparent;
          color: var(--ink);
          border: 2px solid var(--ink);
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 16px 32px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover { background: var(--ink); color: var(--white); }
        .secure-line {
          text-align: center;
          font-size: 13px;
          color: var(--ink-soft);
          margin-bottom: 20px;
          font-weight: 500;
        }
        .secure-line b { color: var(--ink); font-weight: 700; }

        /* Delivery points */
        .buy-deliv {
          border-top: 1px solid var(--line);
          padding-top: 24px;
          display: grid;
          gap: 14px;
          font-size: 14px;
          color: var(--ink-soft);
        }
        .deliv-row { display: flex; gap: 12px; align-items: flex-start; }
        .deliv-icon { color: var(--gold-dark); font-size: 16px; flex-shrink: 0; margin-top: 1px; }
        .deliv-row b { color: var(--ink); font-weight: 600; }

        /* ── TRUST STRIP ── */
        .trust-strip {
          background: var(--white);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .trust-inner {
          max-width: var(--maxw);
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
          padding-top: 36px;
          padding-bottom: 36px;
          text-align: center;
        }
        @media(max-width:760px) { .trust-inner { grid-template-columns: repeat(2,1fr); gap: 28px 10px; } }
        .trust-item b {
          display: block;
          font-family: var(--font-display);
          font-size: 30px;
          color: var(--ink);
          line-height: 1;
          margin-bottom: 6px;
          font-weight: 700;
        }
        .trust-item span {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold-dark);
          font-weight: 700;
        }

        /* ── SECTION SHARED ── */
        .pdp-section { padding: 96px 0; }
        .pdp-section.bg-white { background: var(--white); }
        .pdp-section.bg-cream { background: var(--cream); }
        .sec-eyebrow {
          font-family: var(--font-body);
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--gold-dark);
          font-weight: 700;
          margin-bottom: 14px;
        }
        .sec-h2 {
          font-size: clamp(30px,4vw,46px);
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 16px;
        }
        .sec-p { font-size: 18px; color: var(--ink-soft); line-height: 1.65; max-width: 600px; }

        /* ── DIFFERENTIATORS GRID ── */
        .diff-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 8px;
        }
        @media(max-width:900px) { .diff-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:600px) { .diff-grid { grid-template-columns: 1fr; } }
        .dcard {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 36px;
          transition: box-shadow 0.3s, transform 0.3s;
        }
        .dcard:hover { box-shadow: 0 12px 36px rgba(28,19,4,0.07); transform: translateY(-4px); }
        .dnum {
          font-family: var(--font-display);
          font-size: 16px;
          color: var(--gold);
          font-weight: 700;
          margin-bottom: 18px;
          display: block;
        }
        .dcard h3 { font-size: 21px; margin-bottom: 10px; color: var(--ink); }
        .dcard p { font-size: 15px; color: var(--ink-soft); line-height: 1.6; }
        .dcard-highlight {
          background: var(--gold-dim);
          border: 2px solid rgba(200,150,62,0.4);
          text-align: center;
          margin-top: 20px;
          border-radius: 12px;
          padding: 36px;
        }

        /* ── RITUAL STEPS ── */
        .ritual-bg { background: var(--cream); }
        .ritual-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          margin-top: 48px;
        }
        @media(max-width:760px) { .ritual-steps { grid-template-columns: 1fr; } }
        .ritual-step { text-align: center; }
        .ritual-circle {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: var(--gold-dim);
          border: 1px solid rgba(200,150,62,0.3);
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 28px;
          color: var(--gold-dark);
          font-weight: 700;
        }
        .ritual-step h3 { font-size: 24px; color: var(--ink); margin-bottom: 10px; }
        .ritual-step p { font-size: 15px; color: var(--ink-soft); max-width: 24ch; margin: 0 auto; }

        /* ── LAB CARD ── */
        .lab-card {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 48px;
          box-shadow: 0 12px 40px rgba(28,19,4,0.05);
        }
        .lab-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
        @media(max-width:720px) { .lab-inner { grid-template-columns: 1fr; } }
        .lab-seal {
          width: 96px;
          height: 96px;
          border: 3px solid var(--gold);
          border-radius: 50%;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          color: var(--gold-dark);
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-align: center;
        }
        .lab-points { display: grid; gap: 18px; }
        .lab-point { display: flex; gap: 14px; align-items: flex-start; font-size: 15px; color: var(--ink-soft); }
        .lab-check { color: var(--green); font-weight: 900; font-size: 18px; }
        .lab-point b { color: var(--ink); font-weight: 700; }

        /* ── COMPARISON TABLE ── */
        .cmp-table { width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); background: var(--white); }
        .cmp-table th, .cmp-table td { padding: 20px 22px; text-align: center; border: 1px solid var(--line); font-size: 15px; }
        .cmp-table thead th { background: var(--ink); color: #fff; font-family: var(--font-display); font-size: 17px; font-weight: 600; }
        .cmp-table thead th.us-col { background: var(--gold-gradient); color: #fff; }
        .cmp-table td:first-child { text-align: left; font-weight: 600; color: var(--ink); }
        .cmp-table td.us-col { background: var(--gold-dim); font-weight: 700; color: var(--ink); }
        @media(max-width:680px) { .cmp-table th, .cmp-table td { padding: 12px 10px; font-size: 13px; } }

        /* ── FAQ ── */
        .faq-wrap { max-width: 860px; margin: 0 auto; }
        .faq-item { border-bottom: 1.5px solid var(--line); }
        .faq-q {
          width: 100%;
          background: none;
          border: none;
          color: var(--ink);
          text-align: left;
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 600;
          padding: 26px 0;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }
        .faq-pm { color: var(--gold); font-size: 24px; flex-shrink: 0; transition: transform 0.3s; }
        .faq-pm.open { transform: rotate(45deg); }
        .faq-a {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1);
          color: var(--ink-soft);
          font-size: 16px;
          line-height: 1.65;
        }
        .faq-a.open { max-height: 500px; }
        .faq-a p { padding-bottom: 26px; }

        /* ── FINAL CTA ── */
        .final-cta-section {
          background: var(--white);
          border-top: 1px solid var(--line);
          text-align: center;
          padding: 96px 24px;
        }
        .final-cta-btn {
          background: var(--gold-gradient);
          color: #fff;
          border: none;
          font-family: var(--font-body);
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 20px 56px;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 6px 24px rgba(200,150,62,0.4);
        }
        .final-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(200,150,62,0.5); }

        /* ── STICKY BUY BAR ── */
        .sticky-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 70;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(12px);
          border-top: 1px solid var(--line);
          box-shadow: 0 -4px 24px rgba(28,19,4,0.07);
          transform: translateY(110%);
          transition: transform 0.35s ease;
          padding: 0 24px;
        }
        .sticky-bar.show { transform: translateY(0); }
        .sticky-bar-inner {
          max-width: var(--maxw);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
          gap: 20px;
        }
        .sb-info { display: flex; align-items: center; gap: 14px; }
        .sb-name { font-family: var(--font-display); font-size: 17px; font-weight: 700; color: var(--ink); }
        .sb-price { color: var(--gold-dark); font-weight: 700; font-size: 15px; }
        .sb-btn {
          background: var(--gold-gradient);
          color: #fff;
          border: none;
          font-family: var(--font-body);
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 700;
          padding: 12px 28px;
          border-radius: 6px;
          cursor: pointer;
          transition: box-shadow 0.2s;
          box-shadow: 0 3px 12px rgba(200,150,62,0.3);
          flex-shrink: 0;
        }

        /* ── FOOTER ── */
        .pdp-footer {
          background: var(--ink);
          color: rgba(255,255,255,0.65);
          padding: 72px 0 40px;
          font-size: 14px;
          font-family: var(--font-body);
        }
        .footer-grid {
          max-width: var(--maxw);
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 40px;
        }
        @media(max-width:860px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
        .footer-logo { font-family: var(--font-display); font-size: 28px; margin-bottom: 14px; color: #fff; }
        .footer-logo span { color: var(--gold-soft); }
        .footer-col h5 {
          color: #fff;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .footer-col a {
          display: block;
          margin-bottom: 10px;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .footer-col a:hover { color: var(--gold-soft); }
        .footer-note {
          max-width: var(--maxw);
          margin: 48px auto 0;
          padding: 28px 24px 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
        }

        /* ── ANIMATIONS ── */
        .pdp-fade { opacity: 0; }
        @media(prefers-reduced-motion: reduce) { .pdp-fade { opacity: 1 !important; transform: none !important; } }
      `}</style>

      <div className="pdp-page">
        {/* Announce */}
        <div className="pdp-announce">
          <span><b>NABL</b> 3rd-party lab tested</span>
          <span>·</span>
          <span><b>≥70%</b> Fulvic Acid</span>
          <span>·</span>
          <span><b>AYUSH-GMP</b> certified facility</span>
          <span>·</span>
          <span>Free shipping above ₹999</span>
        </div>

        {/* Nav */}
        <nav className="pdp-nav">
          <div className="pdp-nav-inner">
            <div className="pdp-logo" onClick={() => router.push('/')}>
              3<span>tattava</span>
            </div>
            <div className="pdp-navlinks">
              <a href="#different">Why Us</a>
              <a href="#lab">Lab Reports</a>
              <a href="#faq">FAQ</a>
              <a onClick={() => router.push('/products/shodhit-shilajit-resin')} style={{cursor:'pointer'}}>Shilajit Resin</a>
              <a onClick={() => router.push('/products/shahjeet-sticks')} style={{cursor:'pointer'}}>Honey Sticks</a>
            </div>
            <button className="pdp-nav-cta" onClick={() => {
              document.getElementById('buy-section')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              Shop Now
            </button>
          </div>
        </nav>

        {/* Breadcrumb */}
        <div className="pdp-wrap">
          <div className="pdp-crumb">
            <a onClick={() => router.push('/')}>Home</a> /
            <a onClick={() => router.push('/shop')}>Shop</a> /
            <span>{product.breadcrumbName}</span>
          </div>
        </div>

        {/* PDP Top Grid */}
        <div className="pdp-wrap" id="buy-section">
          <div className="pdp-grid">
            {/* Gallery */}
            <div className="pdp-gallery">
              <div className="g-main-img">
                <div className="g-badge">{product.weight} · Export Quality</div>
                {product.thumbImages[activeThumb]?.url ? (
                  <img
                    src={product.thumbImages[activeThumb].url}
                    alt={product.name}
                  />
                ) : (
                  <div className="g-placeholder">
                    <div className="g-placeholder-jar">
                      <span>{product.name.split(' ')[0]}</span>
                    </div>
                    <p style={{ marginTop: 20, fontSize: 14, color: 'var(--ink-soft)', maxWidth: 280, textAlign: 'center', lineHeight: 1.5 }}>
                      {product.thumbImages[activeThumb]?.caption}
                    </p>
                  </div>
                )}
              </div>
              <div className="g-thumbs">
                {product.thumbImages.map((t, i) => (
                  <div
                    key={i}
                    className={`g-thumb${activeThumb === i ? ' active' : ''}`}
                    onClick={() => setActiveThumb(i)}
                  >
                    {t.url ? <img src={t.url} alt={t.label} /> : t.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Buy Box */}
            <div className="buy-box">
              <div className="buy-rating">
                <span className="buy-stars">★★★★★</span>
                <span>{product.rating} · <a href="#reviews">{product.reviewCount} Verified Reviews</a></span>
                <span className="in-stock">● In Stock</span>
              </div>

              <h1 className="buy-name">{product.name}</h1>
              <div className="buy-subtitle">{product.subtitle}</div>
              <p className="buy-hook">{product.hook}</p>

              <div className="buy-chips">
                {product.chips.map((c, i) => (
                  <span key={i} className="buy-chip"><b>{c.value}</b> {c.label}</span>
                ))}
              </div>

              <div className="price-row">
                <span className="buy-price">₹{(selectedOption === 'one' ? product.price : product.bundlePrice).toLocaleString('en-IN')}</span>
                {product.mrp > product.price && <span className="buy-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>}
                <span className="prelaunch-tag">Pre-launch Special</span>
              </div>
              <div className="buy-tax">Incl. GST · Free Shipping · 30-Day Supply</div>

              {/* Options */}
              <div className="buy-opts">
                <div
                  className={`buy-opt${selectedOption === 'one' ? ' selected' : ''}`}
                  onClick={() => setSelectedOption('one')}
                >
                  <div className="buy-opt-l">
                    <div className="opt-radio" />
                    <div>
                      <div className="opt-title">One-time Purchase</div>
                      <div className="opt-desc">Single {product.weight} · {product.weight} pack</div>
                    </div>
                  </div>
                  <span className="opt-price">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
                <div
                  className={`buy-opt${selectedOption === 'bundle' ? ' selected' : ''}`}
                  onClick={() => setSelectedOption('bundle')}
                >
                  <div className="buy-opt-l">
                    <div className="opt-radio" />
                    <div>
                      <div className="opt-title">The Complete Ritual</div>
                      <div className="opt-desc">{product.bundleDesc}</div>
                    </div>
                  </div>
                  <div>
                    <span className="opt-price">₹{product.bundlePrice.toLocaleString('en-IN')}</span>
                    <span className="opt-save">{product.bundleSaving}</span>
                  </div>
                </div>
              </div>

              {/* Qty */}
              <div className="qty-wrap">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-val">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
              </div>

              {/* CTAs */}
              <div className="cta-stack">
                <button className="btn-primary" onClick={checkout}>
                  Add to Cart — Start the Ritual
                </button>
                <button className="btn-secondary" onClick={checkout}>
                  Buy Now · Pay Later Available
                </button>
              </div>
              <div className="secure-line">🔒 Secure Payments via <b>Razorpay</b></div>

              {/* Delivery assurances */}
              <div className="buy-deliv">
                {product.deliveryPoints.map((d, i) => (
                  <div key={i} className="deliv-row">
                    <span className="deliv-icon">{d.icon}</span>
                    <span><b>{d.title}:</b> {d.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="trust-strip">
          <div className="trust-inner">
            {product.trustMetrics.map((t, i) => (
              <div key={i} className="trust-item">
                <b>{t.value}</b>
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Differentiators */}
        <section className="pdp-section bg-cream" id="different">
          <div className="pdp-wrap">
            <div className="pdp-fade">
              <div className="sec-eyebrow">Why {product.slug === 'shodhit-shilajit-resin' ? 'RockResin' : 'Shahjeet Sticks'}?</div>
              <h2 className="sec-h2">Seven Pillars of<br/>Performance Purity.</h2>
              <p className="sec-p" style={{ marginBottom: 48 }}>Clinical-grade quality you can verify. Every claim backed by data.</p>
            </div>
            <div className="diff-grid">
              {product.differentiators.map((d, i) => (
                <div key={i} className="dcard pdp-fade">
                  <span className="dnum">{d.num}</span>
                  <h3>{d.title}</h3>
                  <p>{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ritual */}
        <section className="pdp-section bg-white ritual-bg">
          <div className="pdp-wrap">
            <div className="pdp-fade" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
              <div className="sec-eyebrow">The Method</div>
              <h2 className="sec-h2">{product.ritual.map(r => r.title).join('. ')}.</h2>
              <p className="sec-p" style={{ margin: '0 auto 8px' }}>Modern performance built on ancient ritual. No mess, no guesswork.</p>
            </div>
            <div className="ritual-steps">
              {product.ritual.map((r, i) => (
                <div key={i} className="ritual-step pdp-fade">
                  <div className="ritual-circle">{r.step}</div>
                  <h3>{r.title}</h3>
                  <p>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lab Transparency */}
        <section className="pdp-section bg-cream" id="lab">
          <div className="pdp-wrap">
            <div className="pdp-fade">
              <div className="sec-eyebrow">Clinical Transparency</div>
              <h2 className="sec-h2">Verified Purity.<br/>No Compromise.</h2>
              <p className="sec-p" style={{ marginBottom: 48 }}>Every jar has a QR code linking to its NABL batch report. We hide nothing.</p>
            </div>
            <div className="lab-card pdp-fade">
              <div className="lab-inner">
                <div style={{ textAlign: 'center' }}>
                  <div className="lab-seal">NABL</div>
                  <h3 style={{ fontSize: 24, marginBottom: 12, fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>View Latest Batch Report</h3>
                  <p style={{ color: 'var(--ink-soft)', marginBottom: 24, fontSize: 15 }}>Batch #RK2024-08: Verified for all heavy metals and fulvic acid %.</p>
                  <button
                    className="btn-primary"
                    style={{ maxWidth: 280, margin: '0 auto', display: 'block' }}
                    onClick={() => setShowModal(true)}
                  >
                    Download Report (PDF)
                  </button>
                </div>
                <div className="lab-points">
                  {product.labPoints.map((lp, i) => (
                    <div key={i} className="lab-point">
                      <span className="lab-check">✓</span>
                      <span dangerouslySetInnerHTML={{ __html: lp }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="pdp-section bg-white">
          <div className="pdp-wrap">
            <div className="pdp-fade" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 48px' }}>
              <div className="sec-eyebrow">Form Comparison</div>
              <h2 className="sec-h2">Why Resin Wins.</h2>
            </div>
            <div className="pdp-fade">
              <table className="cmp-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Metric</th>
                    <th className="us-col">SHODHIT RESIN</th>
                    <th>{product.compCol1}</th>
                    <th>{product.compCol2}</th>
                  </tr>
                </thead>
                <tbody>
                  {product.comparisonRows.map((r, i) => (
                    <tr key={i}>
                      <td>{r.metric}</td>
                      <td className="us-col">{r.us}</td>
                      <td>{r.c1}</td>
                      <td>{r.c2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pdp-section bg-cream" id="faq">
          <div className="pdp-wrap">
            <div className="pdp-fade" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 48px' }}>
              <div className="sec-eyebrow">Questions</div>
              <h2 className="sec-h2">Clinical Clarity.</h2>
            </div>
            <div className="faq-wrap">
              {product.faqs.map((faq, i) => (
                <div key={i} className="faq-item">
                  <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    {faq.q}
                    <span className={`faq-pm${openFaq === i ? ' open' : ''}`}>+</span>
                  </button>
                  <div className={`faq-a${openFaq === i ? ' open' : ''}`}>
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <div className="final-cta-section">
          <div className="pdp-wrap">
            <div className="sec-eyebrow">Start the Ritual</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,5vw,60px)', color: 'var(--ink)', margin: '18px auto 24px', maxWidth: '20ch' }}>
              Premium Purity.<br/>Proven Performance.
            </h2>
            <p style={{ fontSize: 18, color: 'var(--ink-soft)', marginBottom: 36 }}>
              Upgrade your baseline with the world's finest Shodhit Shilajit.
            </p>
            <button className="final-cta-btn" onClick={checkout}>{product.finalCta}</button>
          </div>
        </div>

        {/* Footer */}
        <footer className="pdp-footer">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">3<span>tattava</span></div>
              <p>Performance Ayurveda for the modern human. Science-backed, doctor-formulated, traditionally purified.</p>
            </div>
            <div className="footer-col">
              <h5>Shop</h5>
              <a onClick={() => router.push('/products/shodhit-shilajit-resin')}>Shodhit Resin</a>
              <a onClick={() => router.push('/products/shahjeet-sticks')}>Shahjeet Sticks</a>
              <a onClick={() => router.push('/shop')}>All Products</a>
            </div>
            <div className="footer-col">
              <h5>Information</h5>
              <a href="#lab">Lab Reports</a>
              <a href="#different">The Science</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer-col">
              <h5>Legal</h5>
              <a onClick={() => router.push('/privacy-policy')}>Privacy Policy</a>
              <a onClick={() => router.push('/terms')}>Terms of Service</a>
              <a onClick={() => router.push('/shipping')}>Shipping Policy</a>
            </div>
          </div>
          <div className="footer-note">
            <span>Marketed by SankalpaSiddhi Ayupharma Pvt Ltd · Mfg. Lic. No. DL-482 A&U · Delhi, India</span>
            <span>© 2025 3TATTAVA · Ayurvedic Proprietary Medicine</span>
          </div>
        </footer>

        {/* Sticky Bar */}
        <div className={`sticky-bar${showSticky ? ' show' : ''}`}>
          <div className="sticky-bar-inner">
            <div className="sb-info">
              <div>
                <div className="sb-name">{product.name.split(' ').slice(0,2).join(' ')} <span style={{fontSize:13,color:'var(--ink-soft)',fontFamily:'var(--font-body)',fontWeight:400}}>· {product.weight}</span></div>
                <div className="sb-price">₹{price.toLocaleString('en-IN')}</div>
              </div>
            </div>
            <button className="sb-btn" onClick={checkout}>Add to Cart</button>
          </div>
        </div>

        {/* Lab Modal */}
        {showModal && (
          <div
            style={{ position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',padding:20 }}
            onClick={() => setShowModal(false)}
          >
            <div
              style={{ background:'#fff',padding:48,borderRadius:16,maxWidth:500,width:'100%',textAlign:'center',position:'relative' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{width:72,height:72,border:'2px solid var(--gold)',borderRadius:'50%',margin:'0 auto 20px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',color:'var(--gold-dark)',fontWeight:700}}>NABL</div>
              <h3 style={{fontFamily:'var(--font-display)',fontSize:24,color:'var(--ink)',marginBottom:12}}>Latest Lab Report</h3>
              <p style={{color:'var(--ink-soft)',marginBottom:32,lineHeight:1.6}}>Batch #RK2024-08 confirms ≥71.2% Fulvic Acid and safe trace levels for all heavy metals.</p>
              <button
                style={{background:'transparent',border:'2px solid var(--ink)',color:'var(--ink)',fontFamily:'var(--font-body)',fontSize:12,letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700,padding:'12px 28px',borderRadius:6,cursor:'pointer'}}
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
```

---

## STEP 4 — PRODUCT DATA FILES

Create `data/products/shodhit-shilajit-resin.ts`:

```typescript
import { ProductData } from '@/components/product/ProductPageLayout'

export const shodhitShilajitResin: ProductData = {
  slug: 'shodhit-shilajit-resin',
  name: 'SHODHIT SHILAJIT RESIN',
  subtitle: 'Pure Himalayan Resin · 20g Jar',
  tagline: 'Ancient Mineral Elixir for Modern Vitality',
  hook: 'Sourced above 16,000 ft and purified using classical Triphala Shodhan. Lab-verified ≥70% fulvic acid for superior cellular absorption. Pure, clinical-grade vitality in a single daily ritual.',
  price: 1299,
  mrp: 1499,
  weight: '20g',
  stock: 100,
  rating: 4.9,
  reviewCount: 312,
  chips: [
    { value: '≥70%', label: 'Fulvic Acid' },
    { value: '80+', label: 'Ionic Minerals' },
    { value: 'NABL', label: 'Certified' },
    { value: 'AYUSH', label: 'GMP Facility' },
  ],
  bundlePrice: 1799,
  bundleDesc: 'Resin Jar + 30 Honey Sticks',
  bundleSaving: 'SAVE 21%',
  mainImage: 'https://media.3tattava.com/products/Rockresin-hero.jpeg',
  thumbImages: [
    { label: 'MAIN', url: 'https://media.3tattava.com/products/Rockresin-hero.jpeg', caption: 'SHODHIT SHILAJIT RESIN. Premium Himalayan origin, purified via traditional Shodhan methods.' },
    { label: 'TEXTURE', url: 'https://media.3tattava.com/features/resin-pulled.png', caption: 'PURE RESIN TEXTURE. Glossy, dark — signs of high fulvic content.' },
    { label: 'SOURCE', url: 'https://media.3tattava.com/features/resin-mountain.png', caption: 'HIMALAYAN SOURCE. Seeping from ancient rock above 16,000ft.' },
    { label: 'QUALITY', url: '', caption: 'NABL LAB TESTED. Batch-verified for purity.' },
    { label: 'EXPERT', url: '', caption: 'DR. KASHISH GUPTA (BAMS). Formulated for modern performance.' },
  ],
  differentiators: [
    { num: '01', title: 'Primal Sourcing', desc: 'Harvested from Himalayan peaks above 16,000 ft where mineral content is most concentrated and untouched.' },
    { num: '02', title: 'Classical Shodhan', desc: 'Purified using the traditional Triphala method, removing impurities while preserving essential bio-active compounds.' },
    { num: '03', title: 'Bioavailability Focus', desc: 'With ≥70% fulvic acid, our resin enters your cells efficiently — a natural catalyst for nutrient absorption.' },
    { num: '04', title: '80+ Ionic Minerals', desc: 'A natural matrix of iron, magnesium, and zinc in a form your body recognizes and utilises instantly.' },
    { num: '05', title: 'NABL Lab Verification', desc: 'Every batch tested for heavy metals and purity. We publish reports for complete transparency.' },
    { num: '06', title: 'Certified Excellence', desc: 'Manufactured in an AYUSH-GMP facility meeting international quality control standards.' },
    { num: '07', title: 'Pure Resin Promise', desc: 'Zero fillers, zero capsules, zero additives. Just pure, potent Shilajit in its most effective form.' },
  ],
  ritual: [
    { step: '01', title: 'Dip', desc: 'Dip the precision spatula into the resin jar.' },
    { step: '02', title: 'Hook', desc: 'Hook a pea-sized amount (approx 300–500mg).' },
    { step: '03', title: 'Swirl', desc: 'Swirl into warm water or milk. Dissolves in seconds.' },
  ],
  labPoints: [
    '<b>Heavy-Metal Free:</b> Tested for Lead, Mercury, Arsenic.',
    '<b>High Fulvic Content:</b> Verified ≥70% concentration.',
    '<b>Microbial Safe:</b> Passed all AYUSH-GMP safety protocols.',
    '<b>Pure Origin:</b> 100% Himalayan Asphaltum Punjabianum.',
  ],
  faqs: [
    { q: 'Is this safe for daily use?', a: 'Yes, SHODHIT SHILAJIT is designed as a daily ritual. One 300-500mg dose provides consistent support for energy and mineral balance. If you have chronic medical conditions, please consult your physician first.' },
    { q: 'What is the "Shodhan" method?', a: 'Shodhan is the classical Ayurvedic purification process. We use Triphala-infused water to purify the raw resin, removing all sand and heavy metals while enhancing bioavailability and therapeutic strength.' },
    { q: 'How long does one jar last?', a: 'A 20g jar provides approximately 40-50 servings of a pea-sized amount, making it a 1.5 month supply for most users.' },
    { q: 'Is it suitable for women?', a: 'Absolutely. Shilajit is excellent for women — supporting hormonal balance, energy, and skin health. Not recommended during pregnancy or breastfeeding without medical advice.' },
  ],
  comparisonRows: [
    { metric: 'Form Purity', us: '100% Pure', c1: 'Diluted with fillers', c2: 'Often contains malto' },
    { metric: 'Absorption Rate', us: 'Maximum', c1: 'Delayed by shell', c2: 'Low/Inconsistent' },
    { metric: 'Fulvic % (Verified)', us: '≥70% NABL', c1: 'Rarely stated', c2: 'Rarely stated' },
    { metric: 'Heavy Metal Test', us: '3rd Party NABL', c1: 'Inconsistent', c2: 'Inconsistent' },
    { metric: 'The Ritual', us: 'Traditional Swirl', c1: 'Swallow & Hope', c2: 'Difficult to mix' },
  ],
  compCol1: 'Capsules',
  compCol2: 'Powders',
  deliveryPoints: [
    { icon: '✦', title: 'Clinical Purity', desc: 'Triphala-purified by traditional Shodhan method.' },
    { icon: '⛰', title: 'Elite Source', desc: 'Hand-harvested above 16,000 ft in the Himalayas.' },
    { icon: '⚕', title: 'Expert Formulated', desc: 'By Dr. Kashish Gupta (BAMS) for performance.' },
  ],
  trustMetrics: [
    { value: '≥70%', label: 'Fulvic Acid' },
    { value: '80+', label: 'Ionic Minerals' },
    { value: 'NABL', label: '3rd-party Lab' },
    { value: '16,000ft', label: 'Himalayan Source' },
    { value: 'AYUSH', label: 'GMP Certified' },
  ],
  finalCta: 'Shop SHODHIT RESIN — ₹1,299',
  seoTitle: 'SHODHIT SHILAJIT RESIN — Pure Himalayan Shilajit (20g) | 3TATTAVA',
  seoDescription: 'Pure Himalayan Shodhit Shilajit resin. NABL lab-tested, ≥70% fulvic acid, 80+ trace minerals. Doctor-formulated by Dr. Kashish Gupta (BAMS).',
  breadcrumbName: 'SHODHIT SHILAJIT RESIN',
}
```

Create `data/products/shahjeet-sticks.ts`:

```typescript
import { ProductData } from '@/components/product/ProductPageLayout'

export const shahjeetSticks: ProductData = {
  slug: 'shahjeet-sticks',
  name: 'SHAHJEET STICKS',
  subtitle: 'Honey-Shilajit · 30 Sticks',
  tagline: 'Daily Strength & Vitality Formula',
  hook: '600mg of pure Himalayan Shilajit per stick, infused with natural honey. Tear. Squeeze. Perform. No measuring, no mixing — your 10-second daily ritual for sustained energy and recovery.',
  price: 999,
  mrp: 1199,
  weight: '30 Sticks',
  stock: 150,
  rating: 4.8,
  reviewCount: 218,
  chips: [
    { value: '600mg', label: 'Shilajit Per Stick' },
    { value: '100%', label: 'Pure Resin Form' },
    { value: 'NABL', label: 'Lab Tested' },
    { value: 'AYUSH', label: 'GMP Certified' },
  ],
  bundlePrice: 1799,
  bundleDesc: 'Honey Sticks + Resin Jar',
  bundleSaving: 'SAVE 21%',
  mainImage: 'https://media.3tattava.com/products/shahjeet-box.png',
  thumbImages: [
    { label: 'MAIN', url: 'https://media.3tattava.com/products/shahjeet-box.png', caption: 'SHAHJEET STICKS. 30 single-serve honey-Shilajit sticks for daily performance.' },
    { label: 'SACHET', url: 'https://media.3tattava.com/features/shahjeet-sachet.png', caption: 'THE DAILY RITUAL. Tear, squeeze, perform.' },
    { label: 'SOURCE', url: 'https://media.3tattava.com/features/resin-mountain.png', caption: 'HIMALAYAN ORIGIN. 600mg of pure resin per stick.' },
    { label: 'QUALITY', url: '', caption: 'NABL LAB TESTED. Verified for purity and safety.' },
    { label: 'FORMULA', url: '', caption: 'TRIPHALA PURIFIED. Classical Ayurvedic processing.' },
  ],
  differentiators: [
    { num: '01', title: '600mg of Himalayan Strength', desc: 'The highest-strength Shilajit stick format. No guesswork, no under-dosing, no inconsistency.' },
    { num: '02', title: 'Ancient Power Pair, Perfected', desc: 'Honey is revered in Ayurveda as the supreme Anupana — it amplifies Shilajit\'s bioavailability in every single stick.' },
    { num: '03', title: 'Built for Demanding Days', desc: 'Supports strength, stamina and physical endurance — for workouts, demanding work days, and everything in between.' },
    { num: '04', title: 'Recover Faster, Go Harder', desc: 'Supports post-exertion recovery and sustained endurance so you show up fully, every day.' },
    { num: '05', title: 'Sharp Mind. Strong Body.', desc: 'Supports mental clarity and cognitive sharpness alongside physical vitality — peak performance is never just physical.' },
    { num: '06', title: 'Classically Purified, Verified', desc: 'Triphala-purified per classical Ayurvedic texts, then NABL 3rd-party tested for heavy metals and purity.' },
    { num: '07', title: 'Just Two Ingredients', desc: 'Honey. Shilajit. Nothing else. No fillers, no artificial additives, no shortcuts. Pure as it gets.' },
  ],
  ritual: [
    { step: '01', title: 'Tear', desc: 'Tear the stick open along the notch.' },
    { step: '02', title: 'Squeeze', desc: 'Squeeze the full 8g stick directly into your mouth or warm water.' },
    { step: '03', title: 'Perform', desc: 'No mixing, no measuring, no mess. Just 600mg of pure performance daily.' },
  ],
  labPoints: [
    '<b>Heavy-Metal Free:</b> Tested for Lead, Mercury, Arsenic.',
    '<b>600mg Shilajit Per Stick:</b> Verified concentration per batch.',
    '<b>Microbial Safe:</b> Passed all AYUSH-GMP safety protocols.',
    '<b>Honey Verified:</b> 100% natural, no added sugar.',
  ],
  faqs: [
    { q: 'When is the best time to take Shahjeet Sticks?', a: 'Morning before breakfast for all-day sustained energy, or 30 minutes before training for performance support. Can also be taken post-workout for recovery.' },
    { q: 'Are Shahjeet Sticks suitable for diabetics?', a: 'Each stick contains natural honey with approximately 6g carbohydrates. If you are diabetic or monitoring blood sugar, consult your physician before use.' },
    { q: 'How many sticks per day?', a: 'One stick per day is the recommended dose. Each pack of 30 sticks is a 30-day supply at the standard daily dose.' },
    { q: 'Are they suitable for women?', a: 'Absolutely. Shahjeet Sticks are designed for both men and women seeking daily strength, energy and vitality. Not recommended during pregnancy or breastfeeding without medical advice.' },
  ],
  comparisonRows: [
    { metric: 'Shilajit per Dose', us: '600mg guaranteed', c1: 'Often 100-250mg', c2: 'Varies batch to batch' },
    { metric: 'Carrier Medium', us: 'Raw honey (Anupana)', c1: 'Capsule shell', c2: 'Plain powder' },
    { metric: 'Convenience', us: 'Tear & go — 5 seconds', c1: 'Needs water', c2: 'Needs mixing' },
    { metric: 'Bioavailability', us: 'Enhanced by honey', c1: 'Shell delays absorption', c2: 'Low/Inconsistent' },
    { metric: 'Third Party Tested', us: '3rd Party NABL', c1: 'Inconsistent', c2: 'Inconsistent' },
  ],
  compCol1: 'Capsules',
  compCol2: 'Generic Powders',
  deliveryPoints: [
    { icon: '✦', title: '600mg Per Stick', desc: 'Highest-strength honey-Shilajit stick format available.' },
    { icon: '🍯', title: 'Honey Anupana', desc: 'Natural honey amplifies absorption — ancient Ayurvedic wisdom.' },
    { icon: '⚕', title: 'Expert Formulated', desc: 'By Dr. Kashish Gupta (BAMS) for modern performance needs.' },
  ],
  trustMetrics: [
    { value: '600mg', label: 'Shilajit Per Stick' },
    { value: '100%', label: 'Pure Resin Form' },
    { value: 'NABL', label: '3rd-party Lab' },
    { value: '30', label: 'Daily Sticks' },
    { value: 'AYUSH', label: 'GMP Certified' },
  ],
  finalCta: 'Shop SHAHJEET STICKS — ₹999',
  seoTitle: 'SHAHJEET STICKS — Honey Shilajit Daily Ritual (30 Sticks) | 3TATTAVA',
  seoDescription: '600mg pure Himalayan Shilajit per honey stick. 30 sticks. NABL tested, Triphala purified, AYUSH-GMP certified. Tear. Squeeze. Perform.',
  breadcrumbName: 'SHAHJEET STICKS',
}
```

---

## STEP 5 — CREATE PRODUCT PAGE ROUTES

Create `app/products/shodhit-shilajit-resin/page.tsx`:

```tsx
import type { Metadata } from 'next'
import ProductPageLayout from '@/components/product/ProductPageLayout'
import { shodhitShilajitResin } from '@/data/products/shodhit-shilajit-resin'

export const metadata: Metadata = {
  title: shodhitShilajitResin.seoTitle,
  description: shodhitShilajitResin.seoDescription,
}

export default function RockResinPage() {
  return <ProductPageLayout product={shodhitShilajitResin} />
}
```

Create `app/products/shahjeet-sticks/page.tsx`:

```tsx
import type { Metadata } from 'next'
import ProductPageLayout from '@/components/product/ProductPageLayout'
import { shahjeetSticks } from '@/data/products/shahjeet-sticks'

export const metadata: Metadata = {
  title: shahjeetSticks.seoTitle,
  description: shahjeetSticks.seoDescription,
}

export default function ShahjeetSticksPage() {
  return <ProductPageLayout product={shahjeetSticks} />
}
```

---

## STEP 6 — WIRE HOMEPAGE BUTTONS

In `app/page.tsx` and all homepage components, replace static button links:

```tsx
// Hero section
import { useRouter } from 'next/navigation'
const router = useRouter()

// "SHOP SHILAJIT RESIN" button
onClick={() => router.push('/products/shodhit-shilajit-resin')}

// "TRY HONEY STICKS" button
onClick={() => router.push('/products/shahjeet-sticks')}

// Nav "SHOP" link
onClick={() => router.push('/shop')}

// Week by Week CTA
onClick={() => router.push('/products/shodhit-shilajit-resin')}
```

Also wire navigation links in the Navbar component:
```tsx
// SHOP nav item
<Link href="/shop">Shop</Link>

// SHILAJIT RESIN nav item
<Link href="/products/shodhit-shilajit-resin">Shilajit Resin</Link>

// HONEY STICKS nav item
<Link href="/products/shahjeet-sticks">Honey Sticks</Link>
```

---

## STEP 7 — UPDATE HOMEPAGE SECTION COLORS

Find each homepage section component and apply the light palette:

### FeaturesSection.tsx — update these specific styles:
```tsx
// Section wrapper
style={{ background: 'var(--cream)' }}

// Section header text
// h2: color: 'var(--ink)'
// subtext: color: 'var(--ink-soft)'

// Text columns (between images)
style={{ background: 'var(--white)', borderLeft: '1px solid var(--line)' }}

// Feature text: replace #F5F0EB with 'var(--ink)'
// replace rgba(245,240,235,...) with 'var(--ink-soft)'

// Eyebrow text stays: color: 'var(--gold-dark)'
// Gold line stays
// Watermark numbers: color: 'var(--taupe)', opacity: 0.2
```

### Week by Week glassmorphism cards — update:
```tsx
// Cards over dark video — use LIGHT glassmorphism
background: 'rgba(247,240,226,0.88)',
backdropFilter: 'blur(20px)',
border: '1px solid rgba(200,150,62,0.25)',
// All card text: color: 'var(--ink)'
// Week label: color: 'var(--gold-dark)'
// Card title: color: 'var(--ink)'
// Card body: color: 'var(--ink-soft)'
// Left accent bar stays gold
```

### Reviews/Social Proof section:
```tsx
// Background
background: 'var(--white)'
// Review cards
background: 'var(--cream)', border: '1px solid var(--line)'
// Text
color: 'var(--ink)'
```

### Doctor/Founder section:
```tsx
background: 'var(--cream)'
// all text → var(--ink) and var(--ink-soft)
```

---

## STEP 8 — ADD GSAP TO PRODUCT PAGE

In `app/layout.tsx` (if not already there):

```tsx
<Script
  src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
  strategy="beforeInteractive"
/>
<Script
  src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
  strategy="beforeInteractive"
/>
```

---

## STEP 9 — SHOP PAGE (Optional Quick Win)

Create `app/shop/page.tsx` — simple listing page:

```tsx
'use client'
import { useRouter } from 'next/navigation'

export default function ShopPage() {
  const router = useRouter()
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', padding: '80px 24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: 16, fontWeight: 700 }}>
          SHOP
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 700, color: 'var(--ink)', marginBottom: 64 }}>
          All Products
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))', gap: 28 }}>
          {[
            { name: 'SHODHIT SHILAJIT RESIN', price: 1299, desc: 'Pure Himalayan Resin · 20g Jar', slug: 'shodhit-shilajit-resin', img: 'https://media.3tattava.com/products/Rockresin-hero.jpeg' },
            { name: 'SHAHJEET STICKS', price: 999, desc: 'Honey-Shilajit · 30 Sticks', slug: 'shahjeet-sticks', img: 'https://media.3tattava.com/products/shahjeet-box.png' },
          ].map(p => (
            <div
              key={p.slug}
              onClick={() => router.push(`/products/${p.slug}`)}
              style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.3s, transform 0.3s' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 36px rgba(28,19,4,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
            >
              <div style={{ aspectRatio: '1/1', overflow: 'hidden', background: 'var(--cream)' }}>
                <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '28px 28px 32px' }}>
                <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-dark)', fontWeight: 700, marginBottom: 8 }}>3TATTAVA</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{p.name}</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 20 }}>{p.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>₹{p.price.toLocaleString('en-IN')}</span>
                  <button
                    style={{ background: 'var(--gold)', color: '#fff', border: 'none', fontFamily: 'var(--font-body)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, padding: '11px 22px', borderRadius: 6, cursor: 'pointer' }}
                  >
                    View Product
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

## STEP 10 — TEST AND DEPLOY

```bash
npm run dev
```

**Test checklist:**
- [ ] Homepage background is cream `#f7f0e2` (not dark)
- [ ] All homepage text is dark ink `#1c1304` — readable on light background
- [ ] Hero section stays dark (video background) — correct contrast
- [ ] Week by Week cards are light cream with gold borders (over dark video)
- [ ] "SHOP SHILAJIT RESIN" hero button → routes to `/products/shodhit-shilajit-resin`
- [ ] "TRY HONEY STICKS" hero button → routes to `/products/shahjeet-sticks`
- [ ] Product page `/products/shodhit-shilajit-resin` loads with light cream palette
- [ ] Product page `/products/shahjeet-sticks` loads with same layout, different content
- [ ] Sticky buy bar appears on scroll (below 600px scroll)
- [ ] FAQ accordion opens and closes
- [ ] Comparison table renders with golden "SHODHIT RESIN" column
- [ ] All footer links route correctly
- [ ] `/shop` page shows both products with images

```bash
git add .
git commit -m "feat: light cream theme homepage + product pages (Shilajit Resin + Shahjeet Sticks)"
git push origin main
```

---

## NOTES FOR CLAUDE CODE

1. **Read codebase first** (Step 0) — find exact file locations before editing
2. **Product name is "SHODHIT SHILAJIT RESIN"** — not "Pure Himalayan Shilajit" or "RockResin"
3. **Hero stays dark** — only the sections below the hero get the light cream treatment
4. **Week by Week video section stays dark** — only the cards change to light glassmorphism
5. **Both product pages use the SAME layout component** with different data — don't duplicate the component
6. **CloudFront URLs are confirmed working** — use them exactly as written
7. **Preserve all existing GSAP animations** — only change colors, not animation logic
8. **The gold gradient** (`var(--gold-gradient)`) is used on primary CTA buttons and the comparison table header — this is a key premium detail from the color palette provided
