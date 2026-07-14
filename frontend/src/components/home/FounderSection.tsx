'use client'
import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

const timelineMilestones = [
  {
    period: 'Nov 2016 – Oct 2021',
    role: 'Ayurveda Education, BAMS',
    place: 'Alumni of CBPACS, Govt. of NCT New Delhi',
  },
  {
    period: 'Oct 2021 – Nov 2022',
    role: 'Internship',
    place: 'CBPACS & RTRMH',
  },
  {
    period: 'Jul 2022 – Nov 2022',
    role: 'Founder, Gymveda',
    place: 'Early performance + Ayurveda venture',
  },
  {
    period: 'Dec 2022 – Jan 2023',
    role: 'Clinical Exposure',
    place: 'Resident Medical Officer, Bulandshahr',
  },
  {
    period: '01.02.2023 – 06.10.2025',
    role: 'Consultant (I/C)',
    place: 'NCISM, Ministry of AYUSH, Govt. of India',
  },
  {
    period: 'Jul 2022 – Feb 2026',
    role: 'Performance Ayurveda Research',
    place: 'Bridging ancient science with modern performance',
  },
  {
    period: '2026 →',
    role: 'Founder, 3Tattava',
    place: 'Doctor-Led Performance Ayurveda™',
    isCurrent: true,
  },
]

const trustBadges = [
  'BAMS',
  'CBPACS',
  'NCISM · Ministry of AYUSH',
  'Founder, 3Tattava',
  'Performance Ayurveda Educator',
  'Podcast Host',
]

const founderCSS = `
  .founder-section-v2 {
    background: #ffffff;
    padding: 96px 0;
    overflow: hidden;
  }
  .founder-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 72px;
    align-items: start;
  }

  /* ── Left column ── */
  .founder-eyebrow-v2 {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 500;
    margin-bottom: 14px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .founder-headline-v2 {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(30px, 4vw, 46px);
    font-weight: 700;
    line-height: 1.1;
    color: #442a1b;
    margin: 0 0 28px 0;
  }

  /* Portrait placeholder */
  .founder-portrait-wrap {
    width: 220px;
    height: 270px;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 28px;
    border: 1px solid rgba(183,163,146,0.40);
    box-shadow: 0 8px 24px rgba(68,42,27,0.10);
    background: #f0e8d8;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .founder-portrait-placeholder {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #b7a392;
    text-align: center;
    padding: 16px;
  }
  .founder-portrait-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(68,42,27,0.35) 0%, transparent 60%);
    border-radius: 16px;
  }
  .founder-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .founder-story {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.75;
    color: #6f5a48;
    margin-bottom: 28px;
    max-width: 520px;
  }
  .founder-story-quote {
    border-left: 2px solid #cd872a;
    padding-left: 20px;
    font-style: italic;
    font-size: 17px;
    line-height: 1.7;
    color: #442a1b;
    margin-bottom: 28px;
  }

  /* Trust badges */
  .founder-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 32px;
  }
  .founder-badge {
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    background: #f7f0e2;
    border: 1px solid rgba(183,163,146,0.50);
    border-radius: 20px;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.08em;
    color: #442a1b;
    font-weight: 500;
    white-space: nowrap;
  }

  .founder-cta-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: #cd872a;
    text-decoration: none;
    position: relative;
  }
  .founder-cta-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 1.5px;
    background: #cd872a;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 300ms cubic-bezier(0.16,1,0.3,1);
  }
  .founder-cta-link:hover::after { transform: scaleX(1); }
  .founder-cta-arrow {
    transition: transform 0.2s ease;
  }
  .founder-cta-link:hover .founder-cta-arrow {
    transform: translateX(4px);
  }

  /* ── Right column: Timeline ── */
  .founder-timeline-v2 {
    position: relative;
    padding-left: 28px;
    padding-top: 8px;
  }
  .timeline-v2-track {
    position: absolute;
    left: 7px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(183,163,146,0.40);
    transform-origin: top;
  }
  .timeline-v2-fill {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: #cd872a;
    height: 0%;
    transition: height 1.2s ease;
  }
  .timeline-v2-fill.animated {
    height: 100%;
  }
  .timeline-node {
    position: relative;
    margin-bottom: 32px;
  }
  .timeline-node:last-child {
    margin-bottom: 0;
  }
  .timeline-dot {
    position: absolute;
    left: -28px;
    top: 4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #b7a392;
    border: 2px solid #ffffff;
    box-shadow: 0 0 0 2px rgba(183,163,146,0.35);
    transition: background 0.3s ease, box-shadow 0.3s ease;
  }
  .timeline-dot.active {
    background: #cd872a;
    box-shadow: 0 0 0 3px rgba(205,135,42,0.25);
  }
  .timeline-node-current .timeline-dot {
    background: #442a1b;
    box-shadow: 0 0 0 4px rgba(68,42,27,0.15), 0 0 12px rgba(205,135,42,0.35);
  }
  .timeline-period {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 600;
    margin-bottom: 3px;
  }
  .timeline-role {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #442a1b;
    margin-bottom: 2px;
    line-height: 1.3;
  }
  .timeline-place {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    color: #6f5a48;
    line-height: 1.5;
  }
  .timeline-current-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 6px;
    padding: 3px 10px;
    background: #442a1b;
    border-radius: 12px;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #f7f0e2;
    font-weight: 600;
  }
  .timeline-current-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #cd872a;
    animation: tlDotPulse 1.5s ease-in-out infinite;
  }
  @keyframes tlDotPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.7); }
  }

  /* ── Mobile ── */
  @media (max-width: 900px) {
    .founder-inner {
      grid-template-columns: 1fr;
      gap: 52px;
    }
  }
  @media (max-width: 640px) {
    .founder-section-v2 { padding: 64px 0; }
    .founder-inner { padding: 0 20px; }
    .founder-portrait-wrap { width: 180px; height: 220px; }
  }
`

function TimelineItem({
  period,
  role,
  place,
  isCurrent,
  index,
}: {
  period: string
  role: string
  place: string
  isCurrent?: boolean
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className={`timeline-node${isCurrent ? ' timeline-node-current' : ''}`}
      initial={{ opacity: 0, x: -14 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`timeline-dot${inView ? ' active' : ''}`} />
      <p className="timeline-period">{period}</p>
      <p className="timeline-role">{role}</p>
      <p className="timeline-place">{place}</p>
      {isCurrent && (
        <div className="timeline-current-badge">
          <span className="timeline-current-dot" />
          Present
        </div>
      )}
    </motion.div>
  )
}

export default function FounderSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  useEffect(() => {
    if (inView && fillRef.current) {
      setTimeout(() => {
        if (fillRef.current) fillRef.current.classList.add('animated')
      }, 200)
    }
  }, [inView])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: founderCSS }} />

      <section
        id="founder"
        className="founder-section-v2"
        ref={sectionRef}
        aria-labelledby="founder-heading"
      >
        <div className="founder-inner">
          {/* ── Left: Story column ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="founder-eyebrow-v2">Meet The Founder · Dr. Kashish Gupta, BAMS</p>

            <h2 id="founder-heading" className="founder-headline-v2">
              Why An Ayurveda Doctor Started Thinking About Performance
            </h2>

            {/* Portrait placeholder */}
            <div className="founder-portrait-wrap">
              {/* Real photo: https://media.3tattava.com/dr-kashish/dr-kashish-portrait.jpg */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://media.3tattava.com/dr-kashish/dr-kashish-portrait.jpg"
                alt="Dr. Kashish Gupta, BAMS — Founder of 3Tattava"
                className="founder-img"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement
                  el.style.display = 'none'
                  el.nextElementSibling?.setAttribute('style', 'display:block')
                }}
              />
              <p className="founder-portrait-placeholder" style={{ display: 'none' }}>
                [NA — Dr. Kashish portrait]
              </p>
              <div className="founder-portrait-overlay" aria-hidden />
            </div>

            <blockquote className="founder-story-quote">
              Most people discover Ayurveda after something goes wrong. I wanted to explore what
              happens when Ayurvedic wisdom is used before problems begin — to support energy,
              longevity, recovery, resilience and long-term performance.
            </blockquote>

            <p className="founder-story">
              I entered Ayurveda expecting to learn medicine. What I discovered was something much
              bigger. Ayurveda wasn&apos;t only about treating illness. At its core, it was about
              helping people function at their highest potential. During my education and
              professional experience with the Ministry of AYUSH, I saw a growing disconnect between
              ancient health wisdom and modern lifestyles. People were sleeping less, recovering
              poorly, feeling constantly drained and searching for quick fixes. That&apos;s why I
              created 3Tattava. A Doctor-Led Performance Ayurveda brand designed for modern
              individuals who want to balance their foundations, build resilience and become their
              highest-performing selves.
            </p>

            {/* Trust badges */}
            <motion.div
              className="founder-badges"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {trustBadges.map((b, i) => (
                <motion.span
                  key={b}
                  className="founder-badge"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
                >
                  {b}
                </motion.span>
              ))}
            </motion.div>

            <Link href="/about" className="founder-cta-link">
              Discover Performance Ayurveda
              <svg className="founder-cta-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* ── Right: Career Timeline ── */}
          <div>
            <motion.p
              className="founder-eyebrow-v2"
              style={{ marginBottom: 28 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Career Journey
            </motion.p>

            <div className="founder-timeline-v2">
              <div className="timeline-v2-track" ref={trackRef}>
                <div className="timeline-v2-fill" ref={fillRef} />
              </div>

              {timelineMilestones.map((m, i) => (
                <TimelineItem
                  key={m.period}
                  period={m.period}
                  role={m.role}
                  place={m.place}
                  isCurrent={m.isCurrent}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
