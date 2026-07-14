"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const F = "var(--font-primary), system-ui, sans-serif";
const VP = { once: true, margin: "-15% 0px -15% 0px" } as const;

/**
 * Brand logo reveal: the trinity monogram assembles (scale + settle + gold glow),
 * the wordmark mask-reveals beneath, then the tagline fades in.
 * `dark` = cream marks on dark surfaces; `light` = espresso marks on light surfaces.
 */
export default function LogoReveal({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const reduce = useReducedMotion();
  const mono = variant === "dark" ? "/logos/monogram-cream.png" : "/logos/monogram-espresso.png";
  const word = variant === "dark" ? "/logos/wordmark-cream.png" : "/logos/wordmark-espresso.png";
  const tagColor = variant === "dark" ? "rgba(247,240,226,.6)" : "#6f5a48";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "8px 0 28px" }}>
      {/* Monogram + glow */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: reduce ? 0.4 : [0, 0.85, 0.5], scale: 1 }}
          viewport={VP}
          transition={{ duration: 1.6, ease: EASE }}
          style={{
            position: "absolute",
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(205,135,42,.55) 0%, transparent 65%)",
            filter: "blur(8px)",
            pointerEvents: "none",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={mono}
          alt="3tattava"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.55, rotate: -10, y: 12 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
          viewport={VP}
          transition={reduce ? { duration: 0.4 } : { type: "spring", stiffness: 120, damping: 14, delay: 0.05 }}
          style={{ position: "relative", height: "clamp(84px,12vw,130px)", width: "auto", display: "block" }}
        />
      </div>

      {/* Wordmark mask-reveal */}
      <span style={{ display: "block", overflow: "hidden", lineHeight: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={word}
          alt="3tattava"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: "110%" }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.55 }}
          style={{ height: "clamp(24px,3.6vw,40px)", width: "auto", display: "block" }}
        />
      </span>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VP}
        transition={{ duration: 0.6, delay: reduce ? 0 : 0.95 }}
        style={{
          fontFamily: F,
          fontStyle: "italic",
          fontSize: "clamp(12px,1.5vw,15px)",
          letterSpacing: ".14em",
          color: tagColor,
          margin: 0,
        }}
      >
        Balance · Build · Become
      </motion.p>
    </div>
  );
}
