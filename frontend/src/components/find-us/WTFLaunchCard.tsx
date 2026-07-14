"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;
const F = "var(--font-primary), system-ui, sans-serif";

function Words({ text, delay = 0, color }: { text: string; delay?: number; color?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span style={{ display: "inline-block", color }}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
          <motion.span
            style={{ display: "inline-block", willChange: "transform" }}
            initial={reduce ? { opacity: 0 } : { y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: delay + i * 0.05 }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

const TICKER = "NOW LIVE AT WTF GYMS · 28+ CENTERS · DELHI NCR · TEAR · SQUEEZE · PERFORM · PERFORMANCE AYURVEDA™ · ";

/**
 * WTF Gym launch announcement — a moving text card that plays on mount (it sits
 * above the fold). Optional background image (`/find-us/wtf-launch-bg.jpg`) falls
 * back to a brand gradient if absent.
 */
export default function WTFLaunchCard() {
  const reduce = useReducedMotion();
  const [bgOk, setBgOk] = useState(true);

  return (
    <section style={{ position: "relative", overflow: "hidden", background: "#442a1b" }}>
      {/* Background image (graceful) */}
      {bgOk && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/find-us/wtf-launch-bg.jpg"
          alt=""
          aria-hidden
          onError={() => setBgOk(false)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
        />
      )}
      {/* Scrim for text contrast */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#442a1b 0%,rgba(68,42,27,.72) 48%,rgba(68,42,27,.25) 100%)" }} />
      {/* Ambient embers */}
      <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.4, backgroundImage: "radial-gradient(circle, rgba(205,135,42,.5) 1px, transparent 1px)", backgroundSize: "42px 42px", maskImage: "radial-gradient(ellipse at 30% 50%, black, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse at 30% 50%, black, transparent 70%)" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "clamp(40px,7vh,76px) 24px" }}>
        {/* NOW LIVE badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(205,135,42,.45)", background: "rgba(205,135,42,.12)", padding: "6px 14px", borderRadius: 999, marginBottom: 18 }}
        >
          <motion.span
            aria-hidden
            animate={reduce ? undefined : { opacity: [1, 0.25, 1], scale: [1, 0.85, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 8, height: 8, borderRadius: "50%", background: "#cd872a" }}
          />
          <span style={{ fontFamily: F, fontVariationSettings: "'wdth' 80,'wght' 700", fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: "#f7f0e2" }}>
            Now Live
          </span>
        </motion.div>

        {/* Headline */}
        <h2 style={{ fontFamily: F, fontVariationSettings: "'wdth' 88,'wght' 800", fontSize: "clamp(30px,5.2vw,60px)", letterSpacing: "-0.02em", lineHeight: 1.02, color: "#f7f0e2", margin: "0 0 6px", maxWidth: 900 }}>
          <Words text="Experience 3TATTAVA at" />{" "}
          <Words text="28+ WTF Gyms" delay={0.3} color="#cd872a" />
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.7 }}
          style={{ fontFamily: F, fontVariationSettings: "'wdth' 100,'wght' 400", fontSize: "clamp(14px,1.8vw,18px)", lineHeight: 1.6, color: "rgba(247,240,226,.8)", maxWidth: 620, margin: "10px 0 24px" }}
        >
          Performance Ayurveda™ is now in your gym. Try the Fast Ritual, meet certified
          trainers, and pick up Shahjeet across Delhi NCR — 28 centres · 136 trainers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.85, ease: EASE }}
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          <Link href="#find-nearest" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#442a1b", background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)", padding: "14px 24px", textDecoration: "none" }}>
            Find Your Nearest Center →
          </Link>
          <a href="https://www.wtfgyms.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 600", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,240,226,.7)", border: "1px solid rgba(247,240,226,.24)", padding: "14px 24px", textDecoration: "none" }}>
            About WTF Gyms ↗
          </a>
        </motion.div>
      </div>

      {/* Moving marquee ribbon */}
      <div style={{ position: "relative", zIndex: 1, overflow: "hidden", borderTop: "1px solid rgba(205,135,42,.28)", background: "rgba(0,0,0,.22)" }}>
        <motion.div
          style={{ display: "flex", whiteSpace: "nowrap", willChange: "transform" }}
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1].map((k) => (
            <span key={k} style={{ fontFamily: F, fontVariationSettings: "'wdth' 78,'wght' 600", fontSize: 12, letterSpacing: ".18em", color: "rgba(205,135,42,.85)", padding: "12px 0" }}>
              {TICKER.repeat(3)}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
