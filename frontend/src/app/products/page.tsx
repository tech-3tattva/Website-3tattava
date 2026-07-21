import type { Metadata } from "next";
import { PAGE_METADATA } from "@/lib/brand-content";
import StartRitualButton from "@/components/StartRitualButton";

export const metadata: Metadata = {
  title: PAGE_METADATA.shop.title,
  description: PAGE_METADATA.shop.description,
  alternates: { canonical: "https://www.3tattava.com/products" },
  openGraph: {
    title: PAGE_METADATA.shop.title,
    description: PAGE_METADATA.shop.description,
    url: "https://www.3tattava.com/products",
  },
};

// ─── Static product catalogue (pre-launch teasers) ───────────────────────────
const PRODUCTS = [
  {
    slug: "shodhit-shilajit-resin",
    badge: "DOCTOR-LED",
    badgeGold: true,
    label: "RockResin®",
    subtitle: "Pure Himalayan Shilajit · 20g Jar",
    tagline: "Ancient Mineral Elixir for Modern Vitality",
    image: "https://media.3tattava.com/home/homepage-rockresins.png",
    pills: ["≥70% Fulvic Acid", "NABL Tested", "Triphala Purified"],
    waitlistProduct: "RockResin® — Shodhit Shilajit Resin",
  },
  {
    slug: "shahjeet-sticks",
    badge: "INDIA'S FIRST",
    badgeGold: false,
    label: "Shahjeet™",
    subtitle: "Honey-Shilajit · 30 Single-Serve Sticks",
    tagline: "Tear. Squeeze. Perform.",
    image: "https://media.3tattava.com/products/full+shahjeet+box.png",
    pills: ["600mg Per Stick", "NABL Tested", "AYUSH GMP"],
    waitlistProduct: "Shahjeet® — Honey Sticks",
  },
] as const;

const F = "var(--font-primary), system-ui, sans-serif";

// ─── Product Card (pre-launch — opens the waitlist) ──────────────────────────
function ProductCard({ p }: { p: (typeof PRODUCTS)[number] }) {
  return (
    <div
      style={{
        display: "block",
        background: "#ffffff",
        border: "1px solid rgba(183,163,146,.30)",
        overflow: "hidden",
        transition: "transform .32s cubic-bezier(.16,1,.3,1), box-shadow .32s ease",
        position: "relative",
      }}
      className="group shop-card"
    >
      <style suppressHydrationWarning>{`
        .shop-card:hover { transform: translateY(-5px); box-shadow: 0 22px 60px rgba(28,19,4,.11); }
        .shop-card-img { transition: transform .5s cubic-bezier(.16,1,.3,1); }
        .shop-card:hover .shop-card-img { transform: scale(1.04); }
        .shop-cta { transition: background .24s ease, transform .24s ease; }
        .shop-card:hover .shop-cta { background: #1c1304 !important; color: #f7f0e2 !important; }
      `}</style>

      {/* Badge */}
      <div
        style={{
          position: "absolute", top: "16px", left: "16px", zIndex: 2,
          background: p.badgeGold ? "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)" : "#1c1304",
          color: p.badgeGold ? "#1c1304" : "#f7f0e2",
          fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 700",
          fontSize: "8px", letterSpacing: ".22em", textTransform: "uppercase", padding: "4px 10px",
        }}
      >
        {p.badge}
      </div>

      {/* Launching-soon ribbon */}
      <div
        style={{
          position: "absolute", top: "16px", right: "16px", zIndex: 2,
          background: "rgba(247,240,226,.92)", color: "#6f5a48",
          fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 700",
          fontSize: "8px", letterSpacing: ".2em", textTransform: "uppercase",
          padding: "4px 10px", border: "1px solid rgba(183,163,146,.5)",
        }}
      >
        Launching Soon
      </div>

      {/* Image */}
      <div
        style={{
          background: "linear-gradient(135deg,#1c1304 0%,#2a1f14 100%)",
          aspectRatio: "1 / 1", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "32px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={p.label} className="shop-card-img" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
      </div>

      {/* Info panel */}
      <div style={{ padding: "24px 24px 28px" }}>
        <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(22px,2.5vw,28px)", letterSpacing: "-.01em", color: "#1c1304", marginBottom: "2px" }}>
          {p.label}
        </p>
        <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 500", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(28,19,4,.45)", marginBottom: "10px" }}>
          {p.subtitle}
        </p>

        <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 100,'wght' 300", fontStyle: "italic", fontSize: "14px", color: "rgba(28,19,4,.60)", marginBottom: "14px", lineHeight: 1.5 }}>
          {p.tagline}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
          {p.pills.map((pill) => (
            <span key={pill} style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 600", fontSize: "9px", letterSpacing: ".14em", textTransform: "uppercase", color: "#C8963E", border: "1px solid rgba(200,150,62,.32)", background: "rgba(200,150,62,.06)", padding: "3px 10px" }}>
              ✓ {pill}
            </span>
          ))}
        </div>

        <StartRitualButton
          product={p.waitlistProduct}
          className="shop-cta"
          style={{
            display: "block", width: "100%", border: "none", cursor: "pointer",
            background: "#C8963E", color: "#1c1304", fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: "11px",
            letterSpacing: ".18em", textTransform: "uppercase", padding: "13px 0", textAlign: "center",
          }}
        >
          Join the Waitlist →
        </StartRitualButton>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  return (
    <div>
      {/* Hero banner */}
      <section style={{ background: "#1c1304", padding: "clamp(60px,8vw,100px) 24px clamp(48px,6vw,80px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, rgba(228,192,121,.8) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 500", fontSize: "9px", letterSpacing: ".32em", textTransform: "uppercase", color: "rgba(247,240,226,.45)", marginBottom: "16px" }}>
            Performance Ayurveda · Launching Soon
          </p>
          <h1 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(30px,5vw,56px)", letterSpacing: "-.025em", color: "#f7f0e2", marginBottom: "14px", lineHeight: 1.08 }}>
            The Performance Ayurveda Collection
          </h1>
          <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 100,'wght' 300", fontStyle: "italic", fontSize: "clamp(15px,1.8vw,18px)", color: "#C8963E", marginBottom: "28px" }}>
            Two formats. Same pure Himalayan Shilajit. Our rituals are launching soon — join the waitlist to be first.
          </p>

          <StartRitualButton
            style={{
              display: "inline-block", border: "none", cursor: "pointer",
              background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)",
              color: "#1c1304", fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800",
              fontSize: "12px", letterSpacing: ".16em", textTransform: "uppercase",
              padding: "15px 34px", borderRadius: 999, marginBottom: "36px",
            }}
          >
            Join the Waitlist →
          </StartRitualButton>

          <div style={{ display: "flex", gap: "clamp(12px,2vw,28px)", justifyContent: "center", flexWrap: "wrap" }}>
            {["NABL Lab-Tested Purity", "AYUSH-GMP Certified", "Doctor Formulated", "Himalayan Sourced"].map((t) => (
              <span key={t} style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 600", fontSize: "9px", letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(247,240,226,.50)" }}>
                ✓ {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section style={{ background: "#f7f0e2", padding: "clamp(48px,6vw,80px) 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "28px" }}>
          {PRODUCTS.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      {/* Philosophy strip */}
      <section style={{ background: "#f7f0e2", borderTop: "1px solid rgba(183,163,146,.25)", padding: "40px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontStyle: "italic", fontSize: "clamp(16px,2vw,22px)", color: "rgba(28,19,4,.30)", letterSpacing: "-.01em" }}>
          Balance Your Foundations. Build Your Resilience. Become Your Strongest Self.
        </p>
      </section>
    </div>
  );
}
