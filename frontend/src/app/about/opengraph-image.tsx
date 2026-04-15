import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Why an Ayurveda Doctor Stopped Seeing Patients — Dr. Kashish & 3TATTAVA";
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
          backgroundImage: "linear-gradient(135deg, #241e18 0%, #3d2e26 100%)",
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
          3TATTAVA · Our Story
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <span style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 600, maxWidth: 1000 }}>
            Why an Ayurveda Doctor Stopped Seeing Patients
          </span>
          <span
            style={{
              fontSize: 28,
              color: "rgba(245,239,230,0.85)",
              maxWidth: 1000,
              fontStyle: "italic",
            }}
          >
            And built India&apos;s first Performance Ayurveda brand instead.
          </span>
        </div>
        <span style={{ fontSize: 20, letterSpacing: "0.18em", color: "rgba(245,239,230,0.75)", textTransform: "uppercase" }}>
          Meet Dr. Kashish, BAMS — 3tattava.com
        </span>
      </div>
    ),
    { ...size },
  );
}
