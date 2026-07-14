"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";

const F = "var(--font-primary), system-ui, sans-serif";

/* ─── Colors ─── */
const GOLD = "#cd872a";
const CREAM = "#f7f0e2";
const TAUPE = "#b7a392";

/* ─── Types ─── */
interface RitualStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

/* ─── Data ─── */
const shahjeetSteps: RitualStep[] = [
  {
    number: "01",
    title: "TEAR",
    subtitle: "Anytime. Anywhere.",
    description: "Tear at the Pre-Cut Notch.",
  },
  {
    number: "02",
    title: "SQUEEZE",
    subtitle: "Anytime. Anywhere.",
    description: "Squeeze Directly onto the Tongue.",
  },
  {
    number: "03",
    title: "PERFORM",
    subtitle: "More Ease. More Drive.",
    description: "Keep Going Strong in Everyday Life.",
  },
];

const rockResinSteps: RitualStep[] = [
  {
    number: "01",
    title: "DIP",
    subtitle: "Unlock the Purity Within",
    description: "Use the folded spoon end to open the foil seal.",
  },
  {
    number: "02",
    title: "HOOK",
    subtitle: "Hands-Free. Mess-Free.",
    description: "The spoon rests on the glass rim — hands-free.",
  },
  {
    number: "03",
    title: "SWIRL",
    subtitle: "A Gentle Swirl. A Golden Ritual.",
    description: "One turn of the wrist and RockResin blends seamlessly.",
  },
];

type ProductKey = "shahjeet" | "rockresin";

/* ─── Responsive CSS injected once ─── */
const RITUAL_CSS = `
.ritual-steps-row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: stretch;
  gap: 0;
  width: 100%;
}
.ritual-connector {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  gap: 6px;
  padding: 0 4px;
  flex-shrink: 0;
}
@media (max-width: 768px) {
  .ritual-steps-row {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  .ritual-connector {
    transform: rotate(90deg);
    padding: 4px 0;
  }
}
`;

/* ─── Glass step card ─── */
function StepCard({
  step,
  index,
  reduce,
}: {
  step: RitualStep;
  index: number;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 18,
        delay: index * 0.2,
      }}
      whileHover={{
        y: -8,
        boxShadow: "0 16px 44px rgba(205,135,42,0.28)",
        transition: { duration: 0.3 },
      }}
      style={{
        flex: "0 0 auto",
        width: "clamp(210px, 23vw, 272px)",
        aspectRatio: "1 / 1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 clamp(24px, 3vw, 36px)",
        background: "rgba(247,240,226,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(205,135,42,0.28)",
        borderRadius: "50%",
        boxShadow: "inset 0 0 0 6px rgba(247,240,226,0.05)",
        cursor: "default",
      }}
    >
      {/* Title */}
      <h3
        style={{
          fontFamily: F,
          fontSize: "clamp(18px, 2.2vw, 23px)",
          fontWeight: 700,
          color: CREAM,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {step.title}
      </h3>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: F,
          fontSize: 13.5,
          fontWeight: 600,
          fontStyle: "italic",
          color: GOLD,
          letterSpacing: "0.04em",
          marginBottom: 12,
        }}
      >
        {step.subtitle}
      </p>

      {/* Description */}
      <p
        style={{
          fontFamily: F,
          fontSize: "clamp(12.5px, 1.4vw, 14px)",
          lineHeight: 1.55,
          color: CREAM,
          opacity: 0.82,
          margin: 0,
          maxWidth: "94%",
        }}
      >
        {step.description}
      </p>
    </motion.div>
  );
}

/* ─── Animated connecting dots between steps ─── */
function ConnectingDots({
  index,
  reduce,
}: {
  index: number;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      className="ritual-connector"
      initial={reduce ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={{ opacity: 0, scaleX: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.2 + 0.3,
        ease: "easeOut",
      }}
      style={{ transformOrigin: "left center" }}
    >
      {[0, 1, 2, 3, 4].map((dot) => (
        <motion.span
          key={dot}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.5,
            delay: dot * 0.15 + index * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: GOLD,
            display: "block",
            flexShrink: 0,
          }}
        />
      ))}
    </motion.div>
  );
}

export default function RitualTrinitySection({ lockProduct, videoSrc }: { lockProduct?: ProductKey; videoSrc?: string } = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [active, setActive] = useState<ProductKey>(lockProduct ?? "shahjeet");

  const steps = active === "shahjeet" ? shahjeetSteps : rockResinSteps;

  const reveal = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: inView
      ? { opacity: 1, y: 0 }
      : reduce
        ? { opacity: 0 }
        : { opacity: 0, y: 24 },
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  });

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)",
      }}
    >
      {/* ── Scoped responsive CSS ── */}
      <style dangerouslySetInnerHTML={{ __html: RITUAL_CSS }} />

      {/* ── Video background ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        src={videoSrc ?? "/videos/morning-ritual.mp4"}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Dark overlay ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(68,42,27,0.75)",
          zIndex: 1,
        }}
      />

      {/* ── Content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1100,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Heading */}
        <motion.h2
          {...reveal(0)}
          style={{
            fontFamily: F,
            fontSize: "clamp(28px, 4vw, 46px)",
            fontWeight: 700,
            color: CREAM,
            lineHeight: 1.15,
            marginBottom: 12,
          }}
        >
          The 10-Second Ritual
        </motion.h2>

        {/* Tagline */}
        <motion.p
          {...reveal(0.08)}
          style={{
            fontFamily: F,
            fontSize: "clamp(14px, 1.5vw, 17px)",
            color: GOLD,
            fontStyle: "italic",
            letterSpacing: "0.04em",
            marginBottom: 32,
            opacity: 0.9,
          }}
        >
          Three steps. Every morning. Timeless vitality.
        </motion.p>

        {/* Toggle pill */}
        {!lockProduct && (
        <motion.div
          {...reveal(0.15)}
          style={{
            display: "inline-flex",
            position: "relative",
            background: "rgba(247,240,226,0.1)",
            borderRadius: 40,
            padding: 4,
            marginBottom: "clamp(40px, 5vw, 64px)",
            border: "1px solid rgba(205,135,42,0.25)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {(
            [
              { key: "shahjeet", label: "Shahjeet — Swirl Ritual™" },
              { key: "rockresin", label: "RockResin" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              style={{
                position: "relative",
                fontFamily: F,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.03em",
                padding: "10px 24px",
                border: "none",
                borderRadius: 36,
                cursor: "pointer",
                background: "transparent",
                color: active === item.key ? CREAM : TAUPE,
                zIndex: 1,
                transition: "color 0.3s",
              }}
            >
              {active === item.key && (
                <motion.div
                  layoutId="ritual-pill-slider"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: GOLD,
                    borderRadius: 36,
                    zIndex: -1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {item.label}
            </button>
          ))}
        </motion.div>
        )}

        {/* Steps with connecting dots */}
        <div style={{ minHeight: 280 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="ritual-steps-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {steps.map((step, i) => (
                <div
                  key={`${active}-${step.number}`}
                  style={{ display: "contents" }}
                >
                  <StepCard step={step} index={i} reduce={reduce} />
                  {i < steps.length - 1 && (
                    <ConnectingDots index={i} reduce={reduce} />
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
