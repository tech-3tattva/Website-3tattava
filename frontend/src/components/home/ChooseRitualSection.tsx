'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import PurchaseGate from '@/components/purchase/PurchaseGate'

const rockResinBenefits = [
  'Traditional Resin Form',
  'Triphala Purified',
  '70%+ Fulvic Acid',
  '80+ Trace Minerals',
  '3rd Party NABL Lab Tested',
  'AYUSH GMP Manufactured',
  'US-FDA Registered Facility',
]

const shahjeetBenefits = [
  '600mg Shilajit Per Stick',
  'Honey Infused',
  'No Measuring',
  'No Mixing',
  'Travel Friendly',
  'Performance Focused',
]

const comparisonRows = [
  { attr: 'Experience', rr: 'Traditional', sh: 'Convenient' },
  { attr: 'Format', rr: '100% Pure Resin', sh: 'Resin + Honey Sticks' },
  { attr: 'Ritual', rr: 'Deep', sh: 'Fast' },
  { attr: 'Best For', rr: 'Daily Ayurvedic Practice', sh: 'On-The-Go Performance' },
  { attr: 'Usage', rr: 'Dip · Hook · Swirl', sh: 'Tear · Squeeze · Perform' },
]

const ritualCSS = `
  .ritual-section {
    background: #ffffff;
    padding: 96px 0;
    overflow: hidden;
  }
  .ritual-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .ritual-header {
    text-align: center;
    margin-bottom: 72px;
  }
  .ritual-eyebrow {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 500;
    margin-bottom: 14px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .ritual-headline {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(30px, 4.5vw, 54px);
    font-weight: 700;
    color: #442a1b;
    margin: 0 0 18px;
    line-height: 1.05;
  }
  .ritual-sub {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 17px;
    line-height: 1.7;
    color: #6f5a48;
    max-width: 640px;
    margin: 0 auto;
  }

  /* Two product columns */
  .ritual-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border: 1px solid rgba(183,163,146,0.40);
    border-radius: 24px;
    overflow: hidden;
    margin-bottom: 56px;
    box-shadow: 0 8px 32px rgba(68,42,27,0.08);
  }

  /* RockResin — dark side */
  .ritual-col-rr {
    background: #442a1b;
    padding: 52px 44px;
    position: relative;
    overflow: hidden;
    transition: background 0.3s ease;
  }
  .ritual-col-rr:hover { background: #3a2215; }

  /* Shahjeet — cream/light side */
  .ritual-col-sh {
    background: #f7f0e2;
    padding: 52px 44px;
    position: relative;
    overflow: hidden;
    border-left: 1px solid rgba(183,163,146,0.40);
    transition: background 0.3s ease;
  }
  .ritual-col-sh:hover { background: #ede4d0; }

  /* Background SVG deco */
  .ritual-col-deco {
    position: absolute;
    bottom: -20px;
    right: -20px;
    width: 180px;
    height: 180px;
    opacity: 0.06;
    pointer-events: none;
  }

  /* Product image placeholder */
  .ritual-product-img {
    width: 100%;
    aspect-ratio: 4/3;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .ritual-col-rr .ritual-product-img {
    background: rgba(247,240,226,0.08);
    border: 1px solid rgba(247,240,226,0.12);
  }
  .ritual-col-sh .ritual-product-img {
    background: rgba(68,42,27,0.08);
    border: 1px solid rgba(183,163,146,0.35);
  }
  .ritual-product-placeholder {
    font-size: 11px;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    text-align: center;
    padding: 16px;
  }
  .ritual-col-rr .ritual-product-placeholder { color: rgba(247,240,226,0.35); }
  .ritual-col-sh .ritual-product-placeholder { color: #b7a392; }

  /* Product identity */
  .ritual-product-tag {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .ritual-col-rr .ritual-product-tag { color: #cd872a; }
  .ritual-col-sh .ritual-product-tag { color: #cd872a; }

  .ritual-product-name {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 32px;
    font-weight: 700;
    line-height: 1.0;
    margin-bottom: 6px;
  }
  .ritual-col-rr .ritual-product-name { color: #f7f0e2; }
  .ritual-col-sh .ritual-product-name { color: #442a1b; }

  .ritual-product-tagline {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    margin-bottom: 24px;
  }
  .ritual-col-rr .ritual-product-tagline { color: rgba(247,240,226,0.60); }
  .ritual-col-sh .ritual-product-tagline { color: #6f5a48; }

  /* Benefits list */
  .ritual-benefits {
    list-style: none;
    padding: 0;
    margin: 0 0 24px;
  }
  .ritual-benefits li {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    padding: 6px 0;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid;
  }
  .ritual-col-rr .ritual-benefits li {
    color: rgba(247,240,226,0.80);
    border-color: rgba(247,240,226,0.08);
  }
  .ritual-col-sh .ritual-benefits li {
    color: #442a1b;
    border-color: rgba(183,163,146,0.30);
  }
  .ritual-check {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: #cd872a;
  }

  /* Ritual verb sequence */
  .ritual-verbs {
    margin: 24px 0;
  }
  .ritual-verbs-label {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .ritual-col-rr .ritual-verbs-label { color: rgba(247,240,226,0.40); }
  .ritual-col-sh .ritual-verbs-label { color: #b7a392; }

  .ritual-verbs-seq {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .ritual-verb {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }
  .ritual-col-rr .ritual-verb { color: #f7f0e2; }
  .ritual-col-sh .ritual-verb { color: #442a1b; }

  .ritual-verb-sep {
    font-size: 14px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .ritual-col-rr .ritual-verb-sep { color: rgba(205,135,42,0.50); }
  .ritual-col-sh .ritual-verb-sep { color: rgba(183,163,146,0.60); }

  /* Ideal for */
  .ritual-ideal {
    margin: 20px 0 28px;
  }
  .ritual-ideal-label {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .ritual-col-rr .ritual-ideal-label { color: rgba(247,240,226,0.40); }
  .ritual-col-sh .ritual-ideal-label { color: #b7a392; }
  .ritual-ideal-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .ritual-ideal-tag {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 12px;
    border: 1px solid;
  }
  .ritual-col-rr .ritual-ideal-tag {
    color: rgba(247,240,226,0.70);
    border-color: rgba(247,240,226,0.15);
    background: rgba(247,240,226,0.06);
  }
  .ritual-col-sh .ritual-ideal-tag {
    color: #442a1b;
    border-color: rgba(183,163,146,0.40);
    background: rgba(255,255,255,0.60);
  }

  /* CTA buttons */
  .ritual-col-btn {
    width: 100%;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border-radius: 12px;
    padding: 16px 24px;
    cursor: pointer;
    border: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .ritual-col-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(68,42,27,0.20); }
  .ritual-col-rr .ritual-col-btn { background: #f7f0e2; color: #442a1b; }
  .ritual-col-rr .ritual-col-btn:hover { background: #ffffff; }
  .ritual-col-sh .ritual-col-btn { background: #442a1b; color: #f7f0e2; }
  .ritual-col-sh .ritual-col-btn:hover { background: #5a3625; }

  /* Comparison table */
  .ritual-comparison {
    border: 1px solid rgba(183,163,146,0.35);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 56px;
  }
  .ritual-cmp-header {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    background: #442a1b;
    padding: 16px 28px;
  }
  .ritual-cmp-h {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(247,240,226,0.55);
    font-weight: 600;
  }
  .ritual-cmp-h.accent { color: #cd872a; }
  .ritual-cmp-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    padding: 14px 28px;
    border-bottom: 1px solid rgba(183,163,146,0.25);
    transition: background 0.2s ease;
  }
  .ritual-cmp-row:last-child { border-bottom: none; }
  .ritual-cmp-row:hover { background: rgba(247,240,226,0.40); }
  .ritual-cmp-attr {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #442a1b;
  }
  .ritual-cmp-val {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    color: #6f5a48;
  }

  /* Midline */
  .ritual-midline {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(18px, 2.8vw, 30px);
    font-weight: 600;
    color: #442a1b;
    text-align: center;
    margin-bottom: 56px;
    font-style: italic;
  }

  /* Assessment block */
  .ritual-assessment {
    background: #f7f0e2;
    border: 1px solid rgba(183,163,146,0.35);
    border-radius: 20px;
    padding: 48px;
    text-align: center;
  }
  .ritual-assessment-headline {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 24px;
    font-weight: 700;
    color: #442a1b;
    margin-bottom: 12px;
  }
  .ritual-assessment-body {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 15px;
    color: #6f5a48;
    margin-bottom: 28px;
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
  }
  .ritual-assessment-cta {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  /* Mobile */
  @media (max-width: 900px) {
    .ritual-columns { grid-template-columns: 1fr; }
    .ritual-col-sh { border-left: none; border-top: 1px solid rgba(183,163,146,0.40); }
    .ritual-cmp-header, .ritual-cmp-row { grid-template-columns: 1.5fr 1fr 1fr; padding: 12px 16px; }
  }
  @media (max-width: 640px) {
    .ritual-section { padding: 64px 0; }
    .ritual-inner { padding: 0 20px; }
    .ritual-col-rr, .ritual-col-sh { padding: 36px 24px; }
    .ritual-assessment { padding: 32px 24px; }
    .ritual-cmp-header, .ritual-cmp-row { grid-template-columns: 1fr 1fr; }
    .ritual-cmp-attr { display: none; }
  }
`

export default function ChooseRitualSection() {
  const router = useRouter()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ritualCSS }} />

      <section id="choose-ritual" className="ritual-section" aria-labelledby="ritual-heading">
        <div className="ritual-inner">
          {/* Header */}
          <div className="ritual-header">
            <motion.p className="ritual-eyebrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              Two Formats. One Philosophy.
            </motion.p>
            <motion.h2
              id="ritual-heading"
              className="ritual-headline"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Choose Your Ritual
            </motion.h2>
            <motion.p
              className="ritual-sub"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              Ancient Rituals. Modern Performance. Not every journey looks the same. Some people
              want the traditional depth of Ayurveda. Others need performance support that fits
              into a busy day. Choose the ritual that fits your lifestyle.
            </motion.p>
          </div>

          {/* Product columns */}
          <motion.div
            className="ritual-columns"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            {/* RockResin */}
            <div className="ritual-col-rr">
              {/* Decorative element */}
              <svg className="ritual-col-deco" viewBox="0 0 200 200" fill="none" aria-hidden>
                <circle cx="100" cy="100" r="90" stroke="#f7f0e2" strokeWidth="1" />
                <circle cx="100" cy="100" r="65" stroke="#f7f0e2" strokeWidth="0.7" />
                <circle cx="100" cy="100" r="40" stroke="#f7f0e2" strokeWidth="0.5" />
              </svg>

              <div className="ritual-product-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://media.3tattava.com/products/Rockresin-hero.jpeg"
                  alt="ROCKRESIN® — Shodhit Shilajit Resin in jar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement
                    el.style.display = 'none'
                    const sib = el.nextElementSibling as HTMLElement | null
                    if (sib) sib.style.display = 'flex'
                  }}
                />
                <p className="ritual-product-placeholder" style={{ display: 'none' }}>RockResin · Resin in jar · dark · traditional</p>
              </div>

              <p className="ritual-product-tag">The Deep Ritual</p>
              <h3 className="ritual-product-name">ROCKRESIN®</h3>
              <p className="ritual-product-tagline">One Resin. Complete Vitality.</p>

              <ul className="ritual-benefits" aria-label="RockResin benefits">
                {rockResinBenefits.map((b) => (
                  <li key={b}>
                    <span className="ritual-check" aria-hidden>
                      <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2 6 5 9 10 3" />
                      </svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* Ritual verbs */}
              <div className="ritual-verbs">
                <p className="ritual-verbs-label">The Ritual Experience</p>
                <div className="ritual-verbs-seq" aria-label="Dip. Hook. Swirl.">
                  {['Dip', 'Hook', 'Swirl'].map((v, i) => (
                    <span key={v}>
                      <motion.span
                        className="ritual-verb"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        {v}.
                      </motion.span>
                      {i < 2 && <span className="ritual-verb-sep" aria-hidden> </span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="ritual-ideal">
                <p className="ritual-ideal-label">Ideal For</p>
                <div className="ritual-ideal-tags">
                  {['16+ Years', 'Men & Women', 'Professionals', 'High Performers', 'Long-term Seekers'].map((t) => (
                    <span key={t} className="ritual-ideal-tag">{t}</span>
                  ))}
                </div>
              </div>

              <button className="ritual-col-btn" onClick={() => router.push('/products/shodhit-shilajit-resin')}>
                Begin The Deep Ritual
              </button>
            </div>

            {/* Shahjeet */}
            <div className="ritual-col-sh">
              <svg className="ritual-col-deco" viewBox="0 0 200 200" fill="none" aria-hidden>
                <rect x="20" y="20" width="160" height="160" rx="16" stroke="#442a1b" strokeWidth="1" />
                <rect x="50" y="50" width="100" height="100" rx="10" stroke="#442a1b" strokeWidth="0.7" />
                <rect x="80" y="80" width="40" height="40" rx="5" stroke="#442a1b" strokeWidth="0.5" />
              </svg>

              <div className="ritual-product-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://media.3tattava.com/products/shahjeet-box.png"
                  alt="SHAHJEET® — Performance Honey Shilajit Sticks box"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: '12px', background: 'transparent' }}
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement
                    el.style.display = 'none'
                    const sib = el.nextElementSibling as HTMLElement | null
                    if (sib) sib.style.display = 'flex'
                  }}
                />
                <p className="ritual-product-placeholder" style={{ display: 'none' }}>Shahjeet · Honey stick · lifestyle · active</p>
              </div>

              <p className="ritual-product-tag">The Fast Ritual</p>
              <h3 className="ritual-product-name">SHAHJEET®</h3>
              <p className="ritual-product-tagline">Performance In Your Pocket.</p>

              <ul className="ritual-benefits" aria-label="Shahjeet benefits">
                {shahjeetBenefits.map((b) => (
                  <li key={b}>
                    <span className="ritual-check" aria-hidden>
                      <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2 6 5 9 10 3" />
                      </svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="ritual-verbs">
                <p className="ritual-verbs-label">The Ritual Experience</p>
                <div className="ritual-verbs-seq" aria-label="Tear. Squeeze. Perform.">
                  {['Tear', 'Squeeze', 'Perform'].map((v, i) => (
                    <span key={v}>
                      <motion.span
                        className="ritual-verb"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.35 + i * 0.1 }}
                      >
                        {v}.
                      </motion.span>
                      {i < 2 && <span className="ritual-verb-sep" aria-hidden> </span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="ritual-ideal">
                <p className="ritual-ideal-label">Ideal For</p>
                <div className="ritual-ideal-tags">
                  {['Athletes', 'Gym-goers', 'Entrepreneurs', 'Travelers', 'Corporate', 'Active Lifestyle'].map((t) => (
                    <span key={t} className="ritual-ideal-tag">{t}</span>
                  ))}
                </div>
              </div>

              <button className="ritual-col-btn" onClick={() => router.push('/products/shahjeet-sticks')}>
                Choose The Fast Ritual
              </button>
            </div>
          </motion.div>

          {/* Comparison table */}
          <motion.div
            className="ritual-comparison"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="ritual-cmp-header">
              <span className="ritual-cmp-h">Feature</span>
              <span className="ritual-cmp-h accent">RockResin</span>
              <span className="ritual-cmp-h accent">Shahjeet Sticks</span>
            </div>
            {comparisonRows.map((row) => (
              <motion.div
                key={row.attr}
                className="ritual-cmp-row"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <span className="ritual-cmp-attr">{row.attr}</span>
                <span className="ritual-cmp-val">{row.rr}</span>
                <span className="ritual-cmp-val">{row.sh}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Midline */}
          <motion.p
            className="ritual-midline"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Different Rituals. Same Philosophy. Balance. Build. Become.
          </motion.p>

          {/* Assessment block */}
          <motion.div
            className="ritual-assessment"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="ritual-assessment-headline">Not Sure Which Ritual Is Right For You?</h3>
            <p className="ritual-assessment-body">
              Take the Performance Assessment. Get personalized guidance from our
              Performance Ayurveda Team.
            </p>
            <div className="ritual-assessment-cta">
              <button
                className="btn-primary-spec"
                style={{ fontFamily: 'var(--font-primary)', fontSize: 13, letterSpacing: '0.10em', textTransform: 'uppercase' }}
                onClick={() => router.push('/assessment')}
              >
                Take Assessment
              </button>
              <PurchaseGate fallback={
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: 10.5, letterSpacing: '0.06em', color: '#cd872a', marginTop: 12, textAlign: 'center', fontWeight: 600 }}>
                  🔒 Unlocks after your first ritual
                </p>
              }>{null}</PurchaseGate>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
