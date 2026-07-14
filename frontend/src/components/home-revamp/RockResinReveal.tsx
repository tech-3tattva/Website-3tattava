"use client";
import { media } from "@/lib/media";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const F = "var(--font-primary), system-ui, sans-serif";

export default function RockResinReveal() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section
      id="rockresin-reveal"
      ref={ref}
      style={{
        position: "relative",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#0a0604",
      }}
    >
      {/* Background image with mist effect */}
      <div style={{ position: "absolute", inset: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media("/hero/rockresin-teaser.png")}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: inView ? 0.6 : 0,
            transition: "opacity 2s ease",
            filter: "blur(2px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, rgba(10,6,4,0.3) 0%, rgba(10,6,4,0.85) 70%)",
          }}
        />
      </div>

      {/* Floating mist particles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 300 + i * 80,
              height: 120 + i * 30,
              borderRadius: "50%",
              background: `radial-gradient(ellipse, rgba(205,135,42,${0.03 + i * 0.01}) 0%, transparent 70%)`,
              bottom: `${10 + i * 15}%`,
              left: `${-10 + i * 20}%`,
              animation: `mist-drift-${i} ${12 + i * 3}s ease-in-out infinite`,
            }}
          />
        ))}
        <style jsx>{`
          @keyframes mist-drift-0 { 0%, 100% { transform: translateX(0) translateY(0); } 50% { transform: translateX(40px) translateY(-20px); } }
          @keyframes mist-drift-1 { 0%, 100% { transform: translateX(0) translateY(0); } 50% { transform: translateX(-30px) translateY(-15px); } }
          @keyframes mist-drift-2 { 0%, 100% { transform: translateX(0) translateY(0); } 50% { transform: translateX(50px) translateY(-10px); } }
          @keyframes mist-drift-3 { 0%, 100% { transform: translateX(0) translateY(0); } 50% { transform: translateX(-40px) translateY(-25px); } }
          @keyframes mist-drift-4 { 0%, 100% { transform: translateX(0) translateY(0); } 50% { transform: translateX(30px) translateY(-20px); } }
        `}</style>
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 600, padding: "60px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <p style={{ fontFamily: F, fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "#cd872a", marginBottom: 16, fontWeight: 700 }}>
            Unveiling Soon
          </p>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          style={{
            fontFamily: F,
            fontVariationSettings: "'wdth' 85, 'wght' 800",
            fontSize: "clamp(32px, 5vw, 52px)",
            lineHeight: 1.1,
            color: "#f7f0e2",
            marginBottom: 16,
          }}
        >
          RockResin
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.9 }}
          style={{
            fontFamily: F,
            fontSize: "clamp(14px, 2vw, 18px)",
            color: "rgba(247,240,226,0.6)",
            lineHeight: 1.6,
            marginBottom: 8,
          }}
        >
          Shodhit Shilajit Resin · Ancient Mineral Elixir for Modern Vitality
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1 }}
          style={{
            fontFamily: F,
            fontSize: 13,
            color: "rgba(247,240,226,0.4)",
            letterSpacing: "0.08em",
            marginBottom: 32,
          }}
        >
          Rasayanam · Balyam · Jeevnay
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.1 }}
          style={{
            fontFamily: F,
            fontSize: 14,
            color: "rgba(247,240,226,0.55)",
            lineHeight: 1.7,
            marginBottom: 36,
          }}
        >
          Energy to your body at the core. Strength that builds within. Longevity for the long run.
          <br />
          Harvested from mineral-rich rocks at elevations above 16,000 ft.
        </motion.p>

        {/* Notify me form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.3 }}
        >
          {submitted ? (
            <div style={{ fontFamily: F, fontSize: 14, color: "#cd872a", fontWeight: 700, letterSpacing: "0.08em" }}>
              ✓ You&apos;re on the list. We&apos;ll notify you at launch.
            </div>
          ) : (
            <form onSubmit={handleNotify} style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  fontFamily: F,
                  fontSize: 14,
                  padding: "12px 18px",
                  background: "rgba(247,240,226,0.08)",
                  border: "1px solid rgba(205,135,42,0.3)",
                  borderRadius: 4,
                  color: "#f7f0e2",
                  outline: "none",
                  width: 260,
                  backdropFilter: "blur(8px)",
                }}
              />
              <button
                type="submit"
                style={{
                  fontFamily: F,
                  fontVariationSettings: "'wdth' 85, 'wght' 700",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#442a1b",
                  background: "linear-gradient(105deg, #A67B2F, #E4C079, #cd872a, #A67B2F)",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Notify Me
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
