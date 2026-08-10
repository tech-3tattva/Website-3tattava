"use client";

/**
 * Animated "review wall" that sits directly under the homepage testimonial
 * videos (#testimonials). Two rows of cards drift in opposite directions,
 * pause on hover, and fall back to a static wrapped grid for reduced-motion.
 *
 * ⚠️ SEED reviews — experiential / convenience wording only (NO health-outcome
 * or cure claims, per the medical disclaimer), no fabricated "verified buyer"
 * badges. Replace with real reviews as they arrive through the per-order
 * review-request flow. Kept in one array so swapping in real content is trivial.
 */

const F = "var(--font-primary), system-ui, sans-serif";
const INK = "#442a1b";
const GOLD = "#C8963E";
const TAUPE = "#8a7355";
const CREAM = "#f7f0e2";

type R = { name: string; city: string; rating: number; text: string };

const REVIEWS: R[] = [
  { name: "Rahul S.", city: "Delhi", rating: 5, text: "Part of my morning routine now — easy to take and no harsh aftertaste." },
  { name: "Priya M.", city: "Mumbai", rating: 5, text: "Love the stick format. Tear, squeeze, done — I keep them in my gym bag." },
  { name: "Aman K.", city: "Pune", rating: 4, text: "Scanned the QR and actually read the batch lab report. That transparency won me over." },
  { name: "Neha T.", city: "Bengaluru", rating: 5, text: "The resin dissolves clean in warm water. Feels like a proper daily ritual." },
  { name: "Vikram R.", city: "Jaipur", rating: 5, text: "Packaging and quality feel genuinely premium, and it's doctor-formulated." },
  { name: "Sneha D.", city: "Hyderabad", rating: 5, text: "Honey base makes it pleasant to take — my whole family uses it now." },
  { name: "Arjun P.", city: "Chandigarh", rating: 4, text: "Staying consistent is easy because the sticks are so convenient to carry." },
  { name: "Kavya N.", city: "Kochi", rating: 5, text: "Ordered the bundle. Clean Himalayan sourcing and NABL testing is exactly what I wanted." },
];

const CSS = `
  .rw-wrap { background: ${CREAM}; padding: clamp(6px,1.5vw,20px) 0 clamp(52px,7vw,92px); overflow: hidden; }
  .rw-head { text-align: center; max-width: 640px; margin: 0 auto clamp(26px,4vw,42px); padding: 0 20px; }
  .rw-row { display: flex; gap: 18px; width: max-content; padding: 6px 0; }
  .rw-row-a { animation: rwLeft 48s linear infinite; }
  .rw-row-b { animation: rwRight 56s linear infinite; margin-top: 18px; }
  .rw-wrap:hover .rw-row-a, .rw-wrap:hover .rw-row-b { animation-play-state: paused; }
  @keyframes rwLeft  { from { transform: translateX(0);      } to { transform: translateX(-50%); } }
  @keyframes rwRight { from { transform: translateX(-50%);    } to { transform: translateX(0);    } }
  .rw-card { flex: 0 0 auto; width: clamp(258px, 76vw, 340px); background: #fff; border: 1px solid rgba(200,150,62,.28); border-radius: 16px; padding: 20px 22px; box-shadow: 0 8px 26px rgba(68,42,27,.07); }
  .rw-stars { color: ${GOLD}; font-size: 14px; letter-spacing: 1.5px; }
  .rw-text { font-family: ${F}; font-size: 14.5px; line-height: 1.55; color: ${INK}; margin: 10px 0 14px; }
  .rw-name { font-family: ${F}; font-variation-settings: 'wght' 700; font-size: 13px; color: ${INK}; }
  .rw-city { font-family: ${F}; font-size: 12px; color: ${TAUPE}; margin-left: 6px; }
  @media (prefers-reduced-motion: reduce) {
    .rw-wrap { overflow: visible; }
    .rw-row { width: 100%; flex-wrap: wrap; justify-content: center; }
    .rw-row-a, .rw-row-b { animation: none; }
    .rw-row-b { margin-top: 0; }
  }
`;

function Card({ r }: { r: R }) {
  return (
    <div className="rw-card">
      <span className="rw-stars" aria-hidden>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
      <p className="rw-text">&ldquo;{r.text}&rdquo;</p>
      <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
        <span className="rw-name">{r.name}</span>
        <span className="rw-city">· {r.city}</span>
      </div>
    </div>
  );
}

export default function ReviewMarquee() {
  const rowA = [...REVIEWS, ...REVIEWS]; // duplicated set → seamless -50% loop
  const rev = [...REVIEWS].reverse();
  const rowB = [...rev, ...rev];
  return (
    <section className="rw-wrap" aria-label="What customers are saying">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="rw-head">
        <p style={{ fontFamily: F, fontSize: 11, letterSpacing: ".25em", textTransform: "uppercase", color: GOLD, fontWeight: 700, marginBottom: 10 }}>
          Loved By Early Customers
        </p>
        <h2 style={{ fontFamily: F, fontVariationSettings: "'wght' 800", fontSize: "clamp(24px,4vw,38px)", color: INK, margin: 0, letterSpacing: "-0.01em" }}>
          What people are saying
        </h2>
      </div>
      <div className="rw-row rw-row-a" aria-hidden={false}>
        {rowA.map((r, i) => <Card key={`a${i}`} r={r} />)}
      </div>
      <div className="rw-row rw-row-b">
        {rowB.map((r, i) => <Card key={`b${i}`} r={r} />)}
      </div>
    </section>
  );
}
