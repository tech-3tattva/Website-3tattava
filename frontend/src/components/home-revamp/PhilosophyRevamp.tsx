'use client';
import { media } from "@/lib/media";

import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Data — Balance · Build · Become                                    */
/* ------------------------------------------------------------------ */

const pillars = [
  { title: 'Balance', description: 'Restore harmony in your body and mind for everyday wellness.' },
  { title: 'Build', description: 'Strengthen your energy, resilience, and healthy habits over time.' },
  { title: 'Become', description: 'Unlock your full potential with confidence, vitality, and purpose.' },
];

const FONT = 'var(--font-primary), system-ui, sans-serif';
const INK = '#442a1b';
const GOLD = '#cd872a';
const CREAM = '#f7f0e2';
const EASE = [0.16, 1, 0.3, 1] as const;

const CSS = `
  @keyframes philoPulse { 0% { transform: scale(1); opacity: .5; } 70% { transform: scale(2); opacity: 0; } 100% { opacity: 0; } }
  @media (max-width: 640px) { .philo-bbb { grid-template-columns: 1fr !important; gap: 24px !important; } }
  @media (prefers-reduced-motion: reduce) { .philo-ring { animation: none !important; } }
`;

export default function PhilosophyRevamp() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });
  const reduce = !!useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const open = () => setRevealed(true);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      style={{ background: CREAM, padding: '3rem 1.5rem 4.75rem', overflow: 'hidden' }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        {/* Intro copy */}
        <motion.p
          initial={reduce ? {} : { opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={reduce ? { duration: 0 } : { duration: 0.6 }}
          style={{
            fontFamily: FONT,
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            fontWeight: 500,
            lineHeight: 1.6,
            color: INK,
            maxWidth: 780,
            margin: '0 auto 2.5rem',
          }}
        >
          Every journey begins with balance. Build strength through daily rituals and become
          the best version of yourself with the power of Ayurveda.
        </motion.p>

        {/* Interactive trinity — hover the mark to form the full figure */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AnimatePresence mode="wait" initial={false}>
            {!revealed ? (
              <motion.button
                key="trigger"
                type="button"
                onMouseEnter={open}
                onFocus={open}
                onClick={open}
                aria-label="Reveal the Balance, Build, Become trinity"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : undefined}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={reduce ? { duration: 0.2 } : { duration: 0.45, delay: 0.1 }}
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 6,
                }}
              >
                <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!reduce && (
                    <span
                      className="philo-ring"
                      aria-hidden
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        border: `2px solid ${GOLD}`,
                        animation: 'philoPulse 2s ease-out infinite',
                      }}
                    />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <motion.img
                    src={media("/home/oc-trinity.png")}
                    alt=""
                    aria-hidden
                    width={66}
                    height={66}
                    whileHover={reduce ? {} : { scale: 1.08 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: 66, height: 'auto', display: 'block', position: 'relative', zIndex: 1 }}
                  />
                </span>
                <span style={{ fontFamily: FONT, fontSize: 11.5, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 600, color: GOLD }}>
                  Hover to reveal
                </span>
                <motion.span
                  aria-hidden
                  animate={reduce ? {} : { y: [0, 5, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ color: GOLD, fontSize: 16, lineHeight: 1 }}
                >
                  ↓
                </motion.span>
              </motion.button>
            ) : (
              <motion.div
                key="reveal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  src={media("/home/oc-trinity.png")}
                  alt="3tattava trinity — Balance, Build, Become"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={reduce ? { duration: 0.2 } : { duration: 0.75, ease: EASE }}
                  style={{ width: 'clamp(150px, 20vw, 220px)', height: 'auto', display: 'block', margin: '0.5rem auto 1.9rem' }}
                />
                <div
                  className="philo-bbb"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(20px, 3vw, 48px)', maxWidth: 840, margin: '0 auto' }}
                >
                  {pillars.map((p, i) => (
                    <motion.div
                      key={p.title}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={reduce ? { duration: 0.2 } : { duration: 0.5, delay: 0.3 + i * 0.13, ease: 'easeOut' }}
                    >
                      <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 'clamp(1.15rem, 2vw, 1.5rem)', color: INK, margin: '0 0 7px' }}>
                        {p.title}
                      </h3>
                      <p style={{ fontFamily: FONT, fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', lineHeight: 1.55, color: INK, opacity: 0.72, margin: '0 auto', maxWidth: 250 }}>
                        {p.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
