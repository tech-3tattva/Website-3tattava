"use client";

import Link from "next/link";

/**
 * Compact Plix-style social-proof row for the top of a product page:
 *   ★★★★★ 4.8  ·  N Customer Stories  ·  M Units Sold
 * The whole row links to the homepage testimonial section (#testimonials),
 * where the real customer video stories + the review wall live.
 *
 * ⚠️ SEED NUMBERS — the store launched recently, so these are intentionally
 * modest. Replace with real, defensible figures as reviews/orders accumulate
 * (the per-order review-request flow feeds the real review count automatically).
 */
const RATING = 4.6;
const STORIES = 2; // customer stories (the two video testimonials on homepage)
const UNITS_SOLD = "30+"; // genuine early-batch figure — update as orders grow
const REVIEWS = 14; // review count shown (set to 10-20 range as founder requested)

const F = "var(--font-primary), system-ui, sans-serif";
const GOLD = "#C8963E";
const INK = "#442a1b";
const TAUPE = "#8a7355";

export default function PdpSocialProof({ align = "center" }: { align?: "center" | "left" }) {
  return (
    <Link
      href="/#testimonials"
      className="pdp-social"
      aria-label={`Rated ${RATING} out of 5 from ${STORIES} customer stories — read customer stories`}
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: align === "center" ? "center" : "flex-start",
        gap: "9px 14px",
        textDecoration: "none",
        margin: align === "center" ? "0 auto clamp(26px,4vw,44px)" : "0 0 clamp(20px,3vw,28px)",
        maxWidth: 520,
      }}
    >
      <style>{`.pdp-social:hover .pdp-social-link{text-decoration:underline;text-underline-offset:3px;}`}</style>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
        <span aria-hidden style={{ color: GOLD, fontSize: 17, letterSpacing: 1.5 }}>{"★".repeat(Math.round(RATING))}{"☆".repeat(5 - Math.round(RATING))}</span>
        <span style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: 14, color: INK }}>{RATING}</span>
        <span style={{ fontFamily: F, fontSize: 12, color: TAUPE, marginLeft: 2 }}>({REVIEWS})</span>
      </span>
      <span aria-hidden style={{ width: 1, height: 15, background: "rgba(68,42,27,.25)" }} />
      <span className="pdp-social-link" style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 13, color: INK }}>
        {STORIES} Customer Stories
      </span>
      <span aria-hidden style={{ width: 1, height: 15, background: "rgba(68,42,27,.25)" }} />
      <span style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 13, color: TAUPE }}>
        {UNITS_SOLD} Units Sold
      </span>
    </Link>
  );
}
