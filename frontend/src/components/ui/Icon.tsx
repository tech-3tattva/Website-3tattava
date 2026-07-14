"use client";

import type { CSSProperties } from "react";

/** All available custom SVG icons in /public/icons/ */
export type IconName =
  | "loading-lotus" | "lab-flask" | "lab-microscope" | "lab-certificate" | "lab-test-tube"
  | "map-pin" | "map-compass"
  | "leaf" | "herb" | "mortar-pestle" | "yoga" | "meditation" | "heart-pulse" | "shield-check" | "mountain"
  | "arrow-right" | "chevron-right" | "arrow-up-right"
  | "truck-delivery" | "package" | "star" | "fire" | "lightning" | "diamond" | "water-drop" | "dna";

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  spin?: boolean;
  pulse?: boolean;
}

export default function Icon({ name, size = 24, color, className = "", style, spin, pulse }: IconProps) {
  const animStyle: CSSProperties = spin
    ? { animation: "icon-spin 1.2s linear infinite" }
    : pulse
      ? { animation: "icon-pulse 1.8s ease-in-out infinite" }
      : {};

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/icons/${name}.svg`}
        alt=""
        role="presentation"
        width={size}
        height={size}
        className={className}
        style={{
          display: "inline-block",
          flexShrink: 0,
          filter: color ? undefined : undefined,
          ...animStyle,
          ...style,
        }}
      />
      {(spin || pulse) && (
        <style jsx>{`
          @keyframes icon-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes icon-pulse { 0%, 100% { opacity: 0.5; transform: scale(0.95); } 50% { opacity: 1; transform: scale(1.05); } }
        `}</style>
      )}
    </>
  );
}
