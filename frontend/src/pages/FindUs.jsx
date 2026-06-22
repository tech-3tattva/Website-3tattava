import React, { useEffect, useState } from "react";
import { MapPin, Phone, Navigation } from "lucide-react";
import { getLocations } from "../lib/api";

export default function FindUs() {
  const [locs, setLocs] = useState([]);
  const [city, setCity] = useState("All");
  const [active, setActive] = useState(null);
  useEffect(() => { getLocations().then(setLocs).catch(() => {}); }, []);

  const cities = ["All", ...Array.from(new Set(locs.map((l) => l.city)))];
  const filtered = city === "All" ? locs : locs.filter((l) => l.city === city);

  return (
    <div data-testid="find-us-page" className="bg-cream">
      <section className="bg-ink text-cream py-24 px-6 md:px-16 grain">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-gold mb-6">Find Us</div>
          <h1 className="font-display text-5xl md:text-7xl max-w-4xl" style={{ fontVariationSettings: "'wdth' 82, 'wght' 800", lineHeight: 1 }}>
            Experience 3Tattava <span className="gold-gradient-text">Offline.</span>
          </h1>
          <p className="font-italic-light text-xl text-cream/75 mt-6 max-w-2xl" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>
            29+ WTF Fitness Experience Centers across NCR. Try the rituals. Meet the community.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-16 py-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {cities.map((c) => (
                <button key={c} onClick={() => setCity(c)} className={`eyebrow text-[10px] px-3 py-1.5 border transition ${city === c ? "bg-ink text-cream border-ink" : "border-ink/15 hover:border-gold"}`} data-testid={`city-filter-${c.toLowerCase()}`}>{c}</button>
              ))}
            </div>
            <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3" data-testid="locations-list">
              {filtered.map((l) => (
                <button
                  key={l.id || l.name}
                  onClick={() => setActive(l)}
                  className={`w-full text-left p-5 border transition-all ${active?.name === l.name ? "border-gold bg-cream-deep/40" : "border-ink/10 bg-white hover:border-gold/50"}`}
                  data-testid={`location-${l.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gold mt-1 shrink-0" />
                    <div className="flex-1">
                      <div className="font-display text-base" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{l.name}</div>
                      <div className="text-xs text-ink/65 mt-1">{l.area}, {l.city}</div>
                      <div className="text-xs eyebrow text-gold-dark mt-2 flex items-center gap-1.5"><Phone size={10} /> {l.phone}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Map placeholder — stylized NCR grid */}
          <div className="bg-3t-black text-cream relative overflow-hidden min-h-[600px] grain">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, rgba(200,150,62,0.6) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div className="absolute inset-0 hero-overlay" />
            <div className="relative h-full flex flex-col">
              <div className="p-6 border-b border-gold/20">
                <div className="eyebrow text-gold text-[10px]"><Navigation size={11} className="inline mr-2" /> NCR Network</div>
                <div className="font-display text-2xl mt-2" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>29+ Experience Centers</div>
              </div>
              <div className="flex-1 relative p-6">
                {filtered.slice(0, 18).map((l, i) => {
                  // map lat/lng to relative position (NCR bounding box approx 28.3-28.8 lat, 76.9-77.5 lng)
                  const left = ((l.lng - 76.9) / 0.6) * 100;
                  const top = (1 - (l.lat - 28.3) / 0.5) * 100;
                  return (
                    <button
                      key={i}
                      onClick={() => setActive(l)}
                      style={{ left: `${Math.max(5, Math.min(95, left))}%`, top: `${Math.max(5, Math.min(90, top))}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group`}
                    >
                      <span className={`block w-3 h-3 rounded-full ${active?.name === l.name ? "bg-gold ring-4 ring-gold/30" : "bg-gold/60 hover:bg-gold"} transition-all`} />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 eyebrow text-[9px] text-cream/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">{l.name}</span>
                    </button>
                  );
                })}
              </div>
              {active && (
                <div className="p-6 border-t border-gold/20 bg-3t-black-2" data-testid="active-location-card">
                  <div className="eyebrow text-gold mb-2 text-[10px]">Selected</div>
                  <div className="font-display text-xl mb-1" style={{ fontVariationSettings: "'wdth' 85, 'wght' 700" }}>{active.name}</div>
                  <div className="text-sm text-cream/70">{active.area}, {active.city}</div>
                  <div className="text-xs eyebrow text-gold mt-3 flex items-center gap-2"><Phone size={11} /> {active.phone}</div>
                  <div className="mt-4 flex gap-3 text-xs eyebrow">
                    <a href={`https://www.google.com/maps?q=${active.lat},${active.lng}`} target="_blank" rel="noreferrer" className="px-4 py-2 border border-gold/40 hover:bg-gold hover:text-ink transition">Get Directions</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream-deep/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { h: "Experience Products", b: "Try RockResin and Shahjeet before purchasing." },
            { h: "Attend Activations", b: "Workshops, athlete sessions, dosha assessments." },
            { h: "Meet The Community", b: "Train alongside people on the same journey." },
          ].map((c) => (
            <div key={c.h} className="bg-white border border-ink/10 p-7">
              <div className="font-display text-xl mb-2" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{c.h}</div>
              <p className="text-sm text-ink/70">{c.b}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
