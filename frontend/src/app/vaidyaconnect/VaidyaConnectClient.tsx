'use client';
import { useState, useEffect } from 'react';

interface Doctor {
  _id: string;
  name: string;
  qualification: string;
  speciality: string[];
  city: string;
  consultation_fee: number;
  is_free: boolean;
  trusts_3tattava: boolean;
  patients_visited: number;
  trust_score: number;
  monthly_recommendations: number;
  photo_url?: string;
  booking_link: string;
}

const DUMMY_DOCTORS: Doctor[] = [
  {
    _id: '1',
    name: 'Dr. Pooja Arora',
    qualification: 'BAMS, MD (Ayurveda)',
    speciality: ["Women's Health", 'Performance Ayurveda'],
    city: 'New Delhi',
    consultation_fee: 500,
    is_free: false,
    trusts_3tattava: true,
    patients_visited: 142,
    trust_score: 4.8,
    monthly_recommendations: 23,
    booking_link: '#',
  },
  {
    _id: '2',
    name: 'Dr. Rahul Mehta',
    qualification: 'BAMS',
    speciality: ['Sports Medicine', 'Performance Ayurveda'],
    city: 'Bengaluru',
    consultation_fee: 600,
    is_free: false,
    trusts_3tattava: true,
    patients_visited: 89,
    trust_score: 4.9,
    monthly_recommendations: 17,
    booking_link: '#',
  },
  {
    _id: '3',
    name: 'Dr. Kavya Nair',
    qualification: 'BAMS, PhD (Ayurveda)',
    speciality: ['Hormonal Health', "Women's Wellness"],
    city: 'Mumbai',
    consultation_fee: 0,
    is_free: true,
    trusts_3tattava: true,
    patients_visited: 205,
    trust_score: 4.7,
    monthly_recommendations: 34,
    booking_link: '#',
  },
];

const CITIES = [
  'Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Jaipur', 'Noida', 'Gurgaon',
  'Ahmedabad', 'Lucknow', 'Chandigarh',
];

const TICKER_ITEMS = [
  'Dr. Pooja Arora from Delhi recommended 3TATTAVA Shilajit to 23 patients this month',
  'Dr. Rahul Mehta from Bengaluru — 89% patient trust score',
  '3TATTAVA is now available at 12 Ayurveda clinics across Delhi NCR',
  'Dr. Kavya Nair from Mumbai — 34 women referred to Shahjeet Sticks in April',
  'VaidyaConnect now has doctors across 8 Indian cities',
];

export default function VaidyaConnectClient() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [orbPhase, setOrbPhase] = useState<'idle' | 'searching' | 'done'>('idle');

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    setSuggestions(CITIES.filter(c => c.toLowerCase().includes(query.toLowerCase())));
  }, [query]);

  const handleSearch = (city: string) => {
    setQuery(city);
    setSuggestions([]);
    setOrbPhase('searching');
    setTimeout(() => {
      setDoctors(DUMMY_DOCTORS);
      setSearched(true);
      setOrbPhase('done');
    }, 1200);
  };

  return (
    <>
      <style suppressHydrationWarning>{`
        .vc-page {
          background: #0E0C09;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .vc-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 80px 24px 60px;
          position: relative;
          text-align: center;
        }

        .vc-hero::before {
          content: '';
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .vc-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; letter-spacing: 4px;
          text-transform: uppercase; color: #C9A84C;
          font-weight: 500; margin-bottom: 40px;
        }

        .vc-orb-wrap {
          position: relative;
          width: 140px; height: 140px;
          margin-bottom: 32px;
          transition: transform 0.6s ease;
        }

        .vc-orb-wrap.searching { transform: scale(0.75) translateY(-10px); }
        .vc-orb-wrap.done { transform: scale(0.6) translateY(-20px); }

        .vc-orb-ring-outer {
          position: absolute;
          inset: -16px;
          border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.15);
          animation: orb-pulse 4s ease-in-out infinite;
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        .vc-orb-ring-orbit {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1px dashed rgba(201,168,76,0.2);
          animation: orb-orbit 12s linear infinite;
        }
        @keyframes orb-orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .vc-orb-ring-orbit::before {
          content: '';
          position: absolute;
          top: -3px; left: 50%;
          width: 6px; height: 6px;
          background: #C9A84C;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(201,168,76,0.8);
          transform: translateX(-50%);
        }

        .vc-orb-core {
          width: 140px; height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #2D1A08, #0E0C09);
          border: 1px solid rgba(201,168,76,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 40px rgba(201,168,76,0.1), inset 0 1px 0 rgba(201,168,76,0.2);
          animation: orb-breathe 4s ease-in-out infinite;
        }
        @keyframes orb-breathe {
          0%, 100% { box-shadow: 0 0 40px rgba(201,168,76,0.1), inset 0 1px 0 rgba(201,168,76,0.2); }
          50% { box-shadow: 0 0 60px rgba(201,168,76,0.18), inset 0 1px 0 rgba(201,168,76,0.3); }
        }

        .vc-orb-icon {
          color: rgba(201,168,76,0.7);
          animation: orb-rotate 8s linear infinite;
        }
        @keyframes orb-rotate {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        .vc-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(30px, 5vw, 48px);
          font-weight: 300;
          color: #E8E0D0;
          line-height: 1.15;
          margin-bottom: 10px;
          max-width: 600px;
        }
        .vc-title span { color: #C9A84C; font-style: italic; }

        .vc-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #8A7F6A; font-weight: 300;
          max-width: 400px; line-height: 1.6; margin-bottom: 36px;
        }

        .vc-search-wrap {
          position: relative;
          width: 100%;
          max-width: 480px;
        }

        .vc-search-input {
          width: 100%;
          padding: 16px 52px 16px 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 3px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          color: #E8E0D0;
          outline: none;
          transition: border-color 0.2s;
        }
        .vc-search-input::placeholder { color: #5A5245; font-style: italic; }
        .vc-search-input:focus { border-color: rgba(201,168,76,0.5); }

        .vc-search-icon {
          position: absolute;
          right: 16px; top: 50%;
          transform: translateY(-50%);
          color: #C9A84C; font-size: 18px;
          pointer-events: none;
        }

        .vc-suggestions {
          position: absolute;
          top: calc(100% + 4px);
          left: 0; right: 0;
          background: #1A1710;
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 3px;
          z-index: 100;
          overflow: hidden;
        }
        .vc-suggestion-item {
          padding: 12px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #E8E0D0;
          cursor: pointer;
          transition: background 0.15s;
          text-align: left;
          border: none;
          background: none;
          width: 100%;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .vc-suggestion-item:last-child { border-bottom: none; }
        .vc-suggestion-item:hover { background: rgba(201,168,76,0.06); color: #C9A84C; }

        .vc-searching-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; letter-spacing: 2px;
          text-transform: uppercase; color: #C9A84C;
          margin-top: 16px;
          animation: blink 1.2s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .vc-grid-section {
          padding: 0 24px 80px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .vc-grid-header {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(201,168,76,0.1);
        }

        .vc-grid-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 300;
          color: #E8E0D0;
        }
        .vc-grid-city {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 300;
          color: #C9A84C; font-style: italic;
        }
        .vc-grid-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; letter-spacing: 2px;
          text-transform: uppercase; color: #8A7F6A;
          margin-left: auto;
        }

        .vc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .vc-card {
          background: #1A1710;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px;
          padding: 28px 24px;
          position: relative;
          transition: border-color 0.3s, transform 0.2s;
          animation: card-in 0.4s ease forwards;
          opacity: 0;
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .vc-card:nth-child(1) { animation-delay: 0s; }
        .vc-card:nth-child(2) { animation-delay: 0.1s; }
        .vc-card:nth-child(3) { animation-delay: 0.2s; }

        .vc-card:hover {
          border-color: rgba(201,168,76,0.25);
          transform: translateY(-2px);
        }

        .vc-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 100%;
          background: rgba(201,168,76,0.4);
          border-radius: 4px 0 0 4px;
        }

        .vc-card-head {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }

        .vc-avatar {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2D1A08, #442A1B);
          border: 1.5px solid rgba(201,168,76,0.35);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; font-weight: 600;
          color: #C9A84C;
        }

        .vc-card-info { flex: 1; }
        .vc-doc-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 19px; font-weight: 400;
          color: #E8E0D0; margin-bottom: 2px;
        }
        .vc-doc-qual {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; color: #8A7F6A; font-weight: 300;
        }

        .vc-trust-badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 8px; letter-spacing: 1.5px;
          text-transform: uppercase; font-weight: 500;
          background: rgba(74,124,89,0.12);
          border: 1px solid rgba(74,124,89,0.3);
          color: #7AAA8A;
          padding: 3px 8px; border-radius: 2px;
          white-space: nowrap;
        }

        .vc-specialities {
          display: flex; flex-wrap: wrap; gap: 6px;
          margin-bottom: 16px;
        }
        .vc-speciality-pill {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; letter-spacing: 1.5px;
          text-transform: uppercase;
          background: rgba(201,168,76,0.07);
          border: 1px solid rgba(201,168,76,0.18);
          color: #C9A84C;
          padding: 3px 9px; border-radius: 2px;
        }

        .vc-stats {
          display: flex; gap: 20px;
          margin-bottom: 20px;
          padding: 12px 0;
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .vc-stat {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; color: #8A7F6A; font-weight: 300;
          display: flex; align-items: center; gap: 5px;
        }
        .vc-stat strong {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px; color: #E8E0D0; font-weight: 400;
        }

        .vc-card-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .vc-fee {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; color: #E8E0D0; font-weight: 300;
        }
        .vc-fee-free { color: #7AAA8A; }
        .vc-fee-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; color: #8A7F6A;
          letter-spacing: 1px; text-transform: uppercase;
        }

        .vc-book-btn {
          padding: 9px 20px;
          background: none;
          border: 1px solid rgba(201,168,76,0.4);
          border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; letter-spacing: 2px;
          text-transform: uppercase; font-weight: 500;
          color: #C9A84C; cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          text-decoration: none;
        }
        .vc-book-btn:hover {
          background: #C9A84C;
          color: #0E0C09;
        }

        .vc-ticker {
          background: rgba(201,168,76,0.04);
          border-top: 1px solid rgba(201,168,76,0.1);
          border-bottom: 1px solid rgba(201,168,76,0.1);
          overflow: hidden;
          padding: 12px 0;
          margin: 40px 0;
        }
        .vc-ticker-inner {
          display: flex;
          gap: 80px;
          white-space: nowrap;
          animation: ticker-scroll 28s linear infinite;
        }
        @keyframes ticker-scroll {
          from { transform: translateX(100vw); }
          to   { transform: translateX(-100%); }
        }
        .vc-ticker-item {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: #8A7F6A; font-weight: 300;
          letter-spacing: 0.5px;
        }
        .vc-ticker-dot { color: #C9A84C; margin: 0 16px; }

        @media (max-width: 768px) {
          .vc-hero { padding: 60px 20px 40px; }
          .vc-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="vc-page">

        <section className="vc-hero">
          <div className="vc-eyebrow">VaidyaConnect · 3TATTAVA Doctor Network</div>

          <div className={`vc-orb-wrap ${orbPhase}`}>
            <div className="vc-orb-ring-outer" />
            <div className="vc-orb-ring-orbit" />
            <div className="vc-orb-core">
              <svg className="vc-orb-icon" width="52" height="52" viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="16" r="10" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 46c0-9.94 8.059-18 18-18s18 8.06 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M26 34v8M22 38h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="26" cy="38" r="5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2"/>
              </svg>
            </div>
          </div>

          <h1 className="vc-title">
            Find a <span>Verified</span> Ayurveda<br />Doctor Near You
          </h1>
          <p className="vc-subtitle">
            Every doctor in this network has been vetted by Dr. Kashish.
            All recommend 3TATTAVA as part of their practice.
          </p>

          <div className="vc-search-wrap">
            <input
              type="text"
              className="vc-search-input"
              placeholder="Enter your city — Delhi, Mumbai, Bengaluru..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && query && handleSearch(query)}
            />
            <span className="vc-search-icon">⌕</span>

            {suggestions.length > 0 && (
              <div className="vc-suggestions">
                {suggestions.map(city => (
                  <button
                    key={city}
                    className="vc-suggestion-item"
                    onClick={() => handleSearch(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {orbPhase === 'searching' && (
            <div className="vc-searching-text">Finding verified doctors...</div>
          )}
        </section>

        <div className="vc-ticker">
          <div className="vc-ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="vc-ticker-item">
                {item}
                <span className="vc-ticker-dot">·</span>
              </span>
            ))}
          </div>
        </div>

        {searched && (
          <section className="vc-grid-section">
            <div className="vc-grid-header">
              <span className="vc-grid-title">Doctors in</span>
              <span className="vc-grid-city">{query}</span>
              <span className="vc-grid-count">{doctors.length} verified</span>
            </div>

            <div className="vc-grid">
              {doctors.map((doc) => (
                <div key={doc._id} className="vc-card">
                  <div className="vc-card-head">
                    <div className="vc-avatar">
                      {doc.name.split(' ').map(n => n[0]).slice(1, 3).join('')}
                    </div>
                    <div className="vc-card-info">
                      <div className="vc-doc-name">{doc.name}</div>
                      <div className="vc-doc-qual">{doc.qualification}</div>
                    </div>
                    {doc.trusts_3tattava && (
                      <span className="vc-trust-badge">✓ 3T Verified</span>
                    )}
                  </div>

                  <div className="vc-specialities">
                    {doc.speciality.map(s => (
                      <span key={s} className="vc-speciality-pill">{s}</span>
                    ))}
                  </div>

                  <div className="vc-stats">
                    <span className="vc-stat">
                      <strong>{doc.patients_visited}</strong> patients
                    </span>
                    <span className="vc-stat">
                      <strong>⭐ {doc.trust_score}</strong>
                    </span>
                    <span className="vc-stat">
                      <strong>{doc.monthly_recommendations}</strong> referred/mo
                    </span>
                  </div>

                  <div className="vc-card-foot">
                    <div>
                      <div className={`vc-fee ${doc.is_free ? 'vc-fee-free' : ''}`}>
                        {doc.is_free ? 'Free' : `₹${doc.consultation_fee}`}
                      </div>
                      <div className="vc-fee-label">per consultation</div>
                    </div>
                    <a href={doc.booking_link} className="vc-book-btn">
                      Book →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </>
  );
}
