"use client";

// Brief branded splash shown when the Shahjeet product page opens.
// Fades the Section-2 ("Swirl Ritual") card in, holds, then fades to the page.
// Click to skip. Reduced-motion → skipped instantly.

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function ShahjeetSplash() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (reduce) {
      setShow(false);
      return;
    }
    const t = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="shahjeet-splash"
          onClick={() => setShow(false)}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          aria-label="Shahjeet"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "radial-gradient(ellipse at 50% 45%, #2a1a0e 0%, #120c06 82%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/products/shahjeet/splash.jpg"
            alt="Shahjeet — Tear. Squeeze. Perform."
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              maxWidth: "min(78vw, 500px)",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: 16,
              boxShadow: "0 40px 100px rgba(0,0,0,.6)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
