import React from "react";
import { FlaskConical, ShieldCheck, ScanLine, FileCheck2, MapPin, Mountain } from "lucide-react";
import { EVIDENCE_PILLARS } from "../lib/brandContent";

const LAB_REPORTS = [
  { batch: "RR-24-001", product: "RockResin", date: "Mar 2026", lab: "Eurofins (NABL)", fulvic: "72.3%", status: "Passed" },
  { batch: "RR-24-002", product: "RockResin", date: "Apr 2026", lab: "Eurofins (NABL)", fulvic: "70.8%", status: "Passed" },
  { batch: "SH-24-001", product: "Shahjeet Sticks", date: "Apr 2026", lab: "Eurofins (NABL)", fulvic: "71.2%", status: "Passed" },
  { batch: "SH-24-002", product: "Shahjeet Sticks", date: "May 2026", lab: "Eurofins (NABL)", fulvic: "73.1%", status: "Passed" },
];

const TESTS = [
  { title: "Heavy Metal Screening", desc: "Lead, mercury, arsenic, cadmium — below regulatory limits." },
  { title: "Microbial Safety", desc: "Total aerobic, yeasts, molds, pathogens — within safe range." },
  { title: "Fulvic Acid Verification", desc: "Quantified per batch — ≥70% for RockResin." },
  { title: "Identity Verification", desc: "Confirms authentic Shilajit — not counterfeit substitutes." },
  { title: "Honey Authenticity (Shahjeet)", desc: "Verifies natural honey composition and quality." },
  { title: "Manufacturing Documentation", desc: "AYUSH-GMP records traceable per batch." },
];

export default function ResearchTesting() {
  return (
    <div data-testid="research-page" className="bg-cream">
      <section className="bg-3t-black text-cream py-24 px-6 md:px-16 grain relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=2200&q=80&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative max-w-7xl mx-auto">
          <div className="eyebrow text-gold mb-6"><FlaskConical size={14} className="inline mr-2" /> Research & Testing</div>
          <h1 className="font-display text-5xl md:text-7xl max-w-4xl" style={{ fontVariationSettings: "'wdth' 82, 'wght' 800", lineHeight: 1 }}>
            Evidence <span className="gold-gradient-text">Before Claims™</span>
          </h1>
          <p className="font-italic-light text-xl text-cream/75 mt-6 max-w-2xl" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>
            Ancient wisdom deserves modern verification. Every batch — sourced, purified, tested, documented.
          </p>
        </div>
      </section>

      <section className="section bg-white border-b border-ink/10">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-ink/60 mb-4">The Six Pillars</div>
          <h2 className="font-display text-4xl md:text-5xl mb-12" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", lineHeight: 1.05 }}>
            From <span className="gold-gradient-text">16,000 ft</span> to your daily ritual.
          </h2>
          <div className="grid md:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
            {EVIDENCE_PILLARS.map((p) => (
              <div key={p.title} className="bg-white p-8">
                <div className="font-display text-5xl text-gold/40 mb-3" style={{ fontVariationSettings: "'wdth' 80, 'wght' 700" }}>{p.num}</div>
                <div className="font-display text-xl mb-2" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{p.title}</div>
                <p className="text-sm text-ink/70">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream-deep/40">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-ink/60 mb-4">What Every Batch Is Tested For</div>
          <h2 className="font-display text-3xl md:text-4xl mb-12" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>The verification framework.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTS.map((t) => (
              <div key={t.title} className="bg-white border border-ink/10 p-6">
                <ShieldCheck size={18} className="text-gold mb-3" />
                <div className="font-display text-lg mb-2" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{t.title}</div>
                <p className="text-sm text-ink/70">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink text-cream">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-gold mb-4"><ScanLine size={12} className="inline mr-2" /> Lab Reports Showcase</div>
          <h2 className="font-display text-3xl md:text-5xl mb-12" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>Scan. Verify. Trust.</h2>
          <div className="grid md:grid-cols-2 gap-px bg-gold/15 border border-gold/15">
            {LAB_REPORTS.map((r) => (
              <div key={r.batch} className="bg-3t-black-2 p-6 flex items-center gap-6">
                <FileCheck2 size={28} className="text-gold shrink-0" />
                <div className="flex-1">
                  <div className="eyebrow text-gold mb-1 text-[10px]">Batch {r.batch} · {r.date}</div>
                  <div className="font-display text-lg" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{r.product}</div>
                  <div className="text-xs text-cream/70 mt-1">Lab: {r.lab} · Fulvic: {r.fulvic}</div>
                </div>
                <div className="eyebrow text-[10px] px-3 py-1.5 bg-gold/20 text-gold border border-gold/30">{r.status}</div>
              </div>
            ))}
          </div>
          <p className="text-cream/60 text-xs mt-6 max-w-2xl">Lab reports are sample representations. Real per-batch reports are accessible via QR code on every pack.</p>
        </div>
      </section>

      <section className="section bg-cream text-center">
        <Mountain size={36} className="text-gold mx-auto mb-6" />
        <h2 className="font-display text-3xl md:text-5xl max-w-3xl mx-auto" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", lineHeight: 1.1 }}>
          Sourced at 16,000+ ft. <span className="gold-gradient-text">Tested at sea level.</span>
        </h2>
      </section>
    </div>
  );
}
