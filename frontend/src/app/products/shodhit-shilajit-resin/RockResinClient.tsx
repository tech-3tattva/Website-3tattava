"use client";
import { media } from "@/lib/media";

import { useState, useRef, useEffect, type ReactNode, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ScrollProgressBar } from "../shahjeet-sticks/_enhancements";
import { Mountain, Droplet, Leaf, FlaskConical, ShieldCheck, QrCode, Stethoscope, Package, BadgeCheck, Factory, FileText, Sparkles, Hand, Award, Check, AlertTriangle } from "lucide-react";
import ScrollFAQAccordion from "@/components/ui/scroll-faqaccordion";
import { ROCKRESIN_FAQS } from "@/data/faqs/rockresin";
import ReviewsSection from "@/components/product/ReviewsSection";
import BrandDivider from "@/components/product/BrandDivider";
import ProductSwipeLink from "@/components/product/ProductSwipeLink";

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const F = "var(--font-primary), system-ui, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;
const CREAM = "#f7f0e2";
const ESPRESSO = "#442a1b";
const INK = "#3a2817";
const GOLD = "#cd872a";
const TAUPE = "#8a7355";

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
  id: "shodhit-shilajit-resin",
  name: "SHODHIT SHILAJIT RESIN",
  image: media("/home/rockresin-marquee.png"),
  price: 1299,
  mrp: 1499,
  slug: "shodhit-shilajit-resin",
};

const BUNDLES = [
  { days: 40, jars: 1, label: "40-Day Ritual", price: 1299, mrp: 1499 },
  { days: 80, jars: 2, label: "80-Day Ritual", price: 2200, mrp: 2998 },
  { days: 120, jars: 3, label: "120-Day Ritual", price: 3000, mrp: 4497 },
];

const RR_CSS = `
.rr-2col{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,4vw,56px);align-items:center;}
.rr-2col-rev{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,4vw,56px);align-items:center;}
.rr-3col{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(24px,3vw,44px);}
.rr-arch-mask{overflow:hidden;width:100%;}
.rr-arch{display:inline-flex;white-space:nowrap;will-change:transform;animation:rrArch 32s linear infinite;}
@keyframes rrArch{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.rr-arch-rev{display:inline-flex;white-space:nowrap;will-change:transform;animation:rrArch 32s linear infinite reverse;}
.rr-vmask{position:relative;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 15%,#000 85%,transparent 100%);mask-image:linear-gradient(180deg,transparent 0,#000 15%,#000 85%,transparent 100%);}
.rr-vscroll{display:flex;flex-direction:column;gap:14px;will-change:transform;animation:rrV 24s linear infinite;}
@keyframes rrV{from{transform:translateY(0)}to{transform:translateY(-50%)}}
.rr-cmp{display:grid;grid-template-columns:1.55fr 1fr 1fr;}
.rr-mobilebar{display:none;}
@media(max-width:860px){
  .rr-2col,.rr-2col-rev{grid-template-columns:1fr;gap:32px;}
  .rr-2col-rev>.rr-media{order:-1;}
  .rr-3col{grid-template-columns:1fr;gap:28px;}
  .rr-cmp{grid-template-columns:1.4fr .8fr .8fr;}
}
@media(max-width:768px){.rr-mobilebar{display:flex;}}
.rr-journey{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(16px,2vw,28px);align-items:start;}
.rr-jcard{background:#fff;border:1px solid rgba(68,42,27,.10);border-radius:20px;padding:clamp(24px,3vw,34px);box-shadow:0 6px 18px rgba(68,42,27,.05);transition:transform .4s ease,box-shadow .4s ease;}
.rr-jcard:hover{transform:translateY(-6px);box-shadow:0 24px 54px rgba(68,42,27,.17);}
.rr-jbenefits{display:grid;grid-template-rows:0fr;opacity:0;margin-top:0;transition:grid-template-rows .5s cubic-bezier(.16,1,.3,1),opacity .4s ease,margin-top .5s ease;}
.rr-jbenefits>div{overflow:hidden;}
.rr-jcard:hover .rr-jbenefits{grid-template-rows:1fr;opacity:1;margin-top:18px;}
@media(hover:none){.rr-jbenefits{grid-template-rows:1fr;opacity:1;margin-top:18px;}}
@media(max-width:860px){.rr-journey{grid-template-columns:1fr;}}
@media(prefers-reduced-motion:reduce){.rr-jcard,.rr-jbenefits{transition:none;}}
@media(prefers-reduced-motion:reduce){.rr-arch,.rr-arch-rev,.rr-vscroll{animation:none;}}
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
function HeroSection() {
  const [bundleIdx, setBundleIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const bundle = BUNDLES[bundleIdx];
  const unit = Math.round(bundle.price / bundle.jars);
  const save = Math.round((1 - bundle.price / bundle.mrp) * 100);

  const handleAdd = async () => {
    await addItem({ id: `${PRODUCT.id}-${bundle.days}d`, productId: PRODUCT.id, name: `${PRODUCT.name} — ${bundle.days}-Day Ritual`, image: PRODUCT.image, price: unit, mrp: Math.round(bundle.mrp / bundle.jars), quantity: bundle.jars, slug: PRODUCT.slug });
    setAdded(true); setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section style={{ background: "linear-gradient(180deg,#f7f0e2 0%,#f3ecdb 45%,#eae0cd 100%)", position: "relative", overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero/hero-mountain-full.png?v=1" alt="" aria-hidden style={{ position: "absolute", left: 0, bottom: "clamp(10px,1.6vw,28px)", width: "100%", height: "auto", zIndex: 0, opacity: 0.5, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(118px,13vh,158px) 24px clamp(8px,1.2vh,18px)", position: "relative", zIndex: 1 }}>
        <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          style={{ ...eyebrow, textAlign: "center", color: GOLD, marginBottom: 14 }}>
          Doctor-Led Performance Ayurveda™
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE }}
          style={{ ...heading, fontSize: T.hero, textAlign: "center", maxWidth: "17ch", margin: "0 auto clamp(32px,5vw,56px)" }}>
          ONE RESIN. COMPLETE VITALITY.
        </motion.h1>

        <div className="rr-2col" style={{ position: "relative", alignItems: "end" }}>
          <Reveal style={{ position: "relative", zIndex: 1, marginBottom: "clamp(56px,8vw,110px)" }}>
            <p style={{ ...eyebrow, marginBottom: 12 }}>Dip. Hook. Swirl.</p>
            <p style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: T.bodyLg, lineHeight: 1.42, color: ESPRESSO, maxWidth: "34ch", textTransform: "uppercase", margin: "0 0 clamp(20px,2.5vw,26px)" }}>
              Authentic Himalayan Shilajit, traditionally purified through Triphala Shodhana — for energy, recovery, and long-term vitality.
            </p>

            <p style={{ ...eyebrow, marginBottom: 10 }}>Choose your ritual</p>
            <div role="radiogroup" aria-label="Ritual duration" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
              {BUNDLES.map((b, i) => {
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
              <span style={{ fontFamily: F, fontSize: 11, color: TAUPE }}>{bundle.jars} jar{bundle.jars > 1 ? "s" : ""} · ₹{unit.toLocaleString("en-IN")}/jar</span>
            </div>
            <button type="button" onClick={handleAdd} style={{ width: "100%", maxWidth: 360, height: 48, padding: "0 26px", background: ESPRESSO, color: CREAM, border: "none", borderRadius: 999, fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", cursor: "pointer" }}>
              {added ? "Added ✓" : "Begin Your Ritual"}
            </button>
          </Reveal>

          <motion.div className="rr-media" initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }} style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center", marginTop: "clamp(12px,2vw,28px)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/home/rockresin-hero-product.png?v=2" alt="RockResin — Shodhit Himalayan Shilajit resin jar, tub and spoon" style={{ width: "100%", maxWidth: 460, height: "auto", display: "block", filter: "drop-shadow(0 26px 50px rgba(68,42,27,.20))" }} />
          </motion.div>
        </div>
      </div>
      <ProductSwipeLink to="/products/shahjeet-sticks" productName="Shahjeet Sticks" image="/shahjeet/hero-product.png" direction="right" />
    </section>
  );
}

// ─── 2 · REVERED IN AYURVEDA (pills + values) ─────────────────────────────────
const VALUES = [
  { icon: media("/rockresin/icon-source.png"), eyebrow: "From the roof of the world", text: "Harvested from mineral-rich rocks at elevations above 16,000 ft." },
  { icon: media("/rockresin/icon-minerals.png"), eyebrow: "Nature's complete complex", text: "Packed with 80+ ionic trace minerals in their most bioavailable form." },
  { icon: media("/rockresin/icon-ring.png"), eyebrow: "Absorption you can feel", text: "Lab-verified ≥70% fulvic acid — so your body absorbs what you take." },
];
function ReveredSection() {
  return (
    <section style={{ background: CREAM, padding: "clamp(56px,8vw,96px) 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ ...heading, fontSize: "clamp(22px,3vw,34px)", marginBottom: 12 }}>REVERED IN AYURVEDA</h2>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 500", fontSize: "clamp(17px,2.6vw,26px)", color: INK, lineHeight: 1.45, margin: "0 auto clamp(28px,4vw,40px)" }}>
            A Rasayana for holistic vitality and systemic balance.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ display: "flex", justifyContent: "center" }} role="img" aria-label="Rasayanam — energy to your body at the core. Balyam — strength that builds within. Jeevnaay — longevity for the long run.">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={media("/rockresin/pillars.png")} alt="Rasayanam · Balyam · Jeevnaay" style={{ width: "100%", maxWidth: 840, height: "auto", display: "block" }} />
          </div>
        </Reveal>

        <div className="rr-3col" style={{ marginTop: "clamp(40px,5.5vw,68px)", gap: "clamp(30px,6vw,104px)" }}>
          {VALUES.map((v, i) => (
            <Reveal key={v.eyebrow} delay={i * 0.08} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.icon} alt="" aria-hidden style={{ width: 60, height: 60, objectFit: "contain", display: "block", marginBottom: 18 }} />
              <p style={{ fontFamily: F, fontVariationSettings: "'wght' 600", fontSize: T.eyebrow, letterSpacing: ".08em", textTransform: "uppercase", color: TAUPE, margin: "0 0 8px" }}>{v.eyebrow}</p>
              <p style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: T.body, textTransform: "uppercase", color: INK, lineHeight: 1.4, margin: 0, maxWidth: "26ch" }}>{v.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 3 · COMPARISON ───────────────────────────────────────────────────────────
const CMP_ROWS = [
  { icon: Leaf,         feature: "Purification Process",     ours: "Triple Purified (Triphala Shodhit)",       theirs: "Purification method often not disclosed" },
  { icon: FlaskConical, feature: "Laboratory Testing",       ours: "Eurofins & NABL Lab Tested",               theirs: "Testing information may be limited or unavailable" },
  { icon: ShieldCheck,  feature: "Heavy Metal Screening",    ours: "Batch tested — negligible heavy metals",   theirs: "Not always disclosed" },
  { icon: Droplet,      feature: "Fulvic Acid Verification", ours: "Verified using two analytical methods",    theirs: "Methodology rarely disclosed" },
  { icon: BadgeCheck,   feature: "Fulvic Acid Transparency", ours: "≥70% — lab-backed results",                theirs: "Marketing claims may omit test methods" },
  { icon: Factory,      feature: "Manufacturing Standard",   ours: "AYUSH GMP Manufactured",                   theirs: "Manufacturing standards vary" },
  { icon: Stethoscope,  feature: "Doctor Formulated",        ours: "Formulated by an Ayurvedic Vaidya",        theirs: "Formulation expertise varies" },
  { icon: Mountain,     feature: "Himalayan Source",         ours: "Documented sourcing — above 16,000 ft",    theirs: "Source details often limited" },
  { icon: QrCode,       feature: "Batch Traceability",       ours: "Batch-wise documentation",                 theirs: "Limited traceability" },
  { icon: Package,      feature: "Authentic Resin Form",     ours: "100% pure Himalayan resin",                theirs: "Product formats vary" },
  { icon: FileText,     feature: "Quality Documentation",    ours: "COA & laboratory documentation",           theirs: "Documentation not always available" },
  { icon: Sparkles,     feature: "User Experience",          ours: "Exclusive Dip • Hook • Swirl™ ritual",     theirs: "Traditional stirring / spoon method" },
  { icon: Hand,         feature: "Clean Usage",              ours: "No sticky spoon. No mess.",                theirs: "Resin can stick to spoons" },
  { icon: Award,        feature: "Brand Philosophy",         ours: "Doctor-Led Performance Ayurveda",          theirs: "Brand approach varies" },
];
function ComparisonSection() {
  const WARN = "#b8975c";
  const headCell: CSSProperties = { padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" };
  const rowCell: CSSProperties = { padding: "13px 12px", display: "flex", alignItems: "flex-start", gap: 8, borderTop: "1px solid rgba(247,240,226,.10)" };
  const mid: CSSProperties = { background: "#f2ebda" };
  return (
    <section style={{ background: CREAM, padding: "clamp(8px,2vw,20px) 16px clamp(44px,6vw,72px)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", background: ESPRESSO, borderRadius: 28, padding: "clamp(28px,4vw,52px) clamp(18px,3vw,44px)" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "clamp(24px,3.5vw,42px)" }}>
            <h2 style={{ ...heading, color: CREAM, fontSize: T.h2, marginBottom: 10 }}>Why 3Tattava RockResin™ Stands Apart</h2>
            <p style={{ ...eyebrow, color: GOLD }}>Science · Transparency · Tradition · Experience</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="rr-cmp" style={{ border: "1px solid rgba(247,240,226,.16)", borderRadius: 16, overflow: "hidden" }}>
            <div style={headCell} />
            <div style={{ ...headCell, ...mid, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
              <span style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: T.label, letterSpacing: ".03em", color: ESPRESSO, lineHeight: 1.2 }}>3Tattava<br />RockResin™</span>
            </div>
            <div style={headCell}>
              <span style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: T.label, letterSpacing: ".03em", color: CREAM, lineHeight: 1.2 }}>Typical<br />Shilajit Brands</span>
            </div>
            {CMP_ROWS.map((r, i) => {
              const last = i === CMP_ROWS.length - 1;
              const Icon = r.icon;
              return (
                <div key={r.feature} style={{ display: "contents" }}>
                  <div style={{ ...rowCell, paddingLeft: 16 }}>
                    <Icon size={17} color={GOLD} strokeWidth={1.6} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: T.label, color: CREAM, lineHeight: 1.3 }}>{r.feature}</span>
                  </div>
                  <div style={{ ...rowCell, ...mid, borderTop: "1px solid rgba(68,42,27,.08)", ...(last ? { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 } : {}) }}>
                    <Check size={16} color="#2f8f4e" strokeWidth={2.6} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontFamily: F, fontVariationSettings: "'wght' 600", fontSize: T.label, color: ESPRESSO, lineHeight: 1.3 }}>{r.ours}</span>
                  </div>
                  <div style={rowCell}>
                    <AlertTriangle size={15} color={WARN} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontFamily: F, fontVariationSettings: "'wght' 500", fontSize: T.label, color: "rgba(247,240,226,.62)", lineHeight: 1.3 }}>{r.theirs}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ fontFamily: F, fontSize: 11, color: "rgba(247,240,226,.5)", lineHeight: 1.5, marginTop: 18, maxWidth: 760 }}>
            Comparison is based on publicly available information and product disclosures at the time of publication. Features of other brands may vary.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 4 · CINEMATIC + AUTO-SCROLL FACT TICKER ──────────────────────────────────
const CINE_FACTS: { stat?: string; text: string }[] = [
  { stat: "≥70%", text: "Fulvic acid — verified by two independent methods" },
  { stat: "≥80", text: "Ionic trace minerals in every batch" },
  { text: "Eurofins & NABL — third-party lab tested" },
  { text: "Classically purified through Triphala Shodhan" },
  { text: "Negligible heavy metals — far below ordinary shilajit" },
  { text: "Documented Himalayan sourcing" },
  { stat: "16,000ft", text: "Sourced from high-altitude Himalayan rock" },
  { text: "Vaidya (doctor) formulated by Dr. Kashish Gupta (BAMS)" },
  { text: "100% pure resin form — authentic traditional Shilajit" },
  { text: "Formulated for men and women both" },
  { text: "Authentically Ayurvedic product" },
  { stat: "40-Day", text: "Ritual — 40–50 daily servings per jar" },
  { text: "Dip · Hook · Swirl — hands-free, mess-free" },
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
      <div className="rr-2col" style={{ maxWidth: 1120, margin: "0 auto", gap: "clamp(28px,4vw,60px)" }}>
        <Reveal style={{ display: "flex", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media("/hero/rockresin-cinematic.jpg")} alt="RockResin jar on Himalayan rock — ≥70% fulvic acid, Eurofins & NABL tested, ≥80 trace minerals" style={{ width: "100%", maxWidth: 520, height: "auto", display: "block", borderRadius: 20, boxShadow: "0 22px 48px rgba(68,42,27,.22)" }} />
        </Reveal>
        <Reveal delay={0.08}>
          <p style={{ ...eyebrow, marginBottom: 18 }}>Why RockResin</p>
          <div className="rr-vmask" style={{ height: "clamp(300px,36vw,400px)" }}>
            <div className="rr-vscroll">
              {[...CINE_FACTS, ...CINE_FACTS].map((f, i) => <Card key={i} f={f} />)}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 5 · TRIPHALA PURIFICATION ────────────────────────────────────────────────
function TriphalaSection() {
  return (
    <section style={{ background: CREAM, padding: "clamp(44px,6vw,84px) 24px" }}>
      <div className="rr-2col-rev" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal className="rr-media" style={{ display: "flex", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media("/rockresin/triphala.png")} alt="Triphala — Amalaki, Haritaki and Bibhitaki in wooden bowls" style={{ width: "100%", maxWidth: 620, height: "auto", display: "block" }} />
        </Reveal>
        <Reveal delay={0.08}>
          <h2 style={{ ...heading, fontSize: T.h2, marginBottom: 20 }}>WHY WE PURIFY WITH TRIPHALA</h2>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 500", fontSize: T.body, lineHeight: 1.6, color: INK, margin: "0 0 18px" }}>
            Many brands discuss sourcing. Few discuss purification. Before becoming a Rasayana, Shilajit traditionally undergoes <b style={{ color: GOLD }}>Shodhana</b>.
          </p>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 500", fontSize: T.body, lineHeight: 1.6, color: INK, margin: 0 }}>
            At 3Tattava we follow a <b style={{ color: GOLD }}>Triphala-based purification</b> with <b style={{ color: GOLD }}>Amalaki, Haritaki and Bibhitaki</b> — removing impurities while preserving authenticity. Triphala Purified™ is a process, not a marketing claim.
          </p>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 500", fontSize: T.body, lineHeight: 1.6, color: INK, margin: "18px 0 0" }}>
            Beyond purity, Triphala supports a healthy <b style={{ color: GOLD }}>digestive fire (Agni)</b> — promoting better appetite and efficient digestion, so your body absorbs the minerals it needs.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 6 · THE SWIRL RITUAL (video) ─────────────────────────────────────────────
function SwirlRitualSection() {
  return (
    <section style={{ background: `url(${media("/rockresin/swirl-bg-brown.png")}) center/cover no-repeat, linear-gradient(135deg,#7a3a12 0%,#5c2409 55%,#3f1803 100%)`, padding: "clamp(48px,6vw,88px) 24px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center" }}>
          <h2 style={{ ...heading, color: CREAM, fontSize: T.big, marginBottom: 8 }}>DIP. HOOK. SWIRL.</h2>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: "clamp(15px,2vw,20px)", letterSpacing: ".08em", textTransform: "uppercase", color: "#eccf6a", margin: "0 0 clamp(32px,4.5vw,56px)" }}>3Tattava Swirl Ritual™</p>
        </Reveal>
        <div className="rr-2col" style={{ alignItems: "center", gridTemplateColumns: "1.08fr 0.92fr" }}>
          <Reveal style={{ display: "flex", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={media("/rockresin/swirl-poster.png")} alt="The RockResin ritual — Dip, Hook, Swirl" style={{ width: "100%", maxWidth: 640, height: "auto", display: "block" }} />
          </Reveal>
          <Reveal delay={0.1} style={{ display: "flex", justifyContent: "center" }}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video autoPlay muted loop playsInline src={media("/home/dip-video.mp4")} style={{ height: "clamp(400px,46vw,560px)", width: "auto", aspectRatio: "4 / 5", objectFit: "cover", borderRadius: 20, display: "block", boxShadow: "0 24px 60px rgba(68,42,27,.28)" }} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── 7 · WHAT TO EXPECT ───────────────────────────────────────────────────────
const JOURNEY = [
  { phase: "Balance", when: "Week 1–2", title: "Restore Your Foundation", benefits: [
    { e: "⚡", t: "Steadier energy" },
    { e: "🧠", t: "Better mental clarity" },
    { e: "🔥", t: "Improved digestive fire (Agni)" },
    { e: "😴", t: "Better recovery & sleep quality" },
    { e: "💪", t: "Greater daily readiness" },
    { e: "❤️", t: "Feel more balanced" },
  ] },
  { phase: "Build", when: "Week 3–6", title: "Strengthen From Within", benefits: [
    { e: "🏋️", t: "Improved strength & performance" },
    { e: "🔋", t: "Better stamina & endurance" },
    { e: "🛡️", t: "Greater stress resilience" },
    { e: "✨", t: "Healthier skin & hair" },
    { e: "💪", t: "Faster recovery after activity" },
    { e: "❤️", t: "Deeper everyday vitality" },
  ] },
  { phase: "Become", when: "Week 7–12", title: "Unlock Your Full Potential", benefits: [
    { e: "🚀", t: "Peak physical performance" },
    { e: "🧠", t: "Sustained cognitive performance" },
    { e: "💪", t: "Enhanced endurance" },
    { e: "🌿", t: "Traditional Rasayana rejuvenation" },
    { e: "❤️", t: "Healthy aging support" },
    { e: "✨", t: "Long-term vitality" },
  ] },
];
function ExpectSection() {
  return (
    <section style={{ background: CREAM, padding: "clamp(44px,6vw,84px) 24px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <Reveal>
          <h2 style={{ ...heading, fontSize: T.h2, textAlign: "center", margin: "0 auto 8px" }}>WHAT TO EXPECT</h2>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 500", fontSize: T.body, color: TAUPE, textAlign: "center", margin: "0 auto clamp(28px,4vw,46px)", maxWidth: "44ch" }}>The <b style={{ color: ESPRESSO, fontVariationSettings: "'wght' 700" }}>Balance · Build · Become</b> journey. <span style={{ color: GOLD }}>Hover a phase to explore.</span></p>
        </Reveal>
        <div className="rr-journey">
          {JOURNEY.map((j, i) => (
            <Reveal key={j.phase} delay={i * 0.08}>
              <div className="rr-jcard">
                <p style={{ fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: T.eyebrow, letterSpacing: ".14em", textTransform: "uppercase", color: GOLD, margin: "0 0 6px" }}>{j.when}</p>
                <h3 style={{ ...heading, fontSize: T.h3, margin: "0 0 6px" }}>{j.phase}</h3>
                <p style={{ fontFamily: F, fontVariationSettings: "'wght' 600", fontSize: T.body, color: INK, margin: 0 }}>{j.title}</p>
                <div className="rr-jbenefits">
                  <div>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                      {j.benefits.map((b) => (
                        <li key={b.t} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: F, fontSize: T.label, color: INK, lineHeight: 1.3 }}>
                          <span aria-hidden style={{ fontSize: 15, lineHeight: 1, flexShrink: 0, width: 20, textAlign: "center" }}>{b.e}</span>{b.t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p style={{ fontFamily: F, fontSize: 11, color: TAUPE, textAlign: "center", marginTop: 22 }}>Results vary from person to person.</p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 8 · MARQUEE ──────────────────────────────────────────────────────────────
function MarqueeSection() {
  const phrase = "ONE RESIN · COMPLETE VITALITY · DIP · HOOK · SWIRL · ";
  const VB_W = 1600;
  const VB_H = 640;
  const cx = VB_W / 2;
  const cy = VB_H / 2;
  const rx = 720;
  const ry = 258;
  const d = `M ${cx - rx},${cy} a ${rx},${ry} 0 1,1 ${2 * rx},0 a ${rx},${ry} 0 1,1 ${-2 * rx},0`;
  const tpRef = useRef<SVGTextPathElement>(null);
  const measRef = useRef<SVGTextElement>(null);
  useEffect(() => {
    const tp = tpRef.current;
    const meas = measRef.current;
    if (!tp || !meas) return;
    let raf = 0;
    let offset = 0;
    let last = 0;
    let period = 1;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = () => {
      period = meas.getComputedTextLength() || 1; // exact advance of ONE phrase → seamless wrap
      if (reduce) return;
      const speed = 46; // viewBox units / second
      const tick = (now: number) => {
        if (!last) last = now;
        const dt = (now - last) / 1000;
        last = now;
        offset = (offset + speed * dt) % period;
        tp.setAttribute("startOffset", String(-offset));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
    else start();
    return () => cancelAnimationFrame(raf);
  }, [phrase]);
  return (
    <section style={{ background: CREAM, padding: "clamp(16px,2.5vw,44px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto" }}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" role="img" aria-label={phrase.trim()} style={{ display: "block", overflow: "visible" }}>
          <defs>
            <path id="rr-ellipse" d={d} fill="none" />
          </defs>
          <text ref={measRef} visibility="hidden" style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: 46, letterSpacing: "0.04em" }}>{phrase}</text>
          <text fill={ESPRESSO} style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: 46, letterSpacing: "0.04em" }}>
            <textPath ref={tpRef} href="#rr-ellipse" startOffset="0">{phrase.repeat(8)}</textPath>
          </text>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media("/rockresin/product.png")} alt="RockResin — Shodhit Himalayan Shilajit resin jar and spoon" style={{ width: "min(24%,205px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 36px rgba(68,42,27,.2))" }} />
        </div>
      </div>
    </section>
  );
}

// ─── 9 · FAQ ──────────────────────────────────────────────────────────────────
function FaqSection() {
  return (
    <section style={{ background: CREAM, padding: "clamp(48px,7vw,88px) 24px" }}>
      <ScrollFAQAccordion
        data={ROCKRESIN_FAQS}
        title="Frequently Asked Questions"
        subtitle="Everything about RockResin — purity, dosage, sourcing, and safety."
      />
    </section>
  );
}

// ─── Mobile buy bar (lean, RockResin-priced) ──────────────────────────────────
function MobileBuyBar() {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const add = async () => {
    await addItem({ id: PRODUCT.id, productId: PRODUCT.id, name: PRODUCT.name, image: PRODUCT.image, price: PRODUCT.price, mrp: PRODUCT.mrp, quantity: 1, slug: PRODUCT.slug });
    setAdded(true); setTimeout(() => setAdded(false), 1600);
  };
  return (
    <div className="rr-mobilebar" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1100, alignItems: "center", gap: 12, background: ESPRESSO, padding: "10px 16px calc(10px + env(safe-area-inset-bottom))", boxShadow: "0 -8px 24px rgba(68,42,27,.28)" }}>
      <div style={{ lineHeight: 1.1 }}>
        <span style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: 19, color: CREAM }}>₹{PRODUCT.price.toLocaleString("en-IN")}</span>{" "}
        <span style={{ fontFamily: F, fontSize: 12, color: "rgba(247,240,226,.45)", textDecoration: "line-through" }}>₹{PRODUCT.mrp.toLocaleString("en-IN")}</span>
        <p style={{ fontFamily: F, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: GOLD, margin: "1px 0 0" }}>40-Day Ritual · 40–50 Servings</p>
      </div>
      <button type="button" onClick={add} style={{ marginLeft: "auto", background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a)", color: ESPRESSO, border: "none", borderRadius: 999, padding: "12px 22px", fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer" }}>
        {added ? "Added ✓" : "Begin Ritual"}
      </button>
    </div>
  );
}

// ─── 10 · CERTIFIED BAND ──────────────────────────────────────────────────────
function CertBand() {
  return (
    <section style={{ background: CREAM, padding: "0 16px clamp(44px,6vw,80px)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", background: "linear-gradient(135deg,#52341f 0%,#67421f 48%,#3b2515 100%)", borderRadius: 26, padding: "clamp(36px,5vw,64px) clamp(26px,5vw,64px)", overflow: "hidden", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 600", fontSize: T.eyebrow, letterSpacing: ".14em", textTransform: "uppercase", color: "#e2ac4d", margin: "0 0 8px" }}>Certified &amp; Lab-Tested</p>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: "clamp(22px,3vw,34px)", color: CREAM, margin: "0 0 clamp(24px,3.5vw,40px)", letterSpacing: ".01em" }}>ROCKRESIN®</p>
        </Reveal>
        <Reveal delay={0.08} style={{ display: "flex", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media("/rockresin/frame82.png")} alt="Sankalpa Siddhi Ayupharma — ISO 9001, ISO 22000, FDA, NABL, AYUSH-GMP certified" style={{ width: "100%", maxWidth: 900, height: "auto", display: "block" }} />
        </Reveal>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function RockResinClient() {
  return (
    <div style={{ fontFamily: F, color: ESPRESSO, background: CREAM }}>
      <style dangerouslySetInnerHTML={{ __html: RR_CSS }} />
      <ScrollProgressBar />
      <MobileBuyBar />

      <HeroSection />
      <ReveredSection />
      <BrandDivider />
      <ComparisonSection />
      <BrandDivider />
      <CinematicSection />
      <BrandDivider />
      <TriphalaSection />
      <BrandDivider />
      <SwirlRitualSection />
      <BrandDivider />
      <ExpectSection />
      <BrandDivider />
      <MarqueeSection />
      <FaqSection />
      <ReviewsSection eyebrow="Real Reviews" title="One resin. Real results." />
      <CertBand />
    </div>
  );
}
