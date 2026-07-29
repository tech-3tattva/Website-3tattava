import { media } from "@/lib/media";

// Subtle brand watermark strip used as a "footer" between product sections.
// Faint 3tattava wordmark — centred and fully visible (never cropped at the edges).
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
        justifyContent: "center",
        minHeight: "clamp(52px,6.5vw,88px)",
        padding: "clamp(8px,1.6vw,18px) clamp(24px,5vw,72px)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media("/brand/watermark-wordmark.png")}
        alt=""
        style={{
          width: "min(340px,66%)",
          height: "auto",
          opacity: 0.1,
          filter: "brightness(0) saturate(0)",
          pointerEvents: "none",
          display: "block",
        }}
      />
    </div>
  );
}
