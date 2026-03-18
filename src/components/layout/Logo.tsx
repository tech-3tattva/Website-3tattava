"use client";

import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex flex-col items-center justify-center gap-0 ${className}`}
      aria-label="3Tattva Ayurveda - Home"
    >
      <span
        className="font-display text-2xl md:text-3xl font-semibold tracking-wide text-white"
        style={{ fontFamily: "Cormorant Garamond, serif" }}
      >
        3Tattva
      </span>
      <span
        className="text-sm md:text-base font-devanagari text-gold"
        style={{ fontFamily: "Noto Serif Devanagari, serif", color: "var(--color-gold)" }}
      >
        तत्त्व
      </span>
    </Link>
  );
}
