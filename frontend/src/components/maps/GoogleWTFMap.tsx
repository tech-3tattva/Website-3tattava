"use client";

// ─── Google Maps view of the WTF Experience Centers ──────────────────────────
// Vector map (needs a Map ID) so we can tilt/rotate for a real 3D effect.
//  • variant "home"   → ambient: tilted, slowly auto-rotating, non-interactive.
//  • variant "findus" → interactive: animated pin drop, fits the filtered city,
//                        flies to the pincode "find nearest" result, info popups.
// Renders nothing unless BOTH env vars are set, so the site never breaks:
//   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID

import { useEffect, useMemo, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { WTF_CENTERS, gmapsLink, type WTFCenter } from "@/data/wtf-centers";

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

/** True only when both the API key and a (vector) Map ID are configured. */
export function hasGoogleMaps(): boolean {
  return Boolean(KEY && MAP_ID);
}

const NCR = { lat: 28.56, lng: 77.28 };

export interface GoogleWTFMapProps {
  variant?: "home" | "findus";
  /** Centers to plot (already filtered by the caller). Defaults to all. */
  centers?: WTFCenter[];
  /** Fly the camera here (e.g. the pincode-nearest result on Find Us). */
  focus?: { lat: number; lng: number } | null;
  className?: string;
}

function boundsLiteral(centers: WTFCenter[]) {
  const lats = centers.map((c) => c.lat);
  const lngs = centers.map((c) => c.lng);
  const pad = 0.03;
  return {
    north: Math.max(...lats) + pad,
    south: Math.min(...lats) - pad,
    east: Math.max(...lngs) + pad,
    west: Math.min(...lngs) - pad,
  };
}

/** Imperative camera director — auto-rotate (home) + fit/fly (findus). */
function CameraDirector({
  variant,
  centers,
  focus,
}: {
  variant: "home" | "findus";
  centers: WTFCenter[];
  focus?: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  const centersKey = centers.map((c) => c.id).join(",");

  // Home: tilt + slow rotation (paused for reduced-motion).
  useEffect(() => {
    if (!map || variant !== "home") return;
    map.moveCamera({ center: NCR, zoom: 10.3, tilt: 47.5, heading: 0 });
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let heading = 0;
    let raf = 0;
    const loop = () => {
      heading = (heading + 0.02) % 360;
      map.moveCamera({ heading });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [map, variant]);

  // Find Us: fit to the currently filtered centers.
  useEffect(() => {
    if (!map || variant !== "findus" || centers.length === 0) return;
    if (centers.length === 1) {
      map.moveCamera({ center: { lat: centers[0].lat, lng: centers[0].lng }, zoom: 13, tilt: 45 });
    } else {
      map.fitBounds(boundsLiteral(centers), 56);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, variant, centersKey]);

  // Find Us: fly to an explicit focus point (pincode search).
  useEffect(() => {
    if (!map || !focus) return;
    map.moveCamera({ center: focus, zoom: 12.5, tilt: 50, heading: 20 });
  }, [map, focus]);

  return null;
}

function MapInner({ variant, centers, focus }: Required<Pick<GoogleWTFMapProps, "variant">> & { centers: WTFCenter[]; focus?: { lat: number; lng: number } | null }) {
  const [active, setActive] = useState<WTFCenter | null>(null);
  const isHome = variant === "home";

  return (
    <Map
      mapId={MAP_ID}
      defaultCenter={NCR}
      defaultZoom={isHome ? 10.3 : 10}
      defaultTilt={isHome ? 47.5 : 0}
      defaultHeading={0}
      gestureHandling={isHome ? "none" : "greedy"}
      disableDefaultUI={isHome}
      zoomControl={!isHome}
      clickableIcons={false}
      reuseMaps
      colorScheme="DARK"
      style={{ width: "100%", height: "100%" }}
    >
      <CameraDirector variant={variant} centers={centers} focus={focus} />
      {centers.map((c, i) => (
        <AdvancedMarker
          key={c.id}
          position={{ lat: c.lat, lng: c.lng }}
          title={c.name}
          onClick={isHome ? undefined : () => setActive(c)}
        >
          <div className="gm-pin" style={{ animationDelay: `${Math.min(i * 35, 1200)}ms` }}>
            <span className="gm-pin-dot" />
          </div>
        </AdvancedMarker>
      ))}
      {!isHome && active && (
        <InfoWindow
          position={{ lat: active.lat, lng: active.lng }}
          onCloseClick={() => setActive(null)}
          pixelOffset={[0, -12]}
        >
          <div style={{ fontFamily: "var(--font-primary), system-ui, sans-serif", color: "#1a1208", maxWidth: 220 }}>
            <strong style={{ display: "block", fontSize: 13, marginBottom: 2 }}>{active.name}</strong>
            <span style={{ fontSize: 11, color: "#5c4a38", display: "block", marginBottom: 6 }}>{active.address}</span>
            <a
              href={gmapsLink(active)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 11, fontWeight: 700, color: "#a6631f", textTransform: "uppercase", letterSpacing: ".08em" }}
            >
              Directions →
            </a>
          </div>
        </InfoWindow>
      )}
    </Map>
  );
}

export default function GoogleWTFMap({ variant = "home", centers, focus, className }: GoogleWTFMapProps) {
  const list = useMemo(() => centers ?? WTF_CENTERS, [centers]);
  if (!hasGoogleMaps()) return null;
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <style>{`
        .gm-pin { position: relative; width: 16px; height: 16px; }
        .gm-pin-dot {
          display: block; width: 14px; height: 14px; border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #E4C079, #cd872a 70%);
          box-shadow: 0 0 0 3px rgba(205,135,42,.28), 0 2px 6px rgba(0,0,0,.55);
          animation: gmDrop .5s cubic-bezier(.16,1,.3,1) both, gmPulse 2.6s ease-in-out infinite;
        }
        @keyframes gmDrop { from { transform: translateY(-20px) scale(.4); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes gmPulse { 0%,100% { box-shadow: 0 0 0 3px rgba(205,135,42,.28), 0 2px 6px rgba(0,0,0,.55); } 50% { box-shadow: 0 0 0 8px rgba(205,135,42,0), 0 2px 6px rgba(0,0,0,.55); } }
        @media (prefers-reduced-motion: reduce) { .gm-pin-dot { animation: none; } }
      `}</style>
      <APIProvider apiKey={KEY!} libraries={["marker"]}>
        <MapInner variant={variant} centers={list} focus={focus} />
      </APIProvider>
    </div>
  );
}
