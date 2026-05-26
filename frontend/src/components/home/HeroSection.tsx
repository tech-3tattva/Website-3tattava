'use client'
import { useEffect, useState } from 'react'

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
  .hero-section {
    position: relative;
    height: 100vh;
    min-height: 700px;
    overflow: hidden;
    display: flex;
    align-items: center;
    background: #1A1A1A;
  }
  .hero-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      115deg,
      rgba(26,26,26,0.96) 0%,
      rgba(26,26,26,0.82) 55%,
      rgba(26,26,26,0.35) 100%
    );
    z-index: 1;
  }
  .hero-content {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding-left: clamp(48px, 8vw, 120px);
    padding-right: clamp(48px, 8vw, 120px);
  }
  .hero-left {
    max-width: 680px;
  }

  /* ── CSS entrance animations ── */
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroLineGrow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes heroPulse {
    0%, 100% { opacity: 0.7; transform: scaleY(1); }
    50%      { opacity: 0.15; transform: scaleY(0.3); }
  }

  .hero-eyebrow {
    font-family: var(--font-jost), sans-serif;
    font-weight: 400;
    font-size: 11px;
    letter-spacing: 0.28em;
    color: #C8963E;
    text-transform: uppercase;
    margin-bottom: 16px;
    animation: heroFadeUp 0.6s ease both;
    animation-delay: 0.2s;
  }
  .hero-accent-line {
    width: 48px;
    height: 1px;
    background: #C8963E;
    margin-bottom: 22px;
    transform-origin: left;
    animation: heroLineGrow 0.5s ease both;
    animation-delay: 0.35s;
  }
  .hero-h1-1 {
    font-family: var(--font-cormorant), serif;
    font-weight: 700;
    font-size: clamp(56px, 6.5vw, 88px);
    color: #F5F0EB;
    line-height: 0.93;
    margin: 0;
    animation: heroFadeUp 0.9s ease both;
    animation-delay: 0.4s;
  }
  .hero-h1-2 {
    font-family: var(--font-cormorant), serif;
    font-weight: 300;
    font-style: italic;
    font-size: clamp(38px, 4.5vw, 60px);
    color: #C8963E;
    line-height: 1.1;
    margin: 0 0 32px 0;
    animation: heroFadeUp 0.9s ease both;
    animation-delay: 0.6s;
  }
  .hero-body {
    font-family: var(--font-jost), sans-serif;
    font-weight: 300;
    font-size: 17px;
    line-height: 1.75;
    color: rgba(245,240,235,0.65);
    max-width: 520px;
    margin-bottom: 48px;
    animation: heroFadeUp 0.7s ease both;
    animation-delay: 0.8s;
  }
  .hero-buttons {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    animation: heroFadeUp 0.5s ease both;
    animation-delay: 1.0s;
  }
  .hero-btn-primary {
    font-family: var(--font-jost), sans-serif;
    font-weight: 500;
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    background: #C8963E;
    color: #1A1A1A;
    border: none;
    padding: 18px 40px;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;
  }
  .hero-btn-primary:hover {
    background: #b5852f;
    transform: translateY(-2px);
  }
  .hero-btn-secondary {
    font-family: var(--font-jost), sans-serif;
    font-weight: 400;
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    background: transparent;
    color: #F5F0EB;
    border: 1px solid rgba(200,150,62,0.45);
    padding: 18px 40px;
    cursor: pointer;
    transition: border-color 0.3s ease, background 0.3s ease;
  }
  .hero-btn-secondary:hover {
    border-color: rgba(200,150,62,0.9);
    background: rgba(200,150,62,0.07);
  }

  /* ── Gold particles (scattered across full hero) ── */
  .particles-container {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;
  }
  .particle {
    position: absolute;
    border-radius: 50%;
    background: #C8963E;
    animation: particleFloat var(--dur) ease-in-out var(--delay) infinite alternate;
  }
  @keyframes particleFloat {
    0%   { transform: translateY(0) scale(1); opacity: var(--op); }
    100% { transform: translateY(-20px) scale(0.6); opacity: 0; }
  }

  /* ── Scroll indicator ── */
  .scroll-indicator {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    animation: heroFadeUp 0.6s ease both;
    animation-delay: 2s;
  }
  .scroll-text {
    font-family: var(--font-jost), sans-serif;
    font-size: 9px;
    letter-spacing: 0.45em;
    color: rgba(245,240,235,0.28);
    text-transform: uppercase;
  }
  .scroll-line {
    width: 1px;
    height: 28px;
    background: #C8963E;
    animation: heroPulse 1.8s ease-in-out infinite;
  }

  /* ── Mobile ── */
  @media (max-width: 640px) {
    .hero-content {
      padding-left: 28px;
      padding-right: 28px;
    }
  }
`

export default function HeroSection() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1.5,
        top: Math.random() * 90 + 5,
        left: Math.random() * 90 + 5,
        opacity: Math.random() * 0.35 + 0.1,
        duration: Math.random() * 5 + 3,
        delay: Math.random() * 6,
      }))
    )
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: heroCSS }} />

      <section className="hero-section">
        <video
          className="hero-video"
          src="https://media.3tattava.com/videos/hero-bg.mp4"
          autoPlay loop muted playsInline
        />
        <div className="hero-overlay" />

        {/* Gold particles across full hero */}
        <div className="particles-container">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
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

        <div className="hero-content">
          <div className="hero-left">
            <p className="hero-eyebrow">India&apos;s First Performance Ayurveda Brand</p>
            <div className="hero-accent-line" />
            <h1 className="hero-h1-1">Performance Ayurveda.</h1>
            <h1 className="hero-h1-2">
              Engineered for the Way<br />You Actually Live.
            </h1>
            <p className="hero-body">
              Pure Himalayan Shilajit — 80+ trace minerals, 60%+ fulvic acid — in two formats
              your body will actually absorb. Resin for the purist. Honey Sticks for the daily ritual.
            </p>
            <div className="hero-buttons">
              <button className="hero-btn-primary">Shop Shilajit Resin</button>
              <button className="hero-btn-secondary">Try Honey Sticks</button>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span className="scroll-text">Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>
    </>
  )
}
