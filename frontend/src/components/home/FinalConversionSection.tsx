'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const paths = [
  {
    id: 'shop',
    label: 'Start Your Ritual',
    description: 'Purchase-ready. Choose the format that fits your life.',
    cta: 'Shop Collection',
    href: '/products',
    visual: 'shop',
    bgGradient: 'linear-gradient(160deg, #442a1b 0%, #2a1608 100%)',
    iconColor: '#cd872a',
  },
  {
    id: 'assessment',
    label: 'Discover Your Starting Point',
    description: 'Not sure where to begin? The Assessment builds your personalized path.',
    cta: 'Take Performance Assessment',
    href: '/assessment',
    visual: 'assessment',
    bgGradient: 'linear-gradient(160deg, #f7f0e2 0%, #ede4d0 100%)',
    iconColor: '#442a1b',
    dark: false,
  },
  {
    id: 'experience',
    label: 'Experience It Offline',
    description: 'Visit a 3Tattava Experience Center across Delhi NCR.',
    cta: 'Find Experience Center',
    href: '/find-us',
    visual: 'map',
    bgGradient: 'linear-gradient(160deg, #442a1b 0%, #3a2215 100%)',
    iconColor: '#cd872a',
  },
]

const communityTypes = ['Athletes', 'Professionals', 'Fitness Enthusiasts', 'Lifelong Learners']

const fcCSS = `
  .fc-section {
    background: #442a1b;
    padding: 96px 0 0;
    overflow: hidden;
  }
  .fc-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
  }

  /* Header */
  .fc-eyebrow {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 500;
    margin-bottom: 14px;
    font-family: var(--font-primary), system-ui, sans-serif;
    text-align: center;
  }
  .fc-headline {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(28px, 4.5vw, 58px);
    font-weight: 700;
    color: #f7f0e2;
    text-align: center;
    margin: 0 0 8px;
    line-height: 1.05;
  }
  .fc-tagline {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 16px;
    color: rgba(247,240,226,0.55);
    text-align: center;
    margin-bottom: 80px;
    font-style: italic;
  }

  /* Three paths */
  .fc-paths {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 80px;
  }
  .fc-path-card {
    border-radius: 22px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(247,240,226,0.10);
  }
  .fc-path-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 56px rgba(0,0,0,0.30);
  }
  .fc-path-visual {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .fc-path-visual-bg {
    position: absolute;
    inset: 0;
    transition: transform 0.4s ease;
  }
  .fc-path-card:hover .fc-path-visual-bg { transform: scale(1.05); }
  .fc-path-icon {
    position: relative;
    z-index: 2;
    width: 72px;
    height: 72px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
  }
  .fc-path-card:hover .fc-path-icon { transform: scale(1.10); }
  .fc-path-icon-dark {
    background: rgba(247,240,226,0.10);
    border: 1px solid rgba(247,240,226,0.15);
  }
  .fc-path-icon-light {
    background: rgba(68,42,27,0.10);
    border: 1px solid rgba(68,42,27,0.12);
  }

  .fc-path-body {
    padding: 26px 26px 28px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .fc-path-body-dark { background: #2a1608; }
  .fc-path-body-light { background: #f7f0e2; }

  .fc-path-label {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
    line-height: 1.2;
  }
  .fc-path-body-dark .fc-path-label { color: #f7f0e2; }
  .fc-path-body-light .fc-path-label { color: #442a1b; }

  .fc-path-desc {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.65;
    flex: 1;
    margin-bottom: 22px;
  }
  .fc-path-body-dark .fc-path-desc { color: rgba(247,240,226,0.60); }
  .fc-path-body-light .fc-path-desc { color: #6f5a48; }

  .fc-path-btn {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    border-radius: 10px;
    padding: 14px 20px;
    cursor: pointer;
    border: none;
    transition: transform 0.2s ease, background 0.2s ease;
    width: 100%;
  }
  .fc-path-btn:hover { transform: translateY(-1px); }
  .fc-path-btn-dark { background: #cd872a; color: #442a1b; }
  .fc-path-btn-dark:hover { background: #b5722a; }
  .fc-path-btn-light { background: #442a1b; color: #f7f0e2; }
  .fc-path-btn-light:hover { background: #5a3625; }

  /* Signature statement */
  .fc-signature {
    text-align: center;
    padding: 64px 0;
    border-top: 1px solid rgba(247,240,226,0.10);
    margin-bottom: 0;
  }
  .fc-signature-text {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(22px, 3.5vw, 42px);
    font-weight: 700;
    color: #f7f0e2;
    font-style: italic;
    line-height: 1.25;
    position: relative;
    display: inline-block;
  }
  .fc-signature-text::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #cd872a 50%, transparent 100%);
  }

  /* Community invitation */
  .fc-community {
    background: rgba(247,240,226,0.05);
    border-top: 1px solid rgba(247,240,226,0.08);
    padding: 40px 32px;
    text-align: center;
  }
  .fc-community-headline {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 22px;
    font-weight: 600;
    color: #f7f0e2;
    margin-bottom: 10px;
  }
  .fc-community-sub {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 14px;
    color: rgba(247,240,226,0.50);
    margin-bottom: 20px;
    font-style: italic;
  }
  .fc-community-types {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 32px;
  }
  .fc-community-type {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    color: rgba(247,240,226,0.65);
    background: rgba(247,240,226,0.07);
    border: 1px solid rgba(247,240,226,0.12);
    border-radius: 20px;
    padding: 5px 14px;
    font-weight: 500;
  }

  /* Final CTA bar */
  .fc-cta-bar {
    background: #ffffff;
    padding: 28px 32px;
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
  }
  .fc-cta-primary {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    background: #442a1b;
    color: #f7f0e2;
    border: none;
    border-radius: 12px;
    padding: 16px 36px;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .fc-cta-primary:hover { background: #5a3625; transform: translateY(-1px); }
  .fc-cta-secondary {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    background: transparent;
    color: #442a1b;
    border: 1.5px solid rgba(183,163,146,0.60);
    border-radius: 12px;
    padding: 16px 32px;
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
  }
  .fc-cta-secondary:hover { border-color: #442a1b; background: rgba(68,42,27,0.05); transform: translateY(-1px); }

  /* Mobile */
  @media (max-width: 900px) {
    .fc-paths { grid-template-columns: 1fr; }
    .fc-path-visual { height: 160px; }
  }
  @media (max-width: 640px) {
    .fc-section { padding: 64px 0 0; }
    .fc-inner { padding: 0 20px; }
    .fc-signature { padding: 48px 0; }
    .fc-cta-bar { padding: 20px; flex-direction: column; }
    .fc-cta-primary, .fc-cta-secondary { width: 100%; text-align: center; }
  }
`

const pathIcons: Record<string, React.ReactNode> = {
  shop: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cd872a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  assessment: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#442a1b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  map: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cd872a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
}

export default function FinalConversionSection() {
  const router = useRouter()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fcCSS }} />

      <section id="final-conversion" className="fc-section" aria-labelledby="fc-heading">
        <div className="fc-inner">
          <motion.p className="fc-eyebrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Begin Your Journey
          </motion.p>
          <motion.h2
            id="fc-heading"
            className="fc-headline"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            Ready To Begin?<br />
            Balance. Build. Become.
          </motion.h2>
          <motion.p
            className="fc-tagline"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Ancient Ayurvedic Intelligence for Modern Performance.
          </motion.p>

          {/* Three paths */}
          <div className="fc-paths">
            {paths.map((path, i) => {
              const isDark = path.dark !== false
              return (
                <motion.div
                  key={path.id}
                  className="fc-path-card"
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  onClick={() => router.push(path.href)}
                >
                  <div className="fc-path-visual">
                    <div className="fc-path-visual-bg" style={{ background: path.bgGradient }} />
                    <div className={`fc-path-icon ${isDark ? 'fc-path-icon-dark' : 'fc-path-icon-light'}`}>
                      {pathIcons[path.visual]}
                    </div>
                  </div>
                  <div className={`fc-path-body ${isDark ? 'fc-path-body-dark' : 'fc-path-body-light'}`}>
                    <h3 className="fc-path-label">{path.label}</h3>
                    <p className="fc-path-desc">{path.description}</p>
                    <button className={`fc-path-btn ${isDark ? 'fc-path-btn-dark' : 'fc-path-btn-light'}`}>
                      {path.cta}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Signature statement */}
          <div className="fc-signature">
            <motion.p
              className="fc-signature-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              We Don&apos;t Believe In Quick Fixes.<br />We Believe In Daily Rituals.
            </motion.p>
          </div>

          {/* Community invitation */}
          <div className="fc-community">
            <h3 className="fc-community-headline">Join The Performance Ayurveda Movement</h3>
            <p className="fc-community-sub">Growing together through education, discipline and daily rituals.</p>
            <div className="fc-community-types" role="list">
              {communityTypes.map((type) => (
                <span key={type} className="fc-community-type" role="listitem">{type}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA bar */}
        <motion.div
          className="fc-cta-bar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <button className="fc-cta-primary" onClick={() => router.push('/products')}>
            Shop Now
          </button>
          <button className="fc-cta-secondary" onClick={() => router.push('/assessment')}>
            Take Assessment
          </button>
          <button className="fc-cta-secondary" onClick={() => router.push('/find-us')}>
            Find A Center
          </button>
        </motion.div>
      </section>
    </>
  )
}
