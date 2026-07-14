import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";
import LeadForm from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "3TATTAVA Wellness Club | Performance Ayurveda Community",
  description: "Join the 3TATTAVA Wellness Club — member pricing, expert sessions, events, and the Performance Ayurveda community.",
  alternates: { canonical: "https://www.3tattava.com/wellness-club" },
};

export default function WellnessClubPage() {
  return (
    <ContentPage eyebrow="Membership" title="The 3TATTAVA Wellness Club" intro="More than a loyalty programme — a growing network of athletes, professionals and lifelong learners practising Performance Ayurveda together.">
      <h2>Member Benefits</h2>
      <ul>
        <li><strong>Member pricing</strong> and early access to new products and collections.</li>
        <li><strong>Expert sessions</strong> with Dr. Kashish Gupta and our Performance Nutrition team.</li>
        <li><strong>Community events &amp; activations</strong> at WTF Experience Centers across Delhi NCR.</li>
        <li><strong>Educational drops</strong> — research, rituals, and athlete insights before they go public.</li>
      </ul>

      <h2>Balance · Build · Become — Together</h2>
      <p>The strongest transformations happen in community. The Wellness Club is where the ritual becomes a shared practice. Membership is opening soon.</p>

      <h2>Reserve Your Spot</h2>
      <div style={{ marginTop: 16 }}>
        <LeadForm interest="wellness_club" source="wellness_club" cta="Join the Club" successTitle="Welcome to the movement." successBody="You're on the early list — we'll be in touch with membership details soon." />
      </div>
      <p style={{ marginTop: 18 }}>Prefer to explore first? Visit the <a href="/community">Community page</a>.</p>
    </ContentPage>
  );
}
