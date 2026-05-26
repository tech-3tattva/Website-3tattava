'use client';
import { useState, useEffect } from 'react';

// Replace with your actual 3Tattava Announcement Channel invite link
// Get it from: WhatsApp → 3Tattava community → Announcement → Invite via link
const COMMUNITY_LINK = 'https://chat.whatsapp.com/FI9HnCNNPF3Fp20mU9avG1';
const TOOLTIP_DELAY_MS = 5000;
const TOOLTIP_HIDE_MS  = 12000;

export default function WhatsAppWidget() {
  const [showTooltip, setShowTooltip]   = useState(false);
  const [clicked, setClicked]           = useState(false);
  const [mounted, setMounted]           = useState(false);

  useEffect(() => {
    setMounted(true);
    const showTimer = setTimeout(() => setShowTooltip(true), TOOLTIP_DELAY_MS);
    const hideTimer = setTimeout(() => setShowTooltip(false), TOOLTIP_HIDE_MS);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, []);

  const handleClick = () => {
    setClicked(true);
    setShowTooltip(false);
    window.open(COMMUNITY_LINK, '_blank', 'noopener,noreferrer');
  };

  if (!mounted) return null;

  return (
    <>
      <style suppressHydrationWarning>{`
        .wa-wrap {
          position: fixed;
          bottom: 96px;
          right: 28px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }

        .wa-tooltip {
          background: #1A1710;
          border: 1px solid rgba(201,168,76,0.35);
          border-radius: 10px 10px 2px 10px;
          padding: 12px 16px;
          width: 220px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
          animation: wa-tooltip-in 0.3s ease forwards;
        }

        @keyframes wa-tooltip-in {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .wa-tooltip-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #C9A84C;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .wa-tooltip-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
          font-weight: 400;
          color: #E8E0D0;
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .wa-tooltip-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #8A7F6A;
          font-weight: 300;
        }

        .wa-tooltip-close {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          color: #8A7F6A;
          cursor: pointer;
          font-size: 14px;
          padding: 2px;
          line-height: 1;
        }

        .wa-btn {
          position: relative;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #25D366;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(37,211,102,0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .wa-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 28px rgba(37,211,102,0.5);
        }

        .wa-btn:active { transform: scale(0.93); }

        .wa-btn::before {
          content: '';
          position: absolute;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: 1.5px solid rgba(201,168,76,0.6);
          animation: wa-gold-ring 2.5s ease-out infinite;
        }

        .wa-btn.clicked::before { display: none; }

        @keyframes wa-gold-ring {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(1.9); opacity: 0;   }
        }

        .wa-btn::after {
          content: '';
          position: absolute;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: 1px solid rgba(37,211,102,0.4);
          animation: wa-gold-ring 2.5s ease-out infinite 1.2s;
        }

        .wa-btn.clicked::after { display: none; }

        .wa-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #C9A84C;
          border: 2px solid #0E0C09;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 500;
          color: #0E0C09;
        }

        @media (max-width: 480px) {
          .wa-wrap { bottom: 88px; right: 20px; }
          .wa-tooltip { width: 190px; }
        }
      `}</style>

      <div className="wa-wrap">
        {showTooltip && (
          <div className="wa-tooltip" style={{ position: 'relative' }}>
            <button
              className="wa-tooltip-close"
              onClick={() => setShowTooltip(false)}
              aria-label="Close"
            >✕</button>
            <div className="wa-tooltip-eyebrow">3TATTAVA Community</div>
            <div className="wa-tooltip-text">
              Join early — get launch pricing first
            </div>
            <div className="wa-tooltip-sub">
              300+ members waiting for launch day
            </div>
          </div>
        )}

        <button
          className={`wa-btn ${clicked ? 'clicked' : ''}`}
          onClick={handleClick}
          aria-label="Join 3TATTAVA WhatsApp Community"
          title="Join our WhatsApp Community"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {!clicked && <span className="wa-badge">1</span>}
        </button>
      </div>
    </>
  );
}
