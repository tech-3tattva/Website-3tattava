import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Shipping & Delivery | 3TATTAVA",
  description:
    "How 3TATTAVA processes, dispatches, tracks and delivers orders to serviceable PIN codes across India.",
  alternates: { canonical: "https://www.3tattava.com/shipping" },
};

export default function ShippingPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Shipping and Delivery Policy"
      updated="17 July 2026"
      intro={`How ${LEGAL.company} processes, dispatches, tracks and delivers orders to serviceable PIN codes across India, and how we handle delayed, damaged or missing parcels.`}
    >
      <h2>1. Service area</h2>
      <p>
        We currently deliver to serviceable PIN codes within India.
        Serviceability is checked at checkout or before dispatch. We do not
        promise international delivery unless it is expressly enabled for the
        order.
      </p>

      <h2>2. Order processing and dispatch</h2>
      <ul>
        <li>
          Prepaid orders are ordinarily processed and dispatched within 1-2
          business days after successful payment confirmation.
        </li>
        <li>
          Orders placed on Sundays, public holidays or during announced closures
          are processed on the next working day.
        </li>
        <li>
          Processing may take longer during launches, major sales, stock
          verification, regulatory checks or exceptional events. Any material
          delay will be communicated where reasonably possible.
        </li>
      </ul>
      <p>
        &quot;Business day&quot; means a day other than Sunday or a public
        holiday at our dispatch location.
      </p>

      <h2>3. Estimated delivery</h2>
      <p>
        Delivery estimates depend on the PIN code and logistics provider. Delhi
        NCR orders ordinarily arrive within 2-4 business days after dispatch.
        Estimates for other locations are shown at checkout, in dispatch
        communication or by the carrier and are estimates rather than
        guarantees.
      </p>
      <p>
        If a product is delivered materially later than the stated schedule for
        reasons not caused by force majeure or the customer&rsquo;s
        incorrect/unavailable delivery details, applicable remedies under the
        Returns and Refunds Policy and consumer law remain available.
      </p>

      <h2>4. Shipping charges</h2>
      <p>
        Any shipping charge, free-shipping threshold or location surcharge will
        be clearly displayed before the final purchase action. We will not add
        an undisclosed delivery charge after order confirmation.
      </p>

      <h2>5. Tracking</h2>
      <p>
        After dispatch, tracking information is normally sent to the registered
        email, mobile number or WhatsApp account. Tracking may take several
        hours to update after handover to the carrier.
      </p>

      <h2>6. Address and contact accuracy</h2>
      <p>
        You are responsible for providing a complete name, mobile number,
        house/street details, landmark where needed and correct PIN code. Send
        an address-correction request to{" "}
        <a href={`mailto:${LEGAL.emailOrders}`}>{LEGAL.emailOrders}</a> as soon
        as possible. We will try to update an order before handover, but cannot
        guarantee a change after dispatch.
      </p>
      <p>
        We will never ask you to share an OTP, UPI PIN, CVV or account password
        merely to complete delivery.
      </p>

      <h2>7. Delivery attempts and return to origin</h2>
      <p>
        The carrier may contact you and make delivery attempts under its
        standard process. If delivery fails because the recipient is repeatedly
        unavailable, refuses the parcel without a valid product issue, or
        provided an incorrect/incomplete address, the parcel may be returned to
        origin. Re-dispatch may require confirmation of the address and payment
        of an actual additional shipping charge disclosed to you in advance.
        This does not affect rights relating to a defective, damaged, wrong or
        misdescribed product.
      </p>

      <h2>8. Tampered, damaged or missing parcel</h2>
      <p>
        Do not accept a parcel that is visibly opened, leaking or materially
        tampered with where refusal is practical. If accepted or left at the
        address, photograph or record the outer package and contents and contact{" "}
        <a href={`mailto:${LEGAL.emailOrders}`}>{LEGAL.emailOrders}</a>{" "}
        preferably within 48 hours of delivery. Keep the packaging, label and
        affected product until the claim is resolved.
      </p>

      <h2>9. Delay or loss in transit</h2>
      <p>
        If tracking has not moved for an unusual period or a parcel is marked
        delivered but not received, contact us with the order number. We will
        coordinate with the carrier and provide an update. Where a shipment is
        confirmed lost, we will offer a replacement or refund, subject to your
        statutory rights.
      </p>

      <h2>10. Contact</h2>
      <p>
        For delivery support, email{" "}
        <a href={`mailto:${LEGAL.emailOrders}`}>{LEGAL.emailOrders}</a> with the
        order number and registered mobile number.
      </p>
    </ContentPage>
  );
}
