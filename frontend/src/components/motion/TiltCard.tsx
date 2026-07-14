"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";

// Reusable 3D mouse-tilt card with a tracking amber glow.
// Wrap any card markup; it keeps the child's own background/border/radius.
// Falls back to a plain container under prefers-reduced-motion.
export default function TiltCard({
  children,
  className,
  style,
  max = 9,
  radius = 14,
  glow = true,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  max?: number;
  radius?: number;
  glow?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 18 });
  const gx = useTransform(px, [0, 1], [0, 100]);
  const gy = useTransform(py, [0, 1], [0, 100]);
  const glowBg = useMotionTemplate`radial-gradient(240px circle at ${gx}% ${gy}%, rgba(205,135,42,0.20), transparent 62%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      whileHover={{ scale: 1.015 }}
      transition={{ scale: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
      style={{
        ...style,
        position: "relative",
        borderRadius: radius,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 900,
        willChange: "transform",
      }}
    >
      {children}
      {glow && (
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius,
            pointerEvents: "none",
            background: glowBg,
            zIndex: 3,
          }}
        />
      )}
    </motion.div>
  );
}
