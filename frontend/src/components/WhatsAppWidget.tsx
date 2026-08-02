'use client';
import { useState, useEffect } from 'react';

// Replace with your actual 3Tattava Announcement Channel invite link
// Get it from: WhatsApp → 3Tattava community → Announcement → Invite via link
const COMMUNITY_LINK = 'https://whatsapp.com/channel/0029VbCvQM9AzNc0iZDadt1c';

export default function WhatsAppWidget() {
  const [clicked, setClicked]           = useState(false);
  const [mounted, setMounted]           = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    setClicked(true);
    window.open(COMMUNITY_LINK, '_blank', 'noopener,noreferrer');
  };

  if (!mounted) return null;

  return (
    <>
      <style suppressHydrationWarning>{`
        .wa-wrap {
          position: fixed;
          bottom: 118px;
          right: 28px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }

        .wa-btn {
          position: relative;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #25D366;
          border: 1px solid rgba(37,211,102,0.7);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 24px rgba(37,211,102,0.35), inset 0 1px 0 rgba(255,255,255,0.18);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .wa-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 8px 30px rgba(37,211,102,0.45), 0 0 22px rgba(37,211,102,0.28);
        }

        .wa-btn:active { transform: scale(0.93); }

        .wa-btn::before {
          content: '';
          position: absolute;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: 1.5px solid rgba(37,211,102,0.6);
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
          border: 1px solid rgba(37,211,102,0.35);
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
          font-family: var(--font-primary), system-ui, sans-serif;
          font-size: 9px;
          font-weight: 500;
          color: #0E0C09;
        }

        @media (max-width: 480px) {
          .wa-wrap { bottom: 86px; right: 14px; }
          .wa-btn { width: 48px; height: 48px; }
          .wa-btn::before, .wa-btn::after { width: 48px; height: 48px; }
        }
      `}</style>

      <div className="wa-wrap">
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
