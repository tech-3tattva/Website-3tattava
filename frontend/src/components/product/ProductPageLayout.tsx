'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export interface ProductData {
  slug: string
  name: string
  subtitle: string
  tagline: string
  hook: string
  price: number
  mrp: number
  weight: string
  stock: number
  chips: { label: string; value: string }[]
  bundlePrice: number
  bundleDesc: string
  bundleSaving: string
  mainImage: string
  thumbImages: { label: string; url: string; caption: string }[]
  differentiators: { num: string; title: string; desc: string }[]
  ritual: { step: string; title: string; desc: string }[]
  labPoints: string[]
  faqs: { q: string; a: string }[]
  comparisonRows: { metric: string; us: string; c1: string; c2: string }[]
  compCol1: string
  compCol2: string
  deliveryPoints: { icon: string; title: string; desc: string }[]
  trustMetrics: { value: string; label: string }[]
  finalCta: string
  seoTitle: string
  seoDescription: string
  breadcrumbName: string
}

const pdpCSS = `
  .pdp-page * { box-sizing: border-box; }
  .pdp-page { background: var(--cream); color: var(--ink); font-family: var(--font-primary, system-ui, sans-serif); line-height: 1.6; overflow-x: hidden; }
  .pdp-page h1, .pdp-page h2, .pdp-page h3, .pdp-page h4 { font-family: var(--font-primary, system-ui, sans-serif); line-height: 1.15; }

  .pdp-wrap { max-width: 1240px; margin: 0 auto; padding: 0 24px; }

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
    font-family: var(--font-display, 'Cormorant Garamond', serif);
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
    font-family: var(--font-display, 'Cormorant Garamond', serif);
    font-size: clamp(32px, 4vw, 44px);
    font-weight: 700;
    color: var(--ink);
    line-height: 1.1;
    margin-bottom: 6px;
    letter-spacing: -0.01em;
  }
  .buy-subtitle {
    font-family: var(--font-display, 'Cormorant Garamond', serif);
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
    font-family: var(--font-display, 'Cormorant Garamond', serif);
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
  .opt-price { font-family: var(--font-display, serif); font-size: 20px; font-weight: 700; color: var(--ink); }
  .opt-save {
    font-size: 11px;
    color: var(--green);
    background: rgba(45,74,62,0.1);
    padding: 3px 10px;
    border-radius: 4px;
    font-weight: 700;
    margin-left: 8px;
  }

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

  .cta-stack { display: grid; gap: 12px; margin-bottom: 16px; }
  .btn-primary {
    width: 100%;
    background: var(--gold-gradient);
    color: #fff;
    border: none;
    font-family: var(--font-body, 'Jost', system-ui, sans-serif);
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
    font-family: var(--font-body, 'Jost', system-ui, sans-serif);
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
    max-width: 1240px;
    margin: 0 auto;
    padding: 36px 24px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    text-align: center;
  }
  @media(max-width:760px) { .trust-inner { grid-template-columns: repeat(2,1fr); gap: 28px 10px; } }
  .trust-item b {
    display: block;
    font-family: var(--font-display, serif);
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
    font-family: var(--font-display, serif);
    font-size: 16px;
    color: var(--gold);
    font-weight: 700;
    margin-bottom: 18px;
    display: block;
  }
  .dcard h3 { font-size: 21px; margin-bottom: 10px; color: var(--ink); }
  .dcard p { font-size: 15px; color: var(--ink-soft); line-height: 1.6; }

  /* ── RITUAL STEPS ── */
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
    font-family: var(--font-display, serif);
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
    font-family: var(--font-display, serif);
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
  .cmp-table thead th { background: var(--ink); color: #fff; font-family: var(--font-display, serif); font-size: 17px; font-weight: 600; }
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
    font-family: var(--font-display, serif);
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
    font-family: var(--font-body, 'Jost', system-ui, sans-serif);
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
    max-width: 1240px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    gap: 20px;
  }
  .sb-info { display: flex; align-items: center; gap: 14px; }
  .sb-name { font-family: var(--font-display, serif); font-size: 17px; font-weight: 700; color: var(--ink); }
  .sb-price { color: var(--gold-dark); font-weight: 700; font-size: 15px; }
  .sb-btn {
    background: var(--gold-gradient);
    color: #fff;
    border: none;
    font-family: var(--font-body, 'Jost', system-ui, sans-serif);
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

  /* ── ANIMATIONS ── */
  .pdp-fade { opacity: 0; }
  @media(prefers-reduced-motion: reduce) { .pdp-fade { opacity: 1 !important; transform: none !important; } }

  /* ── MOBILE FIXED CTA BAR ── */
  .mobile-cta-bar { display: none; }

  @media(max-width: 768px) {
    .pdp-wrap { padding: 0 16px; }

    /* Main grid — single column, full bleed image */
    .pdp-grid {
      grid-template-columns: 1fr;
      gap: 0;
      padding: 0 0 80px 0;
    }

    /* Gallery — remove sticky, edge-to-edge image */
    .pdp-gallery { position: static !important; top: unset; }
    .g-main-img { border-radius: 0; border-left: none; border-right: none; }
    .g-thumbs { padding: 0 12px; gap: 8px; }
    .g-thumb { font-size: 8px; }

    /* Buy box — flat, no shadow, borderless */
    .buy-box {
      padding: 20px 16px 16px;
      box-shadow: none;
      border-radius: 0;
      border: none;
      border-top: 1px solid var(--line);
    }
    .buy-name { font-size: clamp(26px, 7vw, 34px); }
    .buy-price { font-size: 36px; }
    .price-row { flex-wrap: wrap; gap: 8px; }
    .buy-chips { gap: 8px; }
    .buy-chip { font-size: 11px; padding: 6px 10px; }
    .buy-opt { padding: 14px 16px; }
    .opt-title { font-size: 14px; }

    /* Hide desktop qty + CTA — mobile bar handles these */
    .qty-wrap { display: none; }
    .cta-stack { display: none; }

    /* Hide desktop sticky bar on mobile — mobile bar replaces it */
    .sticky-bar { display: none !important; }

    /* Trust strip */
    .trust-inner { grid-template-columns: repeat(2, 1fr); gap: 20px 12px; padding: 24px 16px; }
    .trust-item b { font-size: 22px; }

    /* Sections */
    .pdp-section { padding: 56px 0; }
    .sec-h2 { font-size: clamp(26px, 7vw, 36px); }
    .sec-p { font-size: 16px; }

    /* Diff grid */
    .diff-grid { grid-template-columns: 1fr; gap: 14px; }
    .dcard { padding: 24px 20px; }
    .dcard h3 { font-size: 18px; }

    /* Ritual */
    .ritual-steps { grid-template-columns: 1fr; gap: 32px; }
    .ritual-circle { width: 72px; height: 72px; font-size: 22px; }
    .ritual-step h3 { font-size: 20px; }

    /* Lab */
    .lab-card { padding: 24px 18px; }
    .lab-inner { grid-template-columns: 1fr; gap: 32px; }

    /* Comparison table — horizontal scroll */
    .cmp-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 12px; }
    .cmp-table { min-width: 480px; }
    .cmp-table th, .cmp-table td { padding: 12px 10px; font-size: 12px; }

    /* FAQ */
    .faq-q { font-size: 16px; padding: 20px 0; }

    /* Final CTA */
    .final-cta-section { padding: 64px 16px 100px; }
    .final-cta-btn { padding: 16px 32px; font-size: 15px; width: 100%; }

    /* Mobile fixed CTA bar */
    .mobile-cta-bar {
      display: flex;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 50;
      background: rgba(255,255,255,0.97);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-top: 1px solid var(--line);
      padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
      gap: 10px;
      align-items: center;
    }
    .mobile-qty {
      display: flex;
      align-items: center;
      gap: 4px;
      border: 1.5px solid var(--line);
      border-radius: 8px;
      padding: 6px 10px;
      flex-shrink: 0;
      background: var(--white);
    }
    .mobile-qty button {
      width: 28px;
      height: 28px;
      font-size: 20px;
      color: var(--ink);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mobile-qty span {
      min-width: 24px;
      text-align: center;
      font-size: 15px;
      font-weight: 700;
      color: var(--ink);
    }
    .mobile-add-btn {
      flex: 1;
      height: 48px;
      background: var(--gold-gradient);
      color: #fff;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.1em;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      text-transform: uppercase;
      box-shadow: 0 4px 16px rgba(200,150,62,0.35);
    }
  }

  @media(max-width: 480px) {
    .trust-inner { grid-template-columns: repeat(2, 1fr); }
    .buy-rating { flex-wrap: wrap; gap: 6px; }
    .in-stock { margin-left: 0; }
    .prelaunch-tag { font-size: 10px; padding: 4px 8px; }
  }
`

export default function ProductPageLayout({ product }: { product: ProductData }) {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<'one' | 'bundle' | 'subscribe'>('one')
  const [qty, setQty] = useState(1)
  const [activeThumb, setActiveThumb] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showSticky, setShowSticky] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const subscribePrice = Math.round(product.price * 0.80)
  const price = selectedOption === 'one' ? product.price : selectedOption === 'subscribe' ? subscribePrice : product.bundlePrice

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    gsap.utils.toArray<Element>('.pdp-fade').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' }
        }
      )
    })

    gsap.utils.toArray<Element>('.dcard').forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%' }
        }
      )
    })

    const handleScroll = () => setShowSticky(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  const checkout = () => {
    if (selectedOption === 'subscribe') {
      // TODO: Connect Razorpay subscription API post-KYC
      router.push('/subscribe-waitlist')
      return
    }
    alert(`Adding ${qty}x ${product.name} to cart — Razorpay integration coming`)
  }

  return (
    <>
      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: pdpCSS }} />

      <div className="pdp-page">

        {/* Breadcrumb */}
        <div className="pdp-wrap">
          <div className="pdp-crumb">
            <a onClick={() => router.push('/')}>Home</a> /
            <a onClick={() => router.push('/products')}>Shop</a> /
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
                  // eslint-disable-next-line @next/next/no-img-element
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
                    {t.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.url} alt={t.label} />
                    ) : t.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Buy Box */}
            <div className="buy-box">
              <div className="buy-rating">
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
                {/* Subscribe & Save */}
                <div
                  className={`buy-opt${selectedOption === 'subscribe' ? ' selected' : ''}`}
                  onClick={() => setSelectedOption('subscribe')}
                  style={selectedOption === 'subscribe' ? { borderLeftColor: '#C8963E', borderLeftWidth: '3px' } : { borderLeft: '3px solid rgba(200,150,62,0.30)' }}
                >
                  <div className="buy-opt-l">
                    <div className="opt-radio" />
                    <div>
                      <div className="opt-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Subscribe Monthly
                        <span style={{ background: '#C8963E', color: '#1c1304', fontSize: '9px', letterSpacing: '0.08em', padding: '2px 6px', textTransform: 'uppercase', fontWeight: 600 }}>Most Popular</span>
                      </div>
                      <div className="opt-desc">Auto-delivered · Cancel anytime</div>
                    </div>
                  </div>
                  <div>
                    <span className="opt-price">₹{subscribePrice.toLocaleString('en-IN')}/mo</span>
                    <span className="opt-save">SAVE 20%</span>
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
        <section className="pdp-section bg-white">
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
                  <h3 style={{ fontSize: 24, marginBottom: 12, fontFamily: 'var(--font-display, serif)', color: 'var(--ink)' }}>View Latest Batch Report</h3>
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
              <h2 className="sec-h2">Why {product.slug === 'shodhit-shilajit-resin' ? 'Resin' : 'Sticks'} Win.</h2>
            </div>
            <div className="pdp-fade cmp-table-wrap">
              <table className="cmp-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Metric</th>
                    <th className="us-col">{product.name.split(' ').slice(0, 2).join(' ')}</th>
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
            <h2 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(36px,5vw,60px)', color: 'var(--ink)', margin: '18px auto 24px', maxWidth: '20ch' }}>
              Premium Purity.<br/>Proven Performance.
            </h2>
            <p style={{ fontSize: 18, color: 'var(--ink-soft)', marginBottom: 36 }}>
              Upgrade your baseline with the world&apos;s finest {product.name}.
            </p>
            <button className="final-cta-btn" onClick={checkout}>{product.finalCta}</button>
          </div>
        </div>

        {/* Sticky Bar */}
        <div className={`sticky-bar${showSticky ? ' show' : ''}`}>
          <div className="sticky-bar-inner">
            <div className="sb-info">
              <div>
                <div className="sb-name">{product.name.split(' ').slice(0,2).join(' ')} <span style={{fontSize:13,color:'var(--ink-soft)',fontWeight:400}}>· {product.weight}</span></div>
                <div className="sb-price">₹{price.toLocaleString('en-IN')}</div>
              </div>
            </div>
            <button className="sb-btn" onClick={checkout}>Add to Cart</button>
          </div>
        </div>

        {/* Mobile Fixed CTA Bar */}
        <div className="mobile-cta-bar">
          <div className="mobile-qty">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
            <span>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} aria-label="Increase quantity">+</button>
          </div>
          <button className="mobile-add-btn" onClick={checkout}>
            Add to Cart · ₹{price.toLocaleString('en-IN')} →
          </button>
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
              <div style={{width:72,height:72,border:'2px solid var(--gold)',borderRadius:'50%',margin:'0 auto 20px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display, serif)',color:'var(--gold-dark)',fontWeight:700}}>NABL</div>
              <h3 style={{fontFamily:'var(--font-display, serif)',fontSize:24,color:'var(--ink)',marginBottom:12}}>Latest Lab Report</h3>
              <p style={{color:'var(--ink-soft)',marginBottom:32,lineHeight:1.6}}>Batch #RK2024-08 confirms ≥71.2% Fulvic Acid and safe trace levels for all heavy metals.</p>
              <button
                style={{background:'transparent',border:'2px solid var(--ink)',color:'var(--ink)',fontSize:12,letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:700,padding:'12px 28px',borderRadius:6,cursor:'pointer'}}
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
