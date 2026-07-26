"use client";
import { media } from "@/lib/media";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const SPLASH_KEY = "3tattva-intro-played";
const TOTAL_MS = 1500;
const FADE_START_MS = 950;

export default function IntroSplash() {
  const [show, setShow] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SPLASH_KEY) === "true") return undefined;
      sessionStorage.setItem(SPLASH_KEY, "true");
    } catch {
      /* sessionStorage unavailable */
    }
    setShow(true);

    const fade = window.setTimeout(() => setFading(true), FADE_START_MS);
    const done = window.setTimeout(() => setShow(false), TOTAL_MS);

    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(done);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: fading ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fading ? 0.6 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 45%, #241a08 0%, #14100a 60%, #0b0805 100%)",
          }}
          aria-hidden
        >
          {/* Soft gold glow behind the wordmark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.55, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute"
            style={{
              width: "min(60vw, 620px)",
              height: "min(60vw, 620px)",
              background:
                "radial-gradient(circle, rgba(200,150,62,0.30) 0%, rgba(200,150,62,0.07) 45%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />

          <div className="relative flex flex-col items-center justify-center gap-6 px-6">
            {/* 3tattava wordmark — screen blend drops the black background so the
                letters glow against the dark canvas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
              style={{
                width: "min(72vw, 420px)",
                height: "min(22vw, 128px)",
                mixBlendMode: "screen",
              }}
            >
              <Image
                src={media("/logos/3tattava-wordmark.png")}
                alt="3tattava"
                fill
                priority
                sizes="420px"
                className="object-contain object-center"
                style={{
                  filter:
                    "sepia(0.55) saturate(2.2) hue-rotate(-7deg) brightness(1.18)",
                }}
              />
            </motion.div>

            {/* Gold underline that draws in */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="h-px w-40 origin-center"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #C8963E 20%, #E4C079 50%, #C8963E 80%, transparent)",
              }}
            />

            {/* Brand line */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
              className="text-[11px] sm:text-xs uppercase text-[#E4C079]"
              style={{
                fontFamily: "var(--font-primary), system-ui, sans-serif",
                letterSpacing: "0.42em",
              }}
            >
              Balance · Build · Become
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
