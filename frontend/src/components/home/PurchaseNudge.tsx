"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const F = "var(--font-primary), system-ui, sans-serif";

interface NudgeStep {
  eyebrow: string;
  headline: string;
  body: string;
  cta: string;
  href: string;
  image?: string;
}

const STEPS: NudgeStep[] = [
  {
    eyebrow: "Start Here",
    headline: "Begin with Shahjeet — performance in your pocket.",
    body: "A 10-second daily ritual. ₹1,399 · 30 sticks. One purchase unlocks everything.",
    cta: "Shop Shahjeet",
    href: "/products/shahjeet-sticks",
    image: "https://media.3tattava.com/products/shahjeet-box.png",
  },
  {
    eyebrow: "Unlock Your Assessment",
    headline: "Your 6-domain Performance Assessment awaits.",
    body: "Dr. Kashish reviews every submission personally. Buy once — unlock your personalised report within 24 hours.",
    cta: "Shop & Unlock",
    href: "/products/shahjeet-sticks",
  },
  {
    eyebrow: "Expert Guidance",
    headline: "Dr. Falguni's diet plan — included with purchase.",
    body: "BAMS-qualified nutrition guidance tailored to your Prakriti. Starter diet guide + personal consultation unlock after your first order.",
    cta: "Shop to Access",
    href: "/products/shahjeet-sticks",
    image: "/team/dr-falguni-chauhan.jpg",
  },
];

/* ---------- confetti / celebration CSS (injected once) ---------- */
const CONFETTI_COLORS = ["#cd872a", "#E4C079", "#A67B2F", "#f7f0e2", "#ff6b6b", "#48dbfb"];

const styleId = "purchase-nudge-celebration-css";
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(styleId)) return;
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
@keyframes pn-popper {
  0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
  30%  { transform: scale(1.4) rotate(8deg); opacity: 1; }
  60%  { transform: scale(1) rotate(-3deg); opacity: 1; }
  100% { transform: scale(0.6) rotate(0deg); opacity: 0; }
}
@keyframes pn-confetti {
  0%   { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
  100% { opacity: 0; }
}
.pn-popper {
  position: absolute;
  font-size: 28px;
  pointer-events: none;
  animation: pn-popper 1.2s ease-out forwards;
  z-index: 10;
}
.pn-confetti-bit {
  position: absolute;
  width: 7px;
  height: 7px;
  pointer-events: none;
  animation: pn-confetti 1.4s ease-out forwards;
  z-index: 9;
}
`;
  document.head.appendChild(style);
}

/* ---------- celebration spawner ---------- */
function spawnCelebration(container: HTMLElement) {
  // party poppers at four corners
  const popperPositions = [
    { top: -8, left: -8 },
    { top: -8, right: -8 },
    { bottom: -8, left: -8 },
    { bottom: -8, right: -8 },
  ];
  popperPositions.forEach((pos) => {
    const el = document.createElement("span");
    el.className = "pn-popper";
    el.textContent = "🎉";
    const p = pos as Record<string, number | undefined>;
    Object.assign(el.style, {
      top: p.top != null ? `${p.top}px` : "auto",
      bottom: p.bottom != null ? `${p.bottom}px` : "auto",
      left: p.left != null ? `${p.left}px` : "auto",
      right: p.right != null ? `${p.right}px` : "auto",
    });
    container.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  });

  // confetti burst — 24 pieces
  const cx = container.offsetWidth / 2;
  const cy = container.offsetHeight / 2;
  for (let i = 0; i < 24; i++) {
    const bit = document.createElement("span");
    bit.className = "pn-confetti-bit";
    const angle = (i / 24) * 360;
    const dist = 50 + Math.random() * 80;
    const tx = Math.cos((angle * Math.PI) / 180) * dist;
    const ty = Math.sin((angle * Math.PI) / 180) * dist - 20 - Math.random() * 40;
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const shape = Math.random() > 0.5 ? "50%" : "2px";
    const rotation = Math.floor(Math.random() * 720) - 360;
    Object.assign(bit.style, {
      left: `${cx}px`,
      top: `${cy}px`,
      background: color,
      borderRadius: shape,
      animationName: "pn-confetti",
      animationDuration: `${1 + Math.random() * 0.6}s`,
      animationTimingFunction: "cubic-bezier(.2,1,.3,1)",
      animationFillMode: "forwards",
      // Encode the end-state into a custom transform via animationName override:
      // We use a unique keyframe per bit
    });
    // Inline the endpoint via style.setProperty for transform
    bit.animate(
      [
        { transform: "translate(0,0) rotate(0deg) scale(1)", opacity: 1 },
        { transform: `translate(${tx}px,${ty}px) rotate(${rotation}deg) scale(0.3)`, opacity: 0 },
      ],
      { duration: 1000 + Math.random() * 600, easing: "cubic-bezier(.2,1,.3,1)", fill: "forwards" },
    );
    container.appendChild(bit);
    setTimeout(() => bit.remove(), 1800);
  }
}

/* ---------- component ---------- */
export default function PurchaseNudge() {
  const pathname = usePathname();
  const [step, setStep] = useState(-1);
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);

  const storageKey = `3t_nudge_${pathname}`;

  // inject CSS once
  useEffect(() => { ensureStyles(); }, []);

  const advance = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setStep((prev) => {
        const next = prev + 1;
        if (next >= STEPS.length) {
          try { sessionStorage.setItem(storageKey, "done"); } catch { /* */ }
          return next;
        }
        return next;
      });
      setVisible(true);
    }, 400);
  }, [storageKey]);

  const dismiss = () => advance();

  // reset state when pathname changes (layout persists across navigations)
  useEffect(() => {
    setStep(-1);
    setVisible(false);
    setContainerRef(null);

    try {
      if (sessionStorage.getItem(storageKey) === "done") return;
    } catch { /* private browsing */ }

    const timer = window.setTimeout(() => {
      setStep(0);
      setVisible(true);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  // auto-advance every 10s
  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return;
    const t = window.setTimeout(() => advance(), 10000);
    return () => window.clearTimeout(t);
  }, [step, advance]);

  // fire celebration when step card mounts
  useEffect(() => {
    if (step < 0 || !visible || !containerRef || reduce) return;
    const t = setTimeout(() => spawnCelebration(containerRef), 250);
    return () => clearTimeout(t);
  }, [step, visible, containerRef, reduce]);

  // suppress the promo nudge during the purchase flow
  if (pathname?.startsWith("/checkout") || pathname?.startsWith("/order-confirmation")) return null;
  if (step < 0 || step >= STEPS.length) return null;
  const s = STEPS[step];

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          key={`${pathname}-${step}`}
          ref={setContainerRef}
          aria-label="Getting started"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, x: -6 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed", left: 20, bottom: 20, zIndex: 1050,
            width: 310, maxWidth: "calc(100vw - 40px)",
            background: "#442a1b", boxShadow: "0 18px 44px rgba(68,42,27,.42)",
            borderRadius: 4, overflow: "visible",
          }}
        >
          <div style={{ height: 3, background: "linear-gradient(90deg,#A67B2F,#E4C079,#cd872a)", borderRadius: "4px 4px 0 0" }} />
          {/* Step indicator */}
          <div style={{ display: "flex", gap: 4, padding: "10px 18px 0", justifyContent: "center" }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{ width: 24, height: 3, borderRadius: 2, background: i <= step ? "#cd872a" : "rgba(247,240,226,.18)", transition: "background .3s" }} />
            ))}
          </div>
          <button
            type="button" onClick={dismiss} aria-label="Dismiss"
            style={{ position: "absolute", top: 9, right: 11, background: "none", border: "none", color: "rgba(247,240,226,.55)", fontSize: 18, lineHeight: 1, cursor: "pointer", padding: 4 }}
          >×</button>
          <div style={{ padding: "12px 18px 16px", display: "flex", gap: 12 }}>
            {s.image && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={s.image} alt="" width={48} height={48} style={{ objectFit: "cover", flexShrink: 0, alignSelf: "center", borderRadius: s.image.includes("team") ? "50%" : 4 }} />
            )}
            <div>
              <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 700", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "#cd872a", margin: "0 0 4px" }}>
                {s.eyebrow}
              </p>
              <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 13.5, lineHeight: 1.35, color: "#f7f0e2", margin: "0 0 4px" }}>
                {s.headline}
              </p>
              <p style={{ fontFamily: F, fontSize: 11, lineHeight: 1.5, color: "rgba(247,240,226,.6)", margin: "0 0 12px" }}>
                {s.body}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Link href={s.href} onClick={dismiss}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#442a1b", background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)", padding: "9px 14px", textDecoration: "none" }}
                >
                  {s.cta}
                  <motion.span aria-hidden animate={reduce ? undefined : { x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} style={{ fontSize: 13 }}>→</motion.span>
                </Link>
                <button type="button" onClick={dismiss} style={{ fontFamily: F, fontSize: 10.5, letterSpacing: ".06em", color: "rgba(247,240,226,.5)", background: "none", border: "none", cursor: "pointer" }}>
                  {step < STEPS.length - 1 ? "Next" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
