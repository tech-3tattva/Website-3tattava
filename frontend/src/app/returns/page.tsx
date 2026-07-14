import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";

export const metadata: Metadata = {
  title: "Returns & Refunds | 3TATTAVA",
  description: "Our returns, replacement, and refund policy for 3TATTAVA products.",
  alternates: { canonical: "https://www.3tattava.com/returns" },
};

export default function ReturnsPage() {
  return (
    <ContentPage eyebrow="Support" title="Returns & Refunds" updated="June 2026" intro="Consumable wellness products require care around hygiene and safety — here's how we handle returns fairly.">
      <h2>Damaged or Incorrect Orders</h2>
      <p>If your order arrives <strong>damaged, tampered, or incorrect</strong>, contact us within <strong>48 hours</strong> of delivery with your order number and a photo. We&apos;ll arrange a replacement or full refund — no friction.</p>

      <h2>Sealed-Product Policy</h2>
      <p>For safety and hygiene reasons, <strong>opened or used</strong> consumable products cannot be returned. Unopened products in original, sealed packaging may be eligible for return within <strong>7 days</strong> of delivery.</p>

      <h2>Refunds</h2>
      <ul>
        <li>Approved refunds are processed to your <strong>original payment method via Razorpay</strong>.</li>
        <li>Refunds typically reflect within <strong>5–7 working days</strong> of approval.</li>
      </ul>

      <h2>Address Changes &amp; Cancellations</h2>
      <p>Orders can be modified or cancelled within the <strong>24-hour window</strong> before dispatch. Once dispatched, an order follows the returns process above.</p>

      <h2>Raise a Concern</h2>
      <p>Start a return or report an issue via the <a href="/contact">Contact page</a> or email <a href="mailto:orders@3tattava.com">orders@3tattava.com</a>.</p>
    </ContentPage>
  );
}
