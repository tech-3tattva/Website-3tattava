import React from "react";
import { LOGO_WORDMARK } from "../lib/assets";

/**
 * Brand wordmark — uses the artistic 3Tattava PNG but standardises sizing
 * and inversion for light/dark contexts. Adds a subtle hover micro-shine.
 */
export default function Logo({ dark = false, size = "md", className = "", testid = "site-logo-img" }) {
  const heights = { sm: "h-7 md:h-8", md: "h-10 md:h-12", lg: "h-12 md:h-14", xl: "h-14 md:h-16" };
  return (
    <span className={`relative inline-flex items-center group ${className}`}>
      <img
        src={LOGO_WORDMARK}
        alt="3Tattava"
        data-testid={testid}
        className={`${heights[size] || heights.md} w-auto transition-transform duration-700 group-hover:scale-[1.03]`}
        style={{ filter: dark ? "invert(1) brightness(1.05) drop-shadow(0 0 12px rgba(200,150,62,0.0))" : "none" }}
        loading="eager"
        decoding="async"
      />
      {/* gold shimmer pass on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: "linear-gradient(110deg, transparent 30%, rgba(200,150,62,0.45) 50%, transparent 70%)",
          mixBlendMode: dark ? "screen" : "soft-light",
          backgroundSize: "300% 100%",
          animation: "shimmer 1.8s linear",
        }}
      />
    </span>
  );
}
