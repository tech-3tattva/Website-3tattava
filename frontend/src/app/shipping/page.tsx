import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";

export const metadata: Metadata = {
  title: "Shipping & Delivery | 3TATTAVA",
  description: "Dispatch timelines, delivery partners, tracking, and Experience Center pickup for 3TATTAVA orders.",
  alternates: { canonical: "https://www.3tattava.com/shipping" },
};

export default function ShippingPage() {
  return (
    <ContentPage eyebrow="Support" title="Shipping & Delivery" updated="June 2026" intro="How your ritual reaches you — clearly, and on time.">
      <h2>Prepaid Orders</h2>
      <p>To protect product integrity and keep prices fair, all orders are <strong>prepaid</strong>. Once payment is confirmed, your order enters dispatch.</p>

      <h2>Dispatch &amp; Delivery</h2>
      <ul>
        <li>Orders are typically dispatched within <strong>24–48 hours</strong> of confirmation.</li>
        <li>Delivery across India is handled by our logistics partner; Delhi NCR orders usually arrive within <strong>2–4 working days</strong>.</li>
        <li>You receive automated delivery updates over <strong>WhatsApp and email</strong> as your order moves.</li>
      </ul>

      <h2>Pick Up In Person</h2>
      <p>Prefer to collect today? All products are stocked at our <a href="/find-us">WTF Experience Centers across Delhi NCR</a> for same-day availability — no delivery wait for your first ritual.</p>

      <h2>Address Changes</h2>
      <p>Need to correct a delivery address? You have a <strong>24-hour window</strong> after ordering to update it — contact us as early as possible and we&apos;ll do our best before dispatch.</p>

      <h2>Questions</h2>
      <p>Track an order from the <a href="/track-order">Track Order</a> page, or reach us via <a href="/contact">Contact</a>.</p>
    </ContentPage>
  );
}
