"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

const F = "var(--font-primary), system-ui, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;
const CREAM = "#f7f0e2";
const ESPRESSO = "#1c1304";
const GOLD = "#C8963E";
const TAUPE = "rgba(28,19,4,.55)";
const BUNDLE_IMG = "https://media.3tattava.com/products/Boxess%20copy%201.png";

const INCLUDES = [
  "RockResin® 20g classically purified resin jar — 40–50 daily servings",
  "30 Shahjeet® honey sticks — 600mg purified Shilajit each",
  "The full Balance · Build · Become ritual in one box",
  "Founding welcome perks — priority access + care guide",
];

const INSIDE = [
  {
    slug: "shodhit-shilajit-resin",
    label: "RockResin®",
    desc: "Classically purified Himalayan Shilajit resin — the Dip · Hook · Swirl ritual for daily strength and vitality.",
    img: "https://media.3tattava.com/features/home/homepage-rockresins.png",
  },
  {
    slug: "shahjeet-sticks",
    label: "Shahjeet®",
    desc: "600mg purified Shilajit blended with raw honey in 30 single-serve sticks. Tear. Squeeze. Perform.",
    img: "https://media.3tattava.com/products/full+shahjeet+box.png",
  },
];

const CSS = `
.bp-hero{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,64px);align-items:center;}
.bp-inside{display:grid;grid-template-columns:1fr 1fr;gap:clamp(16px,2.5vw,28px);}
@media(max-width:820px){.bp-hero{grid-template-columns:1fr;}.bp-inside{grid-template-columns:1fr;}}
`;

export default function BundleClient() {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

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

  const eyebrow: React.CSSProperties = {
    fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 700", fontSize: 11,
    letterSpacing: ".28em", textTransform: "uppercase", color: GOLD,
  };

  return (
    <div style={{ fontFamily: F, color: ESPRESSO, background: CREAM }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "clamp(96px,13vh,150px) 24px clamp(48px,7vw,84px)" }}>
        <div className="bp-hero" style={{ maxWidth: 1160, margin: "0 auto" }}>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE }}
            style={{ background: "radial-gradient(circle at 50% 40%, #fff 0%, #efe4cf 100%)", borderRadius: 24, padding: "clamp(24px,4vw,48px)", display: "flex", justifyContent: "center", boxShadow: "0 26px 70px rgba(68,42,27,.14)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BUNDLE_IMG} alt="3tattava Founding Bundle Pack — RockResin resin jar and Shahjeet honey sticks box" style={{ width: "100%", maxWidth: 440, height: "auto", display: "block", filter: "drop-shadow(0 24px 46px rgba(68,42,27,.2))" }} />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
          >
            <p style={{ ...eyebrow, marginBottom: 14 }}>The Complete Ritual</p>
            <h1 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(30px,4.6vw,52px)", letterSpacing: "-.02em", lineHeight: 1.05, margin: "0 0 14px" }}>
              Founding Bundle Pack
            </h1>
            <p style={{ fontFamily: F, fontSize: "clamp(15px,1.9vw,18px)", lineHeight: 1.6, color: TAUPE, margin: "0 0 clamp(24px,3vw,30px)", maxWidth: "44ch" }}>
              RockResin® Resin + Shahjeet® Honey Sticks — the full Balance · Build · Become ritual in one pack, at the founding price.
            </p>

            {/* Pricing */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap", marginBottom: 6 }}>
              <span style={{ fontFamily: F, fontSize: 18, color: TAUPE, textDecoration: "line-through" }}>₹2,998</span>
              <span style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: "clamp(34px,5vw,52px)", color: ESPRESSO, lineHeight: 1 }}>₹2,398</span>
              <span style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 11, letterSpacing: ".1em", color: GOLD, border: `1px solid ${GOLD}`, padding: "5px 11px", borderRadius: 8 }}>SAVE ₹600</span>
            </div>
            <p style={{ fontFamily: F, fontSize: 13, color: TAUPE, margin: "0 0 14px" }}>vs ₹2,598 bought separately</p>
            <p style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 13.5, lineHeight: 1.5, color: GOLD, margin: "0 0 clamp(24px,3vw,30px)", maxWidth: "42ch" }}>
              Founding Members (first 200): ₹2,198 — extra ₹200 off with your welcome code at checkout.
            </p>

            {/* Includes */}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 clamp(26px,3.5vw,34px)", display: "flex", flexDirection: "column", gap: 11 }}>
              {INCLUDES.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 11, fontFamily: F, fontSize: 15, lineHeight: 1.5, color: ESPRESSO }}>
                  <span aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD, flexShrink: 0, marginTop: 8 }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              <button type="button" onClick={handleAdd} style={{ height: 56, padding: "0 34px", background: ESPRESSO, color: CREAM, border: "none", borderRadius: 999, fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 13.5, letterSpacing: ".08em", textTransform: "uppercase", cursor: "pointer" }}>
                {added ? "Added ✓" : "Add the Bundle — ₹2,398"}
              </button>
              {added && (
                <Link href="/checkout/cart" style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase", color: ESPRESSO, textDecoration: "underline" }}>
                  Go to cart →
                </Link>
              )}
            </div>

            {/* Trust pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
              {["NABL Lab-Tested", "AYUSH-GMP", "Doctor Formulated", "Himalayan Sourced"].map((t) => (
                <span key={t} style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 600", fontSize: 9.5, letterSpacing: ".14em", textTransform: "uppercase", color: GOLD, border: "1px solid rgba(200,150,62,.32)", background: "rgba(200,150,62,.06)", padding: "4px 11px", borderRadius: 999 }}>
                  ✓ {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", borderTop: "1px solid rgba(183,163,146,.28)", padding: "clamp(48px,6vw,84px) 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ ...eyebrow, textAlign: "center", marginBottom: 10 }}>What&apos;s Inside</p>
          <h2 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(24px,3.2vw,38px)", textAlign: "center", letterSpacing: "-.02em", margin: "0 0 clamp(30px,4vw,44px)" }}>
            Two rituals. One complete system.
          </h2>
          <div className="bp-inside">
            {INSIDE.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} style={{ display: "block", background: CREAM, border: "1px solid rgba(183,163,146,.3)", borderRadius: 18, overflow: "hidden", textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "linear-gradient(135deg,#1c1304 0%,#2a1f14 100%)", aspectRatio: "16 / 10", display: "flex", alignItems: "center", justifyContent: "center", padding: 28 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.label} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
                </div>
                <div style={{ padding: "22px 24px 26px" }}>
                  <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: 22, margin: "0 0 8px" }}>{p.label}</p>
                  <p style={{ fontFamily: F, fontSize: 14.5, lineHeight: 1.55, color: TAUPE, margin: "0 0 14px" }}>{p.desc}</p>
                  <span style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 11.5, letterSpacing: ".14em", textTransform: "uppercase", color: GOLD }}>View product →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY STRIP ─────────────────────────────────────────────── */}
      <section style={{ background: CREAM, padding: "clamp(40px,5vw,64px) 24px", textAlign: "center" }}>
        <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontStyle: "italic", fontSize: "clamp(16px,2vw,24px)", color: "rgba(28,19,4,.32)", letterSpacing: "-.01em", maxWidth: 760, margin: "0 auto" }}>
          Balance Your Foundations. Build Your Resilience. Become Your Strongest Self.
        </p>
      </section>
    </div>
  );
}
