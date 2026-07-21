'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const trustGrid = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M8 3l4 8 5-5 5 15H2L8 3z" />
      </svg>
    ),
    title: 'Himalayan Sourcing',
    body: 'Carefully sourced raw materials above 16,000 ft.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Classical Shodhana',
    body: 'Traditional Ayurvedic purification method with triphala.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
      </svg>
    ),
    title: 'NABL 3rd Party Lab Tested',
    body: 'Eurofins Labs — heavy metals, microbes and fulvic acid.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: 'US-FDA facility registration (not product approval)',
    body: 'Meeting global manufacturing standards.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: 'AYUSH GMP Manufacturing',
    body: 'Produced in certified AYUSH GMP facilities.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M1 6l4.5 3L12 4l6.5 5L23 6" /><path d="M1 12l4.5 3L12 10l6.5 5L23 12" /><path d="M1 18l4.5 3L12 16l6.5 5L23 18" />
      </svg>
    ),
    title: 'Transparency First',
    body: 'Access lab reports, COAs, and product specifications.',
  },
]

const labResults = [
  { label: 'Purity Verification', status: 'Passed' },
  { label: 'Heavy Metal Testing', status: 'Passed' },
  { label: 'Microbial Safety', status: 'Passed' },
  { label: 'Identity Verification', status: 'Passed' },
]

const evidenceCSS = `
  .evidence-section {
    background: #ffffff;
    padding: 96px 0;
    overflow: hidden;
  }
  .evidence-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
  }

  /* Header */
  .evidence-eyebrow {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 500;
    margin-bottom: 14px;
    font-family: var(--font-primary), system-ui, sans-serif;
    text-align: center;
  }
  .evidence-headline {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(28px, 4vw, 50px);
    font-weight: 700;
    color: #442a1b;
    text-align: center;
    margin: 0 0 18px 0;
    line-height: 1.1;
  }
  .evidence-sub {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 17px;
    line-height: 1.7;
    color: #6f5a48;
    text-align: center;
    max-width: 640px;
    margin: 0 auto 72px;
  }

  /* Trust grid 3×2 */
  .evidence-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: rgba(183,163,146,0.25);
    border: 1px solid rgba(183,163,146,0.25);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 72px;
  }
  .evidence-grid-item {
    background: #ffffff;
    padding: 32px 28px;
    transition: background 0.25s ease;
  }
  .evidence-grid-item:hover {
    background: #fdfbf8;
  }
  .evidence-grid-icon {
    color: #442a1b;
    margin-bottom: 16px;
    transition: color 0.2s ease, transform 0.25s ease;
  }
  .evidence-grid-item:hover .evidence-grid-icon {
    color: #cd872a;
    transform: scale(1.06);
  }
  .evidence-grid-title {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #442a1b;
    margin-bottom: 6px;
  }
  .evidence-grid-body {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    line-height: 1.6;
    color: #6f5a48;
  }

  /* QR / Scan block */
  .evidence-qr-block {
    display: flex;
    align-items: center;
    gap: 40px;
    background: #f7f0e2;
    border: 1px solid rgba(183,163,146,0.40);
    border-radius: 20px;
    padding: 40px 48px;
    margin-bottom: 72px;
  }
  .evidence-qr-placeholder {
    width: 120px;
    height: 120px;
    background: #ffffff;
    border: 1px solid rgba(183,163,146,0.40);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(68,42,27,0.08);
  }
  .evidence-qr-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(6, 1fr);
    gap: 3px;
    width: 80px;
    height: 80px;
  }
  .evidence-qr-cell {
    border-radius: 2px;
    background: #442a1b;
  }
  .evidence-qr-cell.light { background: #ffffff; }
  .evidence-qr-text h3 {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 26px;
    font-weight: 700;
    color: #442a1b;
    margin: 0 0 8px 0;
  }
  .evidence-qr-text p {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 15px;
    color: #6f5a48;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  .evidence-qr-links {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  .evidence-qr-link {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: #442a1b;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s ease;
  }
  .evidence-qr-link:hover { color: #cd872a; }
  .evidence-qr-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #cd872a;
    flex-shrink: 0;
  }

  /* Lab result "Passed" cards */
  .evidence-lab-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 72px;
  }
  .evidence-lab-card {
    border: 1px solid rgba(183,163,146,0.40);
    border-radius: 14px;
    padding: 24px 20px;
    background: #ffffff;
    position: relative;
    overflow: hidden;
  }
  .evidence-lab-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #2a6e2a, #3d9e3d);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s ease;
  }
  .evidence-lab-card.animated::before {
    transform: scaleX(1);
  }
  .evidence-lab-label {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #442a1b;
    margin-bottom: 12px;
  }
  .evidence-lab-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: rgba(42,110,42,0.10);
    border: 1px solid rgba(42,110,42,0.25);
    border-radius: 20px;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: #2a6e2a;
    font-weight: 700;
  }
  .evidence-lab-check {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #2a6e2a;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Education strip */
  .evidence-edu-strip {
    background: #f7f0e2;
    border-radius: 16px;
    padding: 40px 48px;
    margin-bottom: 48px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 32px;
    align-items: center;
    border: 1px solid rgba(183,163,146,0.30);
  }
  .evidence-edu-label {
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 600;
    margin-bottom: 10px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .evidence-edu-title {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 22px;
    font-weight: 700;
    color: #442a1b;
    margin-bottom: 10px;
  }
  .evidence-edu-body {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 15px;
    line-height: 1.7;
    color: #6f5a48;
  }

  /* Principle line */
  .evidence-principle {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(20px, 3vw, 32px);
    font-weight: 600;
    color: #442a1b;
    text-align: center;
    padding: 32px 0;
    border-top: 1px solid rgba(183,163,146,0.30);
    border-bottom: 1px solid rgba(183,163,146,0.30);
    margin-bottom: 48px;
    font-style: italic;
  }

  /* CTA */
  .evidence-cta-row {
    display: flex;
    justify-content: center;
  }

  /* Mobile */
  @media (max-width: 900px) {
    .evidence-grid { grid-template-columns: repeat(2, 1fr); }
    .evidence-lab-row { grid-template-columns: repeat(2, 1fr); }
    .evidence-qr-block { flex-direction: column; text-align: center; padding: 32px 24px; }
    .evidence-qr-links { justify-content: center; }
    .evidence-edu-strip { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .evidence-section { padding: 64px 0; }
    .evidence-inner { padding: 0 20px; }
    .evidence-grid { grid-template-columns: 1fr; }
    .evidence-lab-row { grid-template-columns: 1fr; }
  }
`

export default function EvidenceSection() {
  const router = useRouter()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: evidenceCSS }} />

      <section id="evidence" className="evidence-section" aria-labelledby="evidence-heading">
        <div className="evidence-inner">
          <motion.p className="evidence-eyebrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Scientific Authority
          </motion.p>
          <motion.h2
            id="evidence-heading"
            className="evidence-headline"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Evidence Before Claims™
          </motion.h2>
          <motion.p
            className="evidence-sub"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Before we talk about benefits, we believe you deserve to understand the
            standards, testing and processes behind every product.
          </motion.p>

          {/* Trust grid */}
          <motion.div
            className="evidence-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {trustGrid.map((item, i) => (
              <motion.div
                key={item.title}
                className="evidence-grid-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
              >
                <div className="evidence-grid-icon">{item.icon}</div>
                <h3 className="evidence-grid-title">{item.title}</h3>
                <p className="evidence-grid-body">{item.body}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* QR / Scan block */}
          <motion.div
            className="evidence-qr-block"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="evidence-qr-placeholder" aria-label="QR code placeholder">
              {/* Simple QR pattern illustration */}
              <div className="evidence-qr-grid" aria-hidden>
                {Array.from({ length: 36 }, (_, i) => (
                  <div
                    key={i}
                    className={`evidence-qr-cell${[1,3,5,7,9,11,13,15,16,18,20,22,25,27,29,31,33,35].includes(i) ? ' light' : ''}`}
                  />
                ))}
              </div>
            </div>
            <div className="evidence-qr-text">
              <h3>Scan. Verify. Trust.</h3>
              <p>
                Every batch can be linked to its lab report, testing summary and product
                details. Real transparency, not marketing.
              </p>
              <div className="evidence-qr-links">
                {['Lab Report', 'Testing Summary', 'Product Details'].map((link) => (
                  <a key={link} href="/research-testing" className="evidence-qr-link">
                    <span className="evidence-qr-dot" aria-hidden />
                    {link}
                  </a>
                ))}
              </div>
              <p style={{ fontSize: 11, color: '#b7a392', fontStyle: 'italic', marginTop: 12, fontFamily: 'var(--font-primary)' }}>
                [NA — QR code(s) linking each batch to lab report]
              </p>
            </div>
          </motion.div>

          {/* Lab result "Passed" cards */}
          <div className="evidence-lab-row">
            {labResults.map((result, i) => (
              <motion.div
                key={result.label}
                className="evidence-lab-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, className: 'evidence-lab-card animated' } as never}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                onViewportEnter={(e) => {
                  (e?.target as HTMLElement)?.classList.add('animated')
                }}
              >
                <p className="evidence-lab-label">{result.label}</p>
                <span className="evidence-lab-status">
                  <span className="evidence-lab-check" aria-hidden>
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2 6 5 9 10 3" />
                    </svg>
                  </span>
                  {result.status}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Education strip */}
          <motion.div
            className="evidence-edu-strip"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <p className="evidence-edu-label">Why Testing Matters</p>
              <h3 className="evidence-edu-title">Not all Shilajit is created equal.</h3>
              <p className="evidence-edu-body">
                Source quality, purification methods and laboratory verification all influence product
                quality and consistency. This is why testing matters as much as sourcing. We publish
                both <strong>titration and gravimetry</strong> results — not just the single method
                that produces the highest number.
              </p>
            </div>
            <button
              className="btn-primary-spec"
              style={{ whiteSpace: 'nowrap', fontFamily: 'var(--font-primary)', fontSize: 13, letterSpacing: '0.10em', textTransform: 'uppercase' }}
              onClick={() => router.push('/research-testing')}
            >
              View Detailed Reports
            </button>
          </motion.div>

          {/* Principle line */}
          <motion.p
            className="evidence-principle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Ancient Wisdom Deserves Modern Verification.
          </motion.p>
        </div>
      </section>
    </>
  )
}
