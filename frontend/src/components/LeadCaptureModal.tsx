'use client';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const COOLDOWN_KEY = '3t_lead_cooldown';
const COOLDOWN_MS  = 48 * 60 * 60 * 1000; // 48 hours

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.3tattava.com';

type ModalState = 'hidden' | 'visible' | 'submitting' | 'success';

export default function LeadCaptureModal() {
  const pathname = usePathname();
  const [state, setState] = useState<ModalState>('hidden');
  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const canShow = useCallback(() => {
    if (typeof window === 'undefined') return false;
    if (pathname?.startsWith('/products/')) return false;
    const ts = localStorage.getItem(COOLDOWN_KEY);
    if (ts && Date.now() - parseInt(ts, 10) < COOLDOWN_MS) return false;
    return true;
  }, [pathname]);

  useEffect(() => {
    if (!canShow()) return;

    let shown = false;

    const showModal = () => {
      if (shown) return;
      shown = true;
      setState('visible');
    };

    const timer = setTimeout(showModal, 45_000);

    const onScroll = () => {
      if ((window.scrollY + window.innerHeight) / document.body.scrollHeight >= 0.70) {
        showModal();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [canShow]);

  const validate = () => {
    const e: { name?: string; phone?: string } = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!phone.match(/^[6-9]\d{9}$/)) e.phone = '10-digit Indian mobile number';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setState('submitting');
    try {
      await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, source: 'website_popup' }),
      });
      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      setState('success');
    } catch {
      setState('visible');
    }
  };

  const close = () => {
    localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
    setState('hidden');
  };

  if (state === 'hidden') return null;

  return (
    <>
      <style suppressHydrationWarning>{`
        .lcm-overlay {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(14,12,9,0.85);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: lcm-overlay-in 0.3s ease forwards;
        }
        @keyframes lcm-overlay-in { from { opacity: 0; } to { opacity: 1; } }

        .lcm-card {
          background: #1A1710;
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 0;
          width: 100%; max-width: 420px;
          padding: 40px;
          position: relative;
          box-shadow: 0 24px 80px rgba(0,0,0,0.7);
          animation: lcm-card-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes lcm-card-in {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .lcm-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #C9A84C, transparent);
        }

        .lcm-close {
          position: absolute; top: 16px; right: 16px;
          background: none; border: none; cursor: pointer;
          color: #8A7F6A; font-size: 18px; line-height: 1;
          transition: color 0.2s; padding: 4px;
        }
        .lcm-close:hover { color: #E8E0D0; }

        .lcm-eyebrow {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 75, 'wght' 500;
          font-size: 9px; letter-spacing: 3px;
          text-transform: uppercase; color: #C9A84C; margin-bottom: 10px;
        }
        .lcm-headline {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 90, 'wght' 300;
          font-size: 26px; color: #E8E0D0; line-height: 1.2; margin-bottom: 8px;
        }
        .lcm-headline strong {
          font-variation-settings: 'wdth' 90, 'wght' 700;
          color: #C9A84C; font-style: italic;
        }
        .lcm-sub {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 90, 'wght' 300;
          font-size: 13px; color: #8A7F6A; margin-bottom: 24px; line-height: 1.5;
        }
        .lcm-offer {
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.25);
          padding: 10px 14px; margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .lcm-offer-tag {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 75, 'wght' 600;
          font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
          background: #C9A84C; color: #0E0C09;
          padding: 3px 8px; white-space: nowrap;
        }
        .lcm-offer-text {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 90, 'wght' 300;
          font-size: 14px; color: #E8E0D0;
        }
        .lcm-field { margin-bottom: 14px; }
        .lcm-label {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 75, 'wght' 400;
          font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
          color: #8A7F6A; display: block; margin-bottom: 5px;
        }
        .lcm-input {
          width: 100%; padding: 11px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0; color: #E8E0D0;
          font-family: var(--font-primary), system-ui, sans-serif;
          font-size: 14px; outline: none; transition: border-color 0.2s;
        }
        .lcm-input::placeholder { color: #5A5245; }
        .lcm-input:focus { border-color: rgba(201,168,76,0.5); background: rgba(201,168,76,0.04); }
        .lcm-input.err { border-color: rgba(220,80,80,0.5); }
        .lcm-error {
          font-size: 11px; color: rgba(220,100,100,0.9);
          margin-top: 4px; display: block;
          font-family: var(--font-primary), system-ui, sans-serif;
        }
        .lcm-btn {
          width: 100%; margin-top: 20px; padding: 14px;
          background: #C9A84C; border: none; border-radius: 0;
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 85, 'wght' 600;
          font-size: 11px; letter-spacing: 0.12em;
          text-transform: uppercase; color: #0E0C09; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .lcm-btn:hover { background: #E8C97A; }
        .lcm-btn:active { transform: scale(0.99); }
        .lcm-btn:disabled { background: #5A5245; color: #8A7F6A; cursor: not-allowed; }
        .lcm-footer {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-size: 10px; color: #5A5245;
          text-align: center; margin-top: 12px;
        }
        .lcm-success {
          text-align: center; padding: 20px 0;
        }
        .lcm-success-icon {
          font-size: 40px; margin-bottom: 16px;
        }
        .lcm-success-h {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-variation-settings: 'wdth' 90, 'wght' 300;
          font-size: 22px; color: #E8E0D0; margin-bottom: 8px;
        }
        .lcm-success-p {
          font-family: var(--font-primary), system-ui, sans-serif;
          font-size: 13px; color: #8A7F6A;
        }
      `}</style>

      <div className="lcm-overlay" onClick={(e) => e.target === e.currentTarget && close()}>
        <div className="lcm-card">
          <button className="lcm-close" onClick={close} aria-label="Close">×</button>

          {state === 'success' ? (
            <div className="lcm-success">
              <div className="lcm-success-icon">✓</div>
              <div className="lcm-success-h">You&apos;re in.</div>
              <p className="lcm-success-p">Check your phone — your ₹200 code is on its way.</p>
            </div>
          ) : (
            <>
              <div className="lcm-eyebrow">Limited Access</div>
              <div className="lcm-headline">
                Not for everyone.<br /><strong>Built for you.</strong>
              </div>
              <div className="lcm-sub">
                Get ₹200 off your first order. For people serious about their morning ritual.
              </div>

              <div className="lcm-offer">
                <span className="lcm-offer-tag">₹200 Off</span>
                <span className="lcm-offer-text">Your first 3TATTAVA order</span>
              </div>

              <div className="lcm-field">
                <label className="lcm-label" htmlFor="lcm-name">Name</label>
                <input
                  id="lcm-name"
                  className={`lcm-input${errors.name ? ' err' : ''}`}
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                />
                {errors.name && <span className="lcm-error">{errors.name}</span>}
              </div>

              <div className="lcm-field">
                <label className="lcm-label" htmlFor="lcm-phone">Phone (WhatsApp)</label>
                <input
                  id="lcm-phone"
                  className={`lcm-input${errors.phone ? ' err' : ''}`}
                  type="tel"
                  inputMode="numeric"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setErrors(p => ({ ...p, phone: undefined })); }}
                />
                {errors.phone && <span className="lcm-error">{errors.phone}</span>}
              </div>

              <button
                className="lcm-btn"
                onClick={handleSubmit}
                disabled={state === 'submitting'}
              >
                {state === 'submitting' ? 'Sending…' : 'Claim ₹200 Off →'}
              </button>
              <div className="lcm-footer">
                No spam. No emails. Just your code via WhatsApp.
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
