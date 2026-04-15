import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "3TATTAVA — Performance Ayurveda | Himalayan Shilajit Resin & Honey Sticks";
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
          backgroundImage:
            "linear-gradient(135deg, #5c4033 0%, #1a1a1a 100%)",
          padding: "80px",
          color: "white",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background:
                "radial-gradient(circle, #D4A574 0%, #a6763c 70%, transparent 100%)",
            }}
          />
          <span
            style={{
              fontSize: 28,
              letterSpacing: "0.3em",
              fontWeight: 600,
            }}
          >
            3TATTAVA
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span
            style={{
              fontSize: 20,
              color: "#D4A574",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            Performance Ayurveda
          </span>
          <span
            style={{
              fontSize: 84,
              lineHeight: 1.02,
              fontWeight: 600,
              maxWidth: 980,
            }}
          >
            Engineered for the Way You Actually Live.
          </span>
          <span
            style={{
              fontSize: 26,
              color: "rgba(245,239,230,0.85)",
              maxWidth: 980,
              lineHeight: 1.35,
            }}
          >
            Pure Himalayan Shilajit · 80+ Trace Minerals · 60%+ Fulvic Acid · NABL Lab-Certified
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            letterSpacing: "0.18em",
            color: "rgba(245,239,230,0.75)",
            textTransform: "uppercase",
          }}
        >
          <span>Doctor-Formulated · Dr. Kashish, BAMS</span>
          <span>3tattava.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
