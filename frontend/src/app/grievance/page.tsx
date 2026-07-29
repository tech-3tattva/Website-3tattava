import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Grievance Redressal | 3TATTAVA",
  description:
    "How to reach us, raise a complaint, and escalate to external consumer remedies if a grievance remains unresolved.",
  alternates: { canonical: "https://www.3tattava.com/grievance" },
};

export default function GrievancePage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Grievance Redressal"
      updated="17 July 2026"
      intro="Reach the right team, submit a complaint, and know exactly how and when we respond, including your external consumer remedies."
    >
      <h2>1. Company details</h2>
      <ul>
        <li>
          <strong>Legal name:</strong> {LEGAL.company}
        </li>
        <li>
          <strong>Brand:</strong> {LEGAL.brand}
        </li>
        <li>
          <strong>CIN:</strong> {LEGAL.cin}
        </li>
        <li>
          <strong>Website:</strong>{" "}
          <a href={LEGAL.website} target="_blank" rel="noopener noreferrer">
            {LEGAL.website}
          </a>
        </li>
        <li>
          <strong>Registered office:</strong> {LEGAL.registeredOffice}
        </li>
        <li>
          <strong>Customer support / correspondence address:</strong>{" "}
          {LEGAL.operationsAddress}
        </li>
      </ul>

      <h2>2. Support channels</h2>
      <ul>
        <li>
          <strong>General, product and privacy support:</strong>{" "}
          <a href={`mailto:${LEGAL.emailGeneral}`}>{LEGAL.emailGeneral}</a>
        </li>
        <li>
          <strong>Orders, delivery, cancellation and refunds:</strong>{" "}
          <a href={`mailto:${LEGAL.emailOrders}`}>{LEGAL.emailOrders}</a>
        </li>
        <li>
          <strong>Customer care mobile:</strong> {LEGAL.careMobile}
        </li>
      </ul>

      <h2>3. Grievance Officer</h2>
      <ul>
        <li>
          <strong>Name:</strong> {LEGAL.grievanceOfficer}
        </li>
        <li>
          <strong>Designation:</strong> Grievance Officer
        </li>
        <li>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${LEGAL.emailGeneral}`}>{LEGAL.emailGeneral}</a>
        </li>
        <li>
          <strong>Mobile:</strong> {LEGAL.careMobile}
        </li>
        <li>
          <strong>Postal address:</strong> {LEGAL.company}, {LEGAL.registeredOffice}
        </li>
      </ul>

      <h2>4. How to submit a complaint</h2>
      <p>
        Include your name, registered email/mobile, order number if applicable, a concise
        description, the remedy requested and supporting material. For a product-quality or safety
        complaint, include the product name, batch number, manufacture/expiry details and relevant
        photographs or information.
      </p>
      <p>We will:</p>
      <ul>
        <li>acknowledge a consumer grievance within 48 hours;</li>
        <li>provide or enable a ticket/reference number where our system supports it; and</li>
        <li>
          aim to redress the grievance within one month from receipt, subject to any shorter
          mandatory timeline and reasonable cooperation required for investigation.
        </li>
      </ul>

      <h2>5. Privacy complaints</h2>
      <p>
        For a privacy request, use the subject <strong>Privacy Request</strong>. We may verify
        identity before disclosing or changing personal data. Where an applicable data-protection law
        provides a complaint to the Data Protection Board of India or another authority, that remedy
        may be used after first exhausting the Company&apos;s grievance process to the extent
        required by law.
      </p>
    </ContentPage>
  );
}
