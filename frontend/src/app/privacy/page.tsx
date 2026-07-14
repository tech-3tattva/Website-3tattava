import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";

export const metadata: Metadata = {
  title: "Privacy Policy | 3TATTAVA",
  description: "How 3TATTAVA collects, uses, and protects your personal information.",
  alternates: { canonical: "https://www.3tattava.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <ContentPage eyebrow="Legal" title="Privacy Policy" updated="June 2026" intro="Your trust matters as much as your results. This policy explains what we collect, why, and the control you have over it.">
      <h2>Information We Collect</h2>
      <ul>
        <li><strong>Details you provide</strong> — name, email, phone/WhatsApp number, and shipping address when you place an order, take the Performance Assessment, or join a waitlist.</li>
        <li><strong>Order &amp; payment data</strong> — order history and payment confirmation processed securely through Razorpay. We never store your card or UPI credentials.</li>
        <li><strong>Usage data</strong> — pages visited and interactions, used to improve the experience.</li>
      </ul>

      <h2>How We Use It</h2>
      <ul>
        <li>To process and deliver your orders and send delivery updates over WhatsApp and email.</li>
        <li>To provide support, respond to enquiries, and share lab reports or product guidance.</li>
        <li>To send educational and product updates — only with your consent, and you can opt out anytime.</li>
      </ul>

      <h2>Sharing</h2>
      <p>We share data only with the partners required to fulfil your order — our payment processor (Razorpay) and logistics partner — and with our manufacturing and quality partners where legally required. <strong>We do not sell your personal data.</strong></p>

      <h2>Data Security</h2>
      <p>Data is transmitted over encrypted connections and stored on access-controlled infrastructure. While no system is perfectly secure, we apply industry-standard safeguards.</p>

      <h2>Your Rights</h2>
      <p>You may request access to, correction of, or deletion of your personal data at any time by writing to us at <a href="mailto:hello@3tattava.com">hello@3tattava.com</a>.</p>

      <h2>Contact</h2>
      <p>Questions about this policy? Visit our <a href="/contact">Contact page</a> or email <a href="mailto:hello@3tattava.com">hello@3tattava.com</a>.</p>
    </ContentPage>
  );
}
