'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import PurchaseGate, { LockedTeaser } from '@/components/purchase/PurchaseGate'

const steps = [
  { num: '01', label: 'Take Assessment' },
  { num: '02', label: 'Choose Your Ritual' },
  { num: '03', label: 'Receive Starter Guidance' },
  { num: '04', label: 'Build Consistency' },
  { num: '05', label: 'Balance · Build · Become' },
]

const psCSS = `
  .ps-section {
    background: #ffffff;
    padding: 96px 0;
    overflow: hidden;
  }
  .ps-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .ps-header {
    max-width: 700px;
    margin: 0 auto 72px;
    text-align: center;
  }
  .ps-eyebrow {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 500;
    margin-bottom: 14px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .ps-headline {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(26px, 4vw, 46px);
    font-weight: 700;
    color: #442a1b;
    margin: 0 0 16px;
    line-height: 1.1;
  }
  .ps-sub {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: #6f5a48;
  }

  /* Three cards */
  .ps-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 40px;
  }
  .ps-card {
    background: #ffffff;
    border: 1px solid rgba(183,163,146,0.40);
    border-radius: 20px;
    padding: 32px 28px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 16px rgba(68,42,27,0.06);
    transition: box-shadow 0.25s ease, transform 0.25s ease;
  }
  .ps-card:hover {
    box-shadow: 0 14px 36px rgba(68,42,27,0.12);
    transform: translateY(-4px);
  }
  .ps-card-photo-wrap {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 20px;
    background: #f0e8d8;
    border: 2px solid rgba(205,135,42,0.20);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    letter-spacing: 0.08em;
    text-align: center;
    color: #b7a392;
    font-family: var(--font-primary);
  }
  .ps-card-role {
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 600;
    margin-bottom: 6px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .ps-card-name {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 20px;
    font-weight: 700;
    color: #442a1b;
    margin-bottom: 14px;
  }
  .ps-card-body {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.7;
    color: #6f5a48;
    flex: 1;
    margin-bottom: 22px;
  }
  .ps-card-cta {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    background: #442a1b;
    color: #f7f0e2;
    border: none;
    border-radius: 10px;
    padding: 13px 20px;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
    width: 100%;
    margin-bottom: 8px;
  }
  .ps-card-cta:hover { background: #5a3625; transform: translateY(-1px); }
  .ps-card-cta.secondary {
    background: transparent;
    color: #442a1b;
    border: 1.5px solid rgba(183,163,146,0.60);
  }
  .ps-card-cta.secondary:hover { border-color: #cd872a; background: #f7f0e2; }

  /* Paid consultation note */
  .ps-paid-note {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 0;
  }
  .ps-paid-checkbox {
    width: 16px;
    height: 16px;
    border: 1.5px solid rgba(183,163,146,0.60);
    border-radius: 4px;
    flex-shrink: 0;
    margin-top: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f7f0e2;
    cursor: pointer;
    transition: border-color 0.2s ease;
  }
  .ps-paid-label {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    color: #6f5a48;
    line-height: 1.5;
  }
  .ps-paid-label strong { color: #442a1b; }

  /* Community card */
  .ps-community-card {
    background: #f7f0e2;
    border: 1px solid rgba(183,163,146,0.35);
    border-radius: 20px;
    padding: 32px 40px;
    display: flex;
    align-items: center;
    gap: 40px;
    margin-bottom: 72px;
    transition: box-shadow 0.25s ease;
  }
  .ps-community-card:hover { box-shadow: 0 8px 24px rgba(68,42,27,0.10); }
  .ps-community-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: #442a1b;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #cd872a;
  }
  .ps-community-text h3 {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 22px;
    font-weight: 700;
    color: #442a1b;
    margin-bottom: 8px;
  }
  .ps-community-text p {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 14px;
    color: #6f5a48;
    line-height: 1.6;
  }
  .ps-community-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
  }
  .ps-community-tag {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    color: #442a1b;
    background: rgba(255,255,255,0.80);
    border: 1px solid rgba(183,163,146,0.35);
    border-radius: 12px;
    padding: 3px 10px;
  }

  /* What Happens After You Join */
  .ps-steps-section {
    margin-bottom: 72px;
  }
  .ps-steps-label {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 600;
    text-align: center;
    margin-bottom: 36px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .ps-steps {
    display: flex;
    align-items: flex-start;
    gap: 0;
    position: relative;
  }
  .ps-steps::before {
    content: '';
    position: absolute;
    top: 22px;
    left: 10%;
    right: 10%;
    height: 1px;
    background: rgba(183,163,146,0.35);
    z-index: 0;
  }
  .ps-step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 1;
  }
  .ps-step-num {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #442a1b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 16px;
    font-weight: 700;
    color: #cd872a;
    margin-bottom: 14px;
    flex-shrink: 0;
    border: 3px solid #f7f0e2;
    box-shadow: 0 0 0 1px rgba(183,163,146,0.35);
  }
  .ps-step-label {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #442a1b;
    line-height: 1.4;
  }

  /* Lead capture form */
  .ps-form-block {
    background: #f7f0e2;
    border: 1px solid rgba(183,163,146,0.35);
    border-radius: 20px;
    padding: 48px;
    margin-bottom: 48px;
  }
  .ps-form-headline {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 26px;
    font-weight: 700;
    color: #442a1b;
    margin-bottom: 8px;
  }
  .ps-form-sub {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 15px;
    color: #6f5a48;
    margin-bottom: 32px;
  }
  .ps-form-fields {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }
  .ps-form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .ps-form-label {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #442a1b;
    letter-spacing: 0.06em;
  }
  .ps-form-input {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 15px;
    color: #442a1b;
    background: #ffffff;
    border: 1.5px solid rgba(183,163,146,0.50);
    border-radius: 10px;
    padding: 13px 16px;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
  }
  .ps-form-input:focus {
    border-color: #cd872a;
    box-shadow: 0 0 0 3px rgba(205,135,42,0.12);
  }
  .ps-form-submit {
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
  .ps-form-submit:hover { background: #5a3625; transform: translateY(-1px); }

  /* Trust strip */
  .ps-trust {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
    padding-top: 32px;
    border-top: 1px solid rgba(183,163,146,0.30);
  }
  .ps-trust-label {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #6f5a48;
    font-weight: 700;
  }
  .ps-trust-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    color: #442a1b;
    font-weight: 500;
  }
  .ps-trust-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #cd872a;
    flex-shrink: 0;
  }

  /* Mobile */
  @media (max-width: 900px) {
    .ps-cards { grid-template-columns: 1fr; }
    .ps-community-card { flex-direction: column; gap: 20px; padding: 28px; }
    .ps-form-fields { grid-template-columns: 1fr; }
    .ps-steps { flex-direction: column; gap: 20px; }
    .ps-steps::before { display: none; }
    .ps-step { flex-direction: row; text-align: left; gap: 16px; }
  }
  @media (max-width: 640px) {
    .ps-section { padding: 64px 0; }
    .ps-inner { padding: 0 20px; }
    .ps-form-block { padding: 28px 20px; }
  }
`

export default function PerformanceSupportSection() {
  const router = useRouter()
  const [paidChecked, setPaidChecked] = useState(false)
  const [formState, setFormState] = useState({ name: '', email: '', whatsapp: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: psCSS }} />

      <section id="support-system" className="ps-section" aria-labelledby="ps-heading">
        <div className="ps-inner">
          <div className="ps-header">
            <motion.p className="ps-eyebrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              Your Support System
            </motion.p>
            <motion.h2
              id="ps-heading"
              className="ps-headline"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Because Products Don&apos;t Create Transformation Alone.
            </motion.h2>
            <motion.p
              className="ps-sub"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              Performance is built through the combination of daily rituals, nutrition, recovery,
              movement and consistency. That&apos;s why 3Tattava is more than a product. It&apos;s a
              support system.
            </motion.p>
          </div>

          {/* Three premium cards */}
          <div className="ps-cards">
            {/* Card 1: Dr. Kashish */}
            <motion.div
              className="ps-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, duration: 0.5 }}
            >
              <div className="ps-card-photo-wrap" aria-label="Dr. Kashish Gupta photo placeholder">
                [NA — Photo]
              </div>
              <p className="ps-card-role">Founder · Ayurveda Physician</p>
              <h3 className="ps-card-name">Dr. Kashish Gupta</h3>
              <p className="ps-card-body">
                3Tattava was built on the belief that Ayurveda should help people perform better,
                not just recover after problems arise. Learn the principles of Performance Ayurveda
                through articles, videos, podcasts and educational resources created by Dr. Kashish
                Gupta.
              </p>
              <button className="ps-card-cta" onClick={() => router.push('/education')}>
                Explore Performance Ayurveda
              </button>
            </motion.div>

            {/* Card 2: Dr. Falguni */}
            <motion.div
              className="ps-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="ps-card-photo-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/team/dr-falguni-chauhan.jpg" alt="Dr. Falguni Chauhan" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <p className="ps-card-role">BAMS · Ayurveda Diet & Lifestyle Specialist</p>
              <h3 className="ps-card-name">Dr. Falguni Chauhan</h3>
              <p className="ps-card-body">
                Every individual is different based on their Prakriti. Get access to a complimentary
                starter diet guide designed to help support your goals through better nutrition and
                daily habits. For those seeking deeper guidance, personalized programs are also
                available.
              </p>
              <PurchaseGate fallback={
                <div style={{ textAlign: 'center', padding: '6px 0' }}>
                  <p style={{ fontFamily: 'var(--font-primary)', fontSize: 12, lineHeight: 1.5, color: '#6f5a48', margin: '0 0 12px' }}>
                    🔒 Dr. Falguni&apos;s starter diet guide &amp; consultation unlock after your first ritual.
                  </p>
                  <a href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-primary)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: '#442a1b', background: 'linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)', padding: '12px 22px', textDecoration: 'none' }}>
                    Shop to Unlock →
                  </a>
                </div>
              }>
              <button className="ps-card-cta" onClick={() => router.push('/knowledge-center')}>
                Get Free Starter Diet Guide
              </button>
              <div className="ps-paid-note">
                <div
                  className="ps-paid-checkbox"
                  role="checkbox"
                  aria-checked={paidChecked}
                  tabIndex={0}
                  onClick={() => setPaidChecked(!paidChecked)}
                  onKeyDown={(e) => e.key === 'Enter' && setPaidChecked(!paidChecked)}
                  style={{ borderColor: paidChecked ? '#cd872a' : undefined }}
                >
                  {paidChecked && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#cd872a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2 6 5 9 10 3" />
                    </svg>
                  )}
                </div>
                <p className="ps-paid-label">
                  I understand that the personal consultation is a <strong>paid service</strong> and I
                  consent to proceed.
                </p>
              </div>
              <button
                className="ps-card-cta secondary"
                disabled={!paidChecked}
                style={{ opacity: paidChecked ? 1 : 0.45 }}
                onClick={() => paidChecked && router.push('/vaidyaconnect')}
              >
                Book Personal Consultation
              </button>
              </PurchaseGate>
            </motion.div>

            {/* Card 3: Assessment */}
            <motion.div
              className="ps-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div
                className="ps-card-photo-wrap"
                style={{ background: '#442a1b' }}
                aria-label="Assessment icon"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cd872a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <p className="ps-card-role">Personalized Guidance</p>
              <h3 className="ps-card-name">Performance Assessment</h3>
              <p className="ps-card-body">
                Answer a few questions about your Energy · Sleep · Recovery · Training · Stress ·
                Lifestyle and receive personalized recommendations to help begin your journey.
              </p>
              <button className="ps-card-cta" onClick={() => router.push('/assessment')}>
                Take The Assessment
              </button>
              <PurchaseGate fallback={
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: 10.5, letterSpacing: '0.06em', color: '#9a8468', marginTop: 10, textAlign: 'center' }}>
                  🔒 Unlocks after your first ritual
                </p>
              }>{null}</PurchaseGate>
            </motion.div>
          </div>

          {/* Community card */}
          <motion.div
            className="ps-community-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="ps-community-icon" aria-hidden>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="ps-community-text">
              <h3>Community</h3>
              <p>
                Join a growing network of athletes, fitness enthusiasts, professionals and lifelong
                learners exploring Performance Ayurveda together.
              </p>
              <div className="ps-community-tags">
                {['Events', 'Challenges', 'Podcasts', 'Webinars', 'Athlete Sessions'].map((t) => (
                  <span key={t} className="ps-community-tag">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* What Happens After You Join */}
          <div className="ps-steps-section">
            <p className="ps-steps-label">What Happens After You Join?</p>
            <div className="ps-steps" role="list">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  className="ps-step"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  role="listitem"
                >
                  <div className="ps-step-num" aria-hidden>{step.num}</div>
                  <p className="ps-step-label">{step.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Lead capture form */}
          <PurchaseGate fallback={
            <LockedTeaser
              eyebrow="Unlock After Your First Ritual"
              title="Begin Your Performance Journey"
              body="Your free Performance Assessment, Dr. Kashish's 24-hour guidance and your Starter Diet Guide unlock the moment you begin your first ritual."
              ctaLabel="Shop & Unlock"
            />
          }>
          <motion.div
            className="ps-form-block"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }} aria-hidden>✓</div>
                <h3 className="ps-form-headline" style={{ marginBottom: 8 }}>You&apos;re in!</h3>
                <p className="ps-form-sub">We&apos;ll send your assessment link and starter guide shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="ps-form-headline">Begin Your Journey</h3>
                <p className="ps-form-sub">
                  Get your free Performance Assessment + Starter Diet Guide
                </p>
                <div className="ps-form-fields">
                  <div className="ps-form-group">
                    <label htmlFor="ps-name" className="ps-form-label">Name</label>
                    <input
                      id="ps-name"
                      type="text"
                      className="ps-form-input"
                      placeholder="Your name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="ps-form-group">
                    <label htmlFor="ps-email" className="ps-form-label">Email</label>
                    <input
                      id="ps-email"
                      type="email"
                      className="ps-form-input"
                      placeholder="your@email.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="ps-form-group">
                    <label htmlFor="ps-whatsapp" className="ps-form-label">WhatsApp Number</label>
                    <input
                      id="ps-whatsapp"
                      type="tel"
                      className="ps-form-input"
                      placeholder="+91 XXXXX XXXXX"
                      value={formState.whatsapp}
                      onChange={(e) => setFormState({ ...formState, whatsapp: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="ps-form-submit">
                  Start My Assessment
                </button>
              </form>
            )}
          </motion.div>
          </PurchaseGate>

          {/* Trust strip */}
          <div className="ps-trust" role="list" aria-label="Support credentials">
            <span className="ps-trust-label">Supported By</span>
            {['Doctor Guidance', 'Athlete Mindset', 'Community Learning', 'Evidence-Based Ayurveda'].map((item) => (
              <span key={item} className="ps-trust-item" role="listitem">
                <span className="ps-trust-dot" aria-hidden />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
