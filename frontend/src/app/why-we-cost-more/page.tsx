{/* copy pending Dr. Kashish final approval per compliance policy */}
import type { Metadata } from "next";
import Link from "next/link";
import {
  Mountain,
  Leaf,
  ScanLine,
  Factory,
  Stethoscope,
  Atom,
  ShieldCheck,
  FileText,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Why 3TATTAVA Costs More | 3TATTAVA",
  description:
    "Where the price goes: Himalayan Ladakhi sourcing above 16,000 ft, classical Triphala Shodhana purification, NABL-accredited third-party lab testing with batch-specific COA via QR, an AYUSH-GMP + WHO-GMP certified facility, BAMS doctor formulation, and 80+ ionic trace minerals.",
  alternates: { canonical: "https://www.3tattava.com/why-we-cost-more" },
  openGraph: {
    title: "Why 3TATTAVA Costs More | 3TATTAVA",
    description:
      "The factual quality drivers behind the price — sourcing, classical purification, third-party testing, manufacturing standards and doctor formulation.",
    url: "https://www.3tattava.com/why-we-cost-more",
    type: "article",
  },
};

const F = "var(--font-primary), system-ui, sans-serif";
const CREAM = "#f7f0e2";
const ESPRESSO = "#442a1b";
const INK = "#3a2817";
const GOLD = "#cd872a";
const TAUPE = "#8a7355";

type Driver = {
  icon: LucideIcon;
  title: string;
  body: string;
};

// Only already-approved factual differentiators — no health outcomes, no
// superlatives, no fulvic-acid percentage.
const DRIVERS: Driver[] = [
  {
    icon: Mountain,
    title: "Himalayan Ladakhi sourcing",
    body:
      "Our raw Shilajit is collected from high-altitude Himalayan rock in the Ladakh region, above 16,000 feet.",
  },
  {
    icon: Leaf,
    title: "Classical Triphala Shodhana",
    body:
      "Each batch is purified using the classical Triphala Shodhana method — a traditional purification with Amalaki, Haritaki and Bibhitaki — following the classical texts.",
  },
  {
    icon: ScanLine,
    title: "NABL third-party testing + COA",
    body:
      "Every batch undergoes NABL-accredited third-party laboratory testing. The batch-specific Certificate of Analysis is readable via the QR code printed on every pack.",
  },
  {
    icon: Factory,
    title: "AYUSH-GMP + WHO-GMP facility",
    body:
      "Manufactured at a facility certified to AYUSH-GMP and WHO-GMP standards.",
  },
  {
    icon: Stethoscope,
    title: "BAMS doctor formulation",
    body:
      "Formulated by Dr. Kashish Gupta, a BAMS-qualified Ayurvedic physician.",
  },
  {
    icon: Atom,
    title: "80+ ionic trace minerals",
    body:
      "Naturally contains 80+ ionic trace minerals.",
  },
];

const VERIFY = [
  {
    href: "/research-testing",
    title: "Research & Testing",
    body: "How every batch is tested — the full six-layer protocol, step by step.",
  },
  {
    href: "/lab-reports",
    title: "Lab Reports",
    body: "Read the NABL third-party lab report for each product, in full.",
  },
];

export default function WhyWeCostMorePage() {
  return (
    <div style={{ background: CREAM }}>
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "clamp(88px,11vh,132px) 24px clamp(56px,8vh,96px)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(36px,5vw,56px)" }}>
          <p
            style={{
              fontFamily: F,
              fontVariationSettings: "'wght' 600",
              fontSize: 12,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: GOLD,
              margin: "0 0 12px",
            }}
          >
            Where the price goes
          </p>
          <h1
            style={{
              fontFamily: F,
              fontVariationSettings: "'wght' 800",
              fontSize: "clamp(30px,5vw,52px)",
              letterSpacing: "-0.02em",
              color: ESPRESSO,
              margin: "0 0 14px",
            }}
          >
            Why 3TATTAVA costs more
          </h1>
          <p
            style={{
              fontFamily: F,
              fontSize: "clamp(15px,1.7vw,18px)",
              lineHeight: 1.6,
              color: TAUPE,
              margin: "0 auto",
              maxWidth: 640,
            }}
          >
            A higher price should buy something real. Ours reflects deliberate choices at every
            step — from where the resin is collected to how each batch is verified. Here is where
            that cost goes.
          </p>
        </div>

        {/* Differentiator cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: "clamp(20px,3vw,32px)",
          }}
        >
          {DRIVERS.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.title}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(68,42,27,.12)",
                  borderRadius: 20,
                  padding: "clamp(22px,3vw,28px)",
                  boxShadow: "0 10px 30px rgba(68,42,27,.06)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "rgba(205,135,42,.14)",
                    marginBottom: 16,
                  }}
                >
                  <Icon size={24} color={GOLD} aria-hidden />
                </span>
                <h2
                  style={{
                    fontFamily: F,
                    fontVariationSettings: "'wght' 800",
                    fontSize: "clamp(18px,2.2vw,22px)",
                    color: ESPRESSO,
                    margin: "0 0 8px",
                  }}
                >
                  {d.title}
                </h2>
                <p
                  style={{
                    fontFamily: F,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: INK,
                    margin: 0,
                  }}
                >
                  {d.body}
                </p>
              </div>
            );
          })}
        </div>

        {/* Verify it yourself */}
        <div style={{ marginTop: "clamp(48px,7vw,80px)" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(24px,3.5vw,36px)" }}>
            <p
              style={{
                fontFamily: F,
                fontVariationSettings: "'wght' 600",
                fontSize: 12,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: GOLD,
                margin: "0 0 10px",
              }}
            >
              <ShieldCheck
                size={14}
                color={GOLD}
                aria-hidden
                style={{ verticalAlign: "-2px", marginRight: 6 }}
              />
              Don&rsquo;t take our word for it
            </p>
            <h2
              style={{
                fontFamily: F,
                fontVariationSettings: "'wght' 800",
                fontSize: "clamp(24px,3.4vw,36px)",
                letterSpacing: "-0.01em",
                color: ESPRESSO,
                margin: 0,
              }}
            >
              Verify every claim
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: "clamp(16px,2.5vw,24px)",
            }}
          >
            {VERIFY.map((v) => (
              <Link
                key={v.href}
                href={v.href}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  background: "#fff",
                  border: "1px solid rgba(68,42,27,.12)",
                  borderRadius: 18,
                  padding: "clamp(20px,3vw,26px)",
                  textDecoration: "none",
                  boxShadow: "0 8px 24px rgba(68,42,27,.05)",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "rgba(205,135,42,.14)",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={22} color={GOLD} aria-hidden />
                </span>
                <span style={{ display: "block" }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: F,
                      fontVariationSettings: "'wght' 800",
                      fontSize: "clamp(17px,2vw,20px)",
                      color: ESPRESSO,
                    }}
                  >
                    {v.title} <ArrowRight size={17} color={GOLD} aria-hidden />
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontFamily: F,
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: TAUPE,
                      marginTop: 6,
                    }}
                  >
                    {v.body}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: "clamp(48px,7vw,80px)",
            textAlign: "center",
            background: ESPRESSO,
            borderRadius: 24,
            padding: "clamp(36px,6vw,64px) 24px",
          }}
        >
          <h2
            style={{
              fontFamily: F,
              fontVariationSettings: "'wght' 800",
              fontSize: "clamp(24px,3.6vw,38px)",
              letterSpacing: "-0.01em",
              color: CREAM,
              margin: "0 0 12px",
            }}
          >
            See what the price builds
          </h2>
          <p
            style={{
              fontFamily: F,
              fontSize: "clamp(15px,1.7vw,18px)",
              lineHeight: 1.6,
              color: "rgba(247,240,226,.82)",
              margin: "0 auto 26px",
              maxWidth: 560,
            }}
          >
            RockResin Classically Purified Shilajit Resin and Shahjeet Honey-Shilajit Sticks —
            sourced, purified and tested to the standards above.
          </p>
          <Link
            href="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "14px 30px",
              borderRadius: 999,
              background: GOLD,
              color: "#fff",
              fontFamily: F,
              fontVariationSettings: "'wght' 700",
              fontSize: 14,
              letterSpacing: ".04em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Explore the range <ArrowRight size={17} aria-hidden />
          </Link>
        </div>

        {/* Footnote */}
        <p
          style={{
            fontFamily: F,
            fontSize: 12,
            color: TAUPE,
            textAlign: "center",
            marginTop: "clamp(28px,4vw,44px)",
            maxWidth: 660,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
          }}
        >
          Pricing reflects sourcing, classical purification, third-party testing and manufacturing
          standards. Lab reports relate to the tested sample and batch. Questions? Contact{" "}
          <a
            href="mailto:support@3tattava.com"
            style={{ color: GOLD, textDecoration: "none", fontWeight: 600 }}
          >
            support@3tattava.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
