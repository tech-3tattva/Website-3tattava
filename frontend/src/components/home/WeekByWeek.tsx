'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const weeks = [
  {
    week: '1–2',
    title: 'Foundation',
    body: 'Your body begins absorbing 80+ trace minerals. The afternoon energy crash starts to fade. Sleep quality improves within the first week.',
    align: 'left',
    clinicalNote: 'Fulvic acid starts acting as an electrolyte transporter within 48–72 hours. Mineral saturation of cell membranes begins in the first two weeks. Most users report sleep depth improvement by Day 10.',
  },
  {
    week: '3–4',
    title: 'Momentum',
    body: 'Sustained energy without caffeine dependency. Better sleep quality. Sharper mornings. Your body is using what it was always missing.',
    align: 'right',
    clinicalNote: 'By week 3, serum ferritin and hemoglobin levels begin responding in iron-deficient subjects. ATP production in mitochondria increases as trace mineral cofactors reach saturation.',
  },
  {
    week: '6–8',
    title: 'Performance',
    body: 'Measurable improvements in stamina, recovery time, and mental clarity. This is where the compounding begins. Your trainer notices first.',
    align: 'left',
    clinicalNote: 'Post-exercise recovery markers (CRP, lactate clearance) show significant improvement at the 6-week mark in clinical observation. Cognitive performance peaks around week 8 in most subjects.',
  },
  {
    week: '12+',
    title: 'Transformation',
    body: "Blood markers shift. Cognitive baseline improves. This is not a supplement. This is infrastructure — built for people who don't stop.",
    align: 'right',
    clinicalNote: 'At 90 days, testosterone levels in male subjects showed 23.5% increase vs. placebo in a controlled study. Iron markers in deficient subjects normalized in 82% of cases.',
    citation: 'Ref: Pandit S et al. (2016). Shilajit enhances differentiation and maturation of erythroid progenitors. PMC6364418.',
  },
]

const weekCSS = `
  .week-section {
    position: relative;
    overflow: hidden;
    padding: 120px 0 100px;
    background: #111;
  }
  .week-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }
  .week-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg,
      rgba(17,17,17,0.97) 0%,
      rgba(17,17,17,0.82) 30%,
      rgba(17,17,17,0.82) 70%,
      rgba(17,17,17,0.97) 100%);
    z-index: 1;
  }
  .week-content {
    position: relative;
    z-index: 10;
    max-width: 900px;
    margin: 0 auto;
    padding: 0 24px;
  }
  .week-header {
    text-align: center;
    margin-bottom: 80px;
  }
  .week-eyebrow {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.3em;
    color: #C8963E;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .week-title {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-weight: 700;
    font-size: clamp(38px, 5vw, 58px);
    color: #F5F0EB;
    margin: 0 0 14px 0;
  }
  .week-sub {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-weight: 300;
    font-size: 17px;
    color: rgba(245,240,235,0.5);
  }
  .week-timeline {
    position: relative;
  }
  .timeline-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom,
      transparent 0%, rgba(200,150,62,0.35) 15%,
      rgba(200,150,62,0.35) 85%, transparent 100%);
    transform-origin: top;
  }
  @keyframes weekCardFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  .week-card {
    position: relative;
    max-width: 400px;
    margin-bottom: 56px;
    background: rgba(247,240,226,0.88);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(200,150,62,0.25);
    border-left: 3px solid #C8963E;
    padding: 40px 44px;
    will-change: transform;
    box-shadow: 0 8px 40px rgba(0,0,0,0.15);
  }
  .week-card:nth-child(1) { animation: weekCardFloat 4.2s ease-in-out 0s infinite; }
  .week-card:nth-child(2) { animation: weekCardFloat 5.1s ease-in-out 0.8s infinite; }
  .week-card:nth-child(3) { animation: weekCardFloat 4.7s ease-in-out 1.6s infinite; }
  .week-card:nth-child(4) { animation: weekCardFloat 5.4s ease-in-out 2.4s infinite; }
  .week-card.align-left { margin-right: 52%; }
  .week-card.align-right { margin-left: 52%; }
  .week-dot {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    background: #C8963E;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(200,150,62,0.7);
  }
  .week-card.align-left .week-dot { right: -5px; }
  .week-card.align-right .week-dot { left: -5px; }
  .week-label {
    display: none;
  }
  .week-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    background: rgba(200,150,62,0.20);
    border: 1px solid rgba(200,150,62,0.40);
    color: #C8963E;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-variation-settings: 'wdth' 75, 'wght' 600;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 14px;
  }

  /* Click-to-expand clinical note */
  .week-expand-trigger {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 12px;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-variation-settings: 'wdth' 75, 'wght' 500;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold-dark);
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }
  .week-expand-content {
    overflow: hidden;
    max-height: 0;
    transition: max-height 350ms ease;
  }
  .week-expand-content.open {
    max-height: 200px;
  }
  .week-expand-note {
    padding-top: 12px;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    line-height: 1.6;
    color: var(--ink-soft);
    font-style: italic;
  }
  .week-citation {
    display: block;
    margin-top: 8px;
    font-size: 10px;
    font-style: normal;
    color: rgba(28,19,4,0.4);
  }
  .week-watermark {
    position: absolute;
    top: 12px;
    right: 20px;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-weight: 300;
    font-size: 88px;
    color: #C8963E;
    opacity: 0.1;
    line-height: 1;
    pointer-events: none;
  }
  .week-card-title {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-weight: 700;
    font-size: 40px;
    color: var(--ink);
    margin: 0 0 16px 0;
    line-height: 1;
  }
  .week-card-body {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-weight: 300;
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.78;
    margin: 0;
  }
  .week-cta {
    text-align: center;
    padding-top: 80px;
  }
  .week-cta-text {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-weight: 300;
    font-style: italic;
    font-size: 28px;
    color: rgba(247,240,226,0.75);
    margin-bottom: 28px;
  }
  .week-cta-btn {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-weight: 500;
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    background: #C8963E;
    color: #fff;
    border: none;
    padding: 18px 52px;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;
  }
  .week-cta-btn:hover {
    background: #b5852f;
    transform: translateY(-2px);
  }
  @media (max-width: 640px) {
    .week-section { padding: 72px 0 64px; }
    .week-content { padding: 0 16px; }
    .week-header { margin-bottom: 48px; }
    .week-title { font-size: 32px; }
    .week-card.align-left,
    .week-card.align-right {
      margin-left: 0;
      margin-right: 0;
      max-width: 100%;
      padding: 28px 24px;
    }
    .timeline-line { display: none; }
    .week-card-title { font-size: 30px; }
    .week-cta { padding-top: 52px; }
    .week-cta-text { font-size: 22px; }
    .week-cta-btn { padding: 16px 36px; width: 100%; }
  }
`

export default function WeekByWeek() {
  const router = useRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: 'top',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom 80%',
          scrub: 1,
        },
      }
    )

    const cards = sectionRef.current?.querySelectorAll('.week-card') ?? []
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.9, ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: { trigger: card, start: 'top 84%' },
        }
      )
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: weekCSS }} />

      <section className="week-section" ref={sectionRef}>
        <video
          className="week-video"
          src="https://media.3tattava.com/videos/week-bg.mp4"
          autoPlay loop muted playsInline
        />
        <div className="week-overlay" />

        <div className="week-content">
          <div className="week-header">
            <p className="week-eyebrow">The Performance Timeline</p>
            <h2 className="week-title">What to Expect — Week by Week</h2>
            <p className="week-sub">Real performance doesn&apos;t happen overnight. Here&apos;s what actually changes.</p>
          </div>

          <div className="week-timeline">
            <div className="timeline-line" ref={lineRef} />
            {weeks.map((w, i) => (
              <div key={i} className={`week-card align-${w.align}`}>
                <span className="week-watermark">{w.week}</span>
                <div className="week-dot" />
                <span className="week-badge">Week {w.week}</span>
                <h3 className="week-card-title">{w.title}</h3>
                <p className="week-card-body">{w.body}</p>
                {w.clinicalNote && (
                  <>
                    <button
                      className="week-expand-trigger"
                      onClick={() => setExpandedWeek(expandedWeek === i ? null : i)}
                      type="button"
                    >
                      <span>{expandedWeek === i ? '− ' : '+ '}Clinical Note</span>
                    </button>
                    <div className={`week-expand-content${expandedWeek === i ? ' open' : ''}`}>
                      <p className="week-expand-note">
                        {w.clinicalNote}
                        {'citation' in w && w.citation && (
                          <cite className="week-citation">{w.citation}</cite>
                        )}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="week-cta">
            <p className="week-cta-text">Ready to start your 90-day protocol?</p>
            <button className="week-cta-btn" onClick={() => router.push('/products/shodhit-shilajit-resin')}>Start Your Ritual — ₹999</button>
          </div>
        </div>
      </section>
    </>
  )
}
