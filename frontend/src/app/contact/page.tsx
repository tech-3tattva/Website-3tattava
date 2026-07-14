import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";
import LeadForm from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Contact | 3TATTAVA",
  description: "Reach the 3TATTAVA team — orders, support, partnerships, and Performance Ayurveda guidance.",
  alternates: { canonical: "https://www.3tattava.com/contact" },
};

export default function ContactPage() {
  return (
    <ContentPage eyebrow="We're Here" title="Contact Us" intro="Questions about your ritual, an order, or Performance Ayurveda? We usually respond within one working day.">
      <h2>Reach Us Directly</h2>
      <ul>
        <li><strong>General:</strong> <a href="mailto:hello@3tattava.com">hello@3tattava.com</a></li>
        <li><strong>Orders &amp; support:</strong> <a href="mailto:orders@3tattava.com">orders@3tattava.com</a></li>
        <li><strong>WhatsApp:</strong> tap the chat button in the corner of any page.</li>
        <li><strong>Visit us:</strong> any of our <a href="/find-us">WTF Experience Centers across Delhi NCR</a>.</li>
      </ul>

      <h2>Company</h2>
      <p>
        <strong>Marketed by</strong> SankalpaSiddhi Ayupharma Pvt. Ltd., Shahdara, Delhi.
      </p>

      <h2>Send Us A Message</h2>
      <p>Leave your details and a quick note of what you need — we&apos;ll get back to you.</p>
      <div style={{ marginTop: 16 }}>
        <LeadForm interest="contact" source="contact_page" cta="Request A Callback" successTitle="Message received." successBody="Thank you — our team will reach out shortly over WhatsApp or email." />
      </div>
    </ContentPage>
  );
}
