'use client'
import { media } from "@/lib/media";

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import StartRitualButton from "@/components/StartRitualButton";

/* ─── Types ─── */
interface Particle {
  id: number
  size: number
  top: number
  left: number
  opacity: number
  driftX: number
  driftY: number
  duration: number
  delay: number
}

/* ─── CSS ─── */
const heroCSS = `
  .hero-revamp {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1c1304;
  }

  /* ── Video / Image background ── */
  .hero-revamp-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    pointer-events: none;
  }
  .hero-revamp-poster {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  /* ── Gradient overlay ── */
  .hero-revamp-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(28,19,4,0.3), rgba(28,19,4,0.85));
    z-index: 1;
  }

  /* ── Content ── */
  .hero-revamp-content {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 1160px;
    text-align: center;
    padding: 0 clamp(24px, 6vw, 80px);
    margin-top: clamp(72px, 13vh, 170px);
  }

  /* ── Eyebrow ── */
  .hero-revamp-eyebrow {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #cd872a;
    margin-bottom: 24px;
    font-weight: 700;
  }

  /* ── Headline — large serif ── */
  .hero-revamp-h1 {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(32px, 7vw, 88px);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.05;
    color: #f7f0e2;
    margin: 0 0 4px 0;
    white-space: nowrap;
  }

  /* ── Tagline with gold gradient ── */
  .hero-revamp-tagline {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: clamp(20px, 3.5vw, 36px);
    font-weight: 600;
    letter-spacing: 0.04em;
    margin: -10px 0 16px 0;
    background: linear-gradient(135deg, #cd872a 0%, #e8b86d 50%, #cd872a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── CTA row ── */
  .hero-revamp-ctas {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .hero-revamp-btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: none;
    background: linear-gradient(135deg, #cd872a 0%, #e8b86d 50%, #cd872a 100%);
    background-size: 200% 100%;
    background-position: 0% 50%;
    color: #1c1304;
    border: none;
    border-radius: 12px;
    padding: 18px 46px;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease, background-position 0.6s ease;
  }
  .hero-revamp-btn-primary:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 34px rgba(205,135,42,0.45);
    background-position: 100% 50%;
  }
  .hero-revamp-btn-primary:focus-visible {
    outline: 2px solid #f7f0e2;
    outline-offset: 3px;
  }


  /* ── Scroll indicator ── */
  @keyframes heroRevampBounce {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(8px); }
  }
  .hero-revamp-scroll-cue {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .hero-revamp-scroll-cue img {
    width: 24px;
    height: 24px;
    opacity: 0.6;
    animation: heroRevampBounce 2s ease-in-out infinite;
  }

  /* ── Floating particles ── */
  @keyframes heroParticleDrift {
    0%   { transform: translate(0, 0); opacity: var(--p-op); }
    50%  { transform: translate(var(--p-dx), var(--p-dy)); opacity: calc(var(--p-op) * 0.4); }
    100% { transform: translate(0, 0); opacity: var(--p-op); }
  }
  .hero-revamp-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;
  }
  .hero-revamp-particle {
    position: absolute;
    border-radius: 50%;
    background: #cd872a;
    animation: heroParticleDrift var(--p-dur) ease-in-out var(--p-delay) infinite;
  }

  /* ── Mobile ── */
  @media (max-width: 640px) {
    .hero-revamp-ctas {
      flex-direction: column;
      align-items: center;
    }
    .hero-revamp-btn-primary {
      width: 100%;
      max-width: 320px;
    }
  }
`

/* ─── Stagger variants ─── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const fadeUpVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export default function HeroRevamp() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80])

  /* Generate particles client-side */
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 640px)').matches
    setIsMobile(mobile)

    setParticles(
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1.5,
        top: Math.random() * 85 + 5,
        left: Math.random() * 90 + 5,
        opacity: Math.random() * 0.25 + 0.1,
        driftX: (Math.random() - 0.5) * 40,
        driftY: (Math.random() - 0.5) * 30,
        duration: Math.random() * 6 + 5,
        delay: Math.random() * 4,
      }))
    )
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: heroCSS }} />

      <section className="hero-revamp" aria-label="Hero" ref={heroRef}>
        {/* Background: video on desktop, image on mobile */}
        {!isMobile ? (
          <video
            className="hero-revamp-video"
            autoPlay
            muted
            loop
            playsInline
            poster={media("/hero/himalaya-bg.png")}
            aria-hidden="true"
          >
            <source src={media("/videos/shahjeet-reveal.mp4")} type="video/mp4" />
          </video>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className="hero-revamp-poster"
            src={media("/hero/himalaya-bg.png")}
            alt=""
            fetchPriority="high"
            decoding="async"
            aria-hidden="true"
          />
        )}

        {/* Dark gradient overlay */}
        <div className="hero-revamp-overlay" aria-hidden="true" />

        {/* Floating golden particles */}
        <div className="hero-revamp-particles" aria-hidden="true">
          {particles.map((p) => (
            <div
              key={p.id}
              className="hero-revamp-particle"
              style={{
                width: p.size,
                height: p.size,
                top: `${p.top}%`,
                left: `${p.left}%`,
                '--p-op': p.opacity,
                '--p-dx': `${p.driftX}px`,
                '--p-dy': `${p.driftY}px`,
                '--p-dur': `${p.duration}s`,
                '--p-delay': `${p.delay}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Content */}
        <motion.div
          className="hero-revamp-content"
          style={reduce ? undefined : { y: contentY }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="hero-revamp-eyebrow" variants={fadeUpVariant}>
            Doctor-Led Performance Ayurveda
          </motion.p>

          <motion.h1 className="hero-revamp-h1" variants={fadeUpVariant}>
            Ancient Wisdom.<br />
            Modern Vitality.
          </motion.h1>

          <motion.h2 className="hero-revamp-tagline" variants={fadeUpVariant}>
            Balance. Build. Become.
          </motion.h2>

          <motion.div className="hero-revamp-ctas" variants={fadeUpVariant}>
            <StartRitualButton className="hero-revamp-btn-primary">
              Start Your Ritual
            </StartRitualButton>
          </motion.div>
        </motion.div>

        {/* Scroll indicator — bouncing chevron */}
        <motion.div
          className="hero-revamp-scroll-cue"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media("/icons/chevron-down.svg")} alt="" />
        </motion.div>
      </section>
    </>
  )
}
