import type { Metadata } from "next";
import { Instagram, Facebook, Linkedin, ArrowUpRight } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Connect With 3TATTAVA — Social Links",
  description:
    "Follow 3TATTAVA on Instagram, Facebook, LinkedIn and WhatsApp for Performance Ayurveda insights, lab transparency, and daily rituals.",
  alternates: { canonical: "https://www.3tattava.com/social-links" },
};

const F = "var(--font-primary), system-ui, sans-serif";
const CREAM = "#f7f0e2";
const ESPRESSO = "#442a1b";
const GOLD = "#cd872a";
const TAUPE = "#8a7355";

function WhatsAppIcon({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.86 9.86 0 0 0 4.74 1.21h.004c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 18.02h-.003a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23a8.18 8.18 0 0 1 8.23 8.24c0 4.54-3.69 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43l-.48-.01a.92.92 0 0 0-.67.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

const ICONS: Record<string, (p: { size?: number; color?: string }) => JSX.Element> = {
  instagram: (p) => <Instagram size={p.size} color={p.color} aria-hidden />,
  facebook: (p) => <Facebook size={p.size} color={p.color} aria-hidden />,
  linkedin: (p) => <Linkedin size={p.size} color={p.color} aria-hidden />,
  whatsapp: (p) => <WhatsAppIcon size={p.size} color={p.color} />,
};

export default function SocialLinksPage() {
  return (
    <div style={{ background: CREAM, minHeight: "72vh", padding: "clamp(80px,11vh,130px) 20px clamp(64px,9vh,100px)" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/logo-full-espresso.png?v=1"
          alt="3tattava — Balance. Build. Become"
          style={{ width: "min(240px,64%)", height: "auto", display: "block", margin: "0 auto clamp(20px,3vw,28px)" }}
        />
        <p style={{ fontFamily: F, fontVariationSettings: "'wght' 600", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: GOLD, margin: "0 0 10px" }}>
          Connect With Us
        </p>
        <h1 style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: "clamp(26px,4vw,40px)", letterSpacing: "-0.02em", color: ESPRESSO, margin: "0 0 12px" }}>
          Follow 3TATTAVA
        </h1>
        <p style={{ fontFamily: F, fontSize: "clamp(14px,1.6vw,16px)", lineHeight: 1.6, color: TAUPE, margin: "0 auto clamp(28px,4vw,40px)", maxWidth: 380 }}>
          Performance Ayurveda, lab transparency, and daily rituals — join us across every platform.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {SOCIAL_LINKS.map((s) => {
            const Icon = ICONS[s.id];
            return (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderRadius: 16,
                  background: "#fff",
                  border: "1px solid rgba(68,42,27,.14)",
                  boxShadow: "0 6px 18px rgba(68,42,27,.05)",
                  textDecoration: "none",
                  transition: "transform .2s ease, box-shadow .2s ease",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    background: "rgba(205,135,42,.12)",
                    flexShrink: 0,
                  }}
                >
                  {Icon ? <Icon size={22} color={ESPRESSO} /> : null}
                </span>
                <span style={{ flex: "1 1 auto", textAlign: "left", fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 16, color: ESPRESSO }}>
                  {s.label}
                </span>
                <ArrowUpRight size={18} color={TAUPE} aria-hidden />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
