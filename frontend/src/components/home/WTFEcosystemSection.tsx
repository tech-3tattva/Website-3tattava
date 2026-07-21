'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const WTFLeafletMap = dynamic(() => import('@/components/maps/WTFMapHome'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(247,240,226,0.5)', fontFamily: 'var(--font-primary)', fontSize: 13, letterSpacing: '.04em' }}>
      Loading the NCR map…
    </div>
  ),
})

function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    const step = target / (duration / 16)
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setValue(Math.floor(current))
      if (current >= target) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, start])
  return value
}

const communityCards = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Community',
    body: 'Train alongside people committed to growth.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: 'Education',
    body: 'Learn how Ayurveda fits into modern performance.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: 'Experience',
    body: 'Explore products before purchasing.',
  },
]

const counters: { value: number; suffix: string; label: string; display?: string }[] = [
  { value: 29, suffix: '+', label: 'Experience Centers' },
  { value: 1, suffix: '', label: 'Doctor-Led Brand' },
]

const wtfCSS = `
  .wtf-section {
    background: #ffffff;
    padding: 96px 0;
    overflow: hidden;
  }
  .wtf-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .wtf-eyebrow {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 500;
    margin-bottom: 14px;
    font-family: var(--font-primary), system-ui, sans-serif;
    text-align: center;
  }
  .wtf-headline {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 700;
    color: #442a1b;
    text-align: center;
    margin: 0 0 20px 0;
    line-height: 1.1;
  }
  .wtf-sub {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 17px;
    line-height: 1.7;
    color: #6f5a48;
    text-align: center;
    max-width: 680px;
    margin: 0 auto 64px;
  }

  /* Map block */
  .wtf-map-block {
    border: 1px solid rgba(183,163,146,0.40);
    border-radius: 20px;
    height: 480px;
    margin-bottom: 64px;
    position: relative;
    overflow: hidden;
  }
  .wtf-map-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }
  .wtf-map-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(28,19,4,0.82);
    backdrop-filter: blur(6px);
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    z-index: 1000;
    pointer-events: none;
  }
  .wtf-map-footer-text {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    color: rgba(247,240,226,0.65);
    letter-spacing: 0.06em;
  }
  .wtf-map-footer-cta {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #cd872a;
    pointer-events: all;
    cursor: pointer;
    background: none;
    border: none;
    white-space: nowrap;
    text-decoration: none;
  }
  @media (max-width: 640px) {
    .wtf-map-block { height: 320px; }
  }

  /* Three cards */
  .wtf-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 72px;
  }
  .wtf-card {
    background: #f7f0e2;
    border: 1px solid rgba(183,163,146,0.40);
    border-radius: 16px;
    padding: 32px 28px;
    transition: box-shadow 0.25s ease, transform 0.25s ease;
    cursor: default;
  }
  .wtf-card:hover {
    box-shadow: 0 14px 36px rgba(68,42,27,0.12);
    transform: translateY(-3px);
  }
  .wtf-card-icon {
    color: #cd872a;
    margin-bottom: 18px;
    transition: transform 0.25s ease;
  }
  .wtf-card:hover .wtf-card-icon {
    transform: scale(1.08);
  }
  .wtf-card-title {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 22px;
    font-weight: 600;
    color: #442a1b;
    margin-bottom: 10px;
  }
  .wtf-card-body {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.65;
    color: #6f5a48;
  }

  /* Counter band */
  .wtf-counters {
    background: #442a1b;
    border-radius: 20px;
    padding: 48px 40px;
    margin-bottom: 48px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
  }
  .wtf-counter-item {
    text-align: center;
    border-right: 1px solid rgba(247,240,226,0.12);
    padding: 0 24px;
  }
  .wtf-counter-item:last-child { border-right: none; }
  .wtf-counter-num {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(42px, 5vw, 64px);
    font-weight: 700;
    color: #cd872a;
    line-height: 1.0;
    display: block;
    margin-bottom: 8px;
  }
  .wtf-counter-label {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: rgba(247,240,226,0.55);
  }
  .wtf-counter-title {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(247,240,226,0.35);
    text-align: center;
    margin-bottom: 40px;
  }

  /* CTA row */
  .wtf-cta-row {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  /* Mobile */
  @media (max-width: 900px) {
    .wtf-cards { grid-template-columns: 1fr; }
    .wtf-counters { grid-template-columns: repeat(2, 1fr); gap: 24px 0; border-radius: 16px; padding: 36px 24px; }
    .wtf-counter-item:nth-child(even) { border-right: none; }
    .wtf-counter-item:nth-child(1), .wtf-counter-item:nth-child(2) {
      border-bottom: 1px solid rgba(247,240,226,0.12);
      padding-bottom: 24px;
    }
  }
  @media (max-width: 640px) {
    .wtf-section { padding: 64px 0; }
    .wtf-inner { padding: 0 20px; }
    .wtf-map-block { height: 300px; }
    .wtf-cta-row { flex-direction: column; align-items: stretch; }
  }
`


function CounterItem({ counter, start }: { counter: typeof counters[0]; start: boolean }) {
  const count = useCountUp(counter.value, 1600, start && !counter.display)
  return (
    <div className="wtf-counter-item">
      <span className="wtf-counter-num">
        {counter.display ?? (count + counter.suffix)}
      </span>
      <span className="wtf-counter-label">{counter.label}</span>
    </div>
  )
}

export default function WTFEcosystemSection() {
  const router = useRouter()
  const counterRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const counterInView = useInView(counterRef, { once: true, margin: '-80px' })

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: wtfCSS }} />

      <section id="experience-centers" className="wtf-section" aria-labelledby="wtf-heading">
        <div className="wtf-inner">
          <motion.p className="wtf-eyebrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            WTF Fitness Ecosystem
          </motion.p>
          <motion.h2
            id="wtf-heading"
            className="wtf-headline"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Performance Lives In Communities
          </motion.h2>
          <motion.p
            className="wtf-sub"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            The best transformations don&apos;t happen in isolation. They happen where people
            train, learn, recover and grow together. That&apos;s why 3Tattava is building its
            Performance Ayurveda ecosystem alongside one of NCR&apos;s fastest-growing fitness
            communities.
          </motion.p>

          {/* Interactive Leaflet map */}
          <motion.div
            className="wtf-map-block"
            ref={mapRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <WTFLeafletMap />
            <div className="wtf-map-footer">
              <span className="wtf-map-footer-text">28 WTF Experience Centers · Delhi · Noida · Gurugram · Ghaziabad · Faridabad · Greater Noida</span>
              <a className="wtf-map-footer-cta" href="/find-us">View All →</a>
            </div>
          </motion.div>

          {/* Three cards */}
          <div className="wtf-cards">
            {communityCards.map((card, i) => (
              <motion.div
                key={card.title}
                className="wtf-card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                <div className="wtf-card-icon">{card.icon}</div>
                <h3 className="wtf-card-title">{card.title}</h3>
                <p className="wtf-card-body">{card.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Counter band */}
          <div ref={counterRef}>
            <p className="wtf-counter-title">Building India&apos;s Performance Ayurveda Network</p>
            <motion.div
              className="wtf-counters"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {counters.map((c) => (
                <CounterItem key={c.label} counter={c} start={counterInView} />
              ))}
            </motion.div>
          </div>

          {/* CTAs */}
          <div className="wtf-cta-row">
            <motion.button
              className="btn-primary-spec"
              style={{ fontFamily: 'var(--font-primary)', fontSize: 13, letterSpacing: '0.10em', textTransform: 'uppercase' }}
            onClick={() => router.push('/find-us')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Find Your Nearest Experience Center
            </motion.button>
            <motion.button
              className="btn-secondary-spec"
              style={{ fontFamily: 'var(--font-primary)', fontSize: 13, letterSpacing: '0.10em', textTransform: 'uppercase' }}
              onClick={() => router.push('/community')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Community Events
            </motion.button>
          </div>
        </div>
      </section>
    </>
  )
}
