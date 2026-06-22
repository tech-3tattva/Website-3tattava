import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FOUNDER, BRAND } from "../lib/brandContent";

export default function OurStory() {
  return (
    <div data-testid="our-story-page" className="bg-cream">
      <section className="bg-ink text-cream py-24 px-6 md:px-16 grain relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=2200&q=80&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative max-w-7xl mx-auto">
          <div className="eyebrow text-gold mb-6">Our Story</div>
          <h1 className="font-display text-5xl md:text-7xl max-w-4xl" style={{ fontVariationSettings: "'wdth' 82, 'wght' 800", lineHeight: 1 }}>
            We don't believe in quick fixes. <br /><span className="gold-gradient-text">We believe in daily rituals.</span>
          </h1>
        </div>
      </section>

      <section className="section grid md:grid-cols-2 gap-16 items-start">
        <div className="relative">
          <img src={FOUNDER.photo} alt={FOUNDER.name} className="w-full h-[640px] object-cover" />
          <div className="absolute -bottom-4 -left-4 bg-gold text-ink p-6 max-w-[280px]">
            <div className="eyebrow mb-2">Founder</div>
            <div className="font-display text-xl" style={{ fontVariationSettings: "'wdth' 88, 'wght' 800" }}>{FOUNDER.name}</div>
            <div className="text-xs">{FOUNDER.credentials}</div>
          </div>
        </div>
        <div>
          <div className="eyebrow text-ink/60 mb-4">Meet The Founder</div>
          <h2 className="font-display text-4xl md:text-5xl mb-6" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", lineHeight: 1.05 }}>{FOUNDER.headline}</h2>
          <p className="font-italic-light text-xl text-ink/80 mb-8" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>"{FOUNDER.quote}"</p>
          <div className="space-y-5 text-ink/80 mb-8 leading-relaxed">
            <p>Entered Ayurveda expecting to learn medicine — discovered something much bigger. Ayurveda is not just about treating illness. It is about helping people function at their highest potential.</p>
            <p>During my education and experience inside the Ministry of AYUSH, I saw a disconnect between ancient health wisdom and modern lifestyles. People were sleeping less, recovering poorly, feeling drained, seeking quick fixes.</p>
            <p>That is why I created 3Tattava. A doctor-led Performance Ayurveda brand designed for modern individuals who want to balance their foundations, build resilience and become their highest-performing selves.</p>
          </div>

          <div className="eyebrow text-ink/60 mb-4">Timeline</div>
          <div className="space-y-4 border-l-2 border-gold/30 pl-6">
            {FOUNDER.timeline.map((t) => (
              <div key={t.period}>
                <div className="eyebrow text-gold-dark text-[10px]">{t.period}</div>
                <div className="text-sm text-ink/80 mt-1">{t.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand statement */}
      <section className="section bg-ink text-cream text-center grain">
        <div className="max-w-4xl mx-auto">
          <div className="eyebrow text-gold mb-6">The Master Brand Statement</div>
          <p className="font-italic-light text-2xl md:text-3xl leading-relaxed" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>{BRAND.statement}</p>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="section bg-cream-deep/40">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-ink/10 p-10">
            <div className="eyebrow text-gold-dark mb-4">Mission</div>
            <h3 className="font-display text-3xl mb-5" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", lineHeight: 1.1 }}>Make Ayurveda relevant, practical, measurable.</h3>
            <p className="text-ink/75">{BRAND.mission}</p>
          </div>
          <div className="bg-white border border-ink/10 p-10">
            <div className="eyebrow text-gold-dark mb-4">Vision</div>
            <h3 className="font-display text-3xl mb-5" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", lineHeight: 1.1 }}>India's most trusted Performance Ayurveda ecosystem.</h3>
            <p className="text-ink/75">{BRAND.vision}</p>
          </div>
        </div>
      </section>

      <section className="section bg-cream text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl mb-6" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>Ready to begin your ritual?</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/shop" className="btn-outline-dark">Shop The Rituals <ArrowRight size={14} /></Link>
            <Link to="/assessment" className="btn-outline-dark">Take Performance Assessment</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
