import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Phone, Navigation } from "lucide-react";
import { getLocations } from "../lib/api";

// Custom gold pin icon (no default leaflet asset bundling needed)
const goldIcon = L.divIcon({
  className: "",
  html: `<div style="position:relative;transform:translate(-50%,-100%);">
    <div style="width:30px;height:30px;border-radius:50% 50% 50% 0;background:linear-gradient(135deg,#E4C079,#C8963E);transform:rotate(-45deg);border:2px solid #1c1304;box-shadow:0 4px 12px rgba(28,19,4,0.4);"></div>
    <div style="position:absolute;left:50%;top:9px;width:10px;height:10px;border-radius:50%;background:#1c1304;transform:translateX(-50%);"></div>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const activeIcon = L.divIcon({
  className: "",
  html: `<div style="position:relative;transform:translate(-50%,-100%);">
    <div style="width:38px;height:38px;border-radius:50% 50% 50% 0;background:linear-gradient(135deg,#E4C079,#C8963E);transform:rotate(-45deg);border:3px solid #1c1304;box-shadow:0 6px 18px rgba(200,150,62,0.6),0 0 0 8px rgba(200,150,62,0.15);"></div>
    <div style="position:absolute;left:50%;top:11px;width:12px;height:12px;border-radius:50%;background:#1c1304;transform:translateX(-50%);"></div>
  </div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 14, { duration: 0.9 });
  }, [position, map]);
  return null;
}

export default function FindUs() {
  const [locs, setLocs] = useState([]);
  const [city, setCity] = useState("All");
  const [active, setActive] = useState(null);
  const listRef = useRef(null);

  useEffect(() => { getLocations().then(setLocs).catch(() => {}); }, []);

  const cities = ["All", ...Array.from(new Set(locs.map((l) => l.city)))];
  const filtered = city === "All" ? locs : locs.filter((l) => l.city === city);
  const center = filtered.length ? [filtered[0].lat, filtered[0].lng] : [28.55, 77.20];

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
            <div ref={listRef} className="max-h-[600px] overflow-y-auto pr-2 space-y-3" data-testid="locations-list">
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

          {/* Leaflet/OSM map */}
          <div className="h-[600px] relative border border-ink/10 shadow-[0_22px_60px_rgba(28,19,4,0.10)]" data-testid="leaflet-map">
            <MapContainer center={center} zoom={11} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {filtered.map((l, i) => (
                <Marker
                  key={i}
                  position={[l.lat, l.lng]}
                  icon={active?.name === l.name ? activeIcon : goldIcon}
                  eventHandlers={{ click: () => setActive(l) }}
                >
                  <Popup>
                    <div style={{ fontFamily: "Archivo, sans-serif" }}>
                      <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#A67B2F" }}>WTF Center</div>
                      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{l.name}</div>
                      <div style={{ fontSize: 12, color: "#6b5e45", marginTop: 4 }}>{l.area}, {l.city}</div>
                      <div style={{ fontSize: 12, marginTop: 6, color: "#A67B2F", fontWeight: 600 }}>{l.phone}</div>
                      <a
                        href={`https://www.google.com/maps?q=${l.lat},${l.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: "inline-block", marginTop: 8, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", color: "#1c1304", borderBottom: "1px solid #C8963E", paddingBottom: 2 }}
                      >
                        Get Directions →
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
              {active && <FlyTo position={[active.lat, active.lng]} />}
            </MapContainer>
            <div className="absolute top-4 left-4 z-[400] bg-ink text-cream px-4 py-2 eyebrow text-[10px]" style={{ pointerEvents: "none" }}>
              <Navigation size={11} className="inline mr-2" /> {filtered.length} Centers · NCR
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
