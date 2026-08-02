"use client";
import { media } from "@/lib/media";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import Logo from "./Logo";
import { FOOTER_LINKS, SOCIAL_LINKS, TRUST_STRIP_ITEMS } from "@/lib/constants";
import { FOOTER, NEWSLETTER } from "@/lib/brand-content";
import { LEGAL } from "@/lib/legal";

// ─── ANIMATED SOCIAL ICONS ───────────────────────────────────────────────────

const BRAND_BG: Record<string, string> = {
  instagram:
    "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
  facebook: "#1877F2",
  linkedin: "#0A66C2",
  whatsapp: "#25D366",
};

function FooterSocials() {
  return (
    <div style={{ position:"relative" }}>
      <style suppressHydrationWarning>{`
        @keyframes ft-shake {
          0%,100% { transform: rotate(0deg) scale(1); }
          20%     { transform: rotate(-12deg) scale(1.05); }
          40%     { transform: rotate(10deg)  scale(1.05); }
          60%     { transform: rotate(-8deg)  scale(1.02); }
          80%     { transform: rotate(7deg)   scale(1.02); }
        }
        .ft-link {
          display: flex; flex-direction: column; align-items: center;
          text-decoration: none; position: relative; cursor: pointer;
        }
        .ft-ring {
          width: 54px; height: 54px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,.18);
          transition: transform .34s cubic-bezier(.16,1,.3,1), box-shadow .32s ease;
          position: relative; overflow: hidden;
        }
        .ft-ring svg { position: relative; z-index: 1; }
        .ft-link:hover .ft-ring {
          transform: translateY(-11px) scale(1.13);
          box-shadow:
            0 0 26px rgba(0,0,0,.22),
            0 16px 32px rgba(0,0,0,.24);
        }
        .ft-link:hover .ft-ring svg { animation: ft-shake .44s ease-in-out; }
        .ft-lbl {
          position: absolute; top: 62px; left: 50%;
          transform: translateX(-50%) translateY(5px);
          font-size: 9px; letter-spacing: .16em; text-transform: uppercase;
          color: rgba(68,42,27,0);
          transition: color .24s ease, transform .24s ease;
          font-variation-settings: 'wdth' 75,'wght' 500;
          font-family: var(--font-primary), system-ui, sans-serif;
          white-space: nowrap; pointer-events: none;
        }
        .ft-link:hover .ft-lbl {
          color: rgba(68,42,27,.72);
          transform: translateX(-50%) translateY(0);
        }
      `}</style>

      <p style={{
        fontSize:"9px", letterSpacing:".28em", textTransform:"uppercase",
        fontVariationSettings:"'wdth' 75,'wght' 500",
        fontFamily:"var(--font-primary), system-ui, sans-serif",
        color:"rgba(68,42,27,.5)",
        marginBottom:"14px",
      }}>
        Connect With Us
      </p>

      <div style={{ display:"flex", gap:"16px", alignItems:"center", flexWrap:"wrap", paddingBottom:"30px" }}>
        {SOCIAL_LINKS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="ft-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
          >
            <div className="ft-ring" style={{ background: BRAND_BG[item.id] }}>
              <SocialIcon id={item.id} className="h-5 w-5 text-white" />
            </div>
            <span className="ft-lbl">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function SocialIcon({
  id,
  className = "h-5 w-5",
}: {
  id: (typeof SOCIAL_LINKS)[number]["id"];
  className?: string;
}) {
  switch (id) {
    case "instagram":
      return <Instagram className={className} aria-hidden />;
    case "facebook":
      return <Facebook className={className} aria-hidden />;
    case "linkedin":
      return <Linkedin className={className} aria-hidden />;
    case "whatsapp":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.86 9.86 0 0 0 4.74 1.21h.004c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 18.02h-.003a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23a8.18 8.18 0 0 1 8.23 8.24c0 4.54-3.69 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43l-.48-.01a.92.92 0 0 0-.67.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
        </svg>
      );
    default:
      return null;
  }
}

// ─── GIANT WATERMARK ─────────────────────────────────────────────────────────

function FooterWatermark() {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <section
      ref={ref}
      style={{ background: "#f7f0e2", padding: "clamp(20px,3vw,40px) 24px 24px", overflow: "hidden" }}
    >
      {/* Group (4) wordmark watermark — light opacity, fully visible */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={media("/brand/watermark-wordmark.png")}
          alt=""
          aria-hidden
          style={{
            y: prefersReduced ? 0 : y,
            width: "min(780px,92%)",
            height: "auto",
            opacity: 0.13,
            filter: "brightness(0) saturate(0)",
            userSelect: "none",
            pointerEvents: "none",
            display: "block",
          }}
        />
      </div>
    </section>
  );
}

// ─── TRUST STRIP ICON MAP ────────────────────────────────────────────────────
const TRUST_ICON_MAP: Record<string, string> = {
  "⛰️": "/icons/mountain.svg",
  "🔬": "/icons/lab-microscope.svg",
  "⚕️": "/icons/heart-pulse.svg",
  "💎": "/icons/diamond.svg",
  "✓": "/icons/lab-certificate.svg",
};

export default function Footer() {
  return (
    <footer className="bg-white">
      {/* ── Trust Strip ── */}
      <section
        className="bg-[#f7f0e2] border-y border-[#442a1b]/10 py-4 px-6"
        aria-label="Trust indicators"
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center" style={{ gap: 16 }}>
          {TRUST_STRIP_ITEMS.map((item, i) => (
            <div
              key={item.text}
              className={`flex items-center justify-center text-center text-[#442a1b] w-full md:w-auto ${
                i < TRUST_STRIP_ITEMS.length - 1
                  ? "md:border-r md:border-[#b7a392]/50"
                  : ""
              }`}
              style={{ gap: 8, padding: '4px 16px', maxWidth: '100%' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={TRUST_ICON_MAP[item.icon] ?? "/icons/shield-check.svg"}
                width={18}
                height={18}
                alt=""
                role="presentation"
                style={{ flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: "var(--font-primary), system-ui, sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f0e2] text-[#442a1b] py-14 px-6 border-t border-[#e4dcc9]">
        <div className="max-w-6xl mx-auto flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="text-center md:text-left md:max-w-sm">
            <Logo variant="dark" size="lg" className="mb-4" />
            <p
              className="text-[#442a1b] font-display text-lg"
              style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
            >
              {FOOTER.tagline}
            </p>
            <p className="text-sm text-[#6f5a48] mt-2">{FOOTER.email}</p>
            <div className="mt-4 flex justify-center md:justify-start">
              <FooterSocials />
            </div>
          </div>
          <div className="md:max-w-md w-full">
            <h3
              className="font-display text-2xl text-[#442a1b] mb-1"
              style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
            >
              {NEWSLETTER.headline}
            </h3>
            <p className="text-sm text-[#6f5a48] mb-4 leading-relaxed">
              {NEWSLETTER.subheadline}
            </p>
            <NewsletterSignup
              placeholder={NEWSLETTER.placeholder}
              buttonText={NEWSLETTER.cta}
              variant="footer"
              className="w-full !mb-0"
            />
          </div>
        </div>
      </section>

      <FooterWatermark />

      <section className="bg-[#eae5db] py-14 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading font-bold text-text-dark uppercase text-sm tracking-wider mb-4" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media("/icons/package.svg")} alt="" role="presentation" width={16} height={16} />
              Shop
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-medium hover:text-[#cd872a] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-bold text-text-dark uppercase text-sm tracking-wider mb-4" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media("/icons/leaf.svg")} alt="" role="presentation" width={16} height={16} />
              About
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-medium hover:text-[#cd872a] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-bold text-text-dark uppercase text-sm tracking-wider mb-4" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media("/icons/lab-flask.svg")} alt="" role="presentation" width={16} height={16} />
              Learn
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-medium hover:text-[#cd872a] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-bold text-text-dark uppercase text-sm tracking-wider mb-4" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media("/icons/shield-check.svg")} alt="" role="presentation" width={16} height={16} />
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/track-order" className="text-text-medium hover:text-[#cd872a] transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-text-medium hover:text-[#cd872a] transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-medium hover:text-[#cd872a] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-text-medium hover:text-[#cd872a] transition-colors">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal line */}
        <div className="max-w-6xl mx-auto mt-10 pt-8 border-t border-[#d6cfc1]">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={media("/logos/sankalpa-siddhi.png")} alt="SankalpaSiddhi Ayupharma" width={54} height={54} style={{ borderRadius: "50%", flexShrink: 0 }} />
            <p className="text-xs text-text-medium text-center sm:text-left leading-relaxed">
              <strong className="text-text-dark">Marketed by</strong> {LEGAL.companyShort} · CIN {LEGAL.cin} · GSTIN {LEGAL.gstin}
              <br />
              <strong className="text-text-dark">Registered Office:</strong> {LEGAL.registeredOffice}
              <br />
              <strong className="text-text-dark">Dispatch / Operations:</strong> {LEGAL.operationsAddress}
              <br />
              <strong className="text-text-dark">Customer care:</strong> {LEGAL.careMobile} · {LEGAL.emailGeneral}
            </p>
          </div>
          <p className="text-xs text-text-medium text-center md:text-left leading-relaxed">
            {FOOTER.legal.companyLine}
          </p>
        </div>
      </section>

      <section className="bg-[#1a1a1a] py-4 px-6 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-text-light text-sm">
          <p className="text-white/70">© 2026 SankalpaSiddhi Ayupharma Pvt. Ltd. (3TATTAVA™) · CIN U21001DL2026PTC464092. All rights reserved.</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {["Visa", "MC", "Amex", "UPI", "Paytm", "PhonePe"].map((p) => (
              <span key={p} className="bg-white px-2 py-1 rounded text-xs text-black">
                {p}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-white/80 text-center">
            <Link href="/privacy" className="hover:text-white transition-colors whitespace-nowrap">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors whitespace-nowrap">
              Terms of Use
            </Link>
            <Link href="/returns" className="hover:text-white transition-colors whitespace-nowrap">
              Returns &amp; Refunds
            </Link>
            <Link href="/shipping" className="hover:text-white transition-colors whitespace-nowrap">
              Shipping
            </Link>
            <Link href="/payment" className="hover:text-white transition-colors whitespace-nowrap">
              Payment
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors whitespace-nowrap">
              Cookie Policy
            </Link>
            <Link href="/medical-disclaimer" className="hover:text-white transition-colors whitespace-nowrap">
              Medical Disclaimer
            </Link>
            <Link href="/intellectual-property" className="hover:text-white transition-colors whitespace-nowrap">
              Intellectual Property
            </Link>
            <Link href="/grievance" className="hover:text-white transition-colors whitespace-nowrap">
              Grievance
            </Link>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors whitespace-nowrap">
              Sitemap
            </Link>
          </div>
        </div>
        <p className="text-white/50 text-xs text-center mt-3" style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}>
          © {LEGAL.copyrightYear} {LEGAL.companyShort} · {LEGAL.registeredOffice}
        </p>
      </section>
    </footer>
  );
}
