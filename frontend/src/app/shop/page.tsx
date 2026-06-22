'use client'
import { useRouter } from 'next/navigation'

const products = [
  {
    name: 'SHODHIT SHILAJIT RESIN',
    price: 1299,
    desc: 'Pure Himalayan Resin · 20g Jar',
    slug: 'shodhit-shilajit-resin',
    img: 'https://media.3tattava.com/products/Rockresin-hero.jpeg',
    chips: ['≥70% Fulvic Acid', 'NABL Certified', 'AYUSH-GMP'],
  },
  {
    name: 'SHAHJEET STICKS',
    price: 999,
    desc: 'Honey-Shilajit · 30 Sticks',
    slug: 'shahjeet-sticks',
    img: 'https://media.3tattava.com/products/shahjeet-box.png',
    chips: ['600mg Per Stick', 'NABL Certified', 'AYUSH-GMP'],
  },
]

export default function ShopPage() {
  const router = useRouter()
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', padding: 'clamp(48px, 8vw, 80px) clamp(16px, 4vw, 24px)', fontFamily: 'var(--font-body, Jost, system-ui, sans-serif)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: 16, fontWeight: 700 }}>
          SHOP
        </p>
        <h1 style={{ fontFamily: 'var(--font-display, Cormorant Garamond, serif)', fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>
          All Products
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-soft)', marginBottom: 64, maxWidth: 500 }}>
          Lab-certified, doctor-formulated Performance Ayurveda. Two formats. One mission.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px),1fr))', gap: 28 }}>
          {products.map(p => (
            <div
              key={p.slug}
              onClick={() => router.push(`/products/${p.slug}`)}
              style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.3s, transform 0.3s' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 36px rgba(28,19,4,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
            >
              <div style={{ aspectRatio: '1/1', overflow: 'hidden', background: 'var(--cream)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  onMouseOver={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                />
              </div>
              <div style={{ padding: '28px 28px 32px' }}>
                <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-dark)', fontWeight: 700, marginBottom: 8 }}>3TATTAVA</p>
                <h3 style={{ fontFamily: 'var(--font-display, Cormorant Garamond, serif)', fontSize: 26, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{p.name}</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 16 }}>{p.desc}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                  {p.chips.map(chip => (
                    <span key={chip} style={{ fontSize: 11, fontWeight: 600, border: '1px solid var(--line)', borderRadius: 4, padding: '4px 10px', color: 'var(--ink-soft)' }}>{chip}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-display, Cormorant Garamond, serif)', fontSize: 32, fontWeight: 700, color: 'var(--ink)' }}>₹{p.price.toLocaleString('en-IN')}</span>
                  <button
                    style={{ background: 'var(--gold)', color: '#fff', border: 'none', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, padding: '11px 22px', borderRadius: 6, cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-dark)'; }}
                    onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)'; }}
                  >
                    View Product
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom assurance strip */}
        <div style={{ marginTop: 80, padding: '40px 0', borderTop: '1px solid var(--line)', display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: 'NABL', label: 'Lab Certified' },
            { value: 'AYUSH', label: 'GMP Facility' },
            { value: '16,000ft', label: 'Himalayan Source' },
            { value: 'Dr. Kashish', label: 'BAMS Formulated' },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display, Cormorant Garamond, serif)', fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>{m.value}</div>
              <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-dark)', fontWeight: 700, marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
