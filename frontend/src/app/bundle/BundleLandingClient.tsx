"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { media } from "@/lib/media";
import { trackPixel } from "@/lib/fbpixel";
import { trackGa } from "@/lib/gtag";

const F = "var(--font-primary), system-ui, sans-serif";
const CREAM = "#f7f0e2";
const INK = "#1c1304";
const GOLD = "#C8963E";
const TAUPE = "rgba(28,19,4,.55)";

const BUNDLE_IMG = "https://media.3tattava.com/products/Boxess%20copy%201.png";
const ROCKRESIN_IMG = "https://media.3tattava.com/features/home/homepage-rockresins.png";
const SHAHJEET_IMG = "https://media.3tattava.com/products/full+shahjeet+box.png";

// Mirrors the INCLUDES copy from products/founding-bundle-pack/BundleClient.tsx
const INCLUDES = [
  "RockResin™ 20g classically purified resin jar — 40–50 daily servings",
  "30 Shahjeet™ honey sticks — 600mg purified Shilajit each",
  "The full Balance · Build · Become ritual in one box",
  "Founding welcome perks — priority access + care guide",
];

const TRUST = [
  "Third-party NABL tested",
  "BAMS doctor-formulated",
  "Triphala purified",
  "Batch reports public",
];

const INSIDE = [
  {
    slug: "shodhit-shilajit-resin",
    label: "RockResin™",
    detail: "20g classically purified Himalayan Shilajit resin jar — 40–50 daily servings.",
    img: ROCKRESIN_IMG,
  },
  {
    slug: "shahjeet-sticks",
    label: "Shahjeet™",
    detail: "30 single-serve honey sticks — 600mg purified Shilajit blended with raw honey each.",
    img: SHAHJEET_IMG,
  },
];

const CSS = `
.blp-inside{display:grid;grid-template-columns:1fr 1fr;gap:clamp(16px,2.5vw,28px);}
@media(max-width:820px){.blp-inside{grid-template-columns:1fr;}}
`;

const eyebrow: React.CSSProperties = {
  fontFamily: F,
  fontVariationSettings: "'wdth' 75,'wght' 700",
  fontSize: 11,
  letterSpacing: ".28em",
  textTransform: "uppercase",
  color: GOLD,
};

export default function BundleLandingClient() {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    trackPixel("ViewContent", {
      content_name: "bundle_lp",
      content_type: "product",
      currency: "INR",
    });
    trackGa("view_item", {
      currency: "INR",
      value: 2398,
      items: [{ item_id: "founding-bundle-pack", item_name: "Founding Bundle Pack — RockResin + Shahjeet", price: 2398 }],
    });
  }, []);

  const handleAdd = async () => {
    await addItem({
      id: "founding-bundle-pack::founding-bundle",
      productId: "founding-bundle-pack",
      name: "Founding Bundle Pack — RockResin + Shahjeet",
      image: BUNDLE_IMG,
      price: 2398,
      mrp: 2998,
      quantity: 1,
      slug: "founding-bundle-pack",
      variant: "founding-bundle",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div style={{ fontFamily: F, color: INK, background: CREAM }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(96px,13vh,150px) 24px clamp(40px,6vw,72px)", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ ...eyebrow, marginBottom: 14 }}>The Complete Ritual · One Box</p>
          <h1 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(32px,5.4vw,58px)", letterSpacing: "-.02em", lineHeight: 1.05, margin: "0 0 16px" }}>
            The whole ritual, together.
          </h1>
          <p style={{ fontFamily: F, fontSize: "clamp(15px,2vw,19px)", lineHeight: 1.6, color: TAUPE, margin: "0 auto clamp(28px,4vw,36px)", maxWidth: "46ch" }}>
            RockResin™ resin + Shahjeet™ honey sticks — the full Balance · Build · Become ritual in one pack, at the founding price.
          </p>

          <div style={{ position: "relative", width: "100%", maxWidth: 440, aspectRatio: "1 / 1", margin: "0 auto clamp(28px,4vw,36px)", background: "radial-gradient(circle at 50% 40%, #fff 0%, #efe4cf 100%)", borderRadius: 24, boxShadow: "0 26px 70px rgba(68,42,27,.14)" }}>
            <Image
              src={media(BUNDLE_IMG)}
              alt="3tattava Founding Bundle Pack — RockResin resin jar and Shahjeet honey sticks box"
              fill
              priority
              sizes="(max-width: 820px) 90vw, 440px"
              style={{ objectFit: "contain", padding: "clamp(24px,5vw,44px)" }}
            />
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
            <button type="button" onClick={handleAdd} style={{ height: 56, padding: "0 34px", background: INK, color: CREAM, border: "none", borderRadius: 999, fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 13.5, letterSpacing: ".08em", textTransform: "uppercase", cursor: "pointer" }}>
              {added ? "Added ✓" : "Add the Bundle — ₹2,398"}
            </button>
            {added && (
              <Link href="/checkout/cart" style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase", color: INK, textDecoration: "underline" }}>
                Go to cart →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", borderTop: "1px solid rgba(183,163,146,.28)", borderBottom: "1px solid rgba(183,163,146,.28)", padding: "clamp(18px,2.6vw,26px) 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "10px clamp(14px,3vw,32px)", justifyContent: "center", alignItems: "center" }}>
          {TRUST.map((t) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 600", fontSize: "clamp(11px,1.4vw,13px)", letterSpacing: ".04em", color: INK }}>
              <span aria-hidden style={{ color: GOLD }}>✓</span>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── PRICE BLOCK ──────────────────────────────────────────────────── */}
      <section style={{ background: CREAM, padding: "clamp(48px,6vw,84px) 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <p style={{ ...eyebrow, marginBottom: 14 }}>Founding Price</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 6 }}>
            <span style={{ fontFamily: F, fontSize: 18, color: TAUPE, textDecoration: "line-through" }}>₹2,998</span>
            <span style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: "clamp(34px,5vw,52px)", color: INK, lineHeight: 1 }}>₹2,398</span>
            <span style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 11, letterSpacing: ".1em", color: GOLD, border: `1px solid ${GOLD}`, padding: "5px 11px", borderRadius: 8 }}>SAVE ₹600</span>
          </div>
          <p style={{ fontFamily: F, fontSize: 13, color: TAUPE, margin: "0 0 14px" }}>vs ₹2,598 bought separately</p>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 13.5, lineHeight: 1.5, color: GOLD, margin: "0 auto clamp(26px,3.5vw,34px)", maxWidth: "42ch" }}>
            Founding Members (first 200): ₹2,198 — extra ₹200 off with your welcome code at checkout.
          </p>

          {/* Includes — mirrors BundleClient INCLUDES */}
          <ul style={{ listStyle: "none", padding: 0, margin: "0 auto clamp(28px,3.5vw,36px)", display: "flex", flexDirection: "column", gap: 11, textAlign: "left", maxWidth: 460 }}>
            {INCLUDES.map((item) => (
              <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 11, fontFamily: F, fontSize: 15, lineHeight: 1.5, color: INK }}>
                <span aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD, flexShrink: 0, marginTop: 8 }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button type="button" onClick={handleAdd} style={{ height: 56, padding: "0 40px", background: INK, color: CREAM, border: "none", borderRadius: 999, fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 13.5, letterSpacing: ".08em", textTransform: "uppercase", cursor: "pointer" }}>
            {added ? "Added ✓" : "Add the Bundle — ₹2,398"}
          </button>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", borderTop: "1px solid rgba(183,163,146,.28)", padding: "clamp(48px,6vw,84px) 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ ...eyebrow, textAlign: "center", marginBottom: 10 }}>What&apos;s Inside</p>
          <h2 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(24px,3.2vw,38px)", textAlign: "center", letterSpacing: "-.02em", margin: "0 0 clamp(30px,4vw,44px)" }}>
            Two rituals. One complete pack.
          </h2>
          <div className="blp-inside">
            {INSIDE.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} style={{ display: "block", background: CREAM, border: "1px solid rgba(183,163,146,.3)", borderRadius: 18, overflow: "hidden", textDecoration: "none", color: "inherit" }}>
                <div style={{ position: "relative", background: "linear-gradient(135deg,#1c1304 0%,#2a1f14 100%)", aspectRatio: "16 / 10" }}>
                  <Image
                    src={media(p.img)}
                    alt={p.label}
                    fill
                    loading="lazy"
                    sizes="(max-width: 820px) 90vw, 480px"
                    style={{ objectFit: "contain", padding: 28 }}
                  />
                </div>
                <div style={{ padding: "22px 24px 26px" }}>
                  <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: 22, margin: "0 0 8px" }}>{p.label}</p>
                  <p style={{ fontFamily: F, fontSize: 14.5, lineHeight: 1.55, color: TAUPE, margin: "0 0 14px" }}>{p.detail}</p>
                  <span style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 11.5, letterSpacing: ".14em", textTransform: "uppercase", color: GOLD }}>View product →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF BLOCK ──────────────────────────────────────────────────── */}
      <section style={{ background: CREAM, padding: "clamp(48px,6vw,84px) 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ ...eyebrow, marginBottom: 12 }}>See The Proof</p>
          <h2 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(22px,3vw,34px)", letterSpacing: "-.02em", margin: "0 0 14px" }}>
            Every batch, tested and published.
          </h2>
          <p style={{ fontFamily: F, fontSize: "clamp(14px,1.8vw,16px)", lineHeight: 1.6, color: TAUPE, margin: "0 auto clamp(24px,3vw,30px)", maxWidth: "48ch" }}>
            Both products are third-party tested at NABL-accredited labs, with a batch-specific certificate of analysis you can scan via the QR on every pack.
          </p>
          <Link href="/lab-reports" style={{ display: "inline-flex", alignItems: "center", height: 52, padding: "0 32px", border: `1px solid ${INK}`, borderRadius: 999, fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase", color: INK, textDecoration: "none" }}>
            View lab reports →
          </Link>
        </div>
      </section>

      {/* ── DISCLAIMER ───────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", borderTop: "1px solid rgba(183,163,146,.28)", padding: "clamp(28px,3.5vw,44px) 24px" }}>
        <p style={{ fontFamily: F, fontSize: 12, lineHeight: 1.6, color: TAUPE, maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          Ayurvedic Proprietary Medicine. Not intended to diagnose, treat, cure or prevent any disease. Not a substitute for medical advice. Consult a qualified physician if you are pregnant, nursing, or on medication.
        </p>
      </section>
    </div>
  );
}
