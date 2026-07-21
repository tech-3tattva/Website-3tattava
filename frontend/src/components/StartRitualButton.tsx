"use client";

import { useWaitlist } from "@/context/WaitlistContext";

interface Props {
  product?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  "aria-label"?: string;
}

/**
 * Opens the global waitlist modal. Drop-in replacement for the old
 * "Start Your Ritual" / shop links while products are pre-launch.
 */
export default function StartRitualButton({ product, className, style, children, ...rest }: Props) {
  const { open } = useWaitlist();
  return (
    <button type="button" className={className} style={style} onClick={() => open(product)} aria-label={rest["aria-label"]}>
      {children}
    </button>
  );
}
