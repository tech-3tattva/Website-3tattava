import { media } from "@/lib/media";
const F = "var(--font-primary), system-ui, sans-serif";

// Subtle brand watermark strip used as a "footer" between product sections.
// Faint 3tattava wordmark (low opacity) + Balance. Build. Become. tagline.
export default function BrandDivider({ bg = "#f7f0e2" }: { bg?: string }) {
  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        background: bg,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        minHeight: "clamp(52px,6.5vw,88px)",
        padding: "clamp(8px,1.6vw,18px) clamp(24px,5vw,72px)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media("/brand/watermark-wordmark.png")}
        alt=""
        style={{
          position: "absolute",
          left: "clamp(-24px,1vw,48px)",
          top: "50%",
          transform: "translateY(-50%)",
          width: "min(48%,440px)",
          height: "auto",
          opacity: 0.08,
          filter: "brightness(0) saturate(0)",
          pointerEvents: "none",
        }}
      />
      <span
        style={{
          position: "relative",
          fontFamily: F,
          fontStyle: "italic",
          fontVariationSettings: "'wght' 600",
          fontSize: "clamp(12px,1.5vw,17px)",
          letterSpacing: ".08em",
          color: "#cd872a",
        }}
      >
        Balance. Build. Become.
      </span>
    </div>
  );
}
