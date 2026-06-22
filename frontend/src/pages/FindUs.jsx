import React, { useEffect, useState, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Phone, Navigation, Loader2, Target, Sparkles } from "lucide-react";
import { getLocations } from "../lib/api";
import ScrollReveal from "../components/ScrollReveal";

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
    <div style="width:42px;height:42px;border-radius:50% 50% 50% 0;background:linear-gradient(135deg,#E4C079,#C8963E);transform:rotate(-45deg);border:3px solid #1c1304;box-shadow:0 8px 24px rgba(200,150,62,0.6),0 0 0 10px rgba(200,150,62,0.18);"></div>
    <div style="position:absolute;left:50%;top:12px;width:14px;height:14px;border-radius:50%;background:#1c1304;transform:translateX(-50%);"></div>
  </div>`,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
});

const userIcon = L.divIcon({
  className: "",
  html: `<div style="position:relative;transform:translate(-50%,-50%);">
    <div style="width:18px;height:18px;border-radius:50%;background:#3B82F6;border:3px solid #fff;box-shadow:0 0 0 6px rgba(59,130,246,0.25);"></div>
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:36px;height:36px;border-radius:50%;background:rgba(59,130,246,0.25);animation:pulseRing 2s ease-out infinite;"></div>
  </div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FlyTo({ position, zoom = 14 }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, zoom, { duration: 1.0 });
  }, [position, zoom, map]);
  return null;
}

// Haversine distance in km
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export default function FindUs() {
  const [locs, setLocs] = useState([]);
  const [city, setCity] = useState("All");
  const [active, setActive] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [geoStatus, setGeoStatus] = useState("idle"); // idle | locating | done | denied | unsupported
  const listRef = useRef(null);

  useEffect(() => { getLocations().then(setLocs).catch(() => {}); }, []);

  // Auto-request once on mount (silent — browser shows permission prompt)
  useEffect(() => {
    if (!("geolocation" in navigator)) { setGeoStatus("unsupported"); return; }
  }, []);

  const locate = () => {
    if (!("geolocation" in navigator)) { setGeoStatus("unsupported"); return; }
    setGeoStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus("done");
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const cities = useMemo(() => ["All", ...Array.from(new Set(locs.map((l) => l.city)))], [locs]);

  const sorted = useMemo(() => {
    const base = city === "All" ? locs : locs.filter((l) => l.city === city);
    if (!userPos) return base;
    return [...base]
      .map((l) => ({ ...l, _km: distanceKm(userPos.lat, userPos.lng, l.lat, l.lng) }))
      .sort((a, b) => a._km - b._km);
  }, [locs, city, userPos]);

  const nearest = userPos && sorted[0];

  // Auto-select nearest after geo
  useEffect(() => {
    if (nearest && geoStatus === "done") setActive(nearest);
  }, [nearest, geoStatus]);

  const center = active ? [active.lat, active.lng] : userPos ? [userPos.lat, userPos.lng] : sorted.length ? [sorted[0].lat, sorted[0].lng] : [28.55, 77.20];
  const flyTarget = active ? [active.lat, active.lng] : userPos ? [userPos.lat, userPos.lng] : null;

  return (
    <div data-testid="find-us-page" className="bg-cream">
      <section className="bg-ink text-cream py-20 md:py-28 px-6 md:px-16 grain relative overflow-hidden">
        {/* Decorative SVG mountains in hero */}
        <svg className="absolute inset-x-0 bottom-0 w-full opacity-[0.12] pointer-events-none" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 200 L0 140 L180 60 L320 130 L520 50 L720 130 L920 70 L1100 140 L1280 80 L1440 130 L1440 200 Z" fill="#C8963E" />
        </svg>
        <div className="max-w-7xl mx-auto relative">
          <ScrollReveal>
            <div className="eyebrow text-gold mb-5">Find Us</div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl max-w-4xl" style={{ fontVariationSettings: "'wdth' 82, 'wght' 800", lineHeight: 1 }}>
              Experience 3Tattava <span className="gold-gradient-text">Offline.</span>
            </h1>
            <p className="font-italic-light text-base sm:text-lg md:text-xl text-cream/75 mt-5 max-w-2xl" style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>
              29+ WTF Fitness Experience Centers across NCR. Try the rituals. Meet the community.
            </p>
            <button
              onClick={locate}
              data-testid="locate-me"
              className="btn-primary mt-8 inline-flex items-center"
            >
              {geoStatus === "locating" ? <><Loader2 size={14} className="animate-spin" /> Locating…</> : <><Target size={14} /> Find My Nearest Center</>}
            </button>
            {geoStatus === "denied" && <div className="text-xs text-cream/60 mt-3" data-testid="geo-denied">Location access denied. Showing all centers — pick a city below.</div>}
            {geoStatus === "unsupported" && <div className="text-xs text-cream/60 mt-3">Your browser doesn't support geolocation. Pick a city below.</div>}
          </ScrollReveal>
        </div>
      </section>

      {/* Nearest banner */}
      {nearest && (
        <ScrollReveal>
          <div className="bg-gold/10 border-y border-gold/30 px-6 md:px-16 py-4" data-testid="nearest-banner">
            <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap">
              <Sparkles size={16} className="text-gold-dark" />
              <span className="eyebrow text-[11px] text-ink/70">Nearest to you</span>
              <span className="font-display text-lg" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{nearest.name}</span>
              <span className="text-xs text-ink/60">· {nearest._km.toFixed(1)} km away</span>
              <a href={`https://www.google.com/maps?q=${nearest.lat},${nearest.lng}`} target="_blank" rel="noreferrer" className="ml-auto eyebrow text-[10px] text-gold-dark hover:text-gold border-b border-gold-dark/40 pb-0.5">Get Directions →</a>
            </div>
          </div>
        </ScrollReveal>
      )}

      <section className="px-6 md:px-16 py-10 md:py-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-6 md:gap-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-5">
              {cities.map((c) => (
                <button key={c} onClick={() => setCity(c)} className={`eyebrow text-[10px] px-3 py-1.5 border transition ${city === c ? "bg-ink text-cream border-ink" : "border-ink/15 hover:border-gold"}`} data-testid={`city-filter-${c.toLowerCase()}`}>{c}</button>
              ))}
            </div>
            <div ref={listRef} className="max-h-[480px] lg:max-h-[600px] overflow-y-auto pr-1 space-y-3" data-testid="locations-list">
              {sorted.map((l, i) => (
                <button
                  key={l.id || l.name}
                  onClick={() => setActive(l)}
                  className={`w-full text-left p-4 md:p-5 border transition-all ${active?.name === l.name ? "border-gold bg-cream-deep/40" : "border-ink/10 bg-white hover:border-gold/50"}`}
                  data-testid={`location-${l.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gold mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display text-base" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{l.name}</span>
                        {userPos && i === 0 && <span className="eyebrow text-[9px] px-2 py-0.5 bg-gold text-ink">Nearest</span>}
                        {l._km !== undefined && <span className="eyebrow text-[10px] text-gold-dark">{l._km.toFixed(1)} km</span>}
                      </div>
                      <div className="text-xs text-ink/65 mt-1">{l.area}, {l.city}</div>
                      <div className="text-xs eyebrow text-gold-dark mt-2 flex items-center gap-1.5"><Phone size={10} /> {l.phone}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Leaflet map */}
          <div className="h-[420px] sm:h-[500px] lg:h-[600px] relative border border-ink/10 shadow-[0_22px_60px_rgba(28,19,4,0.10)] order-first lg:order-last" data-testid="leaflet-map">
            <MapContainer center={center} zoom={11} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {userPos && (
                <>
                  <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
                    <Popup><div style={{ fontFamily: "Archivo, sans-serif", fontSize: 12 }}>You are here</div></Popup>
                  </Marker>
                  <Circle center={[userPos.lat, userPos.lng]} radius={5000} pathOptions={{ color: "#3B82F6", weight: 1, fillOpacity: 0.04 }} />
                </>
              )}
              {sorted.map((l, i) => (
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
                      {l._km !== undefined && <div style={{ fontSize: 11, color: "#A67B2F", marginTop: 4 }}>{l._km.toFixed(1)} km away</div>}
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
              {flyTarget && <FlyTo position={flyTarget} zoom={active ? 14 : 12} />}
            </MapContainer>
            <div className="absolute top-3 left-3 z-[400] bg-ink text-cream px-3 py-1.5 eyebrow text-[10px] flex items-center gap-2" style={{ pointerEvents: "none" }}>
              <Navigation size={11} /> {sorted.length} Centers
              {userPos && <span className="text-gold ml-2">· Showing nearest first</span>}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream-deep/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-5 md:gap-6">
          {[
            { h: "Experience Products", b: "Try RockResin and Shahjeet before purchasing." },
            { h: "Attend Activations", b: "Workshops, athlete sessions, dosha assessments." },
            { h: "Meet The Community", b: "Train alongside people on the same journey." },
          ].map((c, i) => (
            <ScrollReveal key={c.h} delay={i * 120} className="bg-white border border-ink/10 p-6 md:p-7 hover:border-gold/40 transition">
              <div className="font-display text-lg md:text-xl mb-2" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700" }}>{c.h}</div>
              <p className="text-sm text-ink/70">{c.b}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
