"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { usePurchaseStatus } from "@/hooks/usePurchaseStatus";

const F = "var(--font-primary), system-ui, sans-serif";

// Renders `children` only for buyers; everyone else (incl. while checking) sees
// the teaser fallback. Keeps the feature exciting + locked behind a purchase.
export default function PurchaseGate({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const status = usePurchaseStatus();
  return <>{status === "purchased" ? children : fallback}</>;
}

// Reusable "locked / unlock-after-purchase" teaser.
export function LockedTeaser({
  eyebrow = "Members Only",
  title,
  body,
  ctaLabel = "Shop the Ritual",
  ctaHref = "/products",
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  dark?: boolean;
}) {
  const reduce = useReducedMotion();
  const ink = dark ? "#f7f0e2" : "#442a1b";
  const sub = dark ? "rgba(247,240,226,.7)" : "#6f5a48";
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        textAlign: "center",
        padding: "clamp(36px,6vh,64px) 28px",
        border: "1px dashed rgba(205,135,42,0.45)",
        borderRadius: 6,
        background: dark ? "rgba(205,135,42,0.06)" : "rgba(205,135,42,0.045)",
      }}
    >
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: dark ? "rgba(247,240,226,0.08)" : "#442a1b", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cd872a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 700", fontSize: 10.5, letterSpacing: ".24em", textTransform: "uppercase", color: "#cd872a", margin: "0 0 12px" }}>
        🔒 {eyebrow}
      </p>
      <h3 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(20px,3vw,30px)", color: ink, margin: "0 0 12px", lineHeight: 1.2 }}>{title}</h3>
      <p style={{ fontFamily: F, fontSize: 14.5, lineHeight: 1.65, color: sub, maxWidth: 460, margin: "0 auto 24px" }}>{body}</p>
      <Link href={ctaHref} style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#442a1b", background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)", padding: "14px 26px", textDecoration: "none" }}>
        {ctaLabel}
        <motion.span aria-hidden animate={reduce ? undefined : { x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
      </Link>
    </motion.div>
  );
}
