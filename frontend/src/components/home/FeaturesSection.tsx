'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const features = [
  {
    number: '01',
    eyebrow: 'BALANCE → CELLULAR ENERGY',
    title: 'Cellular Energy',
    body: "Your mitochondria cannot produce ATP without the 80+ ionic minerals that most modern diets have stripped away. Shilajit is the only natural substance that delivers all of them simultaneously — with fulvic acid to carry them directly into your cells. The result is energy that builds week over week, not a spike that collapses.",
    quote: '"Most of my patients were not tired. They were mineral-depleted. There is a difference." — Dr. Kashish Gupta, BAMS',
    disclaimer: 'These statements have not been evaluated by any regulatory authority. This product is not intended to diagnose, treat, cure, or prevent any disease.',
    image: 'https://media.3tattava.com/features/resin-pulled.png',
    imageLeft: true,
  },
  {
    number: '02',
    eyebrow: 'BUILD → MINERAL FOUNDATION',
    title: 'The Daily Ritual',
    body: "600mg of Himalayan Shilajit per Shahjeet Stick, delivered in raw Himalayan honey — nature's Anupana (potency enhancer). Anupana is the Ayurvedic principle that a carrier substance amplifies absorption. Honey is the classical Anupana for Shilajit. No measuring. No mixing. 10 seconds every morning.",
    image: 'https://media.3tattava.com/features/shahjeet-sachet.png',
    imageLeft: false,
  },
  {
    number: '03',
    eyebrow: 'BECOME → LONGEVITY',
    title: 'The Source',
    body: 'Formed over 300 years under extreme Himalayan pressure at 10,000–16,000ft. Purified using classical Triphala Shodhan — the same method prescribed in Ashtanga Hridayam. Every batch third-party tested by NABL-accredited laboratory.',
    nablLink: 'https://media.3tattava.com/lab-reports/RK2024-08.pdf',
    image: 'https://media.3tattava.com/features/resin-mountain.png',
    imageLeft: true,
  },
]

const featuresCSS = `
  .features-section {
    background: var(--cream);
  }
  .features-header {
    text-align: center;
    padding: 120px 24px 80px;
  }
  .feat-section-eyebrow {
    font-family: var(--font-primary), sans-serif;
    font-size: 11px;
    letter-spacing: 0.3em;
    color: var(--gold-dark);
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .feat-section-title {
    font-family: var(--font-primary), serif;
    font-weight: 700;
    font-size: clamp(40px, 5vw, 60px);
    color: var(--ink);
    margin: 0 0 16px 0;
  }
  .feat-section-sub {
    font-family: var(--font-primary), sans-serif;
    font-weight: 300;
    font-size: 18px;
    color: var(--ink-soft);
    max-width: 480px;
    margin: 0 auto;
  }
  .feature-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 560px;
  }
  .feature-card.reverse .feature-img-col { order: 2; }
  .feature-card.reverse .feature-text-col { order: 1; }
  .feature-img-col {
    overflow: hidden;
    position: relative;
  }
  .feature-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transform-origin: center;
    transition: transform 0.7s ease;
    animation: imgBreath 8s ease-in-out infinite;
  }
  @keyframes imgBreath {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  .feature-img-col:hover .feature-img {
    animation: none;
    transform: scale(1.08);
  }
  .feature-text-col {
    background: var(--white);
    padding: clamp(48px, 6vw, 88px) clamp(36px, 5vw, 72px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
    border-left: 1px solid var(--line);
    transition: border-left-color 0.4s ease;
  }
  .feature-text-col:hover {
    border-left-color: rgba(200,150,62,0.35);
  }
  .feat-watermark {
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    font-family: var(--font-primary), serif;
    font-weight: 300;
    font-size: 200px;
    color: var(--taupe);
    opacity: 0.2;
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }
  .feat-eyebrow {
    font-family: var(--font-primary), sans-serif;
    font-size: 10px;
    letter-spacing: 0.28em;
    color: var(--gold-dark);
    text-transform: uppercase;
    margin-bottom: 18px;
  }
  .feat-line {
    width: 36px;
    height: 1px;
    background: var(--gold);
    margin-bottom: 26px;
  }
  .feat-title {
    font-family: var(--font-primary), serif;
    font-weight: 700;
    font-size: clamp(40px, 4vw, 58px);
    color: var(--ink);
    line-height: 1;
    margin: 0 0 24px 0;
  }
  .feat-body {
    font-family: var(--font-primary), sans-serif;
    font-weight: 300;
    font-size: 16px;
    line-height: 1.78;
    color: var(--ink-soft);
    max-width: 390px;
  }
  @media (max-width: 768px) {
    .features-header { padding: 72px 20px 48px; }
    .feat-section-title { font-size: clamp(30px, 8vw, 46px); }
    .feature-card { grid-template-columns: 1fr; }
    .feature-card.reverse .feature-img-col { order: 0; }
    .feature-card.reverse .feature-text-col { order: 0; }
    .feature-img-col { min-height: 260px; }
    .feature-text-col { padding: 40px 24px; border-left: none; border-top: 1px solid var(--line); }
    .feat-title { font-size: clamp(32px, 8vw, 46px); }
    .feat-body { font-size: 15px; max-width: 100%; }
  }
`

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const cards = sectionRef.current?.querySelectorAll('.feature-card') ?? []

    cards.forEach((card, i) => {
      const img = card.querySelector('.feature-img') as HTMLElement
      const eyebrow = card.querySelector('.feat-eyebrow')
      const line = card.querySelector('.feat-line')
      const title = card.querySelector('.feat-title')
      const body = card.querySelector('.feat-body')
      const isLeft = i % 2 === 0

      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.15, filter: 'brightness(0.4) blur(4px)' },
          {
            scale: 1.0,
            filter: 'brightness(1) blur(0px)',
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 78%' },
          }
        )
      }

      const xDir = isLeft ? 70 : -70
      gsap.fromTo(
        [eyebrow, line, title, body],
        { x: -xDir, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 0.85, ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: card, start: 'top 78%' },
        }
      )
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: featuresCSS }} />

      <section className="features-section" ref={sectionRef}>
        <div className="features-header">
          <p className="feat-section-eyebrow">The Science Behind It</p>
          <h2 className="feat-section-title">What 3TATTAVA Actually Does</h2>
          <p className="feat-section-sub">Not wellness. Not supplements. Cellular-level performance architecture.</p>
        </div>

        {features.map((feat) => (
          <div key={feat.number} className={`feature-card${!feat.imageLeft ? ' reverse' : ''}`}>
            <div className="feature-img-col">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={feat.image} alt={feat.title} className="feature-img" />
            </div>
            <div className="feature-text-col feature-text">
              <span className="feat-watermark">{feat.number}</span>
              <p className="feat-eyebrow">{feat.eyebrow}</p>
              <div className="feat-line" />
              <h3 className="feat-title">{feat.title}</h3>
              <p className="feat-body">{feat.body}</p>
              {'quote' in feat && feat.quote && (
                <blockquote style={{
                  marginTop: '24px',
                  paddingLeft: '16px',
                  borderLeft: '2px solid #C8963E',
                  fontStyle: 'italic',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: 'var(--ink-60, rgba(28,19,4,0.6))',
                  fontFamily: 'var(--font-primary), system-ui, sans-serif',
                }}>{feat.quote}</blockquote>
              )}
              {'disclaimer' in feat && feat.disclaimer && (
                <p style={{
                  marginTop: '16px',
                  fontSize: '10px',
                  lineHeight: 1.5,
                  color: 'rgba(28,19,4,0.35)',
                  fontFamily: 'var(--font-primary), system-ui, sans-serif',
                }}>{feat.disclaimer}</p>
              )}
              {'nablLink' in feat && feat.nablLink && (
                <a
                  href={feat.nablLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: '20px',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    color: '#C8963E',
                    textDecoration: 'underline',
                    fontFamily: 'var(--font-primary), system-ui, sans-serif',
                  }}
                >
                  NABL Batch Report: #RK2024-08 · View Full COA →
                </a>
              )}
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
