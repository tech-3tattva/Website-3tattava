"use client";
import { media } from "@/lib/media";

import Link from "next/link";
import type { CSSProperties } from "react";
import TmMark from "@/components/ui/TmMark";

interface LogoProps {
  variant?: "dark" | "white" | "gold";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  linkClassName?: string;
}

// Rendered height in px per size token (full logo incl. "Balance. Build. Become", aspect ~3:1).
const heightMap: Record<NonNullable<LogoProps["size"]>, number> = {
  xs: 28,
  sm: 38,
  md: 46,
  lg: 58,
  xl: 72,
};

/**
 * Branded 3tattava logo (wordmark + "Balance. Build. Become" tagline).
 * Both colour variants are rendered and crossfaded via opacity — switching colour
 * on scroll never swaps the <img> src, so it never reloads.
 */
export default function Logo({ variant = "dark", size = "md", className = "", linkClassName = "" }: LogoProps) {
  const height = heightMap[size];
  const showCream = variant === "white";
  const base: CSSProperties = { height, width: "auto", display: "block", transition: "opacity 0.3s ease" };

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${linkClassName}`}
      aria-label="3tattava — Balance. Build. Become"
      style={{ textDecoration: "none" }}
    >
      <span style={{ position: "relative", height, display: "inline-block" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={media("/logos/logo-full-cream.png?v=1")} alt="3tattava" className={className} style={{ ...base, opacity: showCream ? 1 : 0 }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media("/logos/logo-full-espresso.png?v=1")}
          alt=""
          aria-hidden
          className={className}
          style={{ ...base, position: "absolute", top: 0, left: 0, opacity: showCream ? 0 : 1 }}
        />
        {/* ™ hugging the wordmark's top-right (superscript, close to the last glyph) */}
        <TmMark
          style={{
            position: "absolute",
            top: -Math.round(height * 0.04),
            right: -Math.round(height * 0.26),
            fontSize: Math.round(height * 0.22),
            color: showCream ? "#f7f0e2" : "#442a1b",
            marginLeft: 0,
            transform: "none",
          }}
        />
      </span>
    </Link>
  );
}
