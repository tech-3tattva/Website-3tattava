"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MAHABHUTA_SEQUENCE } from "@/components/vectors/splash/MahabhutaElements";

const SPLASH_KEY = "3tattva-intro-played";
const TOTAL_MS = 3000;
const FADE_START_MS = 2400;

export default function IntroSplash() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"enter" | "gather" | "out">("enter");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SPLASH_KEY) === "true") return undefined;
      sessionStorage.setItem(SPLASH_KEY, "true");
    } catch {
      /* sessionStorage unavailable */
    }
    setShow(true);

    const gather = window.setTimeout(() => setPhase("gather"), 1100);
    const fade = window.setTimeout(() => setPhase("out"), FADE_START_MS);
    const done = window.setTimeout(() => setShow(false), TOTAL_MS);

    return () => {
      window.clearTimeout(gather);
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
          animate={{ opacity: phase === "out" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: phase === "out" ? 0.55 : 0.35 }}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 45%, #2a221c 0%, #0f0c0a 65%, #080706 100%)",
            ["--splash-gold" as string]: "#D4A574",
          }}
          aria-hidden
        >
          <div className="relative flex flex-col items-center justify-center gap-10 px-6">
            <motion.div
              className="relative flex items-center justify-center gap-2 sm:gap-4 md:gap-6"
              animate={
                phase === "gather"
                  ? { gap: "0.35rem" }
                  : phase === "out"
                    ? { gap: "0.25rem", scale: 0.92 }
                    : { gap: "1rem" }
              }
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              {MAHABHUTA_SEQUENCE.map(({ id, label, Glyph }, i) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, scale: 0.2, y: 36, rotate: -12 }}
                  animate={
                    phase === "gather" || phase === "out"
                      ? {
                          opacity: phase === "out" ? 0.25 : 1,
                          scale: 1,
                          y: 0,
                          rotate: 0,
                        }
                      : {
                          opacity: 1,
                          scale: 1,
                          y: 0,
                          rotate: 0,
                        }
                  }
                  transition={{
                    delay: i * 0.12,
                    duration: 0.75,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex flex-col items-center"
                  title={label}
                >
                  <Glyph className="h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14" />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: phase === "gather" || phase === "out" ? 1 : 0,
                y: phase === "out" ? -8 : 0,
              }}
              transition={{ duration: 0.5, delay: phase === "enter" ? 0.9 : 0 }}
              className="pointer-events-none text-center"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: phase === "gather" || phase === "out" ? 1 : 0 }}
                transition={{ duration: 0.45, delay: 1.05 }}
                className="mx-auto mb-4 h-px w-32 origin-center bg-gold/60"
              />
              <p
                className="font-display text-3xl sm:text-4xl tracking-[0.12em] text-[#E8C99A]"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                3tattava
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-white/45">
                Pancha Mahabhuta · The five elements
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
