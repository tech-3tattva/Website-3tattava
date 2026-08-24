"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const F = "var(--font-primary), system-ui, sans-serif";
const GOLD = "#C8963E";
const GOLD_SOFT = "#e0b464";
const CREAM = "#f7f0e2";

/**
 * Banner artwork behind the whole section. Swap this one line when the
 * designer delivers the final banner (drop the file in `public/banners/`
 * and use "/banners/<name>.jpg", or paste a media.3tattava.com URL).
 *
 * Keep it optimised: ~2560px wide, WebP/JPEG, ideally under 400 KB. Avoid the
 * print poster at banners/Landing_Page/6X3+LAUNCH+POSTER.png — it is ~50 MB.
 */
const EVENTS_BANNER = "https://media.3tattava.com/features/home/trinity-poster-v2.png";

type EventStatus = "ongoing" | "upcoming" | "completed";

type BrandEvent = {
  title: string;
  when: string;
  where: string;
  blurb: string;
  /** Point this at the event's own story page once it exists. */
  href: string;
  cta: string;
  status: EventStatus;
};

/** Edit this list to add or retire an event — the section renders from it. */
const EVENTS: BrandEvent[] = [
  {
    title: "WTF Gyms × 3TATTAVA",
    when: "Running now",
    where: "29 gym floors · Delhi NCR",
    blurb:
      "Doctor-formulated Shilajit on WTF gym floors. Scan the code at your gym, claim the trainer offer and start the ritual.",
    href: "/wtf-gym",
    cta: "Explore the gym drop",
    status: "ongoing",
  },
  {
    title: "Indraprastha Kanwar Swasthya Seva Yatra",
    when: "3–8 August 2026",
    where: "Shahdara, Delhi",
    blurb:
      "Our Seva initiative on the Yatra route — a doctor-led Ayurveda camp that gave Kanwar Yatris free consultations, first aid, foot care and heat-safety support.",
    href: "/events",
    cta: "View moments",
    status: "completed",
  },
];

const STATUS_STYLE: Record<EventStatus, { label: string; dot: string; fg: string; bg: string }> = {
  ongoing: { label: "Live now", dot: "#4ade80", fg: "#86efac", bg: "rgba(74,222,128,0.14)" },
  upcoming: { label: "Upcoming", dot: GOLD, fg: GOLD_SOFT, bg: "rgba(200,150,62,0.16)" },
  completed: { label: "Completed", dot: "rgba(247,240,226,0.55)", fg: "rgba(247,240,226,0.72)", bg: "rgba(247,240,226,0.10)" },
};

/* Injected verbatim via dangerouslySetInnerHTML. A JSX `<style>{`...`}</style>`
   child gets HTML-escaped on the server (content: "" becomes &quot;&quot;) but
   not on the client, which trips a React hydration mismatch. */
const EVS_CSS = `
        .evs-wrap {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding: clamp(58px, 8vw, 112px) 20px;
          font-family: ${F};
        }
        /* Banner artwork + scrim so headlines stay legible over any image. */
        .evs-wrap::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -2;
          background-image: url("${EVENTS_BANNER}");
          background-size: cover;
          background-position: center;
          transform: scale(1.02);
        }
        .evs-wrap::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            radial-gradient(85% 65% at 50% 0%, rgba(28,19,4,0.30) 0%, rgba(12,9,4,0.72) 72%),
            linear-gradient(180deg, rgba(12,9,4,0.52) 0%, rgba(12,9,4,0.66) 55%, rgba(12,9,4,0.74) 100%);
        }
        .evs-inner { max-width: 1080px; margin: 0 auto; }
        .evs-head { text-align: center; max-width: 700px; margin: 0 auto clamp(30px, 4vw, 48px); }
        .evs-eyebrow {
          display: inline-flex; align-items: center; gap: 9px;
          font-size: 11.5px; letter-spacing: 0.24em; text-transform: uppercase;
          color: ${GOLD_SOFT}; margin-bottom: 16px;
        }
        .evs-eyebrow span.rule { width: 30px; height: 1px; background: rgba(200,150,62,0.55); }
        .evs-title {
          font-size: clamp(28px, 4.6vw, 48px); line-height: 1.08; letter-spacing: -0.02em;
          color: #fff; margin: 0 0 14px; font-variation-settings: 'wght' 750;
        }
        .evs-title em { font-style: italic; color: ${GOLD}; }
        .evs-sub { font-size: clamp(14px, 1.5vw, 16.5px); line-height: 1.65; color: rgba(247,240,226,0.76); margin: 0; }

        .evs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr)); gap: 18px; }
        .evs-card {
          display: flex; flex-direction: column; gap: 12px;
          padding: clamp(20px, 2.4vw, 28px);
          border-radius: 18px;
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(200,150,62,0.26);
          backdrop-filter: blur(9px);
          -webkit-backdrop-filter: blur(9px);
          transition: border-color 0.25s ease, transform 0.25s ease, background 0.25s ease;
        }
        .evs-card:hover {
          border-color: rgba(200,150,62,0.62);
          background: rgba(255,255,255,0.085);
          transform: translateY(-3px);
        }
        .evs-card.is-completed { background: rgba(255,255,255,0.035); border-color: rgba(247,240,226,0.18); }
        .evs-card.is-completed:hover { border-color: rgba(247,240,226,0.36); }
        .evs-pill {
          align-self: flex-start; display: inline-flex; align-items: center; gap: 7px;
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          padding: 5px 11px; border-radius: 999px;
        }
        .evs-pill i { width: 6px; height: 6px; border-radius: 50%; display: block; }
        .evs-card-title { font-size: clamp(18px, 2vw, 22px); color: ${CREAM}; margin: 0; font-variation-settings: 'wght' 700; line-height: 1.25; }
        .evs-meta { font-size: 12.5px; letter-spacing: 0.06em; color: ${GOLD_SOFT}; text-transform: uppercase; }
        .evs-card.is-completed .evs-meta { color: rgba(247,240,226,0.6); }
        .evs-blurb { font-size: 14px; line-height: 1.62; color: rgba(247,240,226,0.74); margin: 0; flex: 1 1 auto; }

        /* Each card carries its own CTA — one per event, so every event can
           point at its own story page. */
        .evs-cta {
          align-self: flex-start; margin-top: 6px;
          display: inline-flex; align-items: center; gap: 9px;
          padding: 12px 22px; border-radius: 999px;
          font-size: 12px; letter-spacing: 0.13em; text-transform: uppercase;
          font-variation-settings: 'wght' 700; text-decoration: none;
          background: linear-gradient(135deg, ${GOLD} 0%, #b8801f 100%);
          color: #1c1304;
          box-shadow: 0 10px 26px rgba(200,150,62,0.24);
          transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
        }
        .evs-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(200,150,62,0.34); }
        .evs-cta span.arrow { transition: transform 0.25s ease; }
        .evs-cta:hover span.arrow { transform: translateX(4px); }
        /* Completed events get a quieter, outlined CTA so live ones lead. */
        .evs-cta.ghost {
          background: transparent; color: ${CREAM};
          border: 1px solid rgba(247,240,226,0.34); box-shadow: none;
        }
        .evs-cta.ghost:hover { border-color: rgba(247,240,226,0.7); background: rgba(247,240,226,0.06); box-shadow: none; }

        @media (prefers-reduced-motion: reduce) {
          .evs-card, .evs-cta, .evs-cta span.arrow { transition: none; }
          .evs-card:hover, .evs-cta:hover { transform: none; }
        }
`;

/**
 * Homepage events section: where the brand is showing up in the real world.
 * Sits above the product collection so visitors see live activity first.
 */
export default function EventsShowcase() {
  const reduce = useReducedMotion();
  const rise = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-70px" },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="evs-wrap" aria-label="Events and collaborations">
      <style dangerouslySetInnerHTML={{ __html: EVS_CSS }} />

      <div className="evs-inner">
        <div className="evs-head">
          <motion.p className="evs-eyebrow" {...rise(0)}>
            <span className="rule" /> Events &amp; Collaborations <span className="rule" />
          </motion.p>
          <motion.h2 className="evs-title" {...rise(0.06)}>
            Where you&apos;ll <em>find us.</em>
          </motion.h2>
          <motion.p className="evs-sub" {...rise(0.12)}>
            We take Ayurveda to the places people actually train, heal and gather — gym floors, health camps and community drives.
          </motion.p>
        </div>

        <div className="evs-grid">
          {EVENTS.map((ev, i) => {
            const s = STATUS_STYLE[ev.status];
            const done = ev.status === "completed";
            return (
              <motion.div key={ev.title} {...rise(0.16 + i * 0.08)} style={{ display: "flex" }}>
                <article className={`evs-card${done ? " is-completed" : ""}`}>
                  <span className="evs-pill" style={{ background: s.bg, color: s.fg }}>
                    <i style={{ background: s.dot }} /> {s.label}
                  </span>
                  <h3 className="evs-card-title">{ev.title}</h3>
                  <p className="evs-meta">{ev.when} · {ev.where}</p>
                  <p className="evs-blurb">{ev.blurb}</p>
                  <Link href={ev.href} className={`evs-cta${done ? " ghost" : ""}`} aria-label={`${ev.cta} — ${ev.title}`}>
                    {ev.cta} <span className="arrow" aria-hidden>→</span>
                  </Link>
                </article>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
