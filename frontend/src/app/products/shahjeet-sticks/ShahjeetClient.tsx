"use client";

import { useState, useRef, ReactNode } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const F    = "var(--font-primary), system-ui, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

const PRODUCT = {
  id: "shahjeet-sticks",
  name: "SHAHJEET STICKS",
  image: "https://media.3tattava.com/products/shahjeet-box.png",
  price: 999,
  mrp: 1199,
  slug: "shahjeet-sticks",
};

// ─── UTILITIES ──────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inV = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inV ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.52, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <p style={{
      fontFamily: F,
      fontVariationSettings: "'wdth' 75,'wght' 500",
      fontSize: "9px",
      letterSpacing: ".30em",
      textTransform: "uppercase",
      color: light ? "rgba(247,240,226,.50)" : "#C8963E",
      marginBottom: "12px",
    }}>
      {text}
    </p>
  );
}

function GoldPill({ text }: { text: string }) {
  return (
    <span style={{
      fontFamily: F,
      fontVariationSettings: "'wdth' 75,'wght' 600",
      fontSize: "9px",
      letterSpacing: ".14em",
      textTransform: "uppercase",
      color: "#C8963E",
      border: "1px solid rgba(200,150,62,.35)",
      background: "rgba(200,150,62,.08)",
      padding: "4px 12px",
    }}>
      {text}
    </span>
  );
}

// ─── S1 — HERO ───────────────────────────────────────────────────────────────
const SCENARIOS = [
  { icon: "🏋️", label: "Gym" },
  { icon: "💼", label: "Work" },
  { icon: "✈️", label: "Travel" },
  { icon: "🎯", label: "Presentation" },
  { icon: "👨‍👩‍👧", label: "Family" },
  { icon: "💡", label: "Building Ideas" },
];

function HeroSection() {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [purchase, setPurchase] = useState<'once'|'bundle'|'subscribe'>('once');
  const { addItem } = useCart();

  const handleAdd = async () => {
    await addItem({
      id: PRODUCT.id,
      productId: PRODUCT.id,
      name: PRODUCT.name,
      image: PRODUCT.image,
      price: PRODUCT.price,
      mrp: PRODUCT.mrp,
      quantity: qty,
      slug: PRODUCT.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section style={{ background: "#1c1304", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "radial-gradient(circle,rgba(228,192,121,.8) 1px,transparent 1px)",
        backgroundSize: "40px 40px", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "clamp(64px,8vh,112px) 24px clamp(48px,6vh,80px)", position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          style={{ marginBottom: "24px" }}
        >
          <span style={{
            background: "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
            color: "#1c1304",
            fontFamily: F,
            fontVariationSettings: "'wdth' 75,'wght' 700",
            fontSize: "8px",
            letterSpacing: ".28em",
            textTransform: "uppercase",
            padding: "5px 14px",
          }}>
            Doctor-Led Performance Ayurveda™
          </span>
        </motion.div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" }}
          className="grid-cols-1 md:grid-cols-2">

          {/* Left — content */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 800",
                fontSize: "clamp(34px,5.2vw,64px)",
                letterSpacing: "-.03em",
                lineHeight: 1.05,
                color: "#f7f0e2",
                marginBottom: "8px",
              }}
            >
              Shahjeet<sup style={{ fontSize: "40%", verticalAlign: "super" }}>®</sup>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.45 }}
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 600",
                fontStyle: "italic",
                fontSize: "clamp(16px,2vw,22px)",
                color: "#C8963E",
                marginBottom: "6px",
              }}
            >
              Performance In Your Pocket.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.26, duration: 0.45 }}
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 300",
                fontStyle: "italic",
                fontSize: "clamp(14px,1.6vw,17px)",
                color: "rgba(247,240,226,.55)",
                marginBottom: "24px",
              }}
            >
              Shodhit Shilajit + Honey. The Fast Ritual For Modern Life.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32, duration: 0.45 }}
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 400",
                fontSize: "clamp(13px,1.4vw,16px)",
                lineHeight: 1.75,
                color: "rgba(247,240,226,.68)",
                marginBottom: "22px",
                maxWidth: "480px",
              }}
            >
              Ancient wisdom meets modern convenience. For people who refuse to compromise on consistency — at work, gym, on the road, or between daily demands.
            </motion.p>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38, duration: 0.45 }}
              style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "26px" }}
            >
              {["Shodhit Shilajit", "Honey-Based Formula", "Portable Single-Serve", "Men & Women", "Doctor Reviewed", "Ready Anywhere"].map((t) => (
                <GoldPill key={t} text={t} />
              ))}
            </motion.div>

            {/* Purchase Options */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.48, ease: EASE }}
            >
              {/* Option cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" }}>
                {/* One-time */}
                <button
                  type="button"
                  onClick={() => setPurchase('once')}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: purchase === 'once' ? "rgba(200,150,62,.10)" : "transparent",
                    border: purchase === 'once' ? "1px solid rgba(200,150,62,.55)" : "1px solid rgba(247,240,226,.14)",
                    padding: "12px 16px", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0,
                      border: purchase === 'once' ? "4px solid #C8963E" : "2px solid rgba(247,240,226,.35)",
                      background: "transparent",
                    }} />
                    <div>
                      <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 600", fontSize: "12px", color: "#f7f0e2", margin: 0 }}>One-time Purchase</p>
                      <p style={{ fontFamily: F, fontSize: "10px", color: "rgba(247,240,226,.45)", margin: "2px 0 0" }}>30 sticks · no commitment</p>
                    </div>
                  </div>
                  <span style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: "15px", color: "#f7f0e2" }}>₹{PRODUCT.price}</span>
                </button>

                {/* Subscribe Monthly — Most Popular */}
                <button
                  type="button"
                  onClick={() => setPurchase('subscribe')}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: purchase === 'subscribe' ? "rgba(200,150,62,.13)" : "rgba(200,150,62,.04)",
                    border: purchase === 'subscribe' ? "1px solid #C8963E" : "1px solid rgba(200,150,62,.28)",
                    borderLeft: "3px solid #C8963E",
                    padding: "12px 16px", cursor: "pointer", textAlign: "left", position: "relative",
                  }}
                >
                  <div style={{
                    position: "absolute", top: "-9px", left: "14px",
                    background: "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
                    color: "#1c1304", fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 700",
                    fontSize: "7px", letterSpacing: ".18em", textTransform: "uppercase",
                    padding: "2px 8px",
                  }}>Most Popular</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0,
                      border: purchase === 'subscribe' ? "4px solid #C8963E" : "2px solid rgba(200,150,62,.55)",
                      background: "transparent",
                    }} />
                    <div>
                      <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 600", fontSize: "12px", color: "#f7f0e2", margin: 0 }}>Subscribe Monthly</p>
                      <p style={{ fontFamily: F, fontSize: "10px", color: "rgba(247,240,226,.45)", margin: "2px 0 0" }}>Auto-delivered · Cancel anytime · Save 20%</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: "15px", color: "#C8963E", margin: 0 }}>₹799<span style={{ fontSize: "10px", fontVariationSettings: "'wdth' 75,'wght' 400" }}>/mo</span></p>
                    <p style={{ fontFamily: F, fontSize: "9px", color: "rgba(247,240,226,.35)", margin: "2px 0 0", textDecoration: "line-through" }}>₹{PRODUCT.price}</p>
                  </div>
                </button>

                {/* Bundle */}
                <button
                  type="button"
                  onClick={() => setPurchase('bundle')}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: purchase === 'bundle' ? "rgba(200,150,62,.10)" : "transparent",
                    border: purchase === 'bundle' ? "1px solid rgba(200,150,62,.55)" : "1px solid rgba(247,240,226,.14)",
                    padding: "12px 16px", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0,
                      border: purchase === 'bundle' ? "4px solid #C8963E" : "2px solid rgba(247,240,226,.35)",
                      background: "transparent",
                    }} />
                    <div>
                      <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 600", fontSize: "12px", color: "#f7f0e2", margin: 0 }}>The Complete Ritual</p>
                      <p style={{ fontFamily: F, fontSize: "10px", color: "rgba(247,240,226,.45)", margin: "2px 0 0" }}>Shahjeet Sticks + RockResin · Save 21%</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: "15px", color: "#f7f0e2", margin: 0 }}>₹1,799</p>
                    <p style={{ fontFamily: F, fontSize: "9px", color: "rgba(247,240,226,.35)", margin: "2px 0 0", textDecoration: "line-through" }}>₹2,298</p>
                  </div>
                </button>
              </div>

              {/* Price display */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "16px" }}>
                <span style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 800",
                  fontSize: "clamp(26px,3.2vw,36px)",
                  color: purchase === 'subscribe' ? "#C8963E" : "#f7f0e2",
                }}>
                  {purchase === 'once' ? `₹${PRODUCT.price}` : purchase === 'subscribe' ? '₹799/mo' : '₹1,799'}
                </span>
                {purchase !== 'bundle' && (
                  <span style={{ fontFamily: F, fontSize: "15px", color: "rgba(247,240,226,.28)", textDecoration: "line-through" }}>
                    {purchase === 'subscribe' ? `₹${PRODUCT.price}` : `₹${PRODUCT.mrp}`}
                  </span>
                )}
                <span style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 700",
                  fontSize: "9px",
                  letterSpacing: ".14em",
                  background: "rgba(200,150,62,.18)",
                  border: "1px solid rgba(200,150,62,.35)",
                  color: "#C8963E",
                  padding: "3px 8px",
                }}>
                  {purchase === 'once' ? 'SAVE 17%' : purchase === 'subscribe' ? 'SAVE 20%' : 'SAVE 21%'}
                </span>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "12px" }}>
                {purchase !== 'subscribe' && (
                  <div style={{ display: "flex", border: "1px solid rgba(247,240,226,.18)" }}>
                    <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}
                      style={{ width: "38px", height: "44px", color: "#f7f0e2", background: "transparent", border: "none", cursor: "pointer", fontSize: "18px" }}>−</button>
                    <span style={{ width: "38px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 600", fontSize: "15px", color: "#f7f0e2" }}>{qty}</span>
                    <button type="button" onClick={() => setQty(qty + 1)}
                      style={{ width: "38px", height: "44px", color: "#f7f0e2", background: "transparent", border: "none", cursor: "pointer", fontSize: "18px" }}>+</button>
                  </div>
                )}
                {purchase === 'subscribe' ? (
                  <Link
                    href="/subscribe-waitlist"
                    style={{
                      flex: 1,
                      display: "block",
                      background: "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
                      color: "#1c1304",
                      fontFamily: F,
                      fontVariationSettings: "'wdth' 85,'wght' 700",
                      fontSize: "11px",
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                      padding: "14px 22px",
                      textDecoration: "none",
                      textAlign: "center",
                      minWidth: "180px",
                    }}
                  >
                    {/* TODO: Connect Razorpay subscription API post-KYC */}
                    Join Subscribe Waitlist
                  </Link>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => void handleAdd()}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      flex: 1,
                      background: added ? "rgba(200,150,62,.22)" : "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
                      color: "#1c1304",
                      fontFamily: F,
                      fontVariationSettings: "'wdth' 85,'wght' 700",
                      fontSize: "11px",
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                      padding: "14px 22px",
                      border: "none",
                      cursor: "pointer",
                      minWidth: "180px",
                    }}
                  >
                    {added ? "✓ Added to Ritual" : purchase === 'bundle' ? "Add The Complete Ritual" : "Begin Your Fast Ritual"}
                  </motion.button>
                )}
                <Link href="#lab-reports" style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 600",
                  fontSize: "10px",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "rgba(247,240,226,.52)",
                  textDecoration: "none",
                  border: "1px solid rgba(247,240,226,.18)",
                  padding: "14px 16px",
                  whiteSpace: "nowrap",
                }}>
                  View Lab Reports
                </Link>
              </div>
            </motion.div>

            {/* 6 scenarios */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.58, duration: 0.45 }}
              style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}
            >
              {SCENARIOS.map((s) => (
                <div key={s.label} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 500",
                  fontSize: "9px",
                  letterSpacing: ".10em",
                  textTransform: "uppercase",
                  color: "rgba(247,240,226,.35)",
                }}>
                  <span>{s.icon}</span>{s.label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — product image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.20, duration: 0.65, ease: EASE }}
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PRODUCT.image}
              alt="Shahjeet — Honey Shilajit Sticks"
              style={{
                width: "100%",
                maxWidth: "440px",
                objectFit: "contain",
                filter: "drop-shadow(0 40px 80px rgba(200,150,62,.22))",
              }}
            />
          </motion.div>
        </div>

        {/* Ritual signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.72, duration: 0.5 }}
          style={{
            borderTop: "1px solid rgba(247,240,226,.08)",
            marginTop: "clamp(32px,5vh,52px)",
            paddingTop: "26px",
            textAlign: "center",
          }}
        >
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700",
            fontStyle: "italic",
            fontSize: "clamp(15px,1.8vw,20px)",
            color: "rgba(247,240,226,.55)",
            marginBottom: "6px",
          }}>
            Tear. Squeeze. Perform.
          </p>
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 100,'wght' 300",
            fontSize: "12px",
            color: "rgba(247,240,226,.30)",
            letterSpacing: ".06em",
            marginBottom: "8px",
          }}>
            No preparation. No spoon. No warm water. No excuses.
          </p>
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700",
            fontStyle: "italic",
            fontSize: "12px",
            color: "rgba(247,240,226,.22)",
            letterSpacing: ".04em",
          }}>
            The Fast Ritual™ — For those who carry their ambition everywhere. Now your ritual travels with you.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── S2 — WHY SHILAJIT + HONEY? ─────────────────────────────────────────────
function WhyCombinationSection() {
  return (
    <section style={{ background: "#1c1304", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <Eyebrow text="The Science Behind The Combination" light />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(26px,3.8vw,46px)",
              letterSpacing: "-.02em",
              color: "#f7f0e2",
              marginBottom: "10px",
            }}>
              Some Combinations Exist For A Reason.
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", marginBottom: "40px" }} className="grid-cols-1 md:grid-cols-2">
          {/* Shilajit card */}
          <Reveal delay={0.05}>
            <div style={{ background: "rgba(247,240,226,.04)", border: "1px solid rgba(247,240,226,.08)", padding: "32px" }}>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 800",
                fontSize: "clamp(24px,3vw,32px)",
                letterSpacing: "-.02em",
                color: "#f7f0e2",
                marginBottom: "4px",
              }}>Shilajit</p>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 600",
                fontSize: "9px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "#C8963E",
                marginBottom: "16px",
              }}>The Rasayana</p>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 400",
                fontSize: "14px",
                lineHeight: 1.72,
                color: "rgba(247,240,226,.62)",
                marginBottom: "14px",
              }}>
                Centuries of presence in Ayurvedic literature as a Rasayana — a category of substances used for long-term vitality, resilience, and daily wellbeing. In Shahjeet, we use Shodhit Shilajit: purified through classical Triphala-based Shodhana before use.
              </p>
              {["Rasayana tradition", "Shodhit via Triphala", "Resin-based source", "Quality verified", "Rooted in classical texts"].map((pt) => (
                <div key={pt} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                  <span style={{ color: "#C8963E", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ fontFamily: F, fontSize: "12px", color: "rgba(247,240,226,.58)" }}>{pt}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Honey card */}
          <Reveal delay={0.10}>
            <div style={{ background: "rgba(247,240,226,.04)", border: "1px solid rgba(200,150,62,.18)", padding: "32px" }}>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 800",
                fontSize: "clamp(24px,3vw,32px)",
                letterSpacing: "-.02em",
                color: "#f7f0e2",
                marginBottom: "4px",
              }}>Madhu</p>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 600",
                fontSize: "9px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "#C8963E",
                marginBottom: "16px",
              }}>Nature&apos;s Carrier</p>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 400",
                fontSize: "14px",
                lineHeight: 1.72,
                color: "rgba(247,240,226,.62)",
                marginBottom: "14px",
              }}>
                Madhu (honey) is described as Yogavahi in classical Ayurvedic texts — a carrier substance that enhances the properties of what it accompanies. Traditionally valued for palatability, daily nourishment, ease of consumption, and compatibility with Ayurvedic formulations.
              </p>
              {["Yogavahi carrier properties", "Natural palatability", "Daily nourishment", "Formulation compatibility", "Polyphenols & flavonoids"].map((pt) => (
                <div key={pt} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                  <span style={{ color: "#C8963E", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ fontFamily: F, fontSize: "12px", color: "rgba(247,240,226,.58)" }}>{pt}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Two Yogavahi statement */}
        <Reveal delay={0.12}>
          <div style={{
            background: "rgba(200,150,62,.06)",
            border: "1px solid rgba(200,150,62,.20)",
            padding: "32px 36px",
            textAlign: "center",
            marginBottom: "36px",
          }}>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(16px,2.2vw,22px)",
              color: "#f7f0e2",
              marginBottom: "10px",
            }}>
              Two Yogavahi. One Purpose.
            </p>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontSize: "14px",
              color: "rgba(247,240,226,.55)",
              maxWidth: "560px",
              margin: "0 auto 14px",
              lineHeight: 1.72,
            }}>
              Both Shilajit and Madhu are described as Yogavahi in classical Ayurvedic texts. Together, they create synergy — not merely simplicity.
              Honey contributes polyphenols, flavonoids, organic acids, naturally occurring enzymes, and trace bioactive compounds.
            </p>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontStyle: "italic",
              fontSize: "14px",
              color: "rgba(247,240,226,.38)",
              marginBottom: "14px",
            }}>
              No measuring. No preparation. No carrying jars. No searching for warm water.
            </p>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontStyle: "italic",
              fontSize: "clamp(14px,1.8vw,18px)",
              background: "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Ancient Rasayana. Traditional Madhu. Modern Convenience. Daily Consistency.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S3 — THE FAST RITUAL™ ───────────────────────────────────────────────────
const FAST_STEPS = [
  { word: "TEAR", icon: "🖐", headline: "Open. Anytime. Anywhere.", body: "No jars. No spoons. Whether at your desk, in the gym, travelling, or heading into an important meeting — just tear the notch and you're ready." },
  { word: "SQUEEZE", icon: "⬇️", headline: "No Measuring. No Guesswork.", body: "A carefully prepared combination of Shodhit Shilajit and Honey, individually portioned in every stick. Simply squeeze and consume. Consistency delivered." },
  { word: "PERFORM", icon: "⚡", headline: "Continue Your Day.", body: "No waiting. No mixing. No cleanup. Just one less excuse standing between you and your higher variant. Repeat tomorrow." },
];

const PERSONAS_FAST = [
  { icon: "💼", type: "The Entrepreneur", desc: "Between calls and decisions" },
  { icon: "🏢", type: "The Professional", desc: "Between meetings and deadlines" },
  { icon: "✈️", type: "The Traveller", desc: "Between airports and destinations" },
  { icon: "🏃", type: "The Athlete", desc: "Before, after, between sessions" },
  { icon: "👨‍👩‍👧", type: "The Parent", desc: "Between responsibilities" },
  { icon: "📚", type: "The Student", desc: "Between lectures and ambitions" },
];

function FastRitualSection() {
  const [active, setActive] = useState(0);
  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Eyebrow text="The Fast Ritual™" />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(26px,3.8vw,46px)",
              letterSpacing: "-.02em",
              color: "#1c1304",
              marginBottom: "8px",
            }}>
              Wellness Should Move At The Speed Of Life.
            </h2>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontStyle: "italic",
              fontSize: "15px",
              color: "rgba(28,19,4,.45)",
            }}>
              Tear, squeeze, and Perform!!
            </p>
          </div>
        </Reveal>

        {/* Step selector */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "32px", flexWrap: "wrap" }}>
          {FAST_STEPS.map((s, i) => (
            <button
              key={s.word}
              type="button"
              onClick={() => setActive(i)}
              style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "11px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                padding: "10px 22px",
                border: "1px solid",
                cursor: "pointer",
                background: active === i ? "#1c1304" : "transparent",
                color: active === i ? "#f7f0e2" : "rgba(28,19,4,.42)",
                borderColor: active === i ? "#1c1304" : "rgba(28,19,4,.18)",
                transition: "all .22s ease",
              }}
            >
              {s.word}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: EASE }}
            style={{
              background: "#1c1304",
              padding: "clamp(28px,4vw,52px)",
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "28px",
              alignItems: "center",
              maxWidth: "680px",
              margin: "0 auto 44px",
            }}
          >
            <div>
              <span style={{ fontSize: "clamp(40px,6vw,64px)", lineHeight: 1 }}>{FAST_STEPS[active].icon}</span>
            </div>
            <div>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 600",
                fontSize: "9px",
                letterSpacing: ".22em",
                textTransform: "uppercase",
                color: "#C8963E",
                marginBottom: "8px",
              }}>{FAST_STEPS[active].word}</p>
              <h3 style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "clamp(17px,2.2vw,22px)",
                color: "#f7f0e2",
                marginBottom: "8px",
              }}>{FAST_STEPS[active].headline}</h3>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 400",
                fontSize: "14px",
                lineHeight: 1.72,
                color: "rgba(247,240,226,.65)",
              }}>{FAST_STEPS[active].body}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Built For Real Life */}
        <Reveal delay={0.08}>
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700",
            fontSize: "clamp(16px,2vw,20px)",
            color: "#1c1304",
            textAlign: "center",
            marginBottom: "20px",
          }}>
            Built For Real Life.
          </p>
        </Reveal>
        <Reveal delay={0.10}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "12px", marginBottom: "36px" }}>
            {PERSONAS_FAST.map((p) => (
              <div key={p.type} style={{
                background: "#fff",
                border: "1px solid rgba(183,163,146,.24)",
                padding: "16px 14px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "22px", marginBottom: "6px" }}>{p.icon}</div>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: "12px",
                  color: "#1c1304",
                  marginBottom: "3px",
                }}>{p.type}</p>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 300",
                  fontSize: "10px",
                  color: "rgba(28,19,4,.45)",
                  letterSpacing: ".04em",
                }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700",
            fontStyle: "italic",
            fontSize: "clamp(14px,1.8vw,18px)",
            textAlign: "center",
            color: "rgba(28,19,4,.30)",
          }}>
            The ritual may be fast. The process behind it isn&apos;t.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S4 — THE SHAHJEET DIFFERENCE ───────────────────────────────────────────
const DIFFERENCES = [
  { heading: "Not Just Shilajit — Shodhit Shilajit", body: "Triphala-based Shodhana. How a substance is prepared influences its quality as much as where it comes from. We chose preparation first." },
  { heading: "Not Just Honey — Madhu With Purpose", body: "Yogavahi properties. Natural compatibility with Ayurvedic formulations. Palatability that encourages daily consistency without compromise." },
  { heading: "Not Just A Stick Pack — A Portable Ritual", body: "Removes every barrier: no preparation, no measuring, no jars, no warm water. The ritual travels with you to every environment, every context." },
  { heading: "Not Just A Product — A Daily Companion", body: "Travelling, working, training, building, creating, learning. Shahjeet fits into every context of a modern life — without asking you to rearrange it." },
  { heading: "Precision In Every Stick", body: "Individually portioned for consistency. No guesswork, no variation, no days where you forget because it was inconvenient." },
  { heading: "Doctor-Led. Experience-Driven.", body: "How do we make ancient Ayurvedic wisdom easier to practice in modern life? The answer wasn't another capsule. The answer was a ritual people could actually carry." },
];

function DifferenceSection() {
  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "48px" }}>
            <Eyebrow text="Why Shahjeet" />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(24px,3.5vw,40px)",
              letterSpacing: "-.02em",
              color: "#1c1304",
              marginBottom: "8px",
              maxWidth: "600px",
            }}>
              Convenience Is Easy. Thoughtful Formulation Is Not.
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "0", border: "1px solid rgba(183,163,146,.24)" }}>
          {DIFFERENCES.map((d, i) => (
            <Reveal key={d.heading} delay={i * 0.05}>
              <motion.div
                whileHover={{ background: "#fff" }}
                style={{
                  padding: "30px 26px",
                  borderRight: i % 2 === 0 ? "1px solid rgba(183,163,146,.24)" : "none",
                  borderBottom: i < 4 ? "1px solid rgba(183,163,146,.24)" : "none",
                  transition: "background .22s ease",
                }}
              >
                <div style={{
                  width: "3px",
                  height: "26px",
                  background: "linear-gradient(to bottom,#A67B2F,#E4C079)",
                  marginBottom: "14px",
                }} />
                <h3 style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: "15px",
                  color: "#1c1304",
                  marginBottom: "8px",
                  lineHeight: 1.3,
                }}>{d.heading}</h3>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 400",
                  fontSize: "13px",
                  lineHeight: 1.70,
                  color: "rgba(28,19,4,.58)",
                }}>{d.body}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.14}>
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700",
            fontStyle: "italic",
            fontSize: "clamp(14px,1.8vw,18px)",
            textAlign: "center",
            color: "rgba(28,19,4,.28)",
            marginTop: "36px",
          }}>
            Some products ask for your attention. Shahjeet respects your schedule.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S5 — INSIDE EVERY SHAHJEET STICK ───────────────────────────────────────
function IngredientsSection() {
  return (
    <section style={{ background: "#1c1304", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Eyebrow text="Inside Every Stick" light />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(24px,3.5vw,40px)",
              letterSpacing: "-.02em",
              color: "#f7f0e2",
              marginBottom: "8px",
            }}>
              Simple Ingredients. Thoughtfully Combined.
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "36px" }} className="grid-cols-1 md:grid-cols-2">
          {/* Shilajit */}
          <Reveal delay={0.05}>
            <div style={{ border: "1px solid rgba(200,150,62,.22)", background: "rgba(200,150,62,.04)", padding: "30px" }}>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 800",
                fontSize: "22px",
                color: "#f7f0e2",
                marginBottom: "2px",
              }}>Shodhit Shilajit</p>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 600",
                fontSize: "9px",
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "#C8963E",
                marginBottom: "14px",
              }}>The Rasayana</p>
              <p style={{
                fontFamily: F,
                fontSize: "13px",
                lineHeight: 1.68,
                color: "rgba(247,240,226,.58)",
                marginBottom: "14px",
              }}>
                Triphala purified, resin-based, quality verified, rooted in tradition. The Rasayana heritage behind every Shahjeet stick.
              </p>
              {["Triphala-based Shodhana", "Resin-form source material", "Quality verified", "Rooted in Ayurvedic tradition", "600mg per stick"].map((pt) => (
                <div key={pt} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                  <span style={{ color: "#C8963E", fontWeight: 700 }}>✓</span>
                  <span style={{ fontFamily: F, fontSize: "12px", color: "rgba(247,240,226,.55)" }}>{pt}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Honey */}
          <Reveal delay={0.10}>
            <div style={{ border: "1px solid rgba(247,240,226,.10)", background: "rgba(247,240,226,.03)", padding: "30px" }}>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 800",
                fontSize: "22px",
                color: "#f7f0e2",
                marginBottom: "2px",
              }}>Madhu (Honey)</p>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 600",
                fontSize: "9px",
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "#C8963E",
                marginBottom: "14px",
              }}>Nature&apos;s Companion</p>
              <p style={{
                fontFamily: F,
                fontSize: "13px",
                lineHeight: 1.68,
                color: "rgba(247,240,226,.58)",
                marginBottom: "14px",
              }}>
                Polyphenols, flavonoids, organic acids, naturally occurring enzymes, trace bioactive compounds. Palatability that makes the ritual something you look forward to.
              </p>
              {["Yogavahi carrier properties", "Natural palatability", "Daily nourishment", "Formulation compatibility", "Ease of consumption"].map((pt) => (
                <div key={pt} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                  <span style={{ color: "#C8963E", fontWeight: 700 }}>✓</span>
                  <span style={{ fontFamily: F, fontSize: "12px", color: "rgba(247,240,226,.55)" }}>{pt}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div style={{
            background: "rgba(200,150,62,.06)",
            border: "1px solid rgba(200,150,62,.18)",
            padding: "28px 32px",
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(15px,2vw,20px)",
              color: "#f7f0e2",
              marginBottom: "10px",
            }}>
              Shahjeet is not simply Shilajit mixed into honey. It is a formulation philosophy.
            </p>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontSize: "14px",
              color: "rgba(247,240,226,.50)",
              maxWidth: "520px",
              margin: "0 auto 10px",
              lineHeight: 1.68,
            }}>
              No proprietary mysteries, no hidden narratives, no exaggerated claims. Every stick: Traditional Wisdom. Thoughtful Formulation. Modern Convenience.
            </p>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontStyle: "italic",
              fontSize: "13px",
              color: "#C8963E",
            }}>
              The best formulations are not the most complicated. They are the most intentional.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S6 — 5 PILLARS OF SHAHJEET QUALITY™ ────────────────────────────────────
const PILLARS = [
  { icon: "⛰", num: "01", title: "Himalayan Shilajit", body: "Authentic source. Traditional heritage. The foundation of the formulation, selected with care and purified before use." },
  { icon: "🌿", num: "02", title: "Triphala-Based Purification", body: "Essential in Ayurveda. Rooted in tradition. Process-driven quality that begins before the formulation — not after." },
  { icon: "🍯", num: "03", title: "Traditional Madhu", body: "Yogavahi properties. Natural palatability. Daily use compatibility. Not just a taste — a classical Ayurvedic companion." },
  { icon: "📦", num: "04", title: "Single-Serve Consistency", body: "Individually portioned. No measuring, no guesswork. Portable, repeatable, travel-friendly. Every stick, every day." },
  { icon: "🔬", num: "05", title: "Quality Verification", body: "Laboratory testing. Batch verification. Quality documentation. Transparency that continues beyond purchase — not before it ends." },
];

function PillarsSection() {
  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Eyebrow text="Shahjeet Quality™" />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(24px,3.5vw,40px)",
              letterSpacing: "-.02em",
              color: "#1c1304",
              marginBottom: "8px",
            }}>
              The 5 Pillars of Shahjeet Quality™
            </h2>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontStyle: "italic",
              fontSize: "14px",
              color: "rgba(28,19,4,.42)",
            }}>
              Five Pillars. One Standard.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "16px" }}>
          {PILLARS.map((p, i) => (
            <Reveal key={p.num} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 14px 36px rgba(200,150,62,.10)" }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(183,163,146,.22)",
                  padding: "24px",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: "2px",
                  background: "linear-gradient(90deg,#A67B2F,#E4C079,#C8963E)",
                }} />
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "20px" }}>{p.icon}</span>
                  <span style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 85,'wght' 800",
                    fontSize: "28px",
                    color: "rgba(28,19,4,.07)",
                    lineHeight: 1,
                  }}>{p.num}</span>
                </div>
                <h3 style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: "15px",
                  color: "#1c1304",
                  marginBottom: "8px",
                  lineHeight: 1.3,
                }}>{p.title}</h3>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 400",
                  fontSize: "12.5px",
                  lineHeight: 1.68,
                  color: "rgba(28,19,4,.55)",
                }}>{p.body}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.16}>
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700",
            fontStyle: "italic",
            fontSize: "clamp(14px,1.8vw,18px)",
            textAlign: "center",
            color: "rgba(28,19,4,.28)",
            marginTop: "36px",
          }}>
            The ritual may take seconds. The process behind it takes much longer.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S7 — EVIDENCE BEFORE CLAIMS™ ───────────────────────────────────────────
const QUALITY_DOCS = [
  "Raw Material Verification",
  "Shilajit Quality Assessment",
  "Heavy Metal Screening",
  "Microbial Testing",
  "Honey Quality Evaluation",
  "Batch Traceability",
  "QR Verification",
  "Manufacturing Documentation",
];

function EvidenceSection() {
  return (
    <section id="lab-reports" style={{ background: "#1c1304", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Eyebrow text="Transparency" light />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(24px,3.5vw,40px)",
              letterSpacing: "-.02em",
              color: "#f7f0e2",
              marginBottom: "8px",
            }}>
              Evidence Before Claims™
            </h2>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontStyle: "italic",
              fontSize: "15px",
              color: "rgba(247,240,226,.48)",
            }}>
              Trust should never depend on marketing. It should depend on evidence.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }} className="grid-cols-1 md:grid-cols-2">
          {/* Checklist */}
          <Reveal delay={0.05}>
            <div>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 600",
                fontSize: "9px",
                letterSpacing: ".20em",
                textTransform: "uppercase",
                color: "#C8963E",
                marginBottom: "18px",
              }}>Quality Verification</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "22px" }}>
                {QUALITY_DOCS.map((d) => (
                  <div key={d} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    background: "rgba(247,240,226,.04)",
                    border: "1px solid rgba(247,240,226,.06)",
                  }}>
                    <div style={{
                      width: "18px",
                      height: "18px",
                      background: "linear-gradient(135deg,#A67B2F,#E4C079)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5l2 2L8 1" stroke="#1c1304" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 500", fontSize: "12px", color: "rgba(247,240,226,.72)" }}>{d}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {["Lab Report", "COA", "Manufacturing Certs"].map((label) => (
                  <Link key={label} href="/lab-reports" style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 75,'wght' 600",
                    fontSize: "9px",
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "#C8963E",
                    border: "1px solid rgba(200,150,62,.32)",
                    padding: "6px 12px",
                    textDecoration: "none",
                  }}>
                    View {label} →
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          {/* QR Verify + Standard */}
          <Reveal delay={0.10}>
            <div>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 600",
                fontSize: "9px",
                letterSpacing: ".20em",
                textTransform: "uppercase",
                color: "#C8963E",
                marginBottom: "18px",
              }}>Scan. Verify. Trust.</p>
              {[
                "Locate the QR code on your Shahjeet box.",
                "Scan with any smartphone camera app.",
                "Access batch-specific quality documentation.",
                "Verify ingredient quality, testing status, and batch identity.",
              ].map((step, i) => (
                <div key={step} style={{ display: "flex", gap: "14px", marginBottom: "16px" }}>
                  <div style={{
                    width: "28px",
                    height: "28px",
                    background: "linear-gradient(135deg,#A67B2F,#E4C079)",
                    color: "#1c1304",
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 85,'wght' 800",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}>{i + 1}</div>
                  <p style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 100,'wght' 400",
                    fontSize: "13px",
                    lineHeight: 1.65,
                    color: "rgba(247,240,226,.65)",
                  }}>{step}</p>
                </div>
              ))}

              <div style={{
                marginTop: "24px",
                padding: "20px",
                background: "rgba(200,150,62,.06)",
                border: "1px solid rgba(200,150,62,.18)",
              }}>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 700",
                  fontSize: "9px",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#C8963E",
                  marginBottom: "8px",
                }}>Our Standard</p>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: "13px",
                  color: "rgba(247,240,226,.72)",
                  lineHeight: 1.65,
                }}>
                  Source Carefully. Purify Thoughtfully. Test Rigorously. Share Transparently.
                </p>
              </div>

              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 300",
                fontStyle: "italic",
                fontSize: "12px",
                color: "rgba(247,240,226,.32)",
                marginTop: "16px",
                lineHeight: 1.6,
              }}>
                Anyone can make a promise. We prefer to show the process behind it.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── S8 — PERFORMANCE WITHOUT COMPLEXITY ─────────────────────────────────────
const FRICTIONS = ["Measure", "Mix", "Prepare", "Carry", "Clean", "Repeat"];
const REMOVED = ["No preparation", "No measuring", "No warm water", "No jars", "No spoons", "No excuses"];

function NoComplexitySection() {
  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Eyebrow text="The Philosophy" />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(24px,3.5vw,40px)",
              letterSpacing: "-.02em",
              color: "#1c1304",
              marginBottom: "8px",
            }}>
              The Best Ritual Is The One You Actually Follow.
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }} className="grid-cols-1 md:grid-cols-2">
          {/* Modern friction */}
          <Reveal delay={0.05}>
            <div style={{ background: "#fff", border: "1px solid rgba(183,163,146,.24)", padding: "28px" }}>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "15px",
                color: "rgba(28,19,4,.50)",
                marginBottom: "14px",
                textDecoration: "line-through",
              }}>
                Modern Life Creates Friction
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {FRICTIONS.map((f) => (
                  <span key={f} style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 75,'wght' 500",
                    fontSize: "10px",
                    letterSpacing: ".10em",
                    textTransform: "uppercase",
                    color: "rgba(28,19,4,.35)",
                    border: "1px solid rgba(28,19,4,.12)",
                    padding: "5px 12px",
                    textDecoration: "line-through",
                  }}>
                    {f}
                  </span>
                ))}
              </div>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 300",
                fontStyle: "italic",
                fontSize: "12px",
                color: "rgba(28,19,4,.35)",
                marginTop: "14px",
              }}>
                ...eventually abandoned.
              </p>
            </div>
          </Reveal>

          {/* Shahjeet removes friction */}
          <Reveal delay={0.08}>
            <div style={{ background: "#1c1304", padding: "28px" }}>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "15px",
                color: "#C8963E",
                marginBottom: "14px",
              }}>
                Shahjeet Removes Friction
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {REMOVED.map((r) => (
                  <span key={r} style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 75,'wght' 600",
                    fontSize: "10px",
                    letterSpacing: ".10em",
                    textTransform: "uppercase",
                    color: "#C8963E",
                    border: "1px solid rgba(200,150,62,.30)",
                    padding: "5px 12px",
                  }}>
                    ✓ {r}
                  </span>
                ))}
              </div>
              <p style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 100,'wght' 300",
                fontStyle: "italic",
                fontSize: "12px",
                color: "rgba(247,240,226,.40)",
                marginTop: "14px",
              }}>
                ...one ritual, consistently repeated.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontStyle: "italic",
              fontSize: "clamp(14px,1.8vw,18px)",
              color: "rgba(28,19,4,.28)",
              marginBottom: "6px",
            }}>
              Small actions, repeated daily, over time — that is the philosophy behind Shahjeet.
            </p>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontStyle: "italic",
              fontSize: "clamp(14px,1.8vw,18px)",
              color: "rgba(28,19,4,.22)",
            }}>
              The Fast Ritual™ — Because wellness should fit your life. Not compete with it.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S9 — WHY HONEY ─────────────────────────────────────────────────────────
const HONEY_PROPERTIES = [
  { sanskrit: "Yogavahi", desc: "Carries and complements the qualities of what it accompanies — enhancing the formulation rather than competing with it." },
  { sanskrit: "Sukshma", desc: "Subtle and penetrating — traditionally described as reaching fine channels and supporting absorption at a deeper level." },
  { sanskrit: "Pathya", desc: "Incorporated into preparations and daily regimens — traditionally considered suitable for long-term, consistent use." },
];

function HoneySection() {
  return (
    <section style={{ background: "#1c1304", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Eyebrow text="The Role of Madhu" light />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(24px,3.5vw,40px)",
              letterSpacing: "-.02em",
              color: "#f7f0e2",
              marginBottom: "8px",
            }}>
              Why Honey Has Been Valued For Centuries.
            </h2>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontStyle: "italic",
              fontSize: "15px",
              color: "rgba(247,240,226,.45)",
            }}>
              More Than A Sweetener.
            </p>
          </div>
        </Reveal>

        {/* 3 classical descriptions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "16px", marginBottom: "36px" }}>
          {HONEY_PROPERTIES.map((h, i) => (
            <Reveal key={h.sanskrit} delay={i * 0.07}>
              <div style={{
                border: "1px solid rgba(200,150,62,.20)",
                background: "rgba(200,150,62,.04)",
                padding: "26px",
              }}>
                <p style={{
                  fontFamily: "'Noto Serif Devanagari','Noto Sans Devanagari',serif",
                  fontSize: "24px",
                  color: "#C8963E",
                  marginBottom: "4px",
                  lineHeight: 1.3,
                }}>{h.sanskrit}</p>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 600",
                  fontSize: "9px",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "rgba(200,150,62,.55)",
                  marginBottom: "10px",
                }}>Classical Ayurvedic Description</p>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 400",
                  fontSize: "13px",
                  lineHeight: 1.68,
                  color: "rgba(247,240,226,.58)",
                }}>{h.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Why we chose honey */}
        <Reveal delay={0.12}>
          <div style={{
            background: "rgba(247,240,226,.04)",
            border: "1px solid rgba(247,240,226,.08)",
            padding: "28px 32px",
            marginBottom: "28px",
          }}>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "15px",
              color: "#f7f0e2",
              marginBottom: "16px",
            }}>
              Why We Chose Honey:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "12px" }}>
              {[
                { label: "Palatability", desc: "A pleasant experience encourages daily consistency." },
                { label: "Convenience", desc: "No mixing, no preparation, no barriers to the ritual." },
                { label: "Traditional Relevance", desc: "Recognised in Ayurveda for compatibility and daily use." },
                { label: "Formulation Synergy", desc: "A natural companion to Shodhit Shilajit — not an afterthought." },
              ].map((item) => (
                <div key={item.label}>
                  <p style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 75,'wght' 700",
                    fontSize: "10px",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "#C8963E",
                    marginBottom: "4px",
                  }}>✓ {item.label}</p>
                  <p style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 100,'wght' 400",
                    fontSize: "12px",
                    lineHeight: 1.60,
                    color: "rgba(247,240,226,.50)",
                  }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Diabetes note */}
        <Reveal delay={0.14}>
          <div style={{
            padding: "20px 24px",
            background: "rgba(200,150,62,.06)",
            border: "1px solid rgba(200,150,62,.18)",
          }}>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 75,'wght' 700",
              fontSize: "9px",
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: "#C8963E",
              marginBottom: "8px",
            }}>⚠ A Note For Individuals Managing Sugar Intake</p>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 400",
              fontSize: "12px",
              color: "rgba(247,240,226,.55)",
              lineHeight: 1.65,
            }}>
              Shahjeet contains honey. Individuals monitoring blood sugar or living with diabetes should consult a qualified physician before use, review the nutritional information carefully, monitor their individual response, and incorporate Shahjeet within their broader dietary plan.
            </p>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontStyle: "italic",
              fontSize: "11px",
              color: "rgba(247,240,226,.32)",
              marginTop: "8px",
            }}>
              Thoughtfully Formulated. Transparently Communicated.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S10 — THE SHAHJEET JOURNEY ──────────────────────────────────────────────
const JOURNEY_PHASES = [
  {
    phase: "Week 1", label: "THE BEGINNING",
    headline: "Establishing The Ritual",
    points: ["Establishing your daily ritual", "Building consistency", "Creating awareness", "Making time for yourself"],
    note: "Before the body changes, the habit changes.",
  },
  {
    phase: "Week 2–4", label: "BUILDING MOMENTUM",
    headline: "Discipline Becoming Habit",
    points: ["Daily consistency", "Routine development", "Sustainable habits", "Lifestyle integration"],
    note: "What once required effort starts becoming habit.",
  },
  {
    phase: "Month 2–3", label: "MAKING IT YOUR OWN",
    headline: "The Goal Is Repeatability",
    points: ["Habit reinforcement", "Daily commitment", "Personal discipline", "Long-term thinking"],
    note: "The goal is not perfection. The goal is repeatability.",
  },
  {
    phase: "Long Term", label: "A RITUAL THAT TRAVELS",
    headline: "A Ritual For Life",
    points: ["Consistency", "Resilience", "Personal growth", "Sustainable performance"],
    note: "The Fast Ritual™ — Not Because Life Is Simple. Because Life Is Busy.",
  },
];

function JourneySection() {
  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Eyebrow text="The Journey" />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(24px,3.5vw,40px)",
              letterSpacing: "-.02em",
              color: "#1c1304",
              marginBottom: "8px",
            }}>
              Consistency Changes Everything.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.04}>
          <div style={{
            background: "rgba(28,19,4,.04)",
            border: "1px solid rgba(28,19,4,.08)",
            padding: "13px 20px",
            marginBottom: "40px",
            maxWidth: "680px",
            margin: "0 auto 40px",
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 400",
              fontSize: "11.5px",
              lineHeight: 1.65,
              color: "rgba(28,19,4,.48)",
            }}>
              Individual results vary. Consistency is what drives outcomes. Shahjeet is not intended to diagnose, treat, cure, or prevent any disease. Consult a qualified physician before use if you have a medical condition or take regular medication.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "18px" }}>
          {JOURNEY_PHASES.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.07}>
              <div style={{
                background: "#fff",
                border: "1px solid rgba(183,163,146,.26)",
                padding: "26px",
                height: "100%",
              }}>
                <div style={{
                  display: "inline-flex",
                  background: "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
                  padding: "4px 12px",
                  marginBottom: "14px",
                }}>
                  <span style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 75,'wght' 700",
                    fontSize: "8px",
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "#1c1304",
                  }}>{p.phase}</span>
                </div>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 700",
                  fontSize: "9px",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#C8963E",
                  marginBottom: "6px",
                }}>{p.label}</p>
                <h3 style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: "16px",
                  color: "#1c1304",
                  marginBottom: "12px",
                }}>{p.headline}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 14px" }}>
                  {p.points.map((pt) => (
                    <li key={pt} style={{
                      fontFamily: F,
                      fontSize: "12.5px",
                      color: "rgba(28,19,4,.58)",
                      lineHeight: 1.6,
                      paddingLeft: "13px",
                      position: "relative",
                      marginBottom: "3px",
                    }}>
                      <span style={{ position: "absolute", left: 0, color: "#C8963E" }}>·</span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 300",
                  fontStyle: "italic",
                  fontSize: "11.5px",
                  color: "rgba(28,19,4,.38)",
                  borderTop: "1px solid rgba(28,19,4,.08)",
                  paddingTop: "10px",
                  lineHeight: 1.55,
                }}>{p.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── S11 — WHY PEOPLE CHOOSE SHAHJEET ───────────────────────────────────────
function WhyChooseSection() {
  return (
    <section style={{ background: "#1c1304", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Eyebrow text="The Choice" light />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(24px,3.5vw,40px)",
              letterSpacing: "-.02em",
              color: "#f7f0e2",
              marginBottom: "8px",
              maxWidth: "680px",
              margin: "0 auto 8px",
            }}>
              Because Modern Life Doesn&apos;t Always Leave Time For A Perfect Routine.
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "16px", marginBottom: "36px" }}>
          {[
            { title: "Why Not Capsules?", body: "Capsules feel disconnected. Shahjeet feels intentional. The act of tearing, squeezing, and consuming creates a moment of awareness that a capsule simply cannot replicate." },
            { title: "Why Not Energy Products?", body: "We focus on consistency — not stimulation. Sustainability — not intensity. Daily rituals — not temporary solutions. Shahjeet is designed for the long game." },
            { title: "Why Not Just Honey?", body: "Shahjeet is a formulation philosophy. Each ingredient has a purpose — Shodhit Shilajit for its Rasayana heritage, Madhu for its Yogavahi role and palatability. Neither ingredient alone is the answer." },
            { title: "Portable By Design", body: "Pocket, gym bag, travel kit — Shahjeet fits into every environment where modern life takes you. The ritual doesn't need to stay home." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={{
                  background: "rgba(247,240,226,.04)",
                  border: "1px solid rgba(247,240,226,.08)",
                  padding: "24px",
                  height: "100%",
                }}
              >
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: "15px",
                  color: "#C8963E",
                  marginBottom: "10px",
                }}>{item.title}</p>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 400",
                  fontSize: "13px",
                  lineHeight: 1.68,
                  color: "rgba(247,240,226,.55)",
                }}>{item.body}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.14}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
              {["Portable", "Purposeful", "Consistent", "Ayurvedic", "Modern"].map((tag) => (
                <span key={tag} style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 75,'wght' 600",
                  fontSize: "9px",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "rgba(247,240,226,.45)",
                  border: "1px solid rgba(247,240,226,.12)",
                  padding: "5px 14px",
                }}>{tag}</span>
              ))}
            </div>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontStyle: "italic",
              fontSize: "clamp(14px,1.8vw,18px)",
              color: "rgba(247,240,226,.28)",
            }}>
              Some products ask you to change your life. Shahjeet simply asks you to stay consistent.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── S12 — REAL PEOPLE. REAL ROUTINES. ──────────────────────────────────────
const ROUTINE_PERSONAS = [
  { icon: "🏢", title: "For The Professional", desc: "Long days and packed schedules. Shahjeet fits into the moments between — a 3-second ritual that doesn't interrupt your flow.", quote: "Consistency is the ultimate competitive advantage. In careers, as in life." },
  { icon: "💼", title: "For The Entrepreneur", desc: "Building something meaningful demands consistency above everything else. One habit, repeated daily, becomes the foundation beneath every decision.", quote: "The strongest businesses are built by people who take care of themselves first." },
  { icon: "🏃", title: "For The Athlete", desc: "Training locations change. Competition schedules shift. Your commitment to your wellness routine shouldn't depend on where you are.", quote: "Champions aren't built in one session. They're built in thousands of consistent ones." },
  { icon: "✈️", title: "For The Traveller", desc: "Airports, road trips, hotels — your wellness routine shouldn't need to stay home. Shahjeet travels with you, wherever you go.", quote: "Discipline doesn't take a day off. Your ritual shouldn't either." },
  { icon: "🎯", title: "For Everyday Life", desc: "The goal is not perfection. The goal is consistency. One stick, every day, regardless of circumstances — that is the commitment Shahjeet was designed for.", quote: "The strongest rituals are not the most complicated. They are the ones we continue to practice." },
];

function PersonasSection() {
  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Eyebrow text="Community" />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(24px,3.5vw,40px)",
              letterSpacing: "-.02em",
              color: "#1c1304",
              marginBottom: "8px",
            }}>
              Real People. Real Routines.
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "18px" }}>
          {ROUTINE_PERSONAS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(183,163,146,.26)",
                  padding: "26px",
                  height: "100%",
                }}
              >
                <div style={{ fontSize: "22px", marginBottom: "10px" }}>{p.icon}</div>
                <h3 style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85,'wght' 700",
                  fontSize: "16px",
                  color: "#1c1304",
                  marginBottom: "8px",
                }}>{p.title}</h3>
                <p style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 100,'wght' 400",
                  fontSize: "13px",
                  lineHeight: 1.68,
                  color: "rgba(28,19,4,.58)",
                  marginBottom: "14px",
                }}>{p.desc}</p>
                <div style={{
                  borderLeft: "2px solid rgba(200,150,62,.35)",
                  paddingLeft: "12px",
                }}>
                  <p style={{
                    fontFamily: F,
                    fontVariationSettings: "'wdth' 100,'wght' 300",
                    fontStyle: "italic",
                    fontSize: "12px",
                    color: "rgba(28,19,4,.40)",
                    lineHeight: 1.60,
                  }}>
                    &ldquo;{p.quote}&rdquo;
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── S13 — FAQs ──────────────────────────────────────────────────────────────
const FAQS = [
  { q: "What is Shahjeet?", a: "Shahjeet is a doctor-formulated, honey-based Shilajit stick pack containing Shodhit Shilajit — purified through classical Triphala Shodhana. Each stick provides 600mg of Shilajit resin in a portable, ready-to-consume format. No preparation, no measuring, no cleanup." },
  { q: "How do I consume Shahjeet?", a: "Tear the stick at the notch. Squeeze the contents directly into your mouth, or into water. Consume as part of your daily routine. No spoon, no warm water, no preparation required — anywhere, anytime." },
  { q: "When is the best time to consume Shahjeet?", a: "Morning works well for most users — taken as a conscious daily ritual. You can also consume it before a demanding period, training session, or long workday. Consistency matters more than timing. Choose a time you can repeat every day." },
  { q: "Can Shahjeet be consumed daily?", a: "Yes. Like RockResin, Shahjeet is designed for daily use as a Rasayana — a classical Ayurvedic category for long-term daily vitality support. One stick per day, consistently, is the intended ritual." },
  { q: "Is Shahjeet suitable for both men and women?", a: "Yes. Energy, resilience, consistency, and long-term vitality are human goals — not gender-specific ones. Shahjeet is designed for any adult pursuing daily wellbeing." },
  { q: "Why honey specifically?", a: "Madhu (honey) is classified as Yogavahi in classical Ayurvedic texts — a carrier substance that enhances compatibility and palatability of what it accompanies. Honey also makes the experience consistently enjoyable, which directly supports daily adherence." },
  { q: "Does honey reduce the effectiveness of Shilajit?", a: "No. In classical Ayurvedic formulation, Madhu is used precisely because of its Yogavahi properties — it carries and supports the accompanying substance rather than diminishing it. The combination has a traditional rationale in Ayurvedic texts." },
  { q: "Can women consume Shahjeet?", a: "Yes. Shilajit is not restricted by gender in classical Ayurvedic texts. Shahjeet is not recommended during pregnancy or breastfeeding without medical advice from a qualified physician." },
  { q: "What are the benefits for women specifically?", a: "Classical Ayurveda describes Shilajit as a Rasayana supporting general wellbeing and vitality for all adults. Individual responses vary. We do not make specific benefit claims beyond general wellness support." },
  { q: "Does Shahjeet contain added sugar?", a: "Shahjeet contains natural honey — not refined or added sugar. Check the product label for full nutritional information before purchase if you are monitoring your dietary intake." },
  { q: "Can people with diabetes consume Shahjeet?", a: "Shahjeet contains honey, which has a natural sugar content. Individuals living with diabetes or managing blood sugar should consult a qualified physician before use, review the nutritional information, and incorporate Shahjeet within their broader dietary and medical plan." },
  { q: "Can Shahjeet replace RockResin?", a: "They are different rituals for different contexts. RockResin is the Deep Ritual — precise, immersive, ideal for a dedicated morning routine. Shahjeet is the Fast Ritual — portable, convenient, for environments where the Deep Ritual isn't practical. They share the same philosophy but serve different needs." },
  { q: "Is Shahjeet suitable for travel?", a: "Yes. It was specifically designed for this. Shahjeet is portable by design — fits in a pocket, gym bag, travel kit, or carry-on. No jars, no spoons, no warm water required. Your ritual doesn't need to stay home." },
  { q: "How is Shahjeet different from capsules?", a: "Capsules are a passive supplement experience. Shahjeet is a ready-to-consume ritual — Tear, Squeeze, Perform. The act itself creates intentionality. Shahjeet also uses Shodhit Shilajit in resin form rather than encapsulated powder, which preserves the traditional preparation." },
  { q: "How do I view the testing reports?", a: "Every Shahjeet box carries a QR code linking to batch-specific quality documentation. You can also visit our Transparency page to access available lab reports and manufacturing certifications before purchasing." },
];

function FAQItem({ faq, i }: { faq: (typeof FAQS)[0]; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(28,19,4,.10)" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "14px",
          padding: "17px 0",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{
          fontFamily: F,
          fontVariationSettings: "'wdth' 85,'wght' 600",
          fontSize: "clamp(13px,1.5vw,15px)",
          color: "#1c1304",
          lineHeight: 1.4,
        }}>
          <span style={{ color: "rgba(28,19,4,.22)", marginRight: "8px", fontVariationSettings: "'wdth' 75,'wght' 500", fontSize: "10px" }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            display: "inline-flex",
            width: "21px",
            height: "21px",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(200,150,62,.32)",
            color: "#C8963E",
            fontSize: "17px",
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 400",
              fontSize: "13.5px",
              lineHeight: 1.78,
              color: "rgba(28,19,4,.60)",
              paddingBottom: "16px",
              paddingLeft: "28px",
            }}>{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQSection() {
  return (
    <section style={{ background: "#f7f0e2", padding: "clamp(72px,10vw,112px) 24px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <Eyebrow text="Questions" />
            <h2 style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(24px,3.2vw,38px)",
              letterSpacing: "-.02em",
              color: "#1c1304",
            }}>
              Common Questions
            </h2>
          </div>
        </Reveal>
        <div>
          {FAQS.map((faq, i) => (
            <FAQItem key={i} faq={faq} i={i} />
          ))}
        </div>
        <Reveal delay={0.08}>
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <Link href="/education" style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 75,'wght' 600",
              fontSize: "12px",
              letterSpacing: ".10em",
              color: "rgba(28,19,4,.40)",
              textDecoration: "none",
            }}>
              Looking for deeper answers? → Explore the Performance Ayurveda Knowledge Hub
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── FINAL CTA ───────────────────────────────────────────────────────────────
function FinalCTASection() {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = async () => {
    await addItem({
      id: PRODUCT.id,
      productId: PRODUCT.id,
      name: PRODUCT.name,
      image: PRODUCT.image,
      price: PRODUCT.price,
      mrp: PRODUCT.mrp,
      quantity: qty,
      slug: PRODUCT.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section style={{ background: "#1c1304", padding: "clamp(72px,10vw,112px) 24px", textAlign: "center" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <Reveal>
          <Eyebrow text="Begin Your Fast Ritual" light />
          <h2 style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700",
            fontSize: "clamp(24px,3.8vw,46px)",
            letterSpacing: "-.025em",
            lineHeight: 1.1,
            color: "#f7f0e2",
            marginBottom: "6px",
          }}>
            Ready To Begin?
          </h2>
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85,'wght' 700",
            fontStyle: "italic",
            fontSize: "clamp(14px,1.8vw,18px)",
            background: "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "10px",
          }}>
            Shodhit Shilajit. Traditional Madhu. Modern Convenience.
          </p>
          <p style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 100,'wght' 300",
            fontStyle: "italic",
            fontSize: "14px",
            color: "rgba(247,240,226,.35)",
            marginBottom: "28px",
          }}>
            Designed for people who carry their ambition everywhere.
          </p>
        </Reveal>

        {/* 6 trust checkmarks */}
        <Reveal delay={0.06}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "9px", justifyContent: "center", marginBottom: "32px" }}>
            {[
              "Shodhit Shilajit",
              "Triphala Purified",
              "NABL Verified",
              "Doctor Formulated",
              "600mg Per Stick",
              "Portable Design",
            ].map((t) => (
              <span key={t} style={{
                fontFamily: F,
                fontVariationSettings: "'wdth' 75,'wght' 600",
                fontSize: "9px",
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "rgba(247,240,226,.52)",
                border: "1px solid rgba(247,240,226,.10)",
                padding: "4px 11px",
              }}>
                ✓ {t}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Price */}
        <Reveal delay={0.09}>
          <div style={{ marginBottom: "18px" }}>
            <span style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 800",
              fontSize: "36px",
              color: "#f7f0e2",
            }}>₹{PRODUCT.price}</span>
            <span style={{
              fontFamily: F,
              fontSize: "16px",
              color: "rgba(247,240,226,.26)",
              textDecoration: "line-through",
              marginLeft: "10px",
            }}>₹{PRODUCT.mrp}</span>
          </div>
        </Reveal>

        {/* Qty + CTA */}
        <Reveal delay={0.11}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", flexWrap: "wrap", marginBottom: "14px" }}>
            <div style={{ display: "flex", border: "1px solid rgba(247,240,226,.16)" }}>
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ width: "40px", height: "46px", background: "transparent", border: "none", color: "#f7f0e2", cursor: "pointer", fontSize: "19px" }}>−</button>
              <span style={{ width: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: "15px", color: "#f7f0e2" }}>{qty}</span>
              <button type="button" onClick={() => setQty(qty + 1)}
                style={{ width: "40px", height: "46px", background: "transparent", border: "none", color: "#f7f0e2", cursor: "pointer", fontSize: "19px" }}>+</button>
            </div>
            <motion.button
              type="button"
              onClick={() => void handleAdd()}
              whileTap={{ scale: 0.97 }}
              style={{
                background: added ? "rgba(200,150,62,.22)" : "linear-gradient(105deg,#A67B2F,#E4C079,#C8963E)",
                color: "#1c1304",
                fontFamily: F,
                fontVariationSettings: "'wdth' 85,'wght' 700",
                fontSize: "11px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                padding: "14px 30px",
                border: "none",
                cursor: "pointer",
              }}
            >
              {added ? "✓ Added to Ritual" : "Begin Your Fast Ritual"}
            </motion.button>
            <Link href="/lab-reports" style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 600",
              fontSize: "10px",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "rgba(247,240,226,.42)",
              textDecoration: "none",
              border: "1px solid rgba(247,240,226,.13)",
              padding: "14px 18px",
            }}>
              View Reports
            </Link>
          </div>
        </Reveal>

        {/* Brand statement */}
        <Reveal delay={0.14}>
          <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid rgba(247,240,226,.07)" }}>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontStyle: "italic",
              fontSize: "clamp(14px,1.8vw,18px)",
              color: "rgba(247,240,226,.28)",
              marginBottom: "6px",
            }}>
              Some rituals ask you to slow down. Some rituals help you keep moving.
            </p>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 85,'wght' 700",
              fontSize: "clamp(11px,1.2vw,13px)",
              letterSpacing: ".20em",
              textTransform: "uppercase",
              color: "rgba(247,240,226,.16)",
              marginBottom: "8px",
            }}>
              Tear · Squeeze · Perform
            </p>
            <p style={{
              fontFamily: F,
              fontVariationSettings: "'wdth' 100,'wght' 300",
              fontSize: "11px",
              color: "rgba(247,240,226,.18)",
              letterSpacing: ".04em",
            }}>
              Balance your foundations. Build your resilience. Become your strongest self.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function ShahjeetClient() {
  return (
    <div style={{ fontFamily: F, color: "#1c1304" }}>
      <HeroSection />
      <WhyCombinationSection />
      <FastRitualSection />
      <DifferenceSection />
      <IngredientsSection />
      <PillarsSection />
      <EvidenceSection />
      <NoComplexitySection />
      <HoneySection />
      <JourneySection />
      <WhyChooseSection />
      <PersonasSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}
