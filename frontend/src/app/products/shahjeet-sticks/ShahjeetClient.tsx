"use client";
import { media } from "@/lib/media";

import { useState, useRef, type ReactNode, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ScrollProgressBar, MobileBuyBar } from "./_enhancements";
import {
  Utensils, Scale, Hand, Timer, Briefcase, Leaf, Coffee, Plane,
  Sun, Dumbbell, Activity,
} from "lucide-react";
import ScrollFAQAccordion, { type FAQItem } from "@/components/ui/scroll-faqaccordion";
import BrandDivider from "@/components/product/BrandDivider";
import ProductSwipeLink from "@/components/product/ProductSwipeLink";
import { LEGAL } from "@/lib/legal";

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const F = "var(--font-primary), system-ui, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;
const CREAM = "#f7f0e2";
const ESPRESSO = "#442a1b";
const INK = "#3a2817";
const GOLD = "#cd872a";
const TAUPE = "#8a7355";
const RED = "#c0392b";

// Type scale — matched to the homepage sections. Tweak per section here.
const T = {
  hero:    "clamp(30px, 5vw, 56px)",
  h2:      "clamp(26px, 4vw, 44px)",
  h3:      "clamp(18px, 2.4vw, 28px)",
  big:     "clamp(32px, 5.5vw, 62px)",
  body:    "clamp(15px, 1.7vw, 18px)",
  bodyLg:  "clamp(15px, 1.7vw, 20px)",
  eyebrow: "clamp(11px, 1.2vw, 13px)",
  label:   "clamp(12px, 1.4vw, 14px)",
  price:   "clamp(22px, 2.6vw, 30px)",
  num:     "clamp(52px, 9vw, 96px)",
  marquee: "clamp(18px, 2.8vw, 38px)",
};

const PRODUCT = {
  id: "shahjeet-sticks",
  name: "SHAHJEET STICKS",
  image: media("/hero/shahjeet-product.png"),
  price: 1399,
  mrp: 1599,
  slug: "shahjeet-sticks",
};

const SHJ_CSS = `
.shj-2col{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,4vw,56px);align-items:center;}
.shj-2col-rev{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,4vw,56px);align-items:center;}
.shj-marquee-mask{overflow:hidden;width:100%;}
.shj-marquee{display:inline-flex;white-space:nowrap;will-change:transform;animation:shjMarquee 34s linear infinite;}
@keyframes shjMarquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.shj-vmask{position:relative;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 15%,#000 85%,transparent 100%);mask-image:linear-gradient(180deg,transparent 0,#000 15%,#000 85%,transparent 100%);}
.shj-vscroll{display:flex;flex-direction:column;gap:14px;will-change:transform;animation:shjV 24s linear infinite;}
@keyframes shjV{from{transform:translateY(0)}to{transform:translateY(-50%)}}
.shj-cmp{display:grid;grid-template-columns:1.55fr 1fr 1fr;}
@media(max-width:860px){
  .shj-2col,.shj-2col-rev{grid-template-columns:1fr;gap:32px;}
  .shj-2col-rev>.shj-media{order:-1;}
  .shj-cmp{grid-template-columns:1.4fr .8fr .8fr;}
}
@media(prefers-reduced-motion:reduce){.shj-marquee,.shj-vscroll{animation:none;}}
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 20, style, className }: { children: ReactNode; delay?: number; y?: number; style?: CSSProperties; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inV = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y }} animate={inV ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE, delay }} style={style}>
      {children}
    </motion.div>
  );
}

const heading: CSSProperties = { fontFamily: F, fontVariationSettings: "'wght' 800", color: ESPRESSO, letterSpacing: "-0.02em", lineHeight: 1.06, margin: 0 };
const eyebrow: CSSProperties = { fontFamily: F, fontVariationSettings: "'wght' 600", fontSize: T.eyebrow, letterSpacing: "0.14em", textTransform: "uppercase", color: TAUPE, margin: 0 };


// ─── 1 · HERO ─────────────────────────────────────────────────────────────────
const SHJ_BUNDLES = [
  { days: 30, boxes: 1, price: 1399, mrp: 1599, label: "30-Day Ritual" },
  { days: 60, boxes: 2, price: 2599, mrp: 3198, label: "60-Day Ritual" },
  { days: 90, boxes: 3, price: 3599, mrp: 4797, label: "90-Day Ritual" },
];
function HeroSection() {
  const [bundleIdx, setBundleIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const bundle = SHJ_BUNDLES[bundleIdx];
  const unit = Math.round(bundle.price / bundle.boxes);
  const save = Math.round((1 - bundle.price / bundle.mrp) * 100);

  const handleAdd = async () => {
    await addItem({ id: `${PRODUCT.id}-${bundle.days}d`, productId: PRODUCT.id, name: `${PRODUCT.name} — ${bundle.days}-Day Ritual`, image: PRODUCT.image, price: unit, mrp: Math.round(bundle.mrp / bundle.boxes), quantity: bundle.boxes, slug: PRODUCT.slug });
    setAdded(true); setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section style={{ background: "linear-gradient(180deg,#f7f0e2 0%,#f3ecdb 45%,#eae0cd 100%)", position: "relative", overflow: "hidden" }}>
      {/* Full-width mountain backdrop — the whole range is visible behind the hero */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={media("/shahjeet/mountain.png")} alt="" aria-hidden style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: "auto", zIndex: 0, opacity: 0.5, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(118px,13vh,158px) 24px clamp(8px,1.2vh,18px)", position: "relative", zIndex: 1 }}>
        <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          style={{ ...eyebrow, textAlign: "center", color: GOLD, marginBottom: 16 }}>
          Doctor-Led Performance Ayurveda™
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE }}
          style={{ ...heading, fontSize: T.hero, textAlign: "center", maxWidth: "17ch", margin: "0 auto clamp(32px,5vw,56px)" }}>
          PERFORMANCE IN<br />YOUR POCKET
        </motion.h1>

        <div className="shj-2col" style={{ position: "relative", alignItems: "end" }}>

          <Reveal style={{ position: "relative", zIndex: 1, marginBottom: "clamp(56px,8vw,110px)" }}>
            <p style={{ ...eyebrow, marginBottom: 12 }}>No spoon. No mess. No excuses.</p>
            <p style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: T.bodyLg, lineHeight: 1.42, color: ESPRESSO, maxWidth: "34ch", textTransform: "uppercase", margin: "0 0 clamp(20px,2.5vw,28px)" }}>
              600mg of Triphala-purified Himalayan Shilajit with pure honey — anytime, anywhere.
            </p>

            <p style={{ ...eyebrow, marginBottom: 10 }}>Choose your ritual</p>
            <div role="radiogroup" aria-label="Ritual duration" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
              {SHJ_BUNDLES.map((b, i) => {
                const active = i === bundleIdx;
                return (
                  <button key={b.days} type="button" role="radio" aria-checked={active} onClick={() => setBundleIdx(i)}
                    style={{ flex: "1 1 96px", minWidth: 96, textAlign: "center", cursor: "pointer", padding: "12px 10px", borderRadius: 14, background: active ? ESPRESSO : "#f1e7d4", border: `1.5px solid ${active ? ESPRESSO : "rgba(68,42,27,.28)"}`, color: active ? CREAM : ESPRESSO, boxShadow: active ? "0 8px 22px rgba(68,42,27,.28)" : "0 4px 14px rgba(68,42,27,.10)", transition: "all .2s ease" }}>
                    <span style={{ display: "block", fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: 18, lineHeight: 1 }}>{b.days}</span>
                    <span style={{ display: "block", fontFamily: F, fontVariationSettings: "'wght' 600", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", opacity: 0.8, marginTop: 3 }}>Day Ritual</span>
                    <span style={{ display: "block", fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 13, marginTop: 6 }}>₹{b.price.toLocaleString("en-IN")}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: T.price, color: ESPRESSO }}>₹{bundle.price.toLocaleString("en-IN")}</span>
              <span style={{ fontFamily: F, fontSize: T.body, color: TAUPE, textDecoration: "line-through" }}>₹{bundle.mrp.toLocaleString("en-IN")}</span>
              <span style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 10, letterSpacing: ".1em", color: GOLD, border: `1px solid ${GOLD}`, padding: "3px 8px", borderRadius: 4 }}>SAVE {save}%</span>
              <span style={{ fontFamily: F, fontSize: 11, color: TAUPE }}>{bundle.boxes} box{bundle.boxes > 1 ? "es" : ""} · 30 sticks/box</span>
            </div>
            <button type="button" onClick={handleAdd} style={{ width: "100%", maxWidth: 360, height: 48, padding: "0 26px", background: ESPRESSO, color: CREAM, border: "none", borderRadius: 999, fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", cursor: "pointer" }}>
              {added ? "Added ✓" : "Shop Now"}
            </button>
          </Reveal>

          <motion.div className="shj-media" initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }} style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={media("/shahjeet/hero-product.png")} alt="3tattava Shahjeet Sticks canister with a honey stick" style={{ width: "100%", maxWidth: 340, height: "auto", display: "block", filter: "drop-shadow(0 26px 50px rgba(68,42,27,.22))" }} />
          </motion.div>
        </div>
      </div>
      <ProductSwipeLink to="/products/shodhit-shilajit-resin" productName="RockResin" image="/home/rockresin-hero-product.png?v=2" direction="up" />
    </section>
  );
}

// ─── 2 · WHY WE CREATED ───────────────────────────────────────────────────────
function WhyCreatedSection() {
  return (
    <section style={{ background: CREAM, padding: "clamp(56px,8vw,96px) 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div className="shj-2col" style={{ alignItems: "start", marginBottom: "clamp(32px,4vw,48px)" }}>
          <Reveal>
            <h2 style={{ ...heading, fontSize: T.h2, marginBottom: 16 }}>WHY WE CREATED SHAHJEET STICKS?</h2>
            <p style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: T.body, letterSpacing: ".02em", textTransform: "uppercase", color: INK, lineHeight: 1.45, margin: 0 }}>
              Traditional Shilajit is powerful —<br />but using it isn&apos;t always easy.
            </p>
          </Reveal>
          <Reveal className="shj-media" delay={0.1} style={{ display: "flex", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://media.3tattava.com/products/Sticks+refined.png" alt="Three Shahjeet honey sticks" style={{ width: "100%", maxWidth: 420, height: "auto", display: "block", filter: "drop-shadow(0 20px 40px rgba(68,42,27,.2))" }} />
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <div style={{ display: "flex", justifyContent: "center" }} role="img" aria-label="No measuring complications · No carrying jars and cleaning spoons · No finding warm water">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={media("/shahjeet/why-pills.png")} alt="No measuring complications · No carrying jars and cleaning spoons · No finding warm water" style={{ width: "100%", maxWidth: 1040, height: "auto", display: "block" }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 3 · COMPARISON ───────────────────────────────────────────────────────────
const CMP_ROWS = [
  { icon: Utensils, label: "Requires Spoon" },
  { icon: Scale, label: "Inconsistent Serving" },
  { icon: Hand, label: "Sticky Handling" },
  { icon: Timer, label: "Time Consuming" },
  { icon: Briefcase, label: "Difficult to Carry" },
  { icon: Leaf, label: "Traditional Ritual" },
  { icon: Coffee, label: "Preparation Required" },
  { icon: Plane, label: "Difficult While Travelling" },
];
function ComparisonSection() {
  const cell: CSSProperties = { padding: "13px 12px", display: "flex", alignItems: "center", justifyContent: "center" };
  const mid: CSSProperties = { background: "#f2ebda" };
  return (
    <section style={{ background: CREAM, padding: "0 16px clamp(44px,6vw,72px)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", background: ESPRESSO, borderRadius: 28, padding: "clamp(34px,5vw,60px) clamp(22px,4vw,56px)" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: "clamp(24px,3.5vw,38px)", flexWrap: "wrap" }}>
            <span style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: T.num, color: CREAM, lineHeight: 0.9 }}>30</span>
            <span style={{ fontFamily: F, fontVariationSettings: "'wght' 500", fontSize: "clamp(20px,3.2vw,36px)", color: CREAM, lineHeight: 1 }}>Sticks / Box</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="shj-cmp" style={{ border: "1px solid rgba(247,240,226,.16)", borderRadius: 16, overflow: "hidden" }}>
            <div style={cell} />
            <div style={{ ...cell, ...mid, borderTopLeftRadius: 12, borderTopRightRadius: 12, flexDirection: "column", padding: "16px 12px" }}>
              <span style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: T.label, letterSpacing: ".04em", color: ESPRESSO, textAlign: "center", lineHeight: 1.2 }}>SHAHJEET<br />STICKS</span>
            </div>
            <div style={{ ...cell, flexDirection: "column", padding: "16px 12px" }}>
              <span style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: T.label, letterSpacing: ".04em", color: CREAM, textAlign: "center", lineHeight: 1.2 }}>SHILAJIT<br />RESIN</span>
            </div>
            {CMP_ROWS.map((r, i) => {
              const last = i === CMP_ROWS.length - 1;
              const Icon = r.icon;
              return (
                <div key={r.label} style={{ display: "contents" }}>
                  <div style={{ ...cell, justifyContent: "flex-start", gap: 11, padding: "13px 8px 13px 14px", borderTop: "1px solid rgba(247,240,226,.10)" }}>
                    <Icon size={18} color={GOLD} strokeWidth={1.6} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: F, fontVariationSettings: "'wght' 500", fontSize: T.body, color: CREAM }}>{r.label}</span>
                  </div>
                  <div style={{ ...cell, ...mid, borderTop: "1px solid rgba(68,42,27,.08)", ...(last ? { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 } : {}) }}>
                    <span style={{ color: "#5cb338", fontSize: "clamp(16px,1.9vw,22px)", fontWeight: 800, lineHeight: 1 }}>✕</span>
                  </div>
                  <div style={{ ...cell, borderTop: "1px solid rgba(247,240,226,.10)" }}>
                    <span style={{ color: RED, fontSize: "clamp(16px,1.9vw,22px)", fontWeight: 800, lineHeight: 1 }}>✓</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 4 · CINEMATIC + AUTO-SCROLL FACT TICKER ──────────────────────────────────
const CINE_FACTS: { stat?: string; text: string }[] = [
  { stat: "600mg", text: "Pure Himalayan Shilajit in every stick" },
  { stat: "100%", text: "Pure Shilajit resin — nothing diluted" },
  { stat: "NABL", text: "3rd-party lab tested for every batch" },
  { text: "Triphala-purified — Amalaki · Haritaki · Bibhitaki" },
  { text: "Honey (Madhu) — the classical Ayurvedic Anupana" },
  { stat: "10s", text: "Tear · Squeeze · Perform — the daily ritual" },
  { text: "No spoon. No mess. No measuring." },
  { stat: "80+", text: "Trace minerals · 60%+ fulvic acid" },
  { text: "AYUSH-GMP certified manufacturing" },
  { stat: "16,000ft", text: "Sourced from high Himalayan deposits" },
  { stat: "30", text: "Sticks per box — ready anytime, anywhere" },
];
function CinematicSection() {
  const Card = ({ f }: { f: { stat?: string; text: string } }) => (
    <div style={{ background: "#fff", border: "1px solid rgba(68,42,27,.10)", borderRadius: 14, padding: "16px 18px", boxShadow: "0 6px 18px rgba(68,42,27,.05)" }}>
      {f.stat && <span style={{ display: "block", fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: "clamp(24px,3vw,34px)", color: GOLD, lineHeight: 1 }}>{f.stat}</span>}
      <span style={{ fontFamily: F, fontVariationSettings: "'wght' 600", fontSize: T.body, color: ESPRESSO, lineHeight: 1.4, display: "block", marginTop: f.stat ? 6 : 0 }}>{f.text}</span>
    </div>
  );
  return (
    <section style={{ background: CREAM, padding: "clamp(48px,7vw,88px) 24px" }}>
      <div className="shj-2col" style={{ maxWidth: 1120, margin: "0 auto", gap: "clamp(28px,4vw,60px)" }}>
        <Reveal style={{ display: "flex", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://media.3tattava.com/products/rockresin/3-Tattava+A%2B-05S.png" alt="Shahjeet Sticks" style={{ width: "100%", maxWidth: 520, height: "auto", display: "block", borderRadius: 20, boxShadow: "0 22px 48px rgba(68,42,27,.22)" }} />
        </Reveal>
        <Reveal delay={0.08}>
          <p style={{ ...eyebrow, marginBottom: 18 }}>Why Shahjeet</p>
          <div className="shj-vmask" style={{ height: "clamp(300px,36vw,400px)" }}>
            <div className="shj-vscroll">
              {[...CINE_FACTS, ...CINE_FACTS].map((f, i) => <Card key={i} f={f} />)}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 5 · WHY WE INFUSE HONEY ──────────────────────────────────────────────────
const HONEY_ENHANCES = ["Convenience", "Improves Palatability", "Transforms Shilajit Smoothly", "Ready-to-Consume Daily Basis."];
const STAGES = [
  { icon: Sun, title: "Morning", desc: "Before breakfast for all day sustained energy." },
  { icon: Dumbbell, title: "Pre-workout", desc: "30 minutes before training for performance." },
  { icon: Activity, title: "Post-workout", desc: "Immediately after for recovery support." },
];
function HoneySection() {
  return (
    <section style={{ background: CREAM, padding: "clamp(48px,7vw,88px) 24px", position: "relative", overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={media("/shahjeet/bee.png")} alt="" aria-hidden style={{ position: "absolute", right: "-2%", top: "14%", width: "clamp(200px,24vw,380px)", height: "auto", opacity: 0.32, pointerEvents: "none", zIndex: 0 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={media("/shahjeet/stick-dark.png")} alt="3tattava Shahjeet honey stick" style={{ position: "absolute", right: "clamp(-48px,-1.5vw,8px)", top: "clamp(160px,24vw,330px)", width: "clamp(200px,24vw,360px)", height: "auto", zIndex: 2, pointerEvents: "none", filter: "drop-shadow(0 18px 34px rgba(68,42,27,.22))" }} />

      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <Reveal>
          <h2 style={{ ...heading, fontSize: T.h2 }}>WHY WE INFUSE HONEY-</h2>
          <p style={{ ...heading, fontSize: T.h3, marginTop: 6, marginBottom: "clamp(26px,3.5vw,42px)" }}>NATURE&apos;S TRADITIONAL CARRIER</p>
        </Reveal>
        <Reveal delay={0.06} style={{ maxWidth: 600 }}>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 600", fontSize: T.label, letterSpacing: ".04em", textTransform: "uppercase", color: TAUPE, margin: "0 0 18px" }}>Pure honey isn&apos;t just added for taste—</p>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: T.bodyLg, lineHeight: 1.5, textTransform: "uppercase", color: INK, margin: "0 0 22px" }}>
            In Ayurveda, <span style={{ color: GOLD }}>Honey (Madhu) has long been used as an Anupana</span> that has long been paired with Shilajit.
          </p>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: T.bodyLg, textTransform: "uppercase", color: INK, margin: "0 0 10px" }}>It Enhances:</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {HONEY_ENHANCES.map((e) => (
              <li key={e} style={{ fontFamily: F, fontVariationSettings: "'wght' 600", fontSize: T.bodyLg, letterSpacing: ".02em", textTransform: "uppercase", color: TAUPE, lineHeight: 1.55 }}>{e}</li>
            ))}
          </ul>
        </Reveal>

        <div className="shj-2col" style={{ marginTop: "clamp(48px,7vw,84px)", alignItems: "center" }}>
          <Reveal style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {STAGES.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <Icon size={24} color={ESPRESSO} strokeWidth={1.6} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: T.bodyLg, color: ESPRESSO, margin: 0 }}>{s.title}</p>
                    <p style={{ fontFamily: F, fontSize: T.label, color: TAUPE, margin: "3px 0 0", lineHeight: 1.4, maxWidth: 240 }}>{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ ...eyebrow, marginBottom: 12 }}>Designed for every stage</p>
            <h3 style={{ ...heading, fontSize: T.big, lineHeight: 1.02 }}>READY TO GO.<br />ANYTIME.<br />ANYWHERE.</h3>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── 6 · TRIPHALA PURIFICATION ────────────────────────────────────────────────
function TriphalaSection() {
  return (
    <section style={{ background: CREAM, padding: "clamp(44px,6vw,84px) 24px" }}>
      <div className="shj-2col-rev" style={{ maxWidth: 1120, margin: "0 auto" }}>
        <Reveal className="shj-media" style={{ display: "flex", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media("/hero/triphala-bowls.png")} alt="Triphala — Amalaki, Haritaki and Bibhitaki in wooden bowls" style={{ width: "100%", maxWidth: 560, height: "auto", display: "block" }} />
        </Reveal>
        <Reveal delay={0.08}>
          <h2 style={{ ...heading, fontSize: T.h2, marginBottom: 22, display: "inline-block", borderBottom: `2px solid ${GOLD}`, paddingBottom: 8 }}>TRIPHALA PURIFICATION</h2>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 500", fontSize: T.body, lineHeight: 1.65, color: INK, textAlign: "justify", margin: "0 0 18px" }}>
            Our Shilajit is purified using a classical Ayurvedic formulation of <b style={{ color: GOLD }}>Amalaki, Haritaki and Bibhitaki</b>, to <span style={{ color: GOLD }}>refine the resin naturally</span> while preserving and enhancing its authentic essence.
          </p>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 500", fontSize: T.body, lineHeight: 1.65, color: INK, textAlign: "justify", margin: 0 }}>
            3Tattava follows and honour the classical <b style={{ color: GOLD }}>Triphala Shodhana</b> process revered in texts like <i style={{ color: GOLD, fontVariationSettings: "'wght' 600" }}>Charaka Samhita, Bhavaprakasha Nighantu, Rasashastra &amp; Bhaishajya Kalpana etc.,</i> to refine every batch of Shilajit.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 7 · BUILT FOR BUSY DAYS + RITUAL VIDEO ───────────────────────────────────
function BuiltForBusySection() {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#f7edb2 0%,#eccf6a 32%,#dcab44 62%,#c08f2f 100%)", padding: "clamp(52px,7vw,96px) 24px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center" }}>
          <h2 style={{ ...heading, color: ESPRESSO, fontSize: T.big, marginBottom: 8 }}>BUILT FOR BUSY DAYS!</h2>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: "clamp(15px,2vw,20px)", letterSpacing: ".06em", textTransform: "uppercase", color: ESPRESSO, margin: "0 0 clamp(32px,4.5vw,56px)" }}>3Tattava Ritual™</p>
        </Reveal>
        <div className="shj-2col" style={{ alignItems: "center", gridTemplateColumns: "1.12fr 0.88fr" }}>
          <Reveal style={{ display: "flex", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={media("/shahjeet/ritual-steps.png")} alt="The Shahjeet ritual" style={{ height: "clamp(400px,48vw,600px)", width: "auto", maxWidth: "100%", objectFit: "contain", display: "block", filter: "blur(12px)", userSelect: "none", pointerEvents: "none" }} />
          </Reveal>
          <Reveal delay={0.1} style={{ display: "flex", justifyContent: "center" }}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video autoPlay muted loop playsInline src={media("/videos/morning-ritual.mp4")} style={{ height: "clamp(400px,48vw,600px)", width: "auto", aspectRatio: "4 / 5", objectFit: "cover", borderRadius: 20, display: "block", boxShadow: "0 24px 60px rgba(0,0,0,.42)" }} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── 8 · TOMORROW'S PERFORMANCE ───────────────────────────────────────────────
function TomorrowSection() {
  return (
    <section style={{ background: CREAM, padding: "clamp(44px,6vw,84px) 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <Reveal>
          <h2 style={{ ...heading, fontSize: T.h2, textAlign: "center", letterSpacing: ".01em", margin: "0 auto clamp(28px,4vw,46px)", maxWidth: "24ch" }}>
            TOMORROW&apos;S PERFORMANCE STARTS WITH TODAY&apos;S RITUAL.
          </h2>
        </Reveal>
        <div className="shj-2col" style={{ gap: "clamp(14px,1.8vw,22px)" }}>
          {["/hero/athlete-1.jpg", "/hero/athlete-2.jpg"].map((src, i) => (
            <Reveal key={src} delay={i * 0.1}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Athlete taking a Shahjeet stick" style={{ width: "100%", height: "clamp(280px,38vw,460px)", objectFit: "cover", display: "block", borderRadius: 8 }} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 9 · MARQUEE ──────────────────────────────────────────────────────────────
function MarqueeSection() {
  const phrase = "ONE POWERFUL HABIT.\u00A0\u00A0ONE STICK.\u00A0\u00A0ONE MINUTE.\u00A0\u00A0\u00A0";
  const line = phrase.repeat(6);
  const Row = ({ dim }: { dim?: boolean }) => (
    <div className="shj-marquee-mask" aria-hidden>
      <div className="shj-marquee" style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: T.marquee, letterSpacing: "-0.01em", color: dim ? "rgba(68,42,27,.26)" : ESPRESSO }}>
        <span>{line}</span><span>{line}</span>
      </div>
    </div>
  );
  return (
    <section style={{ background: CREAM, padding: "clamp(36px,5vw,64px) 0", position: "relative", overflow: "hidden" }}>
      <Row />
      <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media("/shahjeet/bee-real.png")} alt="Honeybee" style={{ position: "absolute", top: "clamp(-42px,-4vw,-18px)", left: "clamp(-64px,-5vw,-32px)", width: "clamp(96px,12vw,168px)", height: "auto", zIndex: 3, pointerEvents: "none", filter: "drop-shadow(0 12px 26px rgba(68,42,27,.26))" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media("/shahjeet/canister.png")} alt="Shahjeet Sticks canister" style={{ width: "clamp(150px,20vw,280px)", height: "auto", display: "block" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media("/shahjeet/canister-2.png")} alt="Shahjeet Sticks canister" style={{ width: "clamp(150px,20vw,280px)", height: "auto", display: "block", marginLeft: "clamp(-40px,-4vw,-16px)" }} />
        </div>
      </div>
      <Row dim />
    </section>
  );
}

// ─── 10 · FINAL GOLD BAND ─────────────────────────────────────────────────────
function FinalBand() {
  return (
    <section style={{ background: CREAM, padding: "0 16px clamp(44px,6vw,80px)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", background: "linear-gradient(135deg,#c88a2e 0%,#e2ac4d 45%,#b8781c 100%)", borderRadius: 26, padding: "clamp(36px,5vw,64px) clamp(26px,5vw,64px)", overflow: "hidden", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 600", fontSize: T.eyebrow, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(60,36,18,.85)", margin: "0 0 8px" }}>Certified &amp; Lab-Tested</p>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: "clamp(22px,3vw,34px)", color: CREAM, margin: "0 0 clamp(24px,3.5vw,40px)", letterSpacing: ".01em" }}>SHAHJEET STICKS</p>
        </Reveal>
        <Reveal delay={0.08} style={{ display: "flex", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media("/shahjeet/frame82.png")} alt="Sankalpa Siddhi Ayupharma quality marks — ISO 9001 & ISO 22000 quality systems, AYUSH-GMP manufacturing, US-FDA facility registration (not product approval), NABL-accredited third-party lab testing" style={{ width: "100%", maxWidth: 820, height: "auto", display: "block" }} />
        </Reveal>
        <p style={{ fontFamily: F, fontSize: 12, lineHeight: 1.55, color: "rgba(60,36,18,.82)", maxWidth: 760, margin: "clamp(18px,2.5vw,26px) auto 0", textAlign: "center" }}>
          ISO 9001 &amp; ISO 22000 quality systems · AYUSH-GMP manufacturing · US-FDA facility registration (not product approval) · NABL-accredited third-party lab testing. These marks refer to facility registration and independent testing — not approval of the product by any authority.
        </p>
      </div>
    </section>
  );
}

const SHAHJEET_FAQS: FAQItem[] = [
  { id: 1, question: "When is the best time to take Shahjeet Sticks?", answer: "Morning before breakfast is optimal for all-day sustained energy — or 30 minutes before training for performance, or post-workout for recovery. Honey is the classical Anupana (Ayurvedic carrier) for Shilajit, making morning use especially effective." },
  { id: 2, question: "How many sticks should I take per day?", answer: "One stick per day — providing 600mg of pure Himalayan Shilajit. Each pack of 30 sticks is a full 30-day supply. Do not exceed the recommended daily dose." },
  { id: 3, question: "Are Shahjeet Sticks suitable for diabetics?", answer: "Each stick contains natural honey (~6g carbohydrates). Shahjeet is an Ayurvedic proprietary medicine; use as directed on the pack. If you are managing diabetes or any medical condition, consult your physician before use." },
  { id: 4, question: "How is the Shilajit purified?", answer: "Every batch is purified using classical Triphala Shodhana (Amalaki, Haritaki, Bibhitaki) in an AYUSH-GMP certified facility — removing rock and heavy-metal impurities while preserving the fulvic-acid matrix." },
  { id: 5, question: "Are your products lab-tested?", answer: "Yes. Every batch is NABL 3rd-party lab tested for fulvic acid, heavy metals, and microbial safety. Scan the QR code on the pack to view your batch's full report." },
  { id: 6, question: "Can women take Shahjeet honey sticks?", answer: "Yes. Shahjeet Sticks (600mg purified Shilajit in honey per stick) are a convenient format many women prefer over bitter resin — for energy, recovery and mineral support. Avoid during pregnancy and breastfeeding." },
  { id: 7, question: "Can I take Shahjeet before the gym?", answer: "Yes. Many take Shilajit pre-workout for energy support, and Shahjeet Sticks are designed for a convenient pre- or post-workout ritual — tear, squeeze, perform." },
  { id: 8, question: "Can I take a stick in water or milk instead of directly?", answer: "Yes. Squeeze the stick into warm (not boiling) water, tea or milk if you prefer — though it is formulated to be taken directly, with no carrier or preparation required." },
  { id: 9, question: "What colour is real, purified Shilajit?", answer: "Purified resin is dark brown to blackish; it softens and becomes pliable in warm hands and dissolves in warm water to a reddish-brown or golden solution." },
];

function ShahjeetFaqSection() {
  return (
    <section style={{ background: CREAM, padding: "clamp(48px,7vw,88px) 24px" }}>
      <ScrollFAQAccordion
        data={SHAHJEET_FAQS}
        title="Frequently Asked Questions"
        subtitle="Everything about Shahjeet Sticks — dosage, timing, purity, and safety."
      />
    </section>
  );
}

// ─── LEGAL METROLOGY / PRODUCT INFORMATION ────────────────────────────────────
function LegalMetrologySection() {
  const rows: { label: string; value: ReactNode }[] = [
    { label: "MRP", value: <>₹{PRODUCT.mrp.toLocaleString("en-IN")} <span style={{ color: TAUPE }}>(inclusive of all taxes)</span></> },
    { label: "Net Quantity", value: "30 sticks (30 × 8 g)" },
    { label: "Manufactured by", value: `${LEGAL.manufacturer}, ${LEGAL.manufacturerAddress} · Ayurveda Lic. ${LEGAL.manufacturerLicence}` },
    { label: "Marketed by", value: `${LEGAL.companyShort}, ${LEGAL.registeredOffice}` },
    { label: "Country of Origin", value: LEGAL.countryOfOrigin },
    { label: "Consumer care", value: `${LEGAL.emailGeneral} · ${LEGAL.careMobile}` },
  ];
  return (
    <section style={{ background: CREAM, padding: "clamp(32px,5vw,64px) 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <Reveal>
          <p style={{ ...eyebrow, marginBottom: 14 }}>Legal Metrology · Product Information</p>
          <div style={{ border: "1px solid rgba(68,42,27,.18)", borderRadius: 18, padding: "clamp(20px,3vw,32px)", background: "#fbf6ea" }}>
            <dl style={{ margin: 0 }}>
              {rows.map((r, i) => (
                <div key={r.label} style={{ display: "grid", gridTemplateColumns: "minmax(120px,190px) 1fr", gap: "clamp(8px,2vw,28px)", padding: "12px 0", borderTop: i === 0 ? "none" : "1px solid rgba(68,42,27,.10)" }}>
                  <dt style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase", color: GOLD, margin: 0 }}>{r.label}</dt>
                  <dd style={{ fontFamily: F, fontVariationSettings: "'wght' 500", fontSize: T.body, lineHeight: 1.5, color: ESPRESSO, margin: 0 }}>{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function ShahjeetClient() {
  return (
    <div style={{ fontFamily: F, color: ESPRESSO, background: CREAM }}>
      <style dangerouslySetInnerHTML={{ __html: SHJ_CSS }} />
      <ScrollProgressBar />
      <MobileBuyBar />

      <HeroSection />
      <LegalMetrologySection />
      <WhyCreatedSection />
      <BrandDivider />
      <ComparisonSection />
      <BrandDivider />
      <CinematicSection />
      <BrandDivider />
      <HoneySection />
      <BrandDivider />
      <TriphalaSection />
      <BrandDivider />
      <BuiltForBusySection />
      <BrandDivider />
      <TomorrowSection />
      <ShahjeetFaqSection />
      <MarqueeSection />
      <FinalBand />
    </div>
  );
}
