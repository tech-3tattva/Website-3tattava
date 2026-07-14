import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";
import LeadForm from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Subscribe Monthly — Join the Waitlist | 3TATTAVA",
  description: "Never miss a day of your ritual. Join the waitlist for 3TATTAVA monthly subscriptions — auto-delivered, cancel anytime.",
  alternates: { canonical: "https://www.3tattava.com/subscribe-waitlist" },
  robots: { index: false, follow: true },
};

export default function SubscribeWaitlistPage() {
  return (
    <ContentPage eyebrow="Coming Soon" title="Subscribe Monthly" intro="Consistency is the whole point. Monthly subscriptions are launching soon — auto-delivered, save 20%, cancel anytime. Join the waitlist to get early access and launch pricing first.">
      <h2>Why Subscribe</h2>
      <ul>
        <li><strong>Never break the ritual</strong> — your supply arrives before you run out.</li>
        <li><strong>Save 20%</strong> versus one-time pricing, locked in for waitlist members.</li>
        <li><strong>Full flexibility</strong> — pause, skip, or cancel anytime.</li>
      </ul>

      <h2>Join the Waitlist</h2>
      <p>Drop your details and we&apos;ll notify you the moment subscriptions go live.</p>
      <div style={{ marginTop: 16 }}>
        <LeadForm interest="subscription" source="subscribe_waitlist" cta="Join the Waitlist" successTitle="You're on the list." successBody="We'll message you with early access and launch pricing before anyone else." />
      </div>
    </ContentPage>
  );
}
