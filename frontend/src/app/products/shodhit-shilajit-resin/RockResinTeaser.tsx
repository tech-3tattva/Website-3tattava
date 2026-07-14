"use client";
import { media } from "@/lib/media";

// RockResin — Teaser / Unveiling phase.
// Ancient bound-manuscript (पोथी) pages tied with a string, Sanskrit (Devanagari)
// text, animated reveals. No product details are shown — this is the surprise.

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import BgVideo from "@/components/ui/BgVideo";
import type { CSSProperties } from "react";

const F = "var(--font-primary), system-ui, sans-serif";
const DEV = "var(--font-devanagari), 'Noto Serif Devanagari', serif";
const EASE = [0.16, 1, 0.3, 1] as const;

// Varied parchment tones — palette is mixed deliberately, not monotone.
const PAGES = [
  { dev: "रसायन", tr: "Rasāyana", line: "The science of becoming.", tone: "#efe4c8", rot: -7 },
  { dev: "शोधन", tr: "Shodhana", line: "Purified by the old ways.", tone: "#e6d6b2", rot: -2.4 },
  { dev: "सत्त्व", tr: "Sattva", line: "The essence, awaited.", tone: "#eaddbd", rot: 2.4 },
  { dev: "संस्कार", tr: "Saṃskāra", line: "A ritual, remembered.", tone: "#e0cda4", rot: 7 },
];

function AnimWords({ text, style, delay = 0, color }: { text: string; style?: CSSProperties; delay?: number; color?: string }) {
  const reduce = useReducedMotion();
  return (
    <span style={{ display: "inline-block", ...style, color }}>
      {text.split(" ").map((w, i) => (
        <span key={`${w}-${i}`} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={reduce ? { opacity: 0 } : { y: "115%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: delay + i * 0.08 }}
          >
            {w}{i < text.split(" ").length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function PothiPage({ p, i }: { p: (typeof PAGES)[number]; i: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, rotate: 0, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, rotate: p.rot, scale: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.6 + i * 0.14 }}
      whileHover={reduce ? undefined : { y: -16, rotate: 0, scale: 1.04, zIndex: 5, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}
      style={{
        position: "relative",
        width: "clamp(150px, 21vw, 210px)",
        height: "clamp(230px, 32vw, 300px)",
        margin: "0 -14px",
        background: `linear-gradient(160deg, ${p.tone} 0%, ${p.tone} 60%, rgba(120,90,40,0.18) 100%)`,
        border: "1px solid rgba(120,90,40,0.35)",
        borderRadius: "3px 3px 3px 3px",
        boxShadow: "0 18px 44px rgba(0,0,0,.4), inset 0 0 30px rgba(120,90,40,0.12)",
        padding: "44px 20px 22px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        cursor: "default",
        transformOrigin: "top center",
        willChange: "transform",
      }}
    >
      {/* binding hole */}
      <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 11, height: 11, borderRadius: "50%", background: "#2a1a0e", boxShadow: "inset 0 1px 2px rgba(0,0,0,.6), 0 0 0 1px rgba(120,90,40,0.4)" }} />
      {/* worn texture line */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(180deg, transparent 0 13px, rgba(120,90,40,0.05) 13px 14px)", pointerEvents: "none", borderRadius: 3 }} />
      <p style={{ fontFamily: DEV, fontSize: "clamp(30px,4vw,42px)", color: "#3a2412", lineHeight: 1.1, margin: "8px 0 6px" }}>{p.dev}</p>
      <p style={{ fontFamily: F, fontStyle: "italic", fontSize: 12, letterSpacing: ".14em", color: "#9a6a28", margin: "0 0 14px" }}>{p.tr}</p>
      <div style={{ width: 30, height: 1, background: "rgba(120,90,40,0.4)", margin: "0 0 14px" }} />
      <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 100,'wght' 400", fontSize: 12.5, lineHeight: 1.6, color: "rgba(58,36,18,0.72)" }}>{p.line}</p>
      <p style={{ marginTop: "auto", fontFamily: DEV, fontSize: 18, color: "rgba(120,90,40,0.55)" }}>ॐ</p>
    </motion.div>
  );
}

export default function RockResinTeaser() {
  const reduce = useReducedMotion();
  return (
    <div style={{ position: "relative", background: "radial-gradient(ellipse at 50% 0%, #2a1a0e 0%, #1a1208 55%, #120c06 100%)", overflow: "hidden", minHeight: "100vh" }}>
      {/* RockResin poster background */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={media("/hero/rockresin-poster.jpg")} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(18,12,6,0.82) 0%, rgba(18,12,6,0.5) 45%, rgba(18,12,6,0.9) 100%)" }} />
      </div>
      <BgVideo src={media("/videos/himalaya-hero.mp4")} opacity={0.22} />
      {/* ambient floating embers */}
      <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(205,135,42,.5) 1px, transparent 1px)", backgroundSize: "46px 46px", maskImage: "radial-gradient(ellipse at center, black, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 75%)" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "clamp(72px,12vh,128px) 24px clamp(72px,12vh,120px)", textAlign: "center" }}>

        {/* eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 700", fontSize: 10.5, letterSpacing: ".3em", textTransform: "uppercase", color: "#cd872a", marginBottom: 22 }}
        >
          Doctor-Led Performance Ayurveda™
        </motion.p>

        {/* Devanagari invocation */}
        <p style={{ fontFamily: DEV, fontSize: "clamp(18px,2.6vw,28px)", color: "rgba(247,240,226,0.5)", marginBottom: 18 }}>
          <AnimWords text="अथ रसायनम्" delay={0.2} />
        </p>

        {/* Title */}
        <h1 style={{ fontFamily: F, fontVariationSettings: "'wdth' 88,'wght' 800", fontSize: "clamp(44px,9vw,108px)", letterSpacing: "-0.03em", lineHeight: 0.98, margin: "0 0 8px" }}>
          <AnimWords text="RockResin" delay={0.35} color="#f7f0e2" />
          <span style={{ background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>®</span>
        </h1>
        <p style={{ fontFamily: F, fontStyle: "italic", fontVariationSettings: "'wdth' 90,'wght' 600", fontSize: "clamp(16px,2.4vw,24px)", color: "#E4C079", marginBottom: 26 }}>
          <AnimWords text="The Deep Ritual" delay={0.5} />
        </p>

        {/* Unveiling badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.6, ease: EASE }}
          style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(205,135,42,0.4)", background: "rgba(205,135,42,0.08)", padding: "9px 20px", borderRadius: 999, marginBottom: "clamp(48px,8vh,80px)" }}
        >
          <motion.span aria-hidden animate={reduce ? undefined : { opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} style={{ width: 7, height: 7, borderRadius: "50%", background: "#cd872a" }} />
          <span style={{ fontFamily: F, fontVariationSettings: "'wdth' 80,'wght' 700", fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: "#f7f0e2" }}>Unveiling Soon</span>
        </motion.div>

        {/* The bound manuscript */}
        <div style={{ position: "relative", marginBottom: "clamp(48px,8vh,72px)" }}>
          {/* String / cord tying the pages */}
          <svg viewBox="0 0 1000 70" preserveAspectRatio="none" aria-hidden style={{ position: "absolute", top: "clamp(-6px,1vh,8px)", left: 0, width: "100%", height: 70, zIndex: 4, overflow: "visible" }}>
            <defs>
              <linearGradient id="cord" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#A67B2F" />
                <stop offset="0.5" stopColor="#E4C079" />
                <stop offset="1" stopColor="#cd872a" />
              </linearGradient>
            </defs>
            <path d="M40 44 Q 200 20 360 40 T 680 40 T 980 46" fill="none" stroke="url(#cord)" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
            {[160, 400, 620, 860].map((x) => (
              <circle key={x} cx={x} cy={40} r="5" fill="#7a5024" stroke="#E4C079" strokeWidth="1.2" />
            ))}
            {/* tassel */}
            <g stroke="url(#cord)" strokeWidth="2" opacity="0.85">
              <line x1="980" y1="46" x2="980" y2="66" />
              <line x1="976" y1="50" x2="976" y2="64" />
              <line x1="984" y1="50" x2="984" y2="64" />
            </g>
          </svg>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start", gap: 0, perspective: 1200, paddingTop: 24 }}>
            {PAGES.map((p, i) => <PothiPage key={p.tr} p={p} i={i} />)}
          </div>
        </div>

        {/* Teaser buttons — revealed last */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.7, ease: EASE }}
          style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link href="/subscribe-waitlist" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#442a1b", background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)", padding: "15px 26px", textDecoration: "none" }}>
            Notify Me When It Unveils
            <motion.span aria-hidden animate={reduce ? undefined : { x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
          </Link>
          <Link href="/products/shahjeet-sticks" style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#f7f0e2", background: "transparent", border: "1px solid rgba(247,240,226,0.28)", padding: "15px 26px", textDecoration: "none" }}>
            Meanwhile, the Fast Ritual →
          </Link>
          <Link href="/knowledge-center" style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 600", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,240,226,0.6)", background: "transparent", border: "1px solid rgba(247,240,226,0.14)", padding: "15px 26px", textDecoration: "none" }}>
            Explore the Science →
          </Link>
        </motion.div>

        {/* footer mantra */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }}
          style={{ fontFamily: DEV, fontSize: "clamp(14px,1.8vw,18px)", color: "rgba(205,135,42,0.55)", marginTop: "clamp(40px,7vh,64px)", letterSpacing: ".08em" }}
        >
          समत्व · बल · उत्कर्ष
        </motion.p>
        <p style={{ fontFamily: F, fontStyle: "italic", fontSize: 12, color: "rgba(247,240,226,0.32)", marginTop: 8 }}>
          Balance · Build · Become
        </p>
      </div>
    </div>
  );
}
