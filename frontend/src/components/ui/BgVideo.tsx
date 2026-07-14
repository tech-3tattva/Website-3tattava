"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Absolutely-positioned background video with graceful fallback: if the file is
 * missing (404) or can't play, it removes itself so the parent's own background
 * shows through — nothing breaks before the asset is uploaded.
 *
 * Parent MUST be `position: relative`; foreground content should sit at a higher
 * `zIndex` than this layer (this layer is zIndex 0).
 */
export default function BgVideo({
  src,
  poster,
  scrim,
  opacity = 1,
  objectPosition = "center",
}: {
  src: string;
  poster?: string;
  /** optional overlay gradient/colour for text contrast */
  scrim?: string;
  opacity?: number;
  objectPosition?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const fail = () => setFailed(true);
    // The media error can fire before React attaches a synthetic handler, so
    // check the element directly and also listen going forward.
    if (v.error || v.networkState === 3 /* NETWORK_NO_SOURCE */) {
      fail();
      return;
    }
    v.addEventListener("error", fail);
    return () => v.removeEventListener("error", fail);
  }, []);

  if (failed) return null;

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <video
        ref={ref}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        src={src}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          opacity,
        }}
      />
      {scrim ? <div style={{ position: "absolute", inset: 0, background: scrim }} /> : null}
    </div>
  );
}
