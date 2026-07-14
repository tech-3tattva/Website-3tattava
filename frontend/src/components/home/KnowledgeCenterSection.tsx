'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const pillars = [
  {
    id: 'performance-ayurveda',
    title: 'Performance Ayurveda',
    description: 'Ancient intelligence for modern human performance',
    articles: [
      'What is Performance Ayurveda?',
      'Ayurveda Beyond Disease Management',
      'Balance Build Become Explained',
      'Ancient Wisdom for Modern Lifestyles',
    ],
    bgGradient: 'linear-gradient(135deg, #2a1608 0%, #442a1b 100%)',
    accent: '#cd872a',
  },
  {
    id: 'shilajit-science',
    title: 'Shilajit Science',
    description: 'The definitive guide — source, purity, and application',
    articles: [
      'What Is Shilajit?',
      'Different Sources Of Shilajit',
      'Shilajit Purity Test',
      'Shilajit For Women',
      'Triphala vs Water-Purified Shilajit',
      'Fulvic Acid Explained',
      'How Shilajit Is Formed',
    ],
    bgGradient: 'linear-gradient(135deg, #1a0d04 0%, #3a2215 100%)',
    accent: '#e4a04a',
    badge: 'SEO Goldmine',
  },
  {
    id: 'recovery',
    title: 'Recovery',
    description: 'The art and science of building back stronger',
    articles: [
      'Recovery vs Rest',
      'Why Modern People Feel Exhausted',
      'Recovery Habits',
      'Sleep & Performance',
    ],
    bgGradient: 'linear-gradient(135deg, #3d2010 0%, #5a3625 100%)',
    accent: '#cd872a',
  },
  {
    id: 'nutrition',
    title: 'Nutrition',
    description: 'Ayurvedic food wisdom meets modern performance',
    articles: [
      'Ayurvedic Nutrition',
      'Daily Food Habits',
      'Gut Health',
      'Energy Supporting Foods',
    ],
    bgGradient: 'linear-gradient(135deg, #4a2c0f 0%, #6b3f1a 100%)',
    accent: '#cd872a',
  },
  {
    id: 'athlete-mindset',
    title: 'Athlete Mindset',
    description: 'Discipline, resilience, and the performance character',
    articles: [
      'Discipline',
      'Resilience',
      'Consistency',
      'Mental Strength',
    ],
    bgGradient: 'linear-gradient(135deg, #1c1004 0%, #2e1c08 100%)',
    accent: '#cd872a',
    badge: 'Coming Soon',
  },
]

const featuredArticles = [
  {
    title: 'What Is Performance Ayurveda?',
    dek: 'Ayurveda was never slow healing. It was the original performance science.',
    readTime: '6 min read',
    tag: 'Start Here',
  },
  {
    title: 'Why We Use Triphala Purification',
    dek: 'Classical Shodhana isn\'t tradition for tradition\'s sake. Here\'s the science.',
    readTime: '4 min read',
    tag: 'Science',
  },
  {
    title: 'Shilajit: Beyond The Hype',
    dek: 'The fulvic acid debate, sourcing myths, and what actually matters for quality.',
    readTime: '8 min read',
    tag: 'Deep Dive',
  },
  {
    title: 'Balance · Build · Become Explained',
    dek: 'The three-stage philosophy behind 3Tattava — and how it applies to you.',
    readTime: '5 min read',
    tag: 'Philosophy',
  },
]

const kcCSS = `
  .kc-section {
    background: #ffffff;
    padding: 96px 0;
    overflow: hidden;
  }
  .kc-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .kc-header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 72px;
  }
  .kc-eyebrow {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 500;
    margin-bottom: 14px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .kc-headline {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(28px, 4vw, 50px);
    font-weight: 700;
    color: #442a1b;
    margin: 0 0 16px;
    line-height: 1.1;
  }
  .kc-sub {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: #6f5a48;
  }

  /* ── Netflix-style category cards ── */
  .kc-categories-wrap {
    overflow-x: auto;
    margin-bottom: 72px;
    -ms-overflow-style: none;
    scrollbar-width: none;
    padding-bottom: 8px;
  }
  .kc-categories-wrap::-webkit-scrollbar { display: none; }
  .kc-categories {
    display: flex;
    gap: 20px;
    min-width: max-content;
  }
  .kc-cat-card {
    width: 280px;
    aspect-ratio: 16/9;
    border-radius: 18px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    flex-shrink: 0;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .kc-cat-card:hover {
    transform: scale(1.03);
    box-shadow: 0 20px 48px rgba(68,42,27,0.25);
  }
  .kc-cat-card:hover .kc-cat-title { transform: translateY(-4px); }
  .kc-cat-bg {
    position: absolute;
    inset: 0;
    transition: transform 0.4s ease;
  }
  .kc-cat-card:hover .kc-cat-bg { transform: scale(1.04); }
  .kc-cat-scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0,0,0,0.80) 0%,
      rgba(0,0,0,0.35) 50%,
      rgba(0,0,0,0.10) 100%
    );
  }
  .kc-cat-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px 22px;
    z-index: 2;
  }
  .kc-cat-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 10px;
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 8px;
    font-family: var(--font-primary), system-ui, sans-serif;
    background: rgba(205,135,42,0.30);
    color: #cd872a;
    border: 1px solid rgba(205,135,42,0.40);
  }
  .kc-cat-title {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 20px;
    font-weight: 700;
    color: #f7f0e2;
    margin-bottom: 4px;
    transition: transform 0.3s ease;
    line-height: 1.2;
  }
  .kc-cat-desc {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 12px;
    color: rgba(247,240,226,0.65);
    line-height: 1.4;
  }

  /* Article count badge */
  .kc-cat-count {
    position: absolute;
    top: 14px;
    right: 14px;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: rgba(247,240,226,0.60);
    z-index: 2;
  }

  /* ── Featured articles ── */
  .kc-featured-label {
    font-size: 10px;
    letter-spacing: 0.20em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 700;
    margin-bottom: 24px;
    font-family: var(--font-primary), system-ui, sans-serif;
  }
  .kc-featured-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 72px;
  }
  .kc-article-card {
    border: 1px solid rgba(183,163,146,0.35);
    border-radius: 16px;
    overflow: hidden;
    background: #ffffff;
    cursor: pointer;
    transition: box-shadow 0.25s ease, transform 0.25s ease;
  }
  .kc-article-card:hover {
    box-shadow: 0 10px 28px rgba(68,42,27,0.12);
    transform: translateY(-3px);
  }
  .kc-article-img {
    height: 140px;
    background: #f0e8d8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #b7a392;
    font-family: var(--font-primary), system-ui, sans-serif;
    border-bottom: 1px solid rgba(183,163,146,0.25);
    position: relative;
    overflow: hidden;
  }
  .kc-article-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(68,42,27,0.12) 0%, rgba(205,135,42,0.06) 100%);
  }
  .kc-article-body {
    padding: 18px 18px 20px;
  }
  .kc-article-tag {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #cd872a;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .kc-article-title {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 16px;
    font-weight: 700;
    color: #442a1b;
    margin-bottom: 8px;
    line-height: 1.3;
  }
  .kc-article-dek {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    line-height: 1.6;
    color: #6f5a48;
    margin-bottom: 12px;
  }
  .kc-article-meta {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 11px;
    color: #b7a392;
    letter-spacing: 0.06em;
  }

  /* ── Newsletter capture ── */
  .kc-newsletter {
    background: #442a1b;
    border-radius: 24px;
    padding: 56px 64px;
    margin-bottom: 64px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 48px;
    align-items: center;
  }
  .kc-newsletter-headline {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(22px, 3vw, 32px);
    font-weight: 700;
    color: #f7f0e2;
    margin-bottom: 10px;
    line-height: 1.2;
  }
  .kc-newsletter-benefits {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 0;
  }
  .kc-newsletter-benefit {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    color: rgba(247,240,226,0.70);
  }
  .kc-newsletter-benefit-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #cd872a;
    flex-shrink: 0;
  }
  .kc-newsletter-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 280px;
  }
  .kc-newsletter-input {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 15px;
    background: rgba(247,240,226,0.10);
    border: 1.5px solid rgba(247,240,226,0.20);
    border-radius: 10px;
    padding: 14px 18px;
    color: #f7f0e2;
    outline: none;
    transition: border-color 0.2s ease;
    width: 100%;
  }
  .kc-newsletter-input::placeholder { color: rgba(247,240,226,0.35); }
  .kc-newsletter-input:focus { border-color: #cd872a; }
  .kc-newsletter-btn {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    background: #cd872a;
    color: #442a1b;
    border: none;
    border-radius: 10px;
    padding: 15px 24px;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .kc-newsletter-btn:hover { background: #b5722a; transform: translateY(-1px); }

  /* Brand statement */
  .kc-brand-statement {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: clamp(18px, 2.8vw, 28px);
    font-weight: 600;
    color: #442a1b;
    text-align: center;
    font-style: italic;
    margin-bottom: 48px;
  }

  /* Ready to begin bridge */
  .kc-bridge {
    background: #f7f0e2;
    border-radius: 20px;
    padding: 48px;
    text-align: center;
    border: 1px solid rgba(183,163,146,0.35);
  }
  .kc-bridge-headline {
    font-family: var(--font-display, 'Fraunces', Georgia, serif);
    font-size: 28px;
    font-weight: 700;
    color: #442a1b;
    margin-bottom: 8px;
  }
  .kc-bridge-sub {
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 14px;
    color: #6f5a48;
    margin-bottom: 24px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
  .kc-bridge-checks {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    justify-content: center;
    margin-bottom: 28px;
  }
  .kc-bridge-check {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-primary), system-ui, sans-serif;
    font-size: 13px;
    color: #442a1b;
    font-weight: 500;
  }

  /* Mobile */
  @media (max-width: 900px) {
    .kc-featured-grid { grid-template-columns: repeat(2, 1fr); }
    .kc-newsletter { grid-template-columns: 1fr; gap: 32px; padding: 40px 32px; }
  }
  @media (max-width: 640px) {
    .kc-section { padding: 64px 0; }
    .kc-inner { padding: 0 20px; }
    .kc-featured-grid { grid-template-columns: 1fr; }
    .kc-bridge { padding: 32px 20px; }
    .kc-newsletter { padding: 32px 20px; }
  }
`

export default function KnowledgeCenterSection() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: kcCSS }} />

      <section id="knowledge-center" className="kc-section" aria-labelledby="kc-heading">
        <div className="kc-inner">
          <div className="kc-header">
            <motion.p className="kc-eyebrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              The Knowledge Center
            </motion.p>
            <motion.h2
              id="kc-heading"
              className="kc-headline"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Learn Before You Buy
            </motion.h2>
            <motion.p
              className="kc-sub"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              The best decisions are informed decisions. Explore Ayurveda, performance, recovery,
              nutrition and modern wellness through evidence-backed educational resources.
            </motion.p>
          </div>

          {/* Netflix-style category cards */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="kc-categories-wrap" role="list" aria-label="Knowledge Center categories">
              <div className="kc-categories">
                {pillars.map((pillar, i) => (
                  <motion.div
                    key={pillar.id}
                    className="kc-cat-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    onClick={() => router.push(`/education/${pillar.id}`)}
                    role="listitem"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && router.push(`/education/${pillar.id}`)}
                    aria-label={pillar.title}
                  >
                    <div className="kc-cat-bg" style={{ background: pillar.bgGradient }} />
                    <div className="kc-cat-scrim" aria-hidden />
                    {pillar.badge && <span className="kc-cat-count">{pillar.badge}</span>}
                    <div className="kc-cat-content">
                      {pillar.articles.length > 0 && !pillar.badge && (
                        <span className="kc-cat-count" style={{ top: 14, right: 14 }}>{pillar.articles.length} articles</span>
                      )}
                      <h3 className="kc-cat-title">{pillar.title}</h3>
                      <p className="kc-cat-desc">{pillar.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Featured articles */}
          <p className="kc-featured-label">Start Here</p>
          <div className="kc-featured-grid">
            {featuredArticles.map((article, i) => (
              <motion.div
                key={article.title}
                className="kc-article-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                onClick={() => router.push('/education')}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && router.push('/education')}
              >
                <div className="kc-article-img" aria-hidden>
                  <div className="kc-article-img-overlay" />
                  [NA — article cover]
                </div>
                <div className="kc-article-body">
                  <p className="kc-article-tag">{article.tag}</p>
                  <h3 className="kc-article-title">{article.title}</h3>
                  <p className="kc-article-dek">{article.dek}</p>
                  <span className="kc-article-meta">{article.readTime}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Newsletter */}
          <motion.div
            className="kc-newsletter"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <div>
              <h3 className="kc-newsletter-headline">Join The Performance Ayurveda Circle</h3>
              <div className="kc-newsletter-benefits">
                {[
                  'Educational insights',
                  'Performance tips',
                  'New research',
                  'Podcast episodes',
                  'Community updates',
                ].map((b) => (
                  <span key={b} className="kc-newsletter-benefit">
                    <span className="kc-newsletter-benefit-dot" aria-hidden />
                    {b}
                  </span>
                ))}
              </div>
            </div>
            {subscribed ? (
              <div style={{ textAlign: 'center', minWidth: 280 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#f7f0e2', marginBottom: 8 }}>
                  You&apos;re in!
                </p>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: 14, color: 'rgba(247,240,226,0.60)' }}>
                  First issue lands in your inbox soon.
                </p>
              </div>
            ) : (
              <form
                className="kc-newsletter-form"
                onSubmit={(e) => { e.preventDefault(); setSubscribed(true) }}
              >
                <input
                  type="email"
                  className="kc-newsletter-input"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address for newsletter"
                />
                <button type="submit" className="kc-newsletter-btn">
                  Join The Circle
                </button>
              </form>
            )}
          </motion.div>

          {/* Brand statement */}
          <motion.p
            className="kc-brand-statement"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            The Goal Is Not To Sell More Products. The Goal Is To Create Better Decisions.
          </motion.p>

          {/* Ready To Begin bridge */}
          <motion.div
            className="kc-bridge"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="kc-bridge-headline">Ready To Begin?</h3>
            <p className="kc-bridge-sub">You now understand:</p>
            <div className="kc-bridge-checks">
              {['The Philosophy', 'The Science', 'The Community', 'The Rituals'].map((item) => (
                <span key={item} className="kc-bridge-check">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cd872a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </span>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-primary)', fontSize: 15, color: '#6f5a48', marginBottom: 24 }}>
              The next step is yours.
            </p>
            <button
              className="btn-primary-spec"
              style={{ fontFamily: 'var(--font-primary)', fontSize: 14, letterSpacing: '0.08em' }}
              onClick={() => document.getElementById('final-conversion')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Begin Your Journey
            </button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
