"use client";

// ─── Animated geo-tagged map of the WTF Experience Centers (Delhi NCR) ───────
// React-Leaflet, dark CartoDB tiles, pulsing amber pins, fly-to intro.
// Rendered client-only (dynamic ssr:false) — Leaflet needs `window`.

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { WTF_CENTERS, gmapsLink } from "@/data/wtf-centers";

const NCR_CENTER: [number, number] = [28.56, 77.28];

const pinIcon = L.divIcon({
  className: "wtf-pin-wrap",
  html: '<span class="wtf-pin"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8],
});

function FitToCenters({ animate }: { animate: boolean }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(
      WTF_CENTERS.map((c) => [c.lat, c.lng] as [number, number]),
    );
    if (animate) {
      map.flyToBounds(bounds, { padding: [48, 48], duration: 1.7, easeLinearity: 0.18 });
    } else {
      map.fitBounds(bounds, { padding: [48, 48] });
    }
  }, [map, animate]);
  return null;
}

export default function WTFLeafletMap() {
  const reduce =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="wtf-leaflet-shell">
      <style>{`
        .wtf-leaflet-shell { position: relative; height: 100%; width: 100%; isolation: isolate; }
        .wtf-leaflet-shell .leaflet-container {
          height: 100%; width: 100%; background: #1a1208;
          font-family: var(--font-primary), system-ui, sans-serif;
        }
        .wtf-pin {
          display: block; width: 13px; height: 13px; border-radius: 50%;
          background: #cd872a; box-shadow: 0 0 0 2px rgba(247,240,226,.65), 0 0 10px rgba(205,135,42,.9);
          position: relative;
        }
        .wtf-pin::after {
          content: ""; position: absolute; left: 50%; top: 50%;
          width: 13px; height: 13px; margin: -6.5px 0 0 -6.5px; border-radius: 50%;
          background: rgba(205,135,42,.55); animation: wtfpulse 2.4s ease-out infinite;
        }
        @keyframes wtfpulse {
          0%   { transform: scale(1);   opacity: .7; }
          100% { transform: scale(3.4); opacity: 0;  }
        }
        @media (prefers-reduced-motion: reduce) { .wtf-pin::after { animation: none; } }
        .wtf-leaflet-shell .leaflet-popup-content-wrapper {
          border-radius: 3px; background: #f7f0e2; color: #442a1b;
          box-shadow: 0 10px 30px rgba(0,0,0,.4);
        }
        .wtf-leaflet-shell .leaflet-popup-tip { background: #f7f0e2; }
        .wtf-popup-name { font-weight: 700; font-size: 13px; color: #442a1b; margin: 0 0 2px; }
        .wtf-popup-city { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #cd872a; margin: 0 0 6px; }
        .wtf-popup-addr { font-size: 11px; line-height: 1.5; color: #6f5a48; margin: 0 0 8px; }
        .wtf-popup-link { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #cd872a; text-decoration: none; }
      `}</style>
      <MapContainer
        center={NCR_CENTER}
        zoom={9}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        {WTF_CENTERS.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]} icon={pinIcon}>
            <Popup>
              <p className="wtf-popup-name">{c.name}</p>
              <p className="wtf-popup-city">{c.city}</p>
              <p className="wtf-popup-addr">{c.address}</p>
              <a
                className="wtf-popup-link"
                href={gmapsLink(c)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions →
              </a>
            </Popup>
          </Marker>
        ))}
        <FitToCenters animate={!reduce} />
      </MapContainer>
    </div>
  );
}
