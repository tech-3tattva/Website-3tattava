"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronRight, ChevronUp } from "lucide-react";

const GOLD = "#cd872a";
const GOLD_DARK = "#a67b2f";
const ESPRESSO = "#5b3c23";
const F = "var(--font-primary), system-ui, sans-serif";

// Premium "swipe to the other product" affordance shown on a hero's right edge.
// Drag it in the hinted direction past a threshold — or click/tap — to navigate.
export default function ProductSwipeLink({
  to,
  productName,
  image,
  direction = "right",
}: {
  to: string;
  productName: string;
  image: string;
  direction?: "right" | "up";
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const horizontal = direction === "right";
  const go = () => router.push(to);
  const onDragEnd = (_e: unknown, info: PanInfo) => {
    const moved = horizontal ? info.offset.x : -info.offset.y;
    if (moved > 56) go();
  };
  const Chevron = horizontal ? ChevronRight : ChevronUp;

  return (
    <div
      className="ps-wrap"
      style={{
        position: "absolute",
        right: "clamp(2px,1vw,22px)",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 4,
      }}
    >
      <motion.button
        type="button"
        onClick={go}
        onTap={go}
        aria-label={`Explore ${productName}`}
        drag={horizontal ? "x" : "y"}
        dragConstraints={{ left: 0, right: horizontal ? 96 : 0, top: horizontal ? 0 : -96, bottom: 0 }}
        dragElastic={0.4}
        dragSnapToOrigin
        onDragEnd={onDragEnd}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, x: horizontal ? 16 : 0, y: horizontal ? 0 : 16 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: "flex",
          flexDirection: horizontal ? "row" : "column",
          alignItems: "center",
          gap: 11,
          padding: horizontal ? "9px 16px 9px 9px" : "14px 10px",
          border: "none",
          borderRadius: 999,
          cursor: "grab",
          background: "rgba(247,240,226,0.74)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 12px 34px rgba(68,42,27,.18), inset 0 0 0 1px rgba(205,135,42,.4)",
          touchAction: "none",
          fontFamily: F,
        }}
      >
        {/* thumbnail with a slowly-rotating mandala ring */}
        <span style={{ position: "relative", width: 54, height: 54, flexShrink: 0, display: "grid", placeItems: "center" }}>
          <motion.span
            aria-hidden
            animate={reduce ? undefined : { rotate: 360 }}
            transition={reduce ? undefined : { duration: 18, ease: "linear", repeat: Infinity }}
            style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1.5px dashed rgba(205,135,42,.5)` }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" aria-hidden style={{ width: 42, height: 42, objectFit: "contain" }} />
        </span>

        <span style={{ display: "flex", flexDirection: "column", alignItems: horizontal ? "flex-start" : "center", lineHeight: 1.18 }}>
          <span style={{ fontVariationSettings: "'wght' 600", fontSize: 9.5, letterSpacing: ".16em", textTransform: "uppercase", color: GOLD_DARK }}>
            Swipe to explore
          </span>
          <span style={{ fontVariationSettings: "'wght' 800", fontSize: 14, letterSpacing: "-0.01em", color: ESPRESSO, whiteSpace: "nowrap" }}>
            {productName}
          </span>
        </span>

        {/* animated directional chevrons */}
        <motion.span
          aria-hidden
          animate={reduce ? undefined : horizontal ? { x: [0, 6, 0] } : { y: [0, -6, 0] }}
          transition={reduce ? undefined : { duration: 1.3, ease: "easeInOut", repeat: Infinity }}
          style={{ display: "flex", flexDirection: horizontal ? "row" : "column", color: GOLD, marginLeft: horizontal ? 1 : 0 }}
        >
          <Chevron size={17} strokeWidth={2.6} style={horizontal ? { marginRight: -9 } : { marginBottom: -9 }} />
          <Chevron size={17} strokeWidth={2.6} />
        </motion.span>
      </motion.button>
    </div>
  );
}
