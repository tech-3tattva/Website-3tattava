"use client";

import { useRef, type RefObject } from "react";
import Image from "@/components/ui/SafeImage";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

export type ParallaxMediaProps = {
  src: string;
  alt: string;
  /** When set, scroll progress is measured for this element (e.g. full-width section). */
  scrollTargetRef?: RefObject<HTMLElement | null>;
  containerClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Scale at start, middle, end of scroll through target (subtle zoom). */
  scaleRange?: [number, number, number];
  /** Vertical parallax in px at start → end. */
  yRange?: [number, number];
};

export function ParallaxMedia({
  src,
  alt,
  scrollTargetRef,
  containerClassName = "",
  sizes = "100vw",
  priority = false,
  scaleRange = [1.06, 1, 1.05],
  yRange = [28, -28],
}: ParallaxMediaProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const target = scrollTargetRef ?? localRef;
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });

  const scaleRaw = useTransform(scrollYProgress, [0, 0.45, 1], scaleRange);
  const yRaw = useTransform(scrollYProgress, [0, 1], yRange);
  const scale = useSpring(scaleRaw, { stiffness: 100, damping: 34, mass: 0.35 });
  const y = useSpring(yRaw, { stiffness: 100, damping: 34, mass: 0.35 });

  const base = (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes={sizes}
      priority={priority}
    />
  );

  if (reduceMotion) {
    return (
      <div
        className={`relative h-full min-h-[inherit] w-full overflow-hidden ${containerClassName}`}
      >
        <div className="absolute inset-0 min-h-[240px]">{base}</div>
      </div>
    );
  }

  return (
    <div
      ref={scrollTargetRef ? undefined : localRef}
      className={`relative h-full min-h-[inherit] w-full overflow-hidden ${containerClassName}`}
    >
      <motion.div
        className="absolute inset-[-12%] will-change-transform"
        style={{ scale, y }}
      >
        {base}
      </motion.div>
    </div>
  );
}

/** Alias for consumers that prefer the plan naming. */
export const ScrollParallax = ParallaxMedia;
