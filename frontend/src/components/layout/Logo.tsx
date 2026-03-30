"use client";

import type { CSSProperties } from "react";
import Image from "@/components/ui/SafeImage";
import Link from "next/link";

const WORDMARK_SRC = "/logos/3tattava-wordmark.png";

interface LogoProps {
  variant?: "dark" | "white" | "gold";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  linkClassName?: string;
}

/** Approximate 3.2:1 aspect for the 3tattava wordmark */
const sizeMap = {
  sm: { width: 128, height: 40 },
  md: { width: 168, height: 52 },
  lg: { width: 216, height: 66 },
  xl: { width: 280, height: 84 },
};

function imageStyle(variant: LogoProps["variant"]): CSSProperties {
  if (variant === "white") {
    return { mixBlendMode: "screen" };
  }
  if (variant === "dark") {
    return { filter: "invert(1)" };
  }
  if (variant === "gold") {
    return {
      filter: "invert(1) sepia(0.4) saturate(1.6) hue-rotate(5deg)",
    };
  }
  return {};
}

export default function Logo({
  variant = "dark",
  size = "md",
  className = "",
  linkClassName = "",
}: LogoProps) {
  const { width, height } = sizeMap[size];

  return (
    <Link
      href="/"
      className={`inline-flex flex-col items-center ${linkClassName}`}
      aria-label="3tattava — Home"
    >
      <div
        className={`relative isolate ${className}`}
        style={{ width, height }}
      >
        <Image
          src={WORDMARK_SRC}
          alt="3tattava"
          fill
          className="object-contain object-center"
          style={imageStyle(variant)}
          priority
          sizes={`${width}px`}
        />
      </div>
    </Link>
  );
}
