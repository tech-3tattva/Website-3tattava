import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";

export const metadata: Metadata = {
  title: "Terms of Service | 3TATTAVA",
  description: "The terms governing your use of the 3TATTAVA website and purchase of our products.",
  alternates: { canonical: "https://www.3tattava.com/terms" },
};

export default function TermsPage() {
  return (
    <ContentPage eyebrow="Legal" title="Terms of Service" updated="June 2026" intro="By using this website or purchasing our products, you agree to the terms below.">
      <h2>Eligibility</h2>
      <p>Our products are intended for individuals aged 16 and above. By placing an order you confirm you meet this requirement.</p>

      <h2>Products &amp; Wellness Disclaimer</h2>
      <p>3TATTAVA products are <strong>dietary wellness products</strong>, not medicines. They are not intended to diagnose, treat, cure, or prevent any disease. Information on this site is educational and does not constitute medical advice. Consult a qualified physician before use if you have a medical condition, are pregnant or breastfeeding, or take regular medication.</p>

      <h2>Orders &amp; Payment</h2>
      <ul>
        <li>Orders are <strong>prepaid</strong> and confirmed once payment is successfully processed through Razorpay.</li>
        <li>Prices are listed in INR and may change without notice; the price at checkout applies to your order.</li>
        <li>We reserve the right to cancel orders in cases of suspected fraud, pricing errors, or stock unavailability, with a full refund.</li>
      </ul>

      <h2>Intellectual Property</h2>
      <p>All content, branding, copy, and imagery on this site are the property of 3TATTAVA and may not be reproduced without permission.</p>

      <h2>Limitation of Liability</h2>
      <p>To the extent permitted by law, 3TATTAVA is not liable for indirect or consequential damages arising from the use of this site or our products. Individual results vary.</p>

      <h2>Governing Law</h2>
      <p>These terms are governed by the laws of India. Disputes are subject to the jurisdiction of the courts of Delhi.</p>

      <h2>Contact</h2>
      <p>Questions? Reach us via the <a href="/contact">Contact page</a> or <a href="mailto:hello@3tattava.com">hello@3tattava.com</a>.</p>
    </ContentPage>
  );
}
