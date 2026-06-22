'use client';
import { useState, useEffect, useCallback } from 'react';

const TRIGGER_DELAY_DESKTOP = 90_000; // 90 seconds
const TRIGGER_DELAY_MOBILE  = 120_000; // 2 minutes
const SESSION_KEY = '3t_lead_shown';
const STORAGE_KEY = '3t_lead_submitted';

interface FormData {
  name: string;
  email: string;
  phone: string;
  interest: string;
}

type ModalState = 'hidden' | 'visible' | 'submitting' | 'success';

export default function LeadCaptureModal() {
  const [state, setState]     = useState<ModalState>('hidden');
  const [form, setForm]       = useState<FormData>({ name: '', email: '', phone: '', interest: '' });
  const [errors, setErrors]   = useState<Partial<FormData>>({});

  const shouldShow = useCallback(() => {
    if (typeof window === 'undefined') return false;
    if (sessionStorage.getItem(SESSION_KEY)) return false;
    if (localStorage.getItem(STORAGE_KEY)) return false;
    return true;
  }, []);

  useEffect(() => {
    if (!shouldShow()) return;
    const isMobile = window.innerWidth < 768;
    const delay = isMobile ? TRIGGER_DELAY_MOBILE : TRIGGER_DELAY_DESKTOP;
    const timer = setTimeout(() => {
      setState('visible');
      sessionStorage.setItem(SESSION_KEY, '1');
    }, delay);
    return () => clearTimeout(timer);
  }, [shouldShow]);

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = '10-digit Indian number';
    if (!form.interest) e.interest = 'Please select one';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setState('submitting');
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'website_popup' }),
      });
      localStorage.setItem(STORAGE_KEY, '1');
      setState('success');
    } catch {
      setState('visible'); // revert on error — let user retry
    }
  };

  const close = () => setState('hidden');

  if (state === 'hidden') return null;

  return (
    <>
      <style>{`
        .lcm-overlay {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(14,12,9,0.85);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: lcm-overlay-in 0.3s ease forwards;
        }
        @keyframes lcm-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .lcm-card {
          background: #1A1710;
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 6px;
          width: 100%;
          max-width: 460px;
          padding: 40px;
          position: relative;
          box-shadow: 0 24px 80px rgba(0,0,0,0.7);
          animation: lcm-card-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes lcm-card-in {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Gold top bar */
        .lcm-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #C9A84C, transparent);
          border-radius: 6px 6px 0 0;
        }

        .lcm-close {
          position: absolute; top: 16px; right: 16px;
          background: none; border: none; cursor: pointer;
          color: #8A7F6A; font-size: 18px; line-height: 1;
          transition: color 0.2s;
          padding: 4px;
        }
        .lcm-close:hover { color: #E8E0D0; }

        .lcm-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; letter-spacing: 3px;
          text-transform: uppercase; color: #C9A84C;
          font-weight: 500; margin-bottom: 10px;
        }

        .lcm-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; font-weight: 300;
          color: #E8E0D0; line-height: 1.25;
          margin-bottom: 6px;
        }
        .lcm-headline span { color: #C9A84C; font-style: italic; }

        .lcm-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: #8A7F6A; font-weight: 300;
          margin-bottom: 28px; line-height: 1.5;
        }

        /* Offer badge */
        .lcm-offer {
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 4px;
          padding: 12px 16px;
          margin-bottom: 24px;
          display: flex; align-items: center; gap: 12px;
        }
        .lcm-offer-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; letter-spacing: 2px;
          text-transform: uppercase;
          background: #C9A84C; color: #0E0C09;
          padding: 3px 8px; border-radius: 2px; font-weight: 500;
          white-space: nowrap;
        }
        .lcm-offer-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px; color: #E8E0D0; font-weight: 400;
        }

        /* Form */
        .lcm-field { margin-bottom: 14px; }
        .lcm-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; letter-spacing: 1.5px;
          text-transform: uppercase; color: #8A7F6A;
          font-weight: 400; display: block; margin-bottom: 5px;
        }
        .lcm-input, .lcm-select {
          width: 100%; padding: 11px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 3px; color: #E8E0D0;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 300;
          transition: border-color 0.2s;
          outline: none;
          -webkit-appearance: none;
        }
        .lcm-input::placeholder { color: #5A5245; }
        .lcm-input:focus, .lcm-select:focus {
          border-color: rgba(201,168,76,0.5);
          background: rgba(201,168,76,0.04);
        }
        .lcm-input.err, .lcm-select.err { border-color: rgba(220,80,80,0.5); }
        .lcm-select option { background: #1A1710; color: #E8E0D0; }
        .lcm-error {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; color: rgba(220,100,100,0.9);
          margin-top: 4px; display: block;
        }

        .lcm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .lcm-btn {
          width: 100%; margin-top: 20px;
          padding: 14px;
          background: #C9A84C;
          border: none; border-radius: 3px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; letter-spacing: 2px;
          text-transform: uppercase; font-weight: 500;
          color: #0E0C09; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .lcm-btn:hover { background: #E8C97A; }
        .lcm-btn:active { transform: scale(0.99); }
        .lcm-btn:disabled { background: #5A5245; color: #8A7F6A; cursor: not-allowed; }

        .lcm-footer {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; color: #5A5245;
          text-align: center; margin-top: 12px;
        }

        /* Counter */
        .lcm-counter {
          display: flex; align-items: center; gap: 8px;
          margin-top: 8px;
        }
        .lcm-counter-bar {
          flex: 1; height: 3px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px; overflow: hidden;
        }
        .lcm-counter-fill {
          height: 100%; width: 67%;
          background: linear-gradient(90deg, #C9A84C, #E8C97A);
          border-radius: 2px;
        }
        .lcm-counter-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; color: #8A7F6A; white-space: nowrap;
        }

        /* Success state */
        .lcm-success {
          text-align: center; padding: 20px 0;
        }
        .lcm-success-icon {
          width: 56px; height: 56px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          font-size: 22px;
        }
        .lcm-success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 300;
          color: #E8E0D0; margin-bottom: 8px;
        }
        .lcm-success-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: #8A7F6A;
          font-weight: 300; line-height: 1.6;
        }
        .lcm-success-code {
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 3px; padding: 10px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 18px; font-weight: 500;
          letter-spacing: 4px; color: #C9A84C;
          margin: 20px auto; display: inline-block;
        }

        @media (max-width: 480px) {
          .lcm-card { padding: 28px 24px; }
          .lcm-row { grid-template-columns: 1fr; }
          .lcm-headline { font-size: 24px; }
        }
      `}</style>

      <div className="lcm-overlay" onClick={(e) => e.target === e.currentTarget && close()}>
        <div className="lcm-card" role="dialog" aria-modal="true" aria-label="Early access offer">
          <button className="lcm-close" onClick={close} aria-label="Close">✕</button>

          {state === 'success' ? (
            <div className="lcm-success">
              <div className="lcm-success-icon">✓</div>
              <div className="lcm-success-title">You're in, {form.name.split(' ')[0]}.</div>
              <div className="lcm-success-sub">
                Check your email — your launch offer is already there.<br />
                You'll hear from Dr. Kashish before launch day.
              </div>
              <div className="lcm-success-code">EARLY3T</div>
              <div className="lcm-success-sub" style={{ fontSize: '11px' }}>
                Use this code on launch day. ₹200 off your first order.
              </div>
            </div>
          ) : (
            <>
              <div className="lcm-eyebrow">Early Access — Limited Spots</div>
              <div className="lcm-headline">
                Get <span>₹200 off</span> your<br />first 3TATTAVA order.
              </div>
              <div className="lcm-sub">
                For the first 100 people who show up before we launch.
              </div>

              <div className="lcm-offer">
                <span className="lcm-offer-tag">Offer</span>
                <span className="lcm-offer-text">₹200 off — launch day only. One code per person.</span>
              </div>

              <div className="lcm-field">
                <label className="lcm-label" htmlFor="lcm-name">Your name</label>
                <input
                  id="lcm-name" className={`lcm-input ${errors.name ? 'err' : ''}`}
                  placeholder="Ananya Sharma"
                  value={form.name}
                  onChange={e => setForm(f => ({...f, name: e.target.value}))}
                />
                {errors.name && <span className="lcm-error">{errors.name}</span>}
              </div>

              <div className="lcm-row">
                <div className="lcm-field">
                  <label className="lcm-label" htmlFor="lcm-email">Email</label>
                  <input
                    id="lcm-email" type="email" className={`lcm-input ${errors.email ? 'err' : ''}`}
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  />
                  {errors.email && <span className="lcm-error">{errors.email}</span>}
                </div>
                <div className="lcm-field">
                  <label className="lcm-label" htmlFor="lcm-phone">Phone (India)</label>
                  <input
                    id="lcm-phone" type="tel" className={`lcm-input ${errors.phone ? 'err' : ''}`}
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={e => setForm(f => ({...f, phone: e.target.value.replace(/\D/g, '')}))}
                    maxLength={10}
                  />
                  {errors.phone && <span className="lcm-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="lcm-field">
                <label className="lcm-label" htmlFor="lcm-interest">I'm looking for</label>
                <select
                  id="lcm-interest" className={`lcm-select ${errors.interest ? 'err' : ''}`}
                  value={form.interest}
                  onChange={e => setForm(f => ({...f, interest: e.target.value}))}
                >
                  <option value="">Select your goal</option>
                  <option value="energy_performance">Energy &amp; Performance</option>
                  <option value="womens_health">Women&apos;s Health &amp; Iron</option>
                  <option value="fitness_recovery">Fitness &amp; Recovery</option>
                  <option value="focus_stress">Focus &amp; Stress Management</option>
                  <option value="gift">Gifting Someone</option>
                  <option value="curious">Just exploring</option>
                </select>
                {errors.interest && <span className="lcm-error">{errors.interest}</span>}
              </div>

              <button
                className="lcm-btn"
                onClick={handleSubmit}
                disabled={state === 'submitting'}
              >
                {state === 'submitting' ? 'Securing your spot...' : 'Claim My Early Access Offer'}
              </button>

              <div className="lcm-counter">
                <div className="lcm-counter-bar">
                  <div className="lcm-counter-fill" />
                </div>
                <span className="lcm-counter-text">67 of 100 spots taken</span>
              </div>

              <div className="lcm-footer">
                No spam. One launch email + offer code. Unsubscribe anytime.
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
