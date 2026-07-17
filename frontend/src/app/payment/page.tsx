import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Payment Policy | 3TATTAVA",
  description:
    "How 3TATTAVA accepts, processes and secures payments, and how failed, duplicate, pending, and refunded payments are handled.",
  alternates: { canonical: "https://www.3tattava.com/payment" },
};

export default function PaymentPolicyPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Payment Policy"
      updated="17 July 2026"
      intro="How we accept, process and secure payments for your order — and what happens if a payment fails, is charged twice, or needs a refund."
    >
      <h2>1. Currency and methods</h2>
      <p>
        Payments are accepted in Indian Rupees through the methods displayed at checkout, which may include UPI, credit card, debit card, net banking and supported wallets. Availability depends on the payment provider and issuing institution.
      </p>

      <h2>2. Payment processing and security</h2>
      <p>
        Online payments are processed through authorised third-party payment gateways, currently including Razorpay where shown at checkout. The gateway and participating bank/payment system process full card, UPI PIN, CVV or net-banking credentials. {LEGAL.brand} ordinarily receives transaction status, reference and limited method information and does not store full payment credentials. Razorpay&rsquo;s payment-support channel is available at{" "}
        <a href="https://razorpay.com/support/">https://razorpay.com/support/</a>; your bank, card issuer or UPI application also provides its own dispute and chargeback process.
      </p>
      <p>
        Payment-provider terms, security checks and privacy notices also apply to their independent processing.
      </p>

      <h2>3. Confirmation, failed and pending payments</h2>
      <p>
        An order is treated as paid only after successful confirmation from the payment system. If an amount is debited but the order is not confirmed, contact{" "}
        <a href={`mailto:${LEGAL.emailOrders}`}>{LEGAL.emailOrders}</a> with the payment reference. Bank or gateway reconciliation may take time. A failed transaction is ordinarily reversed by the bank/payment provider under its applicable timeline.
      </p>

      <h2>4. Duplicate payment</h2>
      <p>
        If the same order is charged more than once and duplicate receipt is verified, we will initiate reversal of the duplicate amount to the relevant payment method.
      </p>

      <h2>5. Fraud prevention</h2>
      <p>
        We or the payment provider may request reasonable verification, place an order on hold or cancel it where there is a credible fraud, unauthorised-payment or security concern. Never share an OTP, UPI PIN, CVV or account password with anyone claiming to be {LEGAL.brand} support.
      </p>

      <h2>6. Recurring payments</h2>
      <p>
        A subscription or recurring debit will be created only through a separate, explicit mandate. The amount, frequency and cancellation method must be shown before authorisation. Cancelling a recurring mandate does not automatically cancel an order already accepted or dispatched.
      </p>

      <h2>7. Refunds and chargebacks</h2>
      <p>
        Refund eligibility is governed by the <a href="/returns">Returns and Refunds Policy</a>. Approved refunds are sent through the original payment route unless another lawful method is agreed. Contact us first so that we can investigate an issue promptly; this does not prevent use of a lawful bank, payment-system or consumer remedy.
      </p>

      <h2>8. Invoice</h2>
      <p>
        An electronic or physical tax invoice will be provided as required by law using the order information supplied by you.
      </p>
    </ContentPage>
  );
}
