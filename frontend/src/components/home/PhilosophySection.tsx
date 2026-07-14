'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const pillars = [
  {
    id: 'balance',
    english: 'Balance',
    sanskrit: 'समत्व',
    romanized: 'Samatva',
    headline: 'Restore The Foundation.',
    body: 'Before strength comes stability. Before performance comes recovery. Before growth comes balance. Support the foundations that modern lifestyles often disrupt.',
    attributes: ['Energy', 'Recovery', 'Sleep', 'Digestion', 'Stress resilience'],
    visual: 'balance',
    expandedContent: {
      articles: ['What is Balance in Performance Ayurveda?', 'Supporting Your Energy Foundations', 'Sleep & Recovery: The Ayurvedic View'],
      rituals: ['Morning grounding ritual', 'Evening wind-down routine', 'Stress-adaptive practices'],
    },
  },
  {
    id: 'build',
    english: 'Build',
    sanskrit: 'बल',
    romanized: 'Bala',
    headline: 'Develop Resilience.',
    body: 'Once the foundation is stable, the next step is growth. Build the capacity to train harder, focus longer and recover better. Support your capacity to perform daily.',
    attributes: ['Physical strength', 'Mental resilience', 'Consistency', 'Endurance', 'Daily performance'],
    visual: 'build',
    expandedContent: {
      articles: ['Shahjeet: The Daily Performance Ritual', 'Building Physical Resilience', 'Mental Performance Through Ayurveda'],
      rituals: ['Pre-training ritual', 'Recovery support practice', 'Consistency discipline framework'],
    },
  },
  {
    id: 'become',
    english: 'Become',
    sanskrit: 'उत्कर्ष',
    romanized: 'Utkarsha',
    headline: 'Reach Higher Potential.',
    body: 'Performance is not a destination. It is a continuous process of becoming. Support the habits, rituals and mindset that help you evolve into your strongest self.',
    attributes: ['Longevity', 'Vitality', 'Leadership', 'Purpose', 'Lifelong growth'],
    visual: 'become',
    expandedContent: {
      articles: ['RockResin: The Deep Vitality Ritual', 'Longevity Through Performance Ayurveda', 'Advanced Rasayana Principles'],
      rituals: ['Deep ritual practice', 'Longevity daily habits', 'Advanced performance protocol'],
    },
  },
]

const pillarVisuals: Record<string, React.ReactNode> = {
  balance: (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', opacity: 0.18 }} aria-hidden>
      <circle cx="100" cy="100" r="80" stroke="#cd872a" strokeWidth="1" />
      <circle cx="100" cy="100" r="55" stroke="#cd872a" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="30" stroke="#cd872a" strokeWidth="0.6" />
      <line x1="100" y1="20" x2="100" y2="180" stroke="#cd872a" strokeWidth="0.5" />
      <line x1="20" y1="100" x2="180" y2="100" stroke="#cd872a" strokeWidth="0.5" />
      <path d="M100 20 Q140 60 100 100 Q60 140 100 180" stroke="#cd872a" strokeWidth="1.2" fill="none" />
    </svg>
  ),
  build: (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', opacity: 0.18 }} aria-hidden>
      <path d="M100 20 L180 160 L20 160 Z" stroke="#cd872a" strokeWidth="1.2" fill="none" />
      <path d="M100 50 L160 150 L40 150 Z" stroke="#cd872a" strokeWidth="0.8" fill="none" />
      <path d="M100 80 L140 140 L60 140 Z" stroke="#cd872a" strokeWidth="0.6" fill="none" />
      <line x1="100" y1="20" x2="100" y2="170" stroke="#cd872a" strokeWidth="0.5" />
    </svg>
  ),
  become: (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', opacity: 0.18 }} aria-hidden>
      <path d="M100 180 L20 80 Q100 10 180 80 Z" stroke="#cd872a" strokeWidth="1.2" fill="none" />
      <path d="M100 160 L40 90 Q100 35 160 90 Z" stroke="#cd872a" strokeWidth="0.8" fill="none" />
      <path d="M100 20 L100 180" stroke="#cd872a" strokeWidth="0.5" />
      <circle cx="100" cy="20" r="5" stroke="#cd872a" strokeWidth="1" />
    </svg>
  ),
}

const philCSS = `
  .phil-section {
    background: #f7f0e2;
    padding: 96px 0;
    overflow: hidden;
  }
  .phil-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .phil-header {
    text-align: center;
    max-width: 760px;
    margin: 0 auto 72px;
  }
  .phil-eyebrow {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 500;
    margin-bottom: 14px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .phil-headline {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(30px, 4.5vw, 52px);
    font-weight: 700;
    color: #442a1b;
    margin: 0 0 22px;
    line-height: 1.08;
  }
  .phil-intro {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 17px;
    line-height: 1.7;
    color: #6f5a48;
    margin-bottom: 16px;
  }
  .phil-subtitle {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: #6f5a48;
  }
  .phil-brand-mark {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    color: #cd872a;
    font-weight: 700;
    font-style: italic;
  }

  /* Cards */
  .phil-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 64px;
    position: relative;
    padding-top: 28px;
  }
  .phil-thread {
    position: absolute; top: 6px; left: 0; width: 100%; height: 40px;
    z-index: 4; pointer-events: none; overflow: visible;
  }
  @media (max-width: 768px) { .phil-thread { display: none; } }
  .phil-card {
    background:
      repeating-linear-gradient(180deg, transparent 0 15px, rgba(120,90,40,0.045) 15px 16px),
      linear-gradient(160deg, #f3e9d2 0%, #ead9bb 100%);
    border: 1px solid rgba(120,90,40,0.42);
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    position: relative;
    box-shadow: 0 10px 30px rgba(68,42,27,0.12), inset 0 0 44px rgba(120,90,40,0.07);
  }
  .phil-card::before {
    content: "";
    position: absolute;
    top: 9px; left: 50%; transform: translateX(-50%);
    width: 10px; height: 10px; border-radius: 50%;
    background: #2a1a0e;
    box-shadow: inset 0 1px 2px rgba(0,0,0,.6), 0 0 0 1px rgba(120,90,40,0.4);
    z-index: 5;
  }
  .phil-card:hover {
    box-shadow: 0 14px 36px rgba(68,42,27,0.14);
    transform: translateY(-4px);
  }
  .phil-card.active {
    border-color: #cd872a;
    box-shadow: 0 0 0 2px rgba(205,135,42,0.25), 0 14px 36px rgba(68,42,27,0.14);
  }

  /* Visual area */
  .phil-card-visual {
    height: 160px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .phil-card-visual-bg {
    position: absolute;
    inset: 0;
    transition: transform 0.5s ease;
  }
  .phil-card:hover .phil-card-visual-bg {
    transform: scale(1.04);
  }
  .phil-visual-balance { background: linear-gradient(135deg, #f3e9d2 0%, #e7d6b4 100%); }
  .phil-visual-build   { background: linear-gradient(135deg, #ecdcbb 0%, #dcc699 100%); }
  .phil-visual-become  { background: linear-gradient(135deg, #e0cca0 0%, #6f4a24 100%); }

  .phil-card-visual-icon {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .phil-visual-inner {
    width: 120px;
    height: 120px;
  }

  /* Card body */
  .phil-card-body-area {
    padding: 28px 28px 24px;
  }
  .phil-card-num {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 11px;
    letter-spacing: 0.20em;
    color: #cd872a;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .phil-card-english {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 28px;
    font-weight: 700;
    color: #442a1b;
    margin-bottom: 2px;
    line-height: 1;
  }
  .phil-card-sanskrit {
    font-family: var(--font-devanagari, 'Noto Serif Devanagari', serif);
    font-size: 17px;
    color: #cd872a;
    margin-bottom: 2px;
    display: block;
  }
  .phil-card-romanized {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.12em;
    color: #8a6f4a;
    text-transform: uppercase;
    margin-bottom: 16px;
    display: block;
  }
  .phil-card-tagline {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #442a1b;
    margin-bottom: 10px;
  }
  .phil-card-desc {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    line-height: 1.65;
    color: #6f5a48;
    margin-bottom: 16px;
  }
  .phil-card-attrs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 16px;
  }
  .phil-card-attr {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    color: #442a1b;
    background: #f7f0e2;
    border: 1px solid rgba(183,163,146,0.40);
    border-radius: 12px;
    padding: 3px 10px;
    font-weight: 500;
  }
  .phil-expand-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    transition: gap 0.2s ease;
  }
  .phil-expand-btn:hover { gap: 10px; }

  /* Expanded panel */
  .phil-expanded-panel {
    overflow: hidden;
    background: #fdfbf8;
    border-top: 1px solid rgba(183,163,146,0.30);
  }
  .phil-expanded-inner {
    padding: 20px 28px 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .phil-expanded-group h4 {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .phil-expanded-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .phil-expanded-list li {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    color: #442a1b;
    padding: 4px 0;
    border-bottom: 1px solid rgba(183,163,146,0.20);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .phil-expanded-list li::before {
    content: '';
    width: 4px;
    height: 4px;
    background: #cd872a;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .phil-expanded-list li:last-child { border-bottom: none; }

  /* Mid-statement */
  .phil-mid-statement {
    background: #442a1b;
    border-radius: 20px;
    padding: 52px 48px;
    text-align: center;
    margin-bottom: 64px;
  }
  .phil-mid-text {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(20px, 3vw, 34px);
    font-weight: 600;
    color: #f7f0e2;
    line-height: 1.35;
    font-style: italic;
  }

  /* CTA */
  .phil-cta {
    text-align: center;
  }
  .phil-cta-label {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 14px;
    color: #6f5a48;
    margin-bottom: 20px;
  }
  .phil-cta-label strong {
    color: #442a1b;
    font-weight: 600;
  }

  /* Mobile */
  @media (max-width: 900px) {
    .phil-cards { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .phil-section { padding: 64px 0; }
    .phil-inner { padding: 0 20px; }
    .phil-mid-statement { padding: 36px 24px; }
    .phil-expanded-inner { grid-template-columns: 1fr; }
  }
`

export default function PhilosophySection() {
  const router = useRouter()
  const [activeCard, setActiveCard] = useState<string | null>(null)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: philCSS }} />

      <section id="philosophy" className="phil-section" aria-labelledby="phil-heading">
        <div className="phil-inner">
          {/* Header */}
          <div className="phil-header">
            <motion.p className="phil-eyebrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              The Philosophy
            </motion.p>
            <motion.h2
              id="phil-heading"
              className="phil-headline"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              The Journey Of Performance
            </motion.h2>
            <motion.p
              className="phil-intro"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              Not overnight. Not through shortcuts. Not through hacks. Through daily rituals
              that help you balance your foundations, build resilience and become your strongest self.
            </motion.p>
            <motion.p
              className="phil-subtitle"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
            >
              Ancient Ayurveda never focused on quick fixes. It focused on creating the conditions
              for long-term vitality, strength and growth. At 3Tattava, we call this:{' '}
              <span className="phil-brand-mark">Balance · Build · Become</span>
            </motion.p>
          </div>

          {/* Three pillars */}
          <div className="phil-cards">
          <svg className="phil-thread" viewBox="0 0 1000 44" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="philCord" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#A67B2F" /><stop offset="0.5" stopColor="#E4C079" /><stop offset="1" stopColor="#cd872a" />
              </linearGradient>
            </defs>
            <path d="M30 22 Q 180 8 333 20 T 667 20 T 970 26" fill="none" stroke="url(#philCord)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="167" cy="19" r="5" fill="#7a5024" stroke="#E4C079" strokeWidth="1.2" />
            <circle cx="500" cy="20" r="5" fill="#7a5024" stroke="#E4C079" strokeWidth="1.2" />
            <circle cx="833" cy="20" r="5" fill="#7a5024" stroke="#E4C079" strokeWidth="1.2" />
            <g stroke="url(#philCord)" strokeWidth="2"><line x1="970" y1="26" x2="970" y2="42" /><line x1="966" y1="30" x2="966" y2="40" /><line x1="974" y1="30" x2="974" y2="40" /></g>
          </svg>
            {pillars.map((pillar, i) => {
              const isActive = activeCard === pillar.id
              return (
                <motion.div
                  key={pillar.id}
                  className={`phil-card${isActive ? ' active' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.55 }}
                  onClick={() => setActiveCard(isActive ? null : pillar.id)}
                >
                  {/* Visual area */}
                  <div className="phil-card-visual" aria-hidden>
                    <div className={`phil-card-visual-bg phil-visual-${pillar.id}`} />
                    <div className="phil-card-visual-icon">
                      <div className="phil-visual-inner">
                        {pillarVisuals[pillar.visual]}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="phil-card-body-area">
                    <p className="phil-card-num">0{i + 1}</p>
                    <h3 className="phil-card-english">{pillar.english}</h3>
                    <span className="phil-card-sanskrit" lang="sa">{pillar.sanskrit}</span>
                    <span className="phil-card-romanized">({pillar.romanized})</span>
                    <p className="phil-card-tagline">{pillar.headline}</p>
                    <p className="phil-card-desc">{pillar.body}</p>
                    <div className="phil-card-attrs" role="list">
                      {pillar.attributes.map((attr) => (
                        <span key={attr} className="phil-card-attr" role="listitem">{attr}</span>
                      ))}
                    </div>
                    <button
                      className="phil-expand-btn"
                      aria-expanded={isActive}
                      aria-controls={`phil-panel-${pillar.id}`}
                    >
                      {isActive ? 'Collapse' : 'Explore'} {pillar.english}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        {isActive
                          ? <polyline points="18 15 12 9 6 15" />
                          : <polyline points="6 9 12 15 18 9" />
                        }
                      </svg>
                    </button>
                  </div>

                  {/* Expandable panel */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        id={`phil-panel-${pillar.id}`}
                        className="phil-expanded-panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="phil-expanded-inner">
                          <div className="phil-expanded-group">
                            <h4>Recommended Articles</h4>
                            <ul className="phil-expanded-list">
                              {pillar.expandedContent.articles.map((a) => (
                                <li key={a}>{a}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="phil-expanded-group">
                            <h4>Recommended Rituals</h4>
                            <ul className="phil-expanded-list">
                              {pillar.expandedContent.rituals.map((r) => (
                                <li key={r}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Mid-statement */}
          <motion.div
            className="phil-mid-statement"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <p className="phil-mid-text">
              Ayurveda Was Never Just About Treating Illness.<br />
              It Was About Supporting Human Potential.
            </p>
          </motion.div>

          {/* CTA */}
          <div className="phil-cta">
            <p className="phil-cta-label">
              <strong>Discover Your Performance Stage</strong>
            </p>
            <button
              className="btn-primary-spec"
              style={{ fontFamily: 'var(--font-primary)', fontSize: 14, letterSpacing: '0.08em' }}
              onClick={() => router.push('/assessment')}
            >
              Take The Assessment
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
