import type { ReactNode } from "react";

// Shared styled wrapper for content / legal / policy pages.
// Server-component friendly (no hooks). Spec palette + prose styling.

const F = "var(--font-primary), system-ui, sans-serif";

export default function ContentPage({
  eyebrow,
  title,
  intro,
  updated,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  updated?: string;
  children?: ReactNode;
}) {
  return (
    <div style={{ background: "#f7f0e2", minHeight: "62vh" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .content-prose { font-family: ${F}; color: #442a1b; }
        .content-prose h2 { font-variation-settings: 'wdth' 85,'wght' 700; font-size: clamp(19px,2.4vw,26px); letter-spacing: -.01em; color: #442a1b; margin: 34px 0 12px; }
        .content-prose h3 { font-variation-settings: 'wdth' 85,'wght' 700; font-size: 16px; color: #442a1b; margin: 22px 0 8px; }
        .content-prose p { font-size: 15px; line-height: 1.75; color: #6f5a48; margin: 0 0 14px; }
        .content-prose ul { margin: 0 0 16px; padding-left: 0; list-style: none; }
        .content-prose li { font-size: 15px; line-height: 1.7; color: #6f5a48; padding-left: 20px; position: relative; margin-bottom: 7px; }
        .content-prose li::before { content: ""; position: absolute; left: 0; top: 10px; width: 6px; height: 6px; border-radius: 50%; background: #cd872a; }
        .content-prose a { color: #cd872a; font-weight: 600; text-decoration: none; }
        .content-prose a:hover { text-decoration: underline; }
        .content-prose strong { color: #442a1b; font-weight: 700; }
      ` }} />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(56px,8vh,96px) 24px clamp(56px,9vh,96px)" }}>
        {eyebrow && (
          <p style={{ fontFamily: F, fontVariationSettings: "'wdth' 75,'wght' 700", fontSize: 11, letterSpacing: ".26em", textTransform: "uppercase", color: "#cd872a", marginBottom: 14 }}>
            {eyebrow}
          </p>
        )}
        <h1 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(30px,5vw,52px)", letterSpacing: "-.02em", color: "#442a1b", lineHeight: 1.08, margin: "0 0 16px" }}>
          {title}
        </h1>
        {intro && (
          <p style={{ fontFamily: F, fontSize: "clamp(15px,1.8vw,18px)", lineHeight: 1.7, color: "#6f5a48", maxWidth: 640, margin: "0 0 6px" }}>
            {intro}
          </p>
        )}
        {updated && (
          <p style={{ fontFamily: F, fontSize: 12, letterSpacing: ".04em", color: "#b7a392", margin: "8px 0 0" }}>
            Last updated: {updated}
          </p>
        )}
        <div className="content-prose" style={{ marginTop: 30 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
