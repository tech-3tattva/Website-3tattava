'use client'
import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const stages = [
  {
    id: 'week1',
    label: 'WEEK 1',
    theme: 'Foundation',
    subtheme: 'Creating Consistency',
    color: '#cd872a',
    focus: [
      'Establishing a daily ritual',
      'Better hydration habits',
      'More awareness of energy patterns',
      'Greater consistency in lifestyle habits',
    ],
    behindScenes:
      'Your body responds best to consistency. The goal of the first week is not transformation. It\'s creating the conditions for it.',
  },
  {
    id: 'week24',
    label: 'WEEK 2–4',
    theme: 'Momentum',
    subtheme: 'Building Capacity',
    color: '#b06e1a',
    focus: [
      'Feeling more structured in their routine',
      'Better commitment to training',
      'Improved recovery habits',
      'Greater day-to-day consistency',
    ],
    behindScenes:
      'Recovery, nutrition, movement and sleep work together to influence long-term performance outcomes.',
  },
  {
    id: 'month23',
    label: 'MONTH 2–3',
    theme: 'Performance',
    subtheme: 'Supporting Daily Demands',
    color: '#8a5614',
    focus: [
      'Training consistency',
      'Work performance',
      'Daily resilience',
      'Maintaining momentum',
    ],
    behindScenes:
      'Performance is rarely driven by one factor. It emerges from the interaction between recovery, nutrition, movement and lifestyle habits.',
  },
  {
    id: 'longterm',
    label: 'LONG TERM',
    theme: 'Becoming',
    subtheme: 'Sustainable Vitality',
    color: '#442a1b',
    focus: [
      'Longevity',
      'Resilience',
      'Healthy routines',
      'Lifelong growth',
    ],
    behindScenes:
      'The strongest results often come from habits maintained over months and years rather than days.',
  },
]

const ttCSS = `
  .tt-section {
    background: #0d0803;
    padding: 96px 0;
    overflow: hidden;
    position: relative;
  }
  .tt-video-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    opacity: 0.35;
  }
  .tt-video-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg,
      rgba(13,8,3,0.92) 0%,
      rgba(13,8,3,0.75) 30%,
      rgba(13,8,3,0.75) 70%,
      rgba(13,8,3,0.95) 100%);
    z-index: 1;
    pointer-events: none;
  }
  .tt-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
    position: relative;
    z-index: 2;
  }
  .tt-header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 80px;
  }
  .tt-eyebrow {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 500;
    margin-bottom: 14px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .tt-headline {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(26px, 4vw, 46px);
    font-weight: 700;
    color: #f7f0e2;
    margin: 0 0 18px;
    line-height: 1.1;
  }
  .tt-sub {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: rgba(247,240,226,0.55);
  }

  /* Horizontal progress track (desktop) */
  .tt-track-wrap {
    position: relative;
    margin-bottom: 64px;
  }
  .tt-progress-line {
    position: absolute;
    top: 24px;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(183,163,146,0.35);
    z-index: 0;
  }
  .tt-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #cd872a, #442a1b);
    width: var(--fill, 0%);
    transition: width 0.05s linear;
    transform-origin: left;
  }

  .tt-stages {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    position: relative;
    z-index: 1;
  }
  .tt-stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
  }
  .tt-stage-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    margin-bottom: 20px;
    flex-shrink: 0;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    z-index: 2;
  }
  .tt-stage:hover .tt-stage-dot,
  .tt-stage.active .tt-stage-dot {
    transform: scale(1.4);
    box-shadow: 0 0 0 4px rgba(205,135,42,0.25);
  }
  .tt-stage-label {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 700;
    margin-bottom: 6px;
    text-align: center;
  }
  .tt-stage-theme {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 22px;
    font-weight: 700;
    color: #f7f0e2;
    text-align: center;
    margin-bottom: 4px;
  }
  .tt-stage-subtheme {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    color: rgba(247,240,226,0.40);
    text-align: center;
    letter-spacing: 0.06em;
  }

  /* Stage detail card */
  .tt-detail {
    background: #ffffff;
    border: 1px solid rgba(183,163,146,0.40);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(68,42,27,0.08);
  }
  .tt-detail-header {
    padding: 32px 40px 24px;
    border-bottom: 1px solid rgba(183,163,146,0.25);
  }
  .tt-detail-label {
    font-size: 10px;
    letter-spacing: 0.20em;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 6px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .tt-detail-theme {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 32px;
    font-weight: 700;
    color: #442a1b;
    margin-bottom: 4px;
  }
  .tt-detail-subtheme {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 14px;
    color: #6f5a48;
  }
  .tt-detail-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }
  .tt-detail-focus {
    padding: 28px 40px;
    border-right: 1px solid rgba(183,163,146,0.25);
  }
  .tt-detail-focus-label {
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 700;
    margin-bottom: 16px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .tt-detail-focus-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .tt-detail-focus-list li {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 14px;
    color: #442a1b;
    padding: 7px 0;
    border-bottom: 1px solid rgba(183,163,146,0.20);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .tt-detail-focus-list li:last-child { border-bottom: none; }
  .tt-focus-check {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #cd872a;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .tt-detail-behind {
    padding: 28px 40px;
    background: #fdfbf8;
  }
  .tt-detail-behind-label {
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #b7a392;
    font-weight: 700;
    margin-bottom: 14px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .tt-detail-behind-text {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.75;
    color: #6f5a48;
    font-style: italic;
  }

  /* Compliance note */
  .tt-compliance {
    margin-top: 40px;
    padding: 20px 28px;
    background: rgba(247,240,226,0.05);
    border-radius: 12px;
    border-left: 3px solid rgba(205,135,42,0.35);
  }
  .tt-compliance-text {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    line-height: 1.65;
    color: rgba(247,240,226,0.35);
    font-style: italic;
  }

  /* Mobile: vertical */
  @media (max-width: 900px) {
    .tt-progress-line { display: none; }
    .tt-stages { grid-template-columns: 1fr; gap: 24px; }
    .tt-stage { align-items: flex-start; flex-direction: row; gap: 16px; }
    .tt-stage-dot { margin-bottom: 0; margin-top: 4px; }
    .tt-stage-label, .tt-stage-theme, .tt-stage-subtheme { text-align: left; }
    .tt-detail-body { grid-template-columns: 1fr; }
    .tt-detail-focus { border-right: none; border-bottom: 1px solid rgba(183,163,146,0.25); }
  }
  @media (max-width: 640px) {
    .tt-section { padding: 64px 0; }
    .tt-inner { padding: 0 20px; }
    .tt-detail-header { padding: 24px; }
    .tt-detail-focus, .tt-detail-behind { padding: 20px 24px; }
  }
`

export default function TransformationTimelineSection() {
  const [activeStage, setActiveStage] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 70%', 'end 90%'],
  })
  const fillWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const current = stages[activeStage]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ttCSS }} />

      <section id="transformation" className="tt-section" aria-labelledby="tt-heading">
        {/* Cinematic video background */}
        <video
          className="tt-video-bg"
          src="https://media.3tattava.com/videos/week-bg.mp4"
          autoPlay muted loop playsInline
          aria-hidden
        />
        <div className="tt-video-overlay" aria-hidden />

        <div className="tt-inner" ref={sectionRef}>
          <div className="tt-header">
            <motion.p className="tt-eyebrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              What To Expect
            </motion.p>
            <motion.h2
              id="tt-heading"
              className="tt-headline"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              The Journey Looks Different For Everyone
            </motion.h2>
            <motion.p
              className="tt-sub"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              However, many people describe a progression that follows a familiar pattern when
              consistent habits, training, nutrition and daily rituals come together.
            </motion.p>
          </div>

          {/* Progress track */}
          <div className="tt-track-wrap">
            <div className="tt-progress-line" ref={progressRef}>
              <motion.div className="tt-progress-fill" style={{ width: fillWidth }} />
            </div>

            <div className="tt-stages" role="tablist">
              {stages.map((stage, i) => (
                <motion.div
                  key={stage.id}
                  className={`tt-stage${activeStage === i ? ' active' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  onClick={() => setActiveStage(i)}
                  role="tab"
                  aria-selected={activeStage === i}
                  aria-controls={`tt-panel-${stage.id}`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveStage(i)}
                >
                  <div
                    className="tt-stage-dot"
                    style={{ background: stage.color }}
                    aria-hidden
                  />
                  <p className="tt-stage-label">{stage.label}</p>
                  <p className="tt-stage-theme">{stage.theme}</p>
                  <p className="tt-stage-subtheme">{stage.subtheme}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Detail card */}
          <motion.div
            key={current.id}
            id={`tt-panel-${current.id}`}
            className="tt-detail"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            role="tabpanel"
          >
            <div className="tt-detail-header">
              <p className="tt-detail-label" style={{ color: current.color }}>{current.label}</p>
              <h3 className="tt-detail-theme">{current.theme}</h3>
              <p className="tt-detail-subtheme">{current.subtheme}</p>
            </div>
            <div className="tt-detail-body">
              <div className="tt-detail-focus">
                <p className="tt-detail-focus-label">What People Often Focus On</p>
                <ul className="tt-detail-focus-list">
                  {current.focus.map((f) => (
                    <li key={f}>
                      <span className="tt-focus-check" aria-hidden>
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2 6 5 9 10 3" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="tt-detail-behind">
                <p className="tt-detail-behind-label">What&apos;s Happening Behind The Scenes</p>
                <p className="tt-detail-behind-text">{current.behindScenes}</p>
              </div>
            </div>
          </motion.div>

          {/* Compliance disclaimer */}
          <div className="tt-compliance" role="note">
            <p className="tt-compliance-text">
              Individual results vary. This timeline reflects common patterns reported by people
              who maintain consistent daily habits, nutrition, recovery, movement and rituals.
              No medical claims are made. Consult a healthcare professional for personalized advice.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
