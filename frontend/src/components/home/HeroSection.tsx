'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

interface Particle {
  id: number
  size: number
  top: number
  left: number
  opacity: number
  duration: number
  delay: number
}

const heroCSS = `
  .hero-section-v2 {
    position: relative;
    min-height: 92vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    background: #2a1608;
  }

  /* ── Placeholder backdrop (replaced by real asset when available) ── */
  .hero-bg-placeholder {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 70% 40%, rgba(100,50,10,0.45) 0%, transparent 70%),
      linear-gradient(160deg, #1a0d04 0%, #2e1508 40%, #1a0d04 100%);
    z-index: 0;
  }
  /* Himalayan texture grain overlay */
  .hero-grain {
    position: absolute;
    inset: 0;
    z-index: 1;
    opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    pointer-events: none;
  }
  /* Warm Himalayan tonal overlay */
  .hero-overlay-v2 {
    position: absolute;
    inset: 0;
    background: rgba(68, 42, 27, 0.55);
    z-index: 2;
  }

  /* ── Content ── */
  .hero-content-v2 {
    position: relative;
    z-index: 10;
    width: 100%;
    padding: 0 clamp(32px, 8vw, 128px);
    padding-top: 80px;
  }

  /* ── Entrance animations ── */
  @keyframes hv2FadeUp {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes hv2ScaleIn {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes hv2Bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50%       { transform: translateX(-50%) translateY(6px); }
  }
  @keyframes hv2Pulse {
    0%, 100% { opacity: 0.8; transform: scaleY(1); }
    50%       { opacity: 0.2; transform: scaleY(0.4); }
  }
  @keyframes particleRise {
    0%   { transform: translateY(0) scale(1); opacity: var(--op); }
    100% { transform: translateY(-28px) scale(0.5); opacity: 0; }
  }

  .hero-eyebrow-v2 {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #cd872a;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: hv2FadeUp 0.6s ease both;
    animation-delay: 0.15s;
  }
  .hero-eyebrow-v2::before {
    content: '';
    display: block;
    width: 40px;
    height: 1px;
    background: #cd872a;
    transform-origin: left;
    animation: hv2ScaleIn 0.5s ease both;
    animation-delay: 0.3s;
    flex-shrink: 0;
  }

  .hero-headline-v2 {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(58px, 9vw, 104px);
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.0;
    color: #f7f0e2;
    margin: 0 0 18px 0;
    animation: hv2FadeUp 0.9s ease both;
    animation-delay: 0.3s;
  }

  .hero-sub-v2 {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: clamp(16px, 2.2vw, 22px);
    font-weight: 300;
    line-height: 1.55;
    color: rgba(247,240,226,0.75);
    max-width: 580px;
    margin: 0 0 52px 0;
    animation: hv2FadeUp 0.7s ease both;
    animation-delay: 0.55s;
  }

  .hero-cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    animation: hv2FadeUp 0.6s ease both;
    animation-delay: 0.75s;
  }

  .hero-btn-main {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    background: #f7f0e2;
    color: #442a1b;
    border: none;
    border-radius: 12px;
    padding: 17px 32px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
  .hero-btn-main:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(68,42,27,.22);
    background: #ffffff;
  }
  .hero-btn-main:focus-visible {
    outline: 2px solid #cd872a;
    outline-offset: 3px;
  }

  .hero-btn-ghost {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    background: transparent;
    color: #f7f0e2;
    border: 1.5px solid rgba(247,240,226,0.35);
    border-radius: 12px;
    padding: 17px 32px;
    cursor: pointer;
    transition: border-color 0.25s ease, background 0.25s ease, transform 0.2s ease;
  }
  .hero-btn-ghost:hover {
    border-color: rgba(205,135,42,0.8);
    background: rgba(205,135,42,0.10);
    transform: translateY(-1px);
  }
  .hero-btn-ghost:focus-visible {
    outline: 2px solid #cd872a;
    outline-offset: 3px;
  }

  /* ── Trust micro-row (animated in) ── */
  .hero-trust-micro {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-top: 52px;
    padding-top: 28px;
    border-top: 1px solid rgba(247,240,226,0.12);
    animation: hv2FadeUp 0.5s ease both;
    animation-delay: 1.0s;
  }
  .hero-trust-item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(247,240,226,0.55);
  }
  .hero-trust-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #cd872a;
    flex-shrink: 0;
  }

  /* ── Scroll cue ── */
  .hero-scroll-cue {
    position: absolute;
    bottom: 36px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    animation: hv2FadeUp 0.6s ease both;
    animation-delay: 1.4s;
  }
  .hero-scroll-chevron {
    width: 22px;
    height: 22px;
    border-right: 1.5px solid #cd872a;
    border-bottom: 1.5px solid #cd872a;
    transform: rotate(45deg);
    animation: hv2Bounce 1.8s ease-in-out infinite;
    opacity: 0.7;
  }
  .hero-scroll-label {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 9px;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: rgba(247,240,226,0.35);
  }

  /* ── Gold particles ── */
  .hero-particles-v2 {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 3;
  }
  .hero-particle {
    position: absolute;
    border-radius: 50%;
    background: #cd872a;
    animation: particleRise var(--dur) ease-in-out var(--delay) infinite alternate;
  }

  /* ── Right-side decorative mountain silhouette ── */
  .hero-mountain-deco {
    position: absolute;
    right: 0;
    bottom: 0;
    width: clamp(280px, 45vw, 680px);
    height: 100%;
    z-index: 4;
    pointer-events: none;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(68,42,27,0.12) 50%,
      rgba(68,42,27,0.22) 100%
    );
    clip-path: polygon(40% 100%, 60% 30%, 75% 55%, 85% 20%, 100% 45%, 100% 100%);
    opacity: 0.6;
  }

  /* ── Mobile ── */
  @media (max-width: 640px) {
    .hero-content-v2 {
      padding: 80px 24px 0;
    }
    .hero-headline-v2 {
      font-size: 52px;
    }
    .hero-trust-micro {
      gap: 14px;
    }
  }
`

export default function HeroSection() {
  const router = useRouter()
  const [particles, setParticles] = useState<Particle[]>([])
  const heroRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const decoY = useTransform(scrollYProgress, [0, 1], [0, 70])

  useEffect(() => {
    setParticles(
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        size: Math.random() * 2.5 + 1,
        top: Math.random() * 88 + 4,
        left: Math.random() * 88 + 4,
        opacity: Math.random() * 0.30 + 0.08,
        duration: Math.random() * 5 + 4,
        delay: Math.random() * 7,
      }))
    )
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: heroCSS }} />

      <section className="hero-section-v2" aria-label="Hero" ref={heroRef}>
        {/* Background video */}
        <video
          autoPlay muted loop playsInline
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
          src="https://media.3tattava.com/videos/week-bg.mp4"
        />
        {/* Gradient fallback (shows until video loads) */}
        <div className="hero-bg-placeholder" aria-hidden />
        <div className="hero-grain" aria-hidden />
        <div className="hero-overlay-v2" aria-hidden />
        <motion.div className="hero-mountain-deco" aria-hidden style={reduce ? undefined : { y: decoY }} />

        {/* Gold particles */}
        <div className="hero-particles-v2" aria-hidden>
          {particles.map((p) => (
            <div
              key={p.id}
              className="hero-particle"
              style={{
                width: p.size,
                height: p.size,
                top: `${p.top}%`,
                left: `${p.left}%`,
                '--op': p.opacity,
                '--dur': `${p.duration}s`,
                '--delay': `${p.delay}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <motion.div className="hero-content-v2" style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}>
          {/* Eyebrow */}
          <p className="hero-eyebrow-v2">Doctor Led Performance Ayurveda™</p>

          {/* Main headline */}
          <h1 className="hero-headline-v2">
            Balance.<br />Build.<br />Become.
          </h1>

          {/* Sub-headline */}
          <p className="hero-sub-v2">
            Ancient Ayurvedic Intelligence For Modern Human Performance.
          </p>

          {/* CTAs */}
          <div className="hero-cta-row">
            <button
              className="hero-btn-main"
              onClick={() => router.push('#choose-ritual')}
            >
              Explore The Ritual
            </button>
            <button
              className="hero-btn-ghost"
              onClick={() => router.push('#knowledge-center')}
            >
              Learn Before You Buy
            </button>
          </div>

          {/* Trust micro-strip */}
          <div className="hero-trust-micro" role="list" aria-label="Trust markers">
            {['Doctor-Led', 'Athlete-Backed', 'Lab-Tested', 'Experience-Driven'].map((t) => (
              <span key={t} className="hero-trust-item" role="listitem">
                <span className="hero-trust-dot" aria-hidden />
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Scroll cue */}
        <div className="hero-scroll-cue" aria-hidden>
          <span className="hero-scroll-label">Scroll</span>
          <div className="hero-scroll-chevron" />
        </div>
      </section>
    </>
  )
}
