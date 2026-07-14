'use client'
import { motion } from 'framer-motion'

const performancePillars = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 22V8M5 12l7-10 7 10" /><path d="M5 19h14" />
      </svg>
    ),
    label: 'Discipline',
    caption: 'Doing the work daily.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
    label: 'Recovery',
    caption: 'Preparing for tomorrow.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    label: 'Resilience',
    caption: 'Performing under pressure.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    label: 'Consistency',
    caption: 'Small actions. Big results.',
  },
]

const monaCSS = `
  .mona-section {
    background: #f7f0e2;
    padding: 96px 0 0;
    overflow: hidden;
  }
  .mona-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
  }

  /* Pull quote */
  .mona-pull-quote {
    max-width: 700px;
    margin: 0 auto 64px;
    text-align: center;
  }
  .mona-pull-quote-mark {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 80px;
    line-height: 0.6;
    color: #cd872a;
    display: block;
    margin-bottom: 12px;
  }
  .mona-pull-quote-text {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(18px, 2.5vw, 26px);
    font-weight: 400;
    font-style: italic;
    line-height: 1.55;
    color: #442a1b;
  }

  /* Two-column: image left, copy right */
  .mona-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: start;
    margin-bottom: 72px;
  }
  .mona-image-col {
    position: relative;
  }
  .mona-image-frame {
    width: 100%;
    aspect-ratio: 3/4;
    border-radius: 20px;
    overflow: hidden;
    background: #e8dcc8;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 14px 36px rgba(68,42,27,0.16);
    position: relative;
  }
  .mona-image-placeholder {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #b7a392;
    text-align: center;
    padding: 24px;
  }
  .mona-image-badge {
    position: absolute;
    bottom: 24px;
    left: 24px;
    right: 24px;
    background: rgba(68,42,27,0.85);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    padding: 14px 18px;
  }
  .mona-image-badge-name {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 18px;
    font-weight: 600;
    color: #f7f0e2;
    margin-bottom: 3px;
  }
  .mona-image-badge-title {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #cd872a;
    font-family: var(--font-primary), system-ui, sans-serif;
  }

  .mona-copy-col {
    padding-top: 8px;
  }
  .mona-eyebrow {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 500;
    margin-bottom: 16px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .mona-headline {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(28px, 3.5vw, 42px);
    font-weight: 700;
    line-height: 1.1;
    color: #442a1b;
    margin: 0 0 24px 0;
  }
  .mona-body {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.75;
    color: #6f5a48;
    margin-bottom: 36px;
  }

  /* Video block */
  .mona-video-block {
    background: #e8dcc8;
    border-radius: 16px;
    padding: 32px;
    display: flex;
    align-items: center;
    gap: 18px;
    cursor: pointer;
    transition: box-shadow 0.25s ease, transform 0.25s ease;
    margin-bottom: 28px;
    border: 1px solid rgba(183,163,146,0.40);
  }
  .mona-video-block:hover {
    box-shadow: 0 8px 24px rgba(68,42,27,0.12);
    transform: translateY(-2px);
  }
  .mona-video-play {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #442a1b;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .mona-video-block:hover .mona-video-play {
    background: #cd872a;
    transform: scale(1.06);
  }
  .mona-video-text {
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .mona-video-label {
    font-size: 13px;
    font-weight: 600;
    color: #442a1b;
    margin-bottom: 3px;
  }
  .mona-video-sub {
    font-size: 12px;
    color: #6f5a48;
  }

  /* Performance pillars */
  .mona-pillars {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    background: #442a1b;
    border-radius: 0;
    overflow: hidden;
  }
  .mona-pillar {
    padding: 36px 24px;
    text-align: center;
    border-right: 1px solid rgba(247,240,226,0.10);
    transition: background 0.25s ease;
  }
  .mona-pillar:last-child { border-right: none; }
  .mona-pillar:hover { background: rgba(205,135,42,0.12); }
  .mona-pillar-icon {
    color: #cd872a;
    margin: 0 auto 14px;
    display: flex;
    justify-content: center;
    transition: transform 0.25s ease;
  }
  .mona-pillar:hover .mona-pillar-icon {
    transform: scale(1.12);
  }
  .mona-pillar-label {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 17px;
    font-weight: 600;
    color: #f7f0e2;
    margin-bottom: 6px;
  }
  .mona-pillar-caption {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    color: rgba(247,240,226,0.55);
    line-height: 1.5;
  }

  /* Quote band */
  .mona-quote-band {
    background: #442a1b;
    padding: 64px 32px;
    text-align: center;
  }
  .mona-quote-band-text {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(20px, 3vw, 32px);
    font-style: italic;
    font-weight: 400;
    color: #f7f0e2;
    max-width: 700px;
    margin: 0 auto 16px;
    line-height: 1.55;
  }
  .mona-quote-attr {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(247,240,226,0.45);
  }

  /* Trust bar */
  .mona-trust-bar {
    background: #f7f0e2;
    padding: 32px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 12px 32px;
    border-top: 1px solid rgba(183,163,146,0.35);
  }
  .mona-trust-bar-label {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #6f5a48;
    font-weight: 600;
  }
  .mona-trust-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    color: #442a1b;
    font-weight: 500;
  }
  .mona-trust-check {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #cd872a;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* Mobile */
  @media (max-width: 900px) {
    .mona-columns { grid-template-columns: 1fr; gap: 40px; }
    .mona-image-frame { aspect-ratio: 4/3; max-width: 480px; }
    .mona-pillars { grid-template-columns: repeat(2, 1fr); }
    .mona-pillar:nth-child(1), .mona-pillar:nth-child(2) {
      border-bottom: 1px solid rgba(247,240,226,0.10);
    }
    .mona-pillar:nth-child(2) { border-right: none; }
  }
  @media (max-width: 640px) {
    .mona-section { padding: 64px 0 0; }
    .mona-inner { padding: 0 20px; }
    .mona-pull-quote { margin-bottom: 40px; }
    .mona-pillars { grid-template-columns: 1fr 1fr; }
    .mona-quote-band { padding: 48px 20px; }
    .mona-trust-bar { padding: 24px 20px; }
  }
`

const trustBarItems = [
  'Founding Athlete Ambassador',
  'Expert-Led Guidance',
  'Fitness Community Partnerships',
  'Evidence-Based Ayurveda',
]

export default function MonaSection() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: monaCSS }} />

      <section id="athlete" className="mona-section" aria-labelledby="mona-heading">
        <div className="mona-inner">
          {/* Pull quote */}
          <motion.div
            className="mona-pull-quote"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="mona-pull-quote-mark" aria-hidden>&quot;</span>
            <p className="mona-pull-quote-text">
              Performance athletes care about recovery, consistency, resilience and
              discipline — the same principles on which 3Tattava is built.
            </p>
          </motion.div>

          {/* Two-column: image + copy */}
          <div className="mona-columns">
            {/* Image */}
            <motion.div
              className="mona-image-col"
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
            >
              <div className="mona-image-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://media.3tattava.com/mona/mona-athlete.jpg"
                  alt="Mona Agarwal — Paralympic Bronze Medalist, Founding Athlete Ambassador of 3Tattava"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement
                    el.style.display = 'none'
                    el.nextElementSibling?.setAttribute('style', 'display:block')
                  }}
                />
                <p className="mona-image-placeholder" style={{ display: 'none' }}>
                  [NA — Mona Agarwal athlete photo]<br />(training · competition · medal · focused expression)
                </p>
                <div className="mona-image-badge">
                  <p className="mona-image-badge-name">Mona Agarwal</p>
                  <p className="mona-image-badge-title">Paralympic Bronze Medalist · Founding Athlete Ambassador</p>
                </div>
              </div>
            </motion.div>

            {/* Copy */}
            <motion.div
              className="mona-copy-col"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="mona-eyebrow">Founding Athlete Ambassador</p>
              <h2 id="mona-heading" className="mona-headline">
                Built For People Who Demand More From Themselves
              </h2>
              <p className="mona-body">
                Elite performance is rarely about motivation. It is built through consistency,
                recovery, discipline and showing up every day. These same principles form the
                foundation of Performance Ayurveda. That&apos;s why Paralympic Bronze Medalist Mona
                Agarwal joined 3Tattava as our Founding Athlete Ambassador. Together, we aim to
                promote a culture of sustainable performance, resilience and long-term vitality.
              </p>

              {/* Video block */}
              <motion.div
                className="mona-video-block"
                whileHover={{ scale: 1.01 }}
                role="button"
                tabIndex={0}
                aria-label="Watch Mona's Performance Story (2–3 minutes)"
              >
                <div className="mona-video-play" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#f7f0e2" aria-hidden>
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <div className="mona-video-text">
                  <p className="mona-video-label">Watch Mona&apos;s Performance Story</p>
                  <p className="mona-video-sub">2–3 min · Adversity · Training · Mindset · Recovery</p>
                </div>
              </motion.div>

              {/* [NA video note] */}
              <p style={{ fontSize: 11, color: '#b7a392', fontStyle: 'italic', marginBottom: 0, fontFamily: 'var(--font-primary)' }}>
                [NA — Video: Mona&apos;s performance story — not about product]
              </p>
            </motion.div>
          </div>
        </div>

        {/* Performance pillars */}
        <motion.div
          className="mona-pillars"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          {performancePillars.map((p, i) => (
            <motion.div
              key={p.label}
              className="mona-pillar"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
            >
              <div className="mona-pillar-icon">{p.icon}</div>
              <p className="mona-pillar-label">{p.label}</p>
              <p className="mona-pillar-caption">{p.caption}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quote band */}
        <div className="mona-quote-band">
          <motion.p
            className="mona-quote-band-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            &ldquo;Success is not built on one great day. It is built on what you do consistently every day.&rdquo;
          </motion.p>
          <p className="mona-quote-attr">— Mona Agarwal · Paralympic Bronze Medalist</p>
        </div>

        {/* Trust bar */}
        <div className="mona-trust-bar" role="list" aria-label="Performance ecosystem support">
          <span className="mona-trust-bar-label">Performance Ecosystem Supported Through:</span>
          {trustBarItems.map((item) => (
            <span key={item} className="mona-trust-item" role="listitem">
              <span className="mona-trust-check" aria-hidden>
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2 6 5 9 10 3" />
                </svg>
              </span>
              {item}
            </span>
          ))}
        </div>
      </section>
    </>
  )
}
