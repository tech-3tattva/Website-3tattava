'use client';
import { useRef, useState } from 'react';

type MousePos = { x: number; y: number };

function ProductPanel({
  variant,
  product,
}: {
  variant: 'shahjeet' | 'rock';
  product: {
    eyebrow: string;
    headline: string[];
    tagline: string;
    specs: { num: string; label: string }[];
    desc: string;
    badges: { label: string; type: 'gold' | 'green' }[];
    ctaLabel: string;
    ctaHref: string;
    detailPanel: string;
  };
}) {
  const [mouse, setMouse] = useState<MousePos>({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left - rect.width / 2),
      y: (e.clientY - rect.top - rect.height / 2),
    });
  };

  const isShah = variant === 'shahjeet';

  return (
    <div
      className={`ph-panel ph-${variant}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMouse({ x: 0, y: 0 }); }}
      onMouseMove={handleMouseMove}
      style={{
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 24px 64px rgba(28,19,4,0.18)' : 'none',
        transition: 'transform 400ms cubic-bezier(0.16,1,0.3,1), box-shadow 400ms ease',
      }}
    >
      {/* Product visual with 3D hover */}
      <div
        ref={imgRef}
        className="ph-product-visual"
        style={{
          transform: hovered
            ? `perspective(1000px) rotateY(${mouse.x * 0.015}deg) rotateX(${-mouse.y * 0.015}deg) scale(1.05)`
            : 'perspective(1000px) rotateY(0deg) scale(1)',
          transition: hovered ? 'transform 80ms linear' : 'transform 500ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div className="ph-product-box">
          {isShah && <div className="ph-honey-drip" />}
          <div className="ph-product-label">
            <span className="ph-prod-brand">3TATTAVA</span>
            <span className={`ph-prod-name ph-${variant}-name`}>
              {isShah ? <>Shahjeet<br />Sticks</> : <>Rock<br />Resin</>}
            </span>
            <span className="ph-prod-dose">
              {isShah ? '30 sticks · 8g each' : 'Shodhit Shilajit · 20g'}
            </span>
          </div>
        </div>

        {/* Hover detail panel */}
        <div className={`ph-detail-panel${hovered ? ' visible' : ''}`}>
          {product.detailPanel}
        </div>
      </div>

      <div className="ph-content">
        <div className="ph-eyebrow">{product.eyebrow}</div>
        <h2 className="ph-headline">
          {product.headline[0]}<br />
          <span>{product.headline[1]}</span>
        </h2>
        <p className="ph-tagline">&ldquo;{product.tagline}&rdquo;</p>

        <div className="ph-specs">
          {product.specs.map((s) => (
            <div className="ph-spec" key={s.label}>
              <div className="ph-spec-num">{s.num}</div>
              <div className="ph-spec-label">{s.label}</div>
            </div>
          ))}
        </div>

        <p className="ph-desc">{product.desc}</p>

        <div className="ph-badges">
          {product.badges.map((b) => (
            <span key={b.label} className={`ph-badge ph-badge-${b.type}`}>{b.label}</span>
          ))}
        </div>

        <a href={product.ctaHref} className="ph-cta">
          {product.ctaLabel}
          <span className="ph-cta-arrow">→</span>
        </a>
      </div>
    </div>
  );
}

const shahjeetData = {
  eyebrow: 'Honey Infused Shilajit',
  headline: ['Tear. Squeeze.', 'Perform.'],
  tagline: 'Himotpannam. Ayurveda Refined. Honey Infused.',
  specs: [
    { num: '600mg', label: 'Shilajit per Stick' },
    { num: '30', label: 'Single-Serve Sticks' },
    { num: '7.4g', label: 'Honey per Stick' },
  ],
  desc: 'No measuring. No mixing. No mess. One honey stick — every morning. The Shilajit you\'ll actually take every single day.',
  badges: [
    { label: 'For Men & Women', type: 'gold' as const },
    { label: 'NABL Lab Tested', type: 'green' as const },
    { label: 'AYUSH-GMP', type: 'gold' as const },
  ],
  ctaLabel: 'START THE RITUAL — ₹999',
  ctaHref: '/products/shahjeet-sticks',
  detailPanel: '600mg per Stick | Honey Anupana | 8g per Stick',
};

const rockData = {
  eyebrow: 'Pure Himalayan Shilajit Resin',
  headline: ['Dip. Hook.', 'Swirl.'],
  tagline: 'Ancient Mineral Elixir for Modern Vitality',
  specs: [
    { num: '1000mg', label: 'Exd. per Gram' },
    { num: '20g', label: 'Per Jar' },
    { num: '≥70%', label: 'Fulvic Acid' },
  ],
  desc: 'Purified using classical Triphala Shodhan. 300 years of Himalayan compression in every jar. No stirring. Only the ritual.',
  badges: [
    { label: 'NABL 3rd Party Tested', type: 'gold' as const },
    { label: 'Heavy Metal Free', type: 'green' as const },
    { label: '80+ Ionic Minerals', type: 'gold' as const },
  ],
  ctaLabel: 'EXPERIENCE THE RESIN — ₹1,299',
  ctaHref: '/products/shodhit-shilajit-resin',
  detailPanel: '≥70% Fulvic Acid | NABL Batch #RK2024-08 | 300–500mg Daily',
};

export default function ProductHeroSection() {
  return (
    <>
      <style suppressHydrationWarning>{`
        .ph-section {
          display: grid;
          grid-template-columns: 45fr 55fr;
          min-height: 600px;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .ph-section { grid-template-columns: 1fr; }
        }
        .ph-panel {
          position: relative;
          padding: 72px 56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          cursor: default;
        }
        .ph-panel:first-child::after {
          content: '';
          position: absolute;
          top: 10%; right: 0;
          width: 1px; height: 80%;
          background: linear-gradient(180deg, transparent, rgba(201,168,76,0.3) 30%, rgba(201,168,76,0.3) 70%, transparent);
        }
        .ph-shahjeet {
          background: linear-gradient(135deg, #1A0F05 0%, #2D1A08 50%, #0E0C09 100%);
        }
        .ph-shahjeet::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 70% 30%, rgba(205,135,42,0.12) 0%, transparent 65%);
        }
        .ph-rock {
          background: linear-gradient(135deg, #0E0C09 0%, #1C1208 50%, #2A1A0A 100%);
        }
        .ph-rock::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 60%, rgba(201,168,76,0.08) 0%, transparent 65%);
        }
        .ph-product-visual {
          width: 160px;
          height: 200px;
          margin-bottom: 32px;
          position: relative;
          transform-style: preserve-3d;
        }
        .ph-product-box {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .ph-shahjeet .ph-product-box {
          background: linear-gradient(145deg, #CD872A 0%, #E8A830 40%, #B06820 100%);
        }
        .ph-rock .ph-product-box {
          background: linear-gradient(145deg, #2D1A08 0%, #442A1B 50%, #1A0F05 100%);
          border: 1px solid rgba(201,168,76,0.25);
        }

        /* Hover detail panel */
        .ph-detail-panel {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 76px;
          background: rgba(28,19,4,0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 75, 'wght' 500;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #C8963E;
          opacity: 0;
          transform: translateY(100%);
          transition: opacity 350ms ease, transform 350ms ease;
        }
        .ph-detail-panel.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .ph-product-label {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .ph-prod-brand {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 75, 'wght' 400;
          font-size: 9px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          margin-bottom: 8px;
        }
        .ph-shahjeet-name, .ph-rock-name {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 90, 'wght' 600;
          font-size: 22px;
          text-align: center;
          line-height: 1.1;
        }
        .ph-shahjeet-name { color: #F7F0E2; }
        .ph-rock-name { color: #C9A84C; }
        .ph-prod-dose {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 75, 'wght' 400;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 10px;
          color: rgba(255,255,255,0.5);
        }
        .ph-honey-drip {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 3px; height: 0;
          background: linear-gradient(180deg, rgba(232,168,48,0.8), transparent);
          border-radius: 0 0 3px 3px;
          animation: drip 3s ease-in-out infinite;
        }
        @keyframes drip {
          0%   { height: 0; opacity: 0; }
          30%  { height: 40px; opacity: 0.8; }
          60%  { height: 60px; opacity: 0.5; }
          100% { height: 0; opacity: 0; }
        }
        .ph-content { position: relative; z-index: 1; }
        .ph-eyebrow {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 75, 'wght' 500;
          font-size: 9px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .ph-shahjeet .ph-eyebrow { color: #CD872A; }
        .ph-rock .ph-eyebrow { color: #C9A84C; }
        .ph-headline {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 90, 'wght' 300;
          font-size: clamp(32px, 4vw, 48px);
          color: #E8E0D0;
          line-height: 1.1;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }
        .ph-headline span { font-style: italic; }
        .ph-shahjeet .ph-headline span { color: #CD872A; }
        .ph-rock .ph-headline span { color: #C9A84C; }
        .ph-tagline {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 90, 'wght' 300;
          font-size: 14px;
          font-style: italic;
          color: #8A7F6A;
          margin-bottom: 20px;
        }
        .ph-desc {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 90, 'wght' 300;
          font-size: 13px;
          color: #8A7F6A;
          line-height: 1.7;
          max-width: 320px;
          margin-bottom: 28px;
        }
        .ph-specs { display: flex; gap: 24px; margin-bottom: 28px; }
        .ph-spec {
          border-left: 2px solid rgba(201,168,76,0.25);
          padding-left: 12px;
        }
        .ph-shahjeet .ph-spec { border-left-color: rgba(205,135,42,0.3); }
        .ph-spec-num {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 90, 'wght' 300;
          font-size: 22px;
          color: #E8E0D0;
          line-height: 1;
        }
        .ph-shahjeet .ph-spec-num { color: #E8A830; }
        .ph-rock .ph-spec-num { color: #C9A84C; }
        .ph-spec-label {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 75, 'wght' 400;
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #5A5245;
          margin-top: 2px;
        }
        .ph-badges { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }
        .ph-badge {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 75, 'wght' 500;
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 2px;
        }
        .ph-badge-gold {
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          color: #C9A84C;
        }
        .ph-badge-green {
          background: rgba(74,124,89,0.1);
          border: 1px solid rgba(74,124,89,0.25);
          color: #7AAA8A;
        }
        .ph-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          border: 1px solid;
          border-radius: 0;
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 85, 'wght' 600;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
          background: none;
        }
        .ph-shahjeet .ph-cta { border-color: rgba(205,135,42,0.5); color: #E8A830; }
        .ph-shahjeet .ph-cta:hover { background: #CD872A; border-color: #CD872A; color: #0E0C09; }
        .ph-rock .ph-cta { border-color: rgba(201,168,76,0.5); color: #C9A84C; }
        .ph-rock .ph-cta:hover { background: #C9A84C; border-color: #C9A84C; color: #0E0C09; }
        .ph-cta-arrow { transition: transform 0.2s; font-size: 14px; }
        .ph-cta:hover .ph-cta-arrow { transform: translateX(4px); }
        @media (max-width: 768px) {
          .ph-panel { padding: 48px 28px; }
          .ph-panel:first-child::after { display: none; }
        }
      `}</style>

      <section className="ph-section">
        <ProductPanel variant="shahjeet" product={shahjeetData} />
        <ProductPanel variant="rock" product={rockData} />
      </section>
    </>
  );
}
