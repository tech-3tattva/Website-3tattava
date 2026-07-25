import Link from "next/link";

/**
 * Pre-launch state for the Find Us / experience-centers page.
 * The offline experience-center network is not live yet, so the page shows a
 * "Launching Soon" message + waitlist CTA instead of the location finder.
 * To restore the live finder at launch, render <FindUsClient /> from page.tsx.
 */

const CREAM = "#f7f0e2";
const INK = "#442a1b";
const GOLD = "#cd872a";
const MUTED = "#6f5a48";
const FONT = "var(--font-primary), system-ui, sans-serif";

export default function FindUsLaunchingSoon() {
  return (
    <section
      style={{
        fontFamily: FONT,
        background: CREAM,
        color: INK,
        minHeight: "72vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "96px 24px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 13,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: GOLD,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          Experience Centers
        </p>

        <h1
          style={{
            fontSize: "clamp(38px, 7vw, 68px)",
            lineHeight: 1.05,
            fontWeight: 800,
            margin: 0,
          }}
        >
          Launching Soon
        </h1>

        <div
          style={{
            width: 64,
            height: 3,
            margin: "28px auto",
            background: "linear-gradient(90deg,#A67B2F,#E4C079,#cd872a,#A67B2F)",
            borderRadius: 2,
          }}
        />

        <p
          style={{
            fontSize: "clamp(16px, 2.2vw, 19px)",
            lineHeight: 1.7,
            color: MUTED,
            maxWidth: 560,
            margin: "0 auto 14px",
          }}
        >
          Offline 3Tattava experience centers are on their way. We&rsquo;re putting the finishing
          touches on in-person spaces where you can experience the rituals, review the published
          lab reports, and meet our team.
        </p>

        <p
          style={{
            fontSize: "clamp(15px, 2vw, 17px)",
            lineHeight: 1.7,
            color: INK,
            fontWeight: 600,
            margin: "0 auto 36px",
          }}
        >
          Join the founding waitlist to be the first to know when experience centers open near you.
        </p>

        <Link
          href="/waitlist"
          style={{
            display: "inline-block",
            background: INK,
            color: CREAM,
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            padding: "16px 34px",
            borderRadius: 8,
            textDecoration: "none",
            boxShadow: "0 12px 30px rgba(20,12,4,.25)",
          }}
        >
          Join the Founding Waitlist →
        </Link>
        <div style={{ marginTop: 22 }}>
          <Link
            href="/lab-reports"
            style={{
              color: GOLD,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              borderBottom: `1px solid ${GOLD}`,
              paddingBottom: 2,
            }}
          >
            View the Lab Reports
          </Link>
        </div>
      </div>
    </section>
  );
}
