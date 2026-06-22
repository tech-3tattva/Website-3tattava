import React from "react";
import { Link } from "react-router-dom";
import { ATHLETE, TESTIMONIALS } from "../lib/brandContent";
import { Users, Calendar, Trophy, Mic } from "lucide-react";

const EVENTS = [
  { date: "12 Feb 2026", title: "Mona Agarwal · Athlete Session", location: "WTF Punjabi Bagh", type: "Athlete Talk" },
  { date: "28 Feb 2026", title: "Performance Ayurveda Workshop", location: "WTF Cyber Hub, Gurgaon", type: "Workshop" },
  { date: "08 Mar 2026", title: "Dr. Kashish Live · Recovery & Sleep", location: "Online · Zoom", type: "Webinar" },
  { date: "21 Mar 2026", title: "30-Day Consistency Challenge Kick-off", location: "All WTF Locations", type: "Challenge" },
];

export default function Community() {
  return (
    <div data-testid="community-page" className="bg-cream">
      <section className="bg-ink text-cream py-24 px-6 md:px-16 grain relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=2200&q=80&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative max-w-7xl mx-auto">
          <div className="eyebrow text-gold mb-6"><Users size={14} className="inline mr-2" /> Community</div>
          <h1 className="font-display text-5xl md:text-7xl max-w-4xl" style={{ fontVariationSettings: "'wdth' 82, 'wght' 800", lineHeight: 1 }}>
            Performance Lives In <span className="gold-gradient-text">Communities.</span>
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-px bg-ink/10 border border-ink/10">
          {[
            { icon: Trophy, label: "Founding Athlete", n: "Mona Agarwal" },
            { icon: Users, label: "Experience Centers", n: "29+" },
            { icon: Calendar, label: "Events / Year", n: "60+" },
            { icon: Mic, label: "Podcast Episodes", n: "Coming Soon" },
          ].map((s) => (
            <div key={s.label} className="bg-white p-8 text-center">
              <s.icon size={20} className="text-gold mx-auto mb-3" />
              <div className="font-display text-2xl mb-1" style={{ fontVariationSettings: "'wdth' 80, 'wght' 700" }}>{s.n}</div>
              <div className="eyebrow text-[10px] text-ink/60">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-3t-black text-cream grain">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div className="relative">
            <img src={ATHLETE.photo} alt={ATHLETE.name} className="w-full h-[520px] object-cover" />
          </div>
          <div>
            <div className="eyebrow text-gold mb-4">Founding Athlete Ambassador</div>
            <h2 className="font-display text-4xl md:text-5xl mb-5" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", lineHeight: 1.05 }}>{ATHLETE.name}</h2>
            <p className="font-italic-light text-xl text-cream/80 mb-6" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>"{ATHLETE.quote}"</p>
            <p className="text-cream/70 mb-6">Paralympic Bronze Medalist. Founding Athlete of 3Tattava. Built on the principles of discipline, recovery, resilience and consistency — the same foundation of Performance Ayurveda.</p>
            <div className="grid grid-cols-2 gap-5">
              {ATHLETE.pillars.map((p) => (
                <div key={p.title} className="border-l border-gold/40 pl-4">
                  <div className="font-display text-lg" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>{p.title}</div>
                  <div className="text-xs text-cream/65 mt-1">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-ink/60 mb-4">Upcoming Events</div>
          <h2 className="font-display text-4xl md:text-5xl mb-12" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>Train. Learn. Recover. Grow.</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {EVENTS.map((e) => (
              <div key={e.title} className="luxe-card p-7 flex items-start gap-6" data-testid={`event-${e.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
                <div className="w-20 shrink-0 text-center">
                  <div className="eyebrow text-gold-dark text-[10px]">{e.date.split(" ")[1]}</div>
                  <div className="font-display text-3xl" style={{ fontVariationSettings: "'wdth' 80, 'wght' 800" }}>{e.date.split(" ")[0]}</div>
                  <div className="eyebrow text-[10px] text-ink/60">{e.date.split(" ")[2]}</div>
                </div>
                <div className="flex-1 border-l border-ink/10 pl-6">
                  <div className="eyebrow text-gold-dark mb-2 text-[10px]">{e.type}</div>
                  <div className="font-display text-xl mb-2" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{e.title}</div>
                  <div className="text-sm text-ink/70">{e.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream-deep/40">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-ink/60 mb-4">Community Stories</div>
          <h2 className="font-display text-3xl md:text-4xl mb-12" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>Real people. Real routines.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <div key={t.name} className="bg-white border border-ink/10 p-7">
                <div className="font-italic-light text-base mb-5" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>"{t.quote}"</div>
                <div className="font-display text-base" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{t.name}</div>
                <div className="eyebrow text-[10px] text-ink/60 mt-1">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink text-cream text-center">
        <h2 className="font-display text-3xl md:text-5xl max-w-3xl mx-auto" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700", lineHeight: 1.1 }}>
          Join the <span className="gold-gradient-text">Performance Ayurveda Movement.</span>
        </h2>
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Link to="/assessment" className="btn-primary">Take Assessment</Link>
          <Link to="/find-us" className="btn-outline">Find A Center</Link>
        </div>
      </section>
    </div>
  );
}
