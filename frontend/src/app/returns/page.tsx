import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Cancellation, Returns & Refunds | 3TATTAVA",
  description:
    "How to cancel an order and when a return, replacement or refund is available for products bought from 3TATTAVA.",
  alternates: { canonical: "https://www.3tattava.com/returns" },
};

export default function ReturnsPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Cancellation, Returns, Replacements and Refunds Policy"
      updated="17 July 2026"
      intro={`How to cancel an order, and when a return, replacement or refund is available for products bought from ${LEGAL.company}, while preserving every remedy you are entitled to under applicable law.`}
    >
      <h2>1. Purpose</h2>
      <p>
        Medicines and ingestible products require strict hygiene, tamper-control
        and traceability. This Policy protects those requirements while
        preserving all remedies that consumers are entitled to under applicable
        law.
      </p>

      <h2>2. Cancellation before dispatch</h2>
      <p>
        You may request cancellation before dispatch by emailing{" "}
        <a href={`mailto:${LEGAL.emailOrders}`}>{LEGAL.emailOrders}</a> with the
        order number. A request is effective once confirmed by us. If the parcel
        has already been handed to the carrier, the return rules below apply.
      </p>
      <p>
        We do not impose a cancellation charge unless a similar actual charge
        would also be borne by us for a unilateral cancellation and such charge
        is permitted and disclosed under applicable law. If we cancel a paid
        order, we will initiate a full refund.
      </p>

      <h2>3. When a return, replacement or refund is available</h2>
      <p>Contact us if a product is:</p>
      <ul>
        <li>damaged, leaking or materially tampered with on delivery;</li>
        <li>
          incorrect, missing from the shipment or different from the item
          ordered;
        </li>
        <li>expired at delivery;</li>
        <li>
          defective, deficient, suspected to be spurious or affected by a
          manufacturing/quality defect;
        </li>
        <li>
          materially different from the characteristics or features advertised
          or agreed; or
        </li>
        <li>
          delivered materially later than the stated schedule, except where the
          delay is due to force majeure or your incorrect/unavailable delivery
          details.
        </li>
      </ul>
      <p>
        For these cases, the fact that the outer package or product was opened
        for reasonable inspection or that some product was used before a latent
        defect became apparent does not automatically bar a claim.
      </p>

      <h2>4. Reporting period and evidence</h2>
      <p>
        For visible transit damage, tampering, wrong/missing items or an expired
        product, contact us preferably within 48 hours of delivery so that
        carrier evidence can be preserved. Include:
      </p>
      <ul>
        <li>order number and registered contact details;</li>
        <li>a short description of the issue;</li>
        <li>
          clear photographs or video of the outer shipping label, package, seal
          and product; and
        </li>
        <li>
          batch number, manufacturing/expiry details and quantity affected.
        </li>
      </ul>
      <p>
        The 48-hour request is an evidence-preservation period and does not
        extinguish a non-waivable statutory right or a later-discovered
        manufacturing defect, safety complaint or adverse-event report.
      </p>

      <h2>5. Unopened change-of-mind return</h2>
      <p>
        You may request a return of an unused product within 7 calendar days of
        delivery if the original product seal, container, label and outer
        packaging are intact and the product is in resalable condition. Approval
        is subject to inspection and lawful hygiene/safety requirements. Unless
        the return is due to our error or a product issue, actual return
        shipping may be deducted after being disclosed and accepted.
      </p>
      <p>
        Opened or used medicines/ingestible products are not eligible for a
        change-of-mind return because they cannot safely be restocked. This
        exclusion does not apply to a valid defect, misdescription, quality,
        safety or adverse-event complaint.
      </p>

      <h2>6. Non-returnable situations</h2>
      <p>A return may be declined where:</p>
      <ul>
        <li>
          the issue results from misuse, improper storage or damage after
          delivery;
        </li>
        <li>
          the batch/expiry/identity label has been removed or altered without a
          valid reason;
        </li>
        <li>
          the product is opened or used and the request is only based on taste
          preference, change of mind or absence of a guaranteed personal
          outcome;
        </li>
        <li>
          normal variation in a natural product does not affect its approved
          quality or safety; or
        </li>
        <li>
          the item was a free sample or gift, except where it is defective,
          unsafe, wrong or otherwise protected by mandatory law.
        </li>
      </ul>
      <p>We will provide a reason if a claim is declined.</p>

      <h2>7. Review and resolution</h2>
      <p>
        We may request reasonable additional evidence, arrange reverse pickup or
        ask that the product be sent to a specified address. Do not send a
        product without return authorisation. The returned product may be
        inspected and, for a quality complaint, shared with the licensed
        manufacturer or testing laboratory.
      </p>
      <p>For an accepted claim, the available resolution may include:</p>
      <ul>
        <li>replacement of the affected product at no additional charge;</li>
        <li>
          refund of the amount paid for the affected product and applicable
          delivery charge; or
        </li>
        <li>another remedy agreed with you and permitted by law.</li>
      </ul>
      <p>
        Where applicable law entitles you to a refund for a defective,
        deficient, spurious, misdescribed or materially non-conforming product,
        we will not force store credit in its place.
      </p>

      <h2>8. Refund method and timing</h2>
      <p>
        Approved refunds are initiated to the original payment method, unless
        another lawful method is agreed. We ordinarily initiate the refund
        within 5-7 business days after approval or receipt/inspection of a
        required return. The bank, card network, UPI app or payment provider may
        require additional time to display the credit.
      </p>
      <p>
        For an order purchased using a discount, the refund will not exceed the
        amount actually paid for the returned item, plus any delivery charge
        refundable under this Policy or law.
      </p>

      <h2>9. Product-quality complaint or suspected adverse reaction</h2>
      <p>
        If you suspect an adverse reaction, stop using the product and seek
        prompt medical advice. For a severe reaction or emergency, contact local
        emergency services immediately; do not wait for a customer-support
        reply.
      </p>
      <p>
        Report the matter to{" "}
        <a href={`mailto:${LEGAL.emailGeneral}`}>{LEGAL.emailGeneral}</a> with
        the product name, batch number, order/source, dose/use, dates, symptoms,
        relevant medical or medication context you choose to provide, and
        photographs where useful. Preserve the product and packaging if safe to
        do so.
      </p>
      <p>
        We may document, investigate and share necessary information with the
        licensed manufacturer, quality laboratory, insurer, pharmacovigilance
        centre or competent authority. Health-related information will be handled
        under the Privacy Policy. Reporting a suspected reaction does not by
        itself prove that the product caused it.
      </p>

      <h2>10. Contact and complaint timeline</h2>
      <p>
        Email{" "}
        <a href={`mailto:${LEGAL.emailOrders}`}>{LEGAL.emailOrders}</a> for
        return/refund matters and{" "}
        <a href={`mailto:${LEGAL.emailGeneral}`}>{LEGAL.emailGeneral}</a> for
        quality or safety matters. We will acknowledge a consumer complaint
        within 48 hours and aim to resolve it within one month, subject to any
        faster or different period required by law.
      </p>
    </ContentPage>
  );
}
