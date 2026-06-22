'use client';
import { useEffect, useRef, useState } from 'react';

export default function ProductHeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0–1 as section scrolls into view

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProgress(Math.min(entry.intersectionRatio * 2, 1));
        }
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 20) }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const rotateL = `${-15 + progress * 15}deg`;
  const rotateR = `${15 - progress * 15}deg`;
  const translateY = `${20 - progress * 20}px`;
  const opacity = Math.min(progress * 2, 1);

  return (
    <>
      <style>{`
        .ph-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 600px;
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .ph-section { grid-template-columns: 1fr; }
        }

        /* Panel shared */
        .ph-panel {
          position: relative;
          padding: 72px 56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }

        /* Divider line between panels */
        .ph-panel:first-child::after {
          content: '';
          position: absolute;
          top: 10%;
          right: 0;
          width: 1px;
          height: 80%;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(201,168,76,0.3) 30%,
            rgba(201,168,76,0.3) 70%,
            transparent
          );
        }

        /* ── SHAHJEET PANEL ── */
        .ph-shahjeet {
          background: linear-gradient(135deg, #1A0F05 0%, #2D1A08 50%, #0E0C09 100%);
        }
        .ph-shahjeet::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 70% 30%, rgba(205,135,42,0.12) 0%, transparent 65%);
        }

        /* ── ROCKRESIN PANEL ── */
        .ph-rock {
          background: linear-gradient(135deg, #0E0C09 0%, #1C1208 50%, #2A1A0A 100%);
        }
        .ph-rock::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 60%, rgba(201,168,76,0.08) 0%, transparent 65%);
        }

        /* Product visual (placeholder — swap for real image via CloudImage) */
        .ph-product-visual {
          width: 160px;
          height: 200px;
          margin-bottom: 32px;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.1s ease-out, opacity 0.6s ease;
        }

        .ph-product-box {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 20px 60px rgba(0,0,0,0.6),
            0 4px 12px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }

        /* Shahjeet box — honey gold */
        .ph-shahjeet .ph-product-box {
          background: linear-gradient(145deg, #CD872A 0%, #E8A830 40%, #B06820 100%);
        }

        /* RockResin box — dark earth */
        .ph-rock .ph-product-box {
          background: linear-gradient(145deg, #2D1A08 0%, #442A1B 50%, #1A0F05 100%);
          border: 1px solid rgba(201,168,76,0.25);
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
          font-family: 'Cormorant Garamond', serif;
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          font-weight: 400;
          margin-bottom: 8px;
        }

        .ph-shahjeet .ph-prod-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: #F7F0E2;
          text-align: center;
          line-height: 1.1;
        }
        .ph-rock .ph-prod-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: #C9A84C;
          text-align: center;
          line-height: 1.1;
        }

        .ph-prod-dose {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 10px;
          color: rgba(255,255,255,0.5);
        }

        /* Honey drip effect on Shahjeet */
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

        /* Text content */
        .ph-content { position: relative; z-index: 1; }

        .ph-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 12px;
        }
        .ph-shahjeet .ph-eyebrow { color: #CD872A; }
        .ph-rock .ph-eyebrow { color: #C9A84C; }

        .ph-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 300;
          color: #E8E0D0;
          line-height: 1.1;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }
        .ph-headline span {
          font-style: italic;
        }
        .ph-shahjeet .ph-headline span { color: #CD872A; }
        .ph-rock .ph-headline span { color: #C9A84C; }

        .ph-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          font-style: italic;
          color: #8A7F6A;
          margin-bottom: 20px;
        }

        .ph-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: #8A7F6A;
          line-height: 1.7;
          max-width: 320px;
          margin-bottom: 28px;
        }

        /* Specs row */
        .ph-specs {
          display: flex;
          gap: 24px;
          margin-bottom: 28px;
        }
        .ph-spec {
          border-left: 2px solid rgba(201,168,76,0.25);
          padding-left: 12px;
        }
        .ph-shahjeet .ph-spec { border-left-color: rgba(205,135,42,0.3); }
        .ph-spec-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 300;
          color: #E8E0D0;
          line-height: 1;
        }
        .ph-shahjeet .ph-spec-num { color: #E8A830; }
        .ph-rock .ph-spec-num { color: #C9A84C; }
        .ph-spec-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #5A5245;
          margin-top: 2px;
        }

        /* Badges */
        .ph-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }
        .ph-badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-weight: 500;
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

        /* CTA Button */
        .ph-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          border: 1px solid;
          border-radius: 3px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
          background: none;
        }
        .ph-shahjeet .ph-cta {
          border-color: rgba(205,135,42,0.5);
          color: #E8A830;
        }
        .ph-shahjeet .ph-cta:hover {
          background: #CD872A;
          border-color: #CD872A;
          color: #0E0C09;
        }
        .ph-rock .ph-cta {
          border-color: rgba(201,168,76,0.5);
          color: #C9A84C;
        }
        .ph-rock .ph-cta:hover {
          background: #C9A84C;
          border-color: #C9A84C;
          color: #0E0C09;
        }

        .ph-cta-arrow {
          transition: transform 0.2s;
          font-size: 14px;
        }
        .ph-cta:hover .ph-cta-arrow { transform: translateX(4px); }

        @media (max-width: 768px) {
          .ph-panel { padding: 48px 28px; }
          .ph-panel:first-child::after { display: none; }
        }
      `}</style>

      <section ref={sectionRef} className="ph-section">

        {/* ── SHAHJEET STICKS ── */}
        <div className="ph-panel ph-shahjeet">
          <div
            className="ph-product-visual"
            style={{
              transform: `perspective(800px) rotateY(${rotateL}) translateY(${translateY})`,
              opacity,
            }}
          >
            {/*
              PRODUCTION: Replace this entire ph-product-box div with:
              <CloudImage
                src="products/shahjeet-hero.jpg"
                alt="3TATTAVA Shahjeet Sticks"
                className="ph-product-img"
              />
            */}
            <div className="ph-product-box">
              <div className="ph-honey-drip" />
              <div className="ph-product-label">
                <span className="ph-prod-brand">3tattava</span>
                <span className="ph-prod-name">Shahjeet<br />Sticks</span>
                <span className="ph-prod-dose">30 sticks · 8g each</span>
              </div>
            </div>
          </div>

          <div className="ph-content" style={{ opacity, transform: `translateY(${translateY})`, transition: 'opacity 0.6s, transform 0.4s' }}>
            <div className="ph-eyebrow">Honey Infused Shilajit</div>
            <h2 className="ph-headline">
              Tear. Squeeze.<br /><span>Perform.</span>
            </h2>
            <p className="ph-tagline">"Himotpannam. Ayurveda Refined. Honey Infused."</p>

            <div className="ph-specs">
              <div className="ph-spec">
                <div className="ph-spec-num">600mg</div>
                <div className="ph-spec-label">Per Stick</div>
              </div>
              <div className="ph-spec">
                <div className="ph-spec-num">30</div>
                <div className="ph-spec-label">Day Supply</div>
              </div>
              <div className="ph-spec">
                <div className="ph-spec-num">70%+</div>
                <div className="ph-spec-label">Fulvic Acid</div>
              </div>
            </div>

            <p className="ph-desc">
              No measuring. No mixing. No mess. One honey stick — every morning.
              The Shilajit you&apos;ll actually take every single day.
            </p>

            <div className="ph-badges">
              <span className="ph-badge ph-badge-gold">For Men &amp; Women</span>
              <span className="ph-badge ph-badge-green">NABL Lab Tested</span>
              <span className="ph-badge ph-badge-gold">AYUSH-GMP</span>
            </div>

            <a href="/products/shahjeet-sticks" className="ph-cta">
              Start the Ritual — ₹999
              <span className="ph-cta-arrow">→</span>
            </a>
          </div>
        </div>

        {/* ── ROCKRESIN ── */}
        <div className="ph-panel ph-rock">
          <div
            className="ph-product-visual"
            style={{
              transform: `perspective(800px) rotateY(${rotateR}) translateY(${translateY})`,
              opacity,
            }}
          >
            {/*
              PRODUCTION: Replace with:
              <CloudImage
                src="products/rockresin-hero.jpg"
                alt="3TATTAVA RockResin Shilajit Resin"
                className="ph-product-img"
              />
            */}
            <div className="ph-product-box">
              <div className="ph-product-label">
                <span className="ph-prod-brand">3tattava</span>
                <span className="ph-prod-name">Rock<br />Resin</span>
                <span className="ph-prod-dose">Shodhit Shilajit · 20g</span>
              </div>
            </div>
          </div>

          <div className="ph-content" style={{ opacity, transform: `translateY(${translateY})`, transition: 'opacity 0.6s 0.15s, transform 0.4s 0.1s' }}>
            <div className="ph-eyebrow">Pure Himalayan Shilajit Resin</div>
            <h2 className="ph-headline">
              Dip. Hook.<br /><span>Swirl.</span>
            </h2>
            <p className="ph-tagline">"Ancient Mineral Elixir for Modern Vitality"</p>

            <div className="ph-specs">
              <div className="ph-spec">
                <div className="ph-spec-num">1000mg</div>
                <div className="ph-spec-label">Per Serving</div>
              </div>
              <div className="ph-spec">
                <div className="ph-spec-num">20g</div>
                <div className="ph-spec-label">Per Jar</div>
              </div>
              <div className="ph-spec">
                <div className="ph-spec-num">80+</div>
                <div className="ph-spec-label">Trace Minerals</div>
              </div>
            </div>

            <p className="ph-desc">
              Purified using classical Ayurvedic processes including Triphala.
              300 years of the Himalayas, compressed into one substance.
              No stirring. Only the ritual.
            </p>

            <div className="ph-badges">
              <span className="ph-badge ph-badge-gold">NABL 3rd Party Tested</span>
              <span className="ph-badge ph-badge-green">Heavy Metal Free</span>
            </div>

            <a href="/products/rockresin" className="ph-cta">
              Experience the Resin — ₹1,299
              <span className="ph-cta-arrow">→</span>
            </a>
          </div>
        </div>

      </section>
    </>
  );
}
