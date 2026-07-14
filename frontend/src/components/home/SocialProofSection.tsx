'use client'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function useCountUp(target: number, duration = 1600, start = false) {
  const [value, setValue] = useState(0)
  const started = useRef(false)
  if (start && !started.current) {
    started.current = true
    const step = target / (duration / 16)
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setValue(Math.floor(current))
      if (current >= target) clearInterval(timer)
    }, 16)
  }
  return value
}

const communityStories = [
  {
    name: 'Rohit',
    age: 32,
    city: 'Delhi NCR',
    occupation: 'Entrepreneur',
    goal: 'Consistency in daily routine',
    quote:
      "I wasn't looking for another supplement. I was looking for consistency. Building a simple daily ritual helped me stay committed to my broader health goals.",
  },
  {
    name: 'Priya',
    age: 28,
    city: 'Gurgaon',
    occupation: 'Product Manager',
    goal: 'Sustained energy without caffeine',
    quote:
      "By week 3 I was down to one coffee instead of four. My focus during long meetings actually improved. The afternoon energy crash just stopped happening.",
  },
  {
    name: 'Arjun',
    age: 35,
    city: 'Noida',
    occupation: 'Fitness Coach',
    goal: 'Recovery and resilience',
    quote:
      "My clients noticed I was recovering faster between sessions. I didn't change my training. I just got consistent with my daily ritual and sleep habits.",
  },
]

const performerClips = [
  { topic: 'Discipline', duration: '45s', label: 'The Discipline Principle' },
  { topic: 'Recovery', duration: '38s', label: 'Why Recovery Is Training' },
  { topic: 'Consistency', duration: '52s', label: 'Small Actions. Big Results.' },
  { topic: 'Focus', duration: '41s', label: 'Mental Performance Rituals' },
]

const spCSS = `
  .sp-section {
    background: #f7f0e2;
    padding: 96px 0;
    overflow: hidden;
  }
  .sp-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .sp-header {
    text-align: center;
    max-width: 680px;
    margin: 0 auto 72px;
  }
  .sp-eyebrow {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 500;
    margin-bottom: 14px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .sp-headline {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(26px, 4vw, 46px);
    font-weight: 700;
    color: #442a1b;
    margin: 0 0 16px;
    line-height: 1.1;
  }
  .sp-sub {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: #6f5a48;
  }

  /* ── Block 1: Testimonial Carousel ── */
  .sp-block-label {
    font-size: 10px;
    letter-spacing: 0.20em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 700;
    margin-bottom: 24px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .sp-carousel {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 72px;
  }
  .sp-testimonial {
    background: #ffffff;
    border: 1px solid rgba(183,163,146,0.40);
    border-radius: 20px;
    padding: 32px 28px;
    box-shadow: 0 4px 16px rgba(68,42,27,0.06);
    transition: box-shadow 0.25s ease, transform 0.25s ease;
  }
  .sp-testimonial:hover {
    box-shadow: 0 14px 36px rgba(68,42,27,0.12);
    transform: translateY(-3px);
  }
  .sp-quote-mark {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 48px;
    line-height: 0.7;
    color: #cd872a;
    display: block;
    margin-bottom: 12px;
  }
  .sp-quote-text {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 15px;
    line-height: 1.75;
    color: #442a1b;
    font-style: italic;
    margin-bottom: 22px;
  }
  .sp-person {
    border-top: 1px solid rgba(183,163,146,0.30);
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .sp-person-name {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 16px;
    font-weight: 700;
    color: #442a1b;
  }
  .sp-person-meta {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    color: #b7a392;
    letter-spacing: 0.06em;
  }
  .sp-person-goal {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    color: #cd872a;
    font-weight: 500;
  }

  /* ── Block 2: Performer clips ── */
  .sp-clips {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 72px;
  }
  .sp-clip-card {
    background: #442a1b;
    border-radius: 16px;
    aspect-ratio: 9/16;
    max-height: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .sp-clip-card:hover {
    transform: scale(1.02);
    box-shadow: 0 14px 36px rgba(68,42,27,0.25);
  }
  .sp-clip-card:hover .sp-clip-play { transform: scale(1.15); }
  .sp-clip-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, rgba(68,42,27,0.6) 0%, rgba(30,15,5,0.85) 100%);
  }
  .sp-clip-play {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: rgba(205,135,42,0.25);
    border: 1.5px solid rgba(205,135,42,0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition: transform 0.25s ease;
    margin-bottom: 12px;
  }
  .sp-clip-label {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #f7f0e2;
    z-index: 2;
    text-align: center;
    padding: 0 16px;
    line-height: 1.4;
  }
  .sp-clip-topic {
    position: absolute;
    top: 14px;
    left: 14px;
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 700;
    font-family: var(--font-primary), system-ui, sans-serif;
    z-index: 2;
  }
  .sp-clip-duration {
    position: absolute;
    bottom: 14px;
    right: 14px;
    font-size: 10px;
    color: rgba(247,240,226,0.45);
    font-family: var(--font-primary), system-ui, sans-serif;
    z-index: 2;
  }

  /* ── Block 3: Counter snapshot ── */
  .sp-snapshot {
    background: #442a1b;
    border-radius: 20px;
    padding: 48px 40px;
    margin-bottom: 72px;
  }
  .sp-snapshot-label {
    font-size: 11px;
    letter-spacing: 0.20em;
    text-transform: uppercase;
    color: rgba(247,240,226,0.45);
    font-weight: 600;
    text-align: center;
    margin-bottom: 36px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .sp-snapshot-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
  }
  .sp-snapshot-item {
    text-align: center;
    border-right: 1px solid rgba(247,240,226,0.10);
    padding: 0 32px;
  }
  .sp-snapshot-item:last-child { border-right: none; }
  .sp-snapshot-num {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(40px, 5vw, 64px);
    font-weight: 700;
    color: #cd872a;
    display: block;
    margin-bottom: 8px;
    line-height: 1.0;
  }
  .sp-snapshot-label2 {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: rgba(247,240,226,0.55);
  }

  /* ── Block 4: UGC grid ── */
  .sp-ugc-section {
    margin-bottom: 72px;
  }
  .sp-ugc-label {
    font-size: 11px;
    letter-spacing: 0.20em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 700;
    margin-bottom: 24px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .sp-ugc-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
  }
  .sp-ugc-tile {
    aspect-ratio: 1;
    border-radius: 12px;
    background: #e8dcc8;
    border: 1px solid rgba(183,163,146,0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    position: relative;
  }
  .sp-ugc-tile:hover {
    transform: scale(1.04);
    box-shadow: 0 8px 24px rgba(68,42,27,0.15);
  }
  .sp-ugc-placeholder {
    font-size: 9px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: center;
    color: #b7a392;
    padding: 8px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .sp-ugc-handle {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(68,42,27,0.65);
    padding: 4px 6px;
    font-size: 9px;
    letter-spacing: 0.06em;
    text-align: center;
    color: rgba(247,240,226,0.70);
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .sp-ugc-note {
    font-size: 11px;
    color: #b7a392;
    font-style: italic;
    margin-top: 12px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }

  /* Brand statement */
  .sp-brand-statement {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(20px, 3vw, 32px);
    font-weight: 700;
    color: #442a1b;
    text-align: center;
    padding: 32px 0;
    border-top: 1px solid rgba(183,163,146,0.30);
    border-bottom: 1px solid rgba(183,163,146,0.30);
    margin-bottom: 48px;
    font-style: italic;
  }

  /* CTA bridge */
  .sp-cta-bridge {
    text-align: center;
  }
  .sp-cta-bridge p {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 15px;
    color: #6f5a48;
    max-width: 540px;
    margin: 0 auto 24px;
    line-height: 1.7;
  }

  /* Mobile */
  @media (max-width: 900px) {
    .sp-carousel { grid-template-columns: 1fr; }
    .sp-clips { grid-template-columns: repeat(2, 1fr); }
    .sp-snapshot-grid { grid-template-columns: 1fr; gap: 24px; }
    .sp-snapshot-item { border-right: none; border-bottom: 1px solid rgba(247,240,226,0.10); padding: 0 0 24px; }
    .sp-snapshot-item:last-child { border-bottom: none; }
    .sp-ugc-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 640px) {
    .sp-section { padding: 64px 0; }
    .sp-inner { padding: 0 20px; }
    .sp-clips { grid-template-columns: repeat(2, 1fr); }
    .sp-ugc-grid { grid-template-columns: repeat(2, 1fr); }
    .sp-snapshot { padding: 32px 20px; }
  }
`

function SnapshotCounter({ target, display, label }: { target: number; display?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const count = useCountUp(target, 1600, inView && !display)
  return (
    <div className="sp-snapshot-item" ref={ref}>
      <span className="sp-snapshot-num">{display ?? (count + '+')}</span>
      <span className="sp-snapshot-label2">{label}</span>
    </div>
  )
}

export default function SocialProofSection() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: spCSS }} />

      <section id="social-proof" className="sp-section" aria-labelledby="sp-heading">
        <div className="sp-inner">
          <div className="sp-header">
            <motion.p className="sp-eyebrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              Real People · Real Results
            </motion.p>
            <motion.h2
              id="sp-heading"
              className="sp-headline"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Performance Looks Different For Everyone.
            </motion.h2>
            <motion.p
              className="sp-sub"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              Some people want better consistency. Some want improved recovery habits. Some want a
              stronger daily routine. The common factor is showing up every day.
            </motion.p>
          </div>

          {/* Block 1: Community Stories */}
          <p className="sp-block-label">Community Stories</p>
          <div className="sp-carousel">
            {communityStories.map((story, i) => (
              <motion.div
                key={story.name}
                className="sp-testimonial"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <span className="sp-quote-mark" aria-hidden>&ldquo;</span>
                <p className="sp-quote-text">{story.quote}</p>
                <div className="sp-person">
                  <span className="sp-person-name">{story.name}, {story.age}</span>
                  <span className="sp-person-meta">{story.occupation} · {story.city}</span>
                  <span className="sp-person-goal">{story.goal}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Block 2: Performer clips */}
          <p className="sp-block-label">Lessons From High Performers</p>
          <div className="sp-clips">
            {performerClips.map((clip, i) => (
              <motion.div
                key={clip.topic}
                className="sp-clip-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                role="button"
                tabIndex={0}
                aria-label={`Play: ${clip.label}`}
              >
                <div className="sp-clip-bg" aria-hidden />
                <span className="sp-clip-topic">{clip.topic}</span>
                <div className="sp-clip-play" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#cd872a" aria-hidden>
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <p className="sp-clip-label">{clip.label}</p>
                <span className="sp-clip-duration">{clip.duration}</span>
              </motion.div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#b7a392', fontStyle: 'italic', marginBottom: 56, fontFamily: 'var(--font-primary)' }}>
            [NA — Performer short clips 30–60s: Mona / high performers on Discipline · Recovery · Consistency · Focus]
          </p>

          {/* Block 3: Community Snapshot */}
          <motion.div
            className="sp-snapshot"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="sp-snapshot-label">Growing Performance Ayurveda Community</p>
            <div className="sp-snapshot-grid">
              <SnapshotCounter target={29} label="Experience Centers" />
              <SnapshotCounter target={0} display="1000+" label="Community Members (Growing)" />
              <SnapshotCounter target={0} display="Growing" label="Assessments Completed" />
            </div>
          </motion.div>

          {/* Block 4: UGC Grid */}
          <div className="sp-ugc-section">
            <p className="sp-ugc-label">Shared By The Community</p>
            <div className="sp-ugc-grid" role="list" aria-label="Community Instagram posts from @3Tattava and @dr.kash.gupta">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="sp-ugc-tile" role="listitem" tabIndex={0} aria-label={`Community post ${i + 1}`}>
                  <p className="sp-ugc-placeholder">[NA — Instagram post]</p>
                  <span className="sp-ugc-handle">{i % 2 === 0 ? '@3Tattava' : '@dr.kash.gupta'}</span>
                </div>
              ))}
            </div>
            <p className="sp-ugc-note">
              [NA — Auto-pull Instagram reels exclusively from @3Tattava and @dr.kash.gupta official handles]
            </p>
          </div>

          {/* Brand statement */}
          <motion.p
            className="sp-brand-statement"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Products Can Be Purchased In Minutes. Transformation Is Built Daily.
          </motion.p>

          {/* CTA bridge */}
          <div className="sp-cta-bridge">
            <p>
              The strongest performance decisions are informed decisions. Explore the science,
              philosophy and practical application of Performance Ayurveda.
            </p>
            <button
              className="btn-primary-spec"
              style={{ fontFamily: 'var(--font-primary)', fontSize: 14, letterSpacing: '0.08em' }}
              onClick={() => document.getElementById('knowledge-center')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn Before You Buy
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
