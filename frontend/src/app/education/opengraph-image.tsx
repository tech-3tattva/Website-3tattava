import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "The Performance Ayurveda Knowledge Center — 3TATTAVA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundImage: "linear-gradient(135deg, #2b2519 0%, #5c4033 100%)",
          padding: "80px",
          color: "white",
          fontFamily: "serif",
        }}
      >
        <span
          style={{
            fontSize: 24,
            letterSpacing: "0.3em",
            color: "#D4A574",
            textTransform: "uppercase",
          }}
        >
          3TATTAVA Education Hub
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <span style={{ fontSize: 72, lineHeight: 1.04, fontWeight: 600, maxWidth: 1000 }}>
            The Performance Ayurveda Knowledge Center
          </span>
          <span
            style={{
              fontSize: 26,
              color: "rgba(245,239,230,0.85)",
              maxWidth: 1000,
              lineHeight: 1.4,
            }}
          >
            Doctor-reviewed guides on Shilajit, minerals, energy, and women&apos;s wellness.
            No fluff. No spiritual woo. Just the science that matters.
          </span>
        </div>
        <span
          style={{
            fontSize: 20,
            letterSpacing: "0.18em",
            color: "rgba(245,239,230,0.75)",
            textTransform: "uppercase",
          }}
        >
          Reviewed by Dr. Kashish, BAMS · 3tattava.com
        </span>
      </div>
    ),
    { ...size },
  );
}
