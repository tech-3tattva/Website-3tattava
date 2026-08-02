import type { Metadata } from "next";
import { FileText, Download, ExternalLink, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Lab Reports | 3TATTAVA",
  description:
    "NABL 3rd-party lab reports for every 3TATTAVA product — RockResin Classically Purified Shilajit Resin and Shahjeet Honey Sticks. Fulvic acid, heavy metals, and microbial safety, fully transparent.",
  alternates: { canonical: "https://www.3tattava.com/lab-reports" },
};

const F = "var(--font-primary), system-ui, sans-serif";
const CREAM = "#f7f0e2";
const ESPRESSO = "#442a1b";
const INK = "#3a2817";
const GOLD = "#cd872a";
const TAUPE = "#8a7355";

const REPORTS = [
  {
    name: "RockResin™",
    subtitle: "Classically Purified Shilajit Resin · 20g Jar",
    type: "NABL 3rd-Party Lab Report",
    file: "/lab-reports/RockResins-labreport.pdf",
    download: "3TATTAVA-RockResin-Lab-Report.pdf",
  },
  {
    name: "Shahjeet Sticks™",
    subtitle: "Honey-Shilajit Sticks · 30 Pack",
    type: "NABL 3rd-Party Lab Report",
    file: "/lab-reports/Shahjeet-Sticks.pdf",
    download: "3TATTAVA-Shahjeet-Sticks-Lab-Report.pdf",
  },
  {
    name: "Shahjeet Sticks™",
    subtitle: "Honey-Shilajit Sticks · 30 Pack",
    type: "NABL 3rd-Party Lab Report",
    file: "https://media.3tattava.com/misc/lab-reports/Shahjeet-Sticks(Lab+Report).pdf",
    download: "3TATTAVA-Shahjeet-Sticks-Lab-Report-2.pdf",
  },
];

const TESTED = ["Fulvic Acid %", "Heavy Metals", "Microbial Safety", "Purity & Identity"];

export default function LabReportsPage() {
  return (
    <div style={{ background: CREAM }}>
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "clamp(88px,11vh,132px) 24px clamp(56px,8vh,96px)" }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(36px,5vw,56px)" }}>
          <p style={{ fontFamily: F, fontVariationSettings: "'wght' 600", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: GOLD, margin: "0 0 12px" }}>
            Evidence Before Claims™
          </p>
          <h1 style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: "clamp(30px,5vw,52px)", letterSpacing: "-0.02em", color: ESPRESSO, margin: "0 0 14px" }}>
            Lab Reports
          </h1>
          <p style={{ fontFamily: F, fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.6, color: TAUPE, margin: "0 auto", maxWidth: 620 }}>
            Every batch is independently NABL 3rd-party lab tested. Full reports for each product — nothing hidden.
          </p>

          <div style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 22 }}>
            {TESTED.map((t) => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: F, fontVariationSettings: "'wght' 600", fontSize: 12, letterSpacing: ".02em", color: INK, background: "rgba(205,135,42,.12)", borderRadius: 999, padding: "7px 14px" }}>
                <ShieldCheck size={14} color={GOLD} aria-hidden /> {t}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "clamp(20px,3vw,32px)" }}>
          {REPORTS.map((r) => (
            <div key={r.file} style={{ background: "#fff", border: "1px solid rgba(68,42,27,.12)", borderRadius: 20, padding: "clamp(20px,3vw,28px)", boxShadow: "0 10px 30px rgba(68,42,27,.06)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: 12, background: "rgba(205,135,42,.14)", flexShrink: 0 }}>
                  <FileText size={24} color={GOLD} aria-hidden />
                </span>
                <div>
                  <h2 style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: "clamp(19px,2.4vw,24px)", color: ESPRESSO, margin: 0 }}>{r.name}</h2>
                  <p style={{ fontFamily: F, fontSize: 13, color: TAUPE, margin: "3px 0 0" }}>{r.subtitle}</p>
                  <p style={{ fontFamily: F, fontVariationSettings: "'wght' 600", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: GOLD, margin: "6px 0 0" }}>{r.type}</p>
                </div>
              </div>

              <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(68,42,27,.12)", background: "#f3ecdb", marginBottom: 18 }}>
                <iframe src={`${r.file}#view=FitH`} title={`${r.name} lab report`} style={{ width: "100%", height: 420, border: "none", display: "block" }} />
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: "auto" }}>
                <a href={r.file} target="_blank" rel="noopener noreferrer" style={{ flex: "1 1 auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, minWidth: 140, padding: "12px 20px", borderRadius: 999, background: ESPRESSO, color: CREAM, fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 13, letterSpacing: ".04em", textTransform: "uppercase", textDecoration: "none" }}>
                  View Report <ExternalLink size={15} aria-hidden />
                </a>
                <a href={r.file} download={r.download} style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", borderRadius: 999, background: "transparent", color: ESPRESSO, border: `1.5px solid ${ESPRESSO}`, fontFamily: F, fontVariationSettings: "'wght' 700", fontSize: 13, letterSpacing: ".04em", textTransform: "uppercase", textDecoration: "none" }}>
                  <Download size={15} aria-hidden /> Download
                </a>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: F, fontSize: 12, color: TAUPE, textAlign: "center", marginTop: "clamp(28px,4vw,44px)", maxWidth: 640, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
          Reports are batch-specific. Scan the QR code on your pack to verify the exact batch you received, or contact{" "}
          <a href="mailto:support@3tattava.com" style={{ color: GOLD, textDecoration: "none", fontWeight: 600 }}>support@3tattava.com</a>.
        </p>
      </section>
    </div>
  );
}
