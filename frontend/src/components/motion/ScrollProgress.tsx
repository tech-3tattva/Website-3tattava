"use client";

import { motion, useScroll } from "framer-motion";

// Top scroll-progress bar — the same signature treatment used on the
// Shahjeet product page, applied site-wide.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        transformOrigin: "0% 50%",
        scaleX: scrollYProgress,
        background:
          "linear-gradient(105deg,#A67B2F 0%,#E4C079 45%,#cd872a 70%,#A67B2F 100%)",
        zIndex: 1200,
      }}
    />
  );
}
