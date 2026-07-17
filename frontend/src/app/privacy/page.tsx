import type { Metadata } from "next";
import type { CSSProperties } from "react";
import ContentPage from "@/components/layout/ContentPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy | 3TATTAVA",
  description:
    "How 3TATTAVA collects, uses, stores, shares and protects your personal data.",
  alternates: { canonical: "https://www.3tattava.com/privacy" },
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  margin: "0 0 18px",
  fontSize: 14,
};
const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "2px solid #cd872a",
  color: "#442a1b",
  fontWeight: 700,
  verticalAlign: "top",
};
const tdStyle: CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid #e4d6bf",
  color: "#6f5a48",
  verticalAlign: "top",
  lineHeight: 1.6,
};

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="17 July 2026"
      intro={`How ${LEGAL.company} collects, uses, stores, shares and protects your personal data across our website and related digital services.`}
    >
      <h2>1. Introduction</h2>
      <p>
        This Privacy Policy explains how {LEGAL.company} (&quot;3Tattava&quot;,
        &quot;Company&quot;, &quot;we&quot;, &quot;us&quot; or &quot;our&quot;)
        collects, uses, stores, shares and protects personal data when you visit
        www.3tattava.com, create an account, place an order, contact us,
        subscribe to communications, complete a wellness or performance
        assessment, use VaidyaConnect or otherwise interact with our website and
        related digital services (collectively, the &quot;Services&quot;).
      </p>
      <p>
        For applicable data-protection law, the Company is the entity that
        determines why and how your personal data is processed.
      </p>
      <p>
        By providing personal data to us, you confirm that the information is
        yours or that you are authorised to provide it. Where consent is
        required, we will seek it through a clear affirmative action. You may
        withdraw consent as described below.
      </p>

      <h2>2. Personal data we may collect</h2>
      <p>
        We collect only the personal data reasonably required for the purposes
        stated in this Policy.
      </p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Examples</th>
            <th style={thStyle}>Typical source</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>Identity and contact data</td>
            <td style={tdStyle}>
              Name, email address, mobile/WhatsApp number, age or age
              confirmation
            </td>
            <td style={tdStyle}>Directly from you</td>
          </tr>
          <tr>
            <td style={tdStyle}>Account data</td>
            <td style={tdStyle}>
              Login identifier, account preferences and saved details
            </td>
            <td style={tdStyle}>
              Directly from you and through your account activity
            </td>
          </tr>
          <tr>
            <td style={tdStyle}>Order and transaction data</td>
            <td style={tdStyle}>
              Products ordered, order number, invoice details, discounts,
              payment status, cancellations, returns and order history
            </td>
            <td style={tdStyle}>From you and our commerce/payment systems</td>
          </tr>
          <tr>
            <td style={tdStyle}>Delivery data</td>
            <td style={tdStyle}>
              Shipping and billing address, PIN code, delivery instructions and
              shipment status
            </td>
            <td style={tdStyle}>From you and logistics partners</td>
          </tr>
          <tr>
            <td style={tdStyle}>Payment-related data</td>
            <td style={tdStyle}>
              Payment method, transaction reference, payment confirmation and
              refund status
            </td>
            <td style={tdStyle}>
              Payment gateway; we do not ordinarily receive or store full card,
              CVV, UPI PIN or net-banking credentials
            </td>
          </tr>
          <tr>
            <td style={tdStyle}>Communications</td>
            <td style={tdStyle}>
              Emails, calls, WhatsApp or chat messages, enquiries, support
              requests, feedback and survey responses
            </td>
            <td style={tdStyle}>
              Directly from you and communication providers
            </td>
          </tr>
          <tr>
            <td style={tdStyle}>Optional wellness data</td>
            <td style={tdStyle}>
              Information voluntarily provided through a consultation or
              assessment, such as lifestyle, diet, health goals, symptoms,
              allergies, medication, medical history or other health-related
              information
            </td>
            <td style={tdStyle}>
              Directly from you, with specific notice/consent where required
            </td>
          </tr>
          <tr>
            <td style={tdStyle}>Product-quality and safety data</td>
            <td style={tdStyle}>
              Complaint details, photographs or videos, batch number, use
              details, symptoms and adverse-event information
            </td>
            <td style={tdStyle}>Directly from you</td>
          </tr>
          <tr>
            <td style={tdStyle}>Technical and usage data</td>
            <td style={tdStyle}>
              IP address, browser, device type, operating system, referring
              page, pages viewed, approximate location derived from IP,
              timestamps, session and security logs
            </td>
            <td style={tdStyle}>
              Automatically from your device and service providers
            </td>
          </tr>
          <tr>
            <td style={tdStyle}>Cookie and marketing data</td>
            <td style={tdStyle}>
              Cookie identifiers, consent choices, campaign source, ad
              interactions and communication preferences
            </td>
            <td style={tdStyle}>
              Cookies, pixels and similar technologies, subject to your choices
            </td>
          </tr>
          <tr>
            <td style={tdStyle}>User content</td>
            <td style={tdStyle}>
              Product reviews, testimonials, comments or other material you
              choose to submit
            </td>
            <td style={tdStyle}>Directly from you</td>
          </tr>
        </tbody>
      </table>
      <p>
        We do not intentionally request Aadhaar numbers, government identity
        documents, full payment credentials or unrelated medical records unless
        a specific lawful requirement is first explained to you.
      </p>

      <h2>3. How we use personal data</h2>
      <p>We may process personal data to:</p>
      <ul>
        <li>provide the Services and operate the website;</li>
        <li>create and administer customer accounts;</li>
        <li>verify, accept, process, fulfil, deliver and track orders;</li>
        <li>process payments, refunds, returns, replacements and invoices;</li>
        <li>
          send essential order, payment, delivery, safety, recall and service
          communications;
        </li>
        <li>answer enquiries and provide customer support;</li>
        <li>
          provide a requested wellness assessment, product-use guidance or
          VaidyaConnect interaction, without using optional health data for
          unrelated advertising unless you separately consent;
        </li>
        <li>
          investigate product-quality complaints, suspected adverse reactions,
          counterfeit/tampering concerns and recalls, including coordination
          with the licensed manufacturer, laboratory, logistics provider or
          regulator where necessary;
        </li>
        <li>
          prevent fraud, misuse, unauthorised transactions, cyber incidents and
          violations of our Terms;
        </li>
        <li>
          secure, maintain, troubleshoot, analyse and improve the website,
          products and customer experience;
        </li>
        <li>
          measure website performance and campaigns using non-essential cookies
          where you have made the required choice;
        </li>
        <li>
          send newsletters, educational content, offers and promotional
          communications where you have opted in or where otherwise permitted by
          law;
        </li>
        <li>
          comply with accounting, tax, product traceability, pharmacovigilance,
          consumer protection, legal, regulatory and law-enforcement
          obligations; and
        </li>
        <li>establish, exercise or defend legal claims.</li>
      </ul>
      <p>
        We process personal data only for lawful, specified purposes, based on
        your consent, your request or transaction with us, voluntarily provided
        information needed to fulfil a stated purpose, or an applicable legal
        obligation or permitted use.
      </p>

      <h2>4. Transactional and marketing communications</h2>
      <p>
        Order confirmations, payment alerts, shipment updates, recall or safety
        notices and responses to your requests are service communications and
        may be sent by email, SMS, WhatsApp, telephone or another channel you
        provide.
      </p>
      <p>
        Marketing communications are optional. You may unsubscribe by using the
        link in the message, replying with the stated opt-out instruction,
        changing your preferences where available or writing to{" "}
        <a href={`mailto:${LEGAL.emailGeneral}`}>{LEGAL.emailGeneral}</a>.
        Opting out of marketing does not stop necessary service communications.
      </p>

      <h2>5. Cookies and similar technologies</h2>
      <p>
        We use cookies and similar technologies as explained in our{" "}
        <a href="/cookies">Cookie Policy</a>. Strictly necessary cookies may
        operate because they are required for security, checkout, consent
        choices and core website functions. Analytics, personalisation and
        advertising cookies operate only after the required affirmative choice.
        You can review or change non-essential cookie choices through the
        website&rsquo;s Cookie Settings control.
      </p>

      <h2>6. How we share personal data</h2>
      <p>
        We do not sell or rent personal data. We may disclose only the data
        reasonably necessary to the following recipients:
      </p>
      <ul>
        <li>payment gateways, banks and payment-system participants;</li>
        <li>
          courier, warehousing, address-verification and logistics providers;
        </li>
        <li>
          website hosting, cloud storage, cybersecurity, analytics,
          customer-support, email, SMS, WhatsApp and other technology providers;
        </li>
        <li>
          advertising or measurement providers, but only in accordance with
          applicable consent choices;
        </li>
        <li>
          the licensed manufacturer, quality-control laboratory, testing
          partner, insurer or professional adviser when required to investigate
          a product-quality, safety, adverse-event or recall matter;
        </li>
        <li>
          accountants, auditors, lawyers and other advisers bound by
          confidentiality obligations;
        </li>
        <li>
          government departments, courts, regulators, licensing authorities or
          law-enforcement agencies where disclosure is required or permitted by
          law; and
        </li>
        <li>
          a successor or transaction counterparty in a genuine merger,
          restructuring, financing or transfer of business, subject to
          appropriate confidentiality and legal safeguards.
        </li>
      </ul>
      <p>
        Our service providers are authorised to process personal data only for
        the contracted services or other lawful instructions and are expected to
        apply appropriate safeguards.
      </p>

      <h2>7. International processing</h2>
      <p>
        Some technology, cloud, analytics, communication or payment providers
        may process or store data outside India. Where this occurs, we will take
        reasonable steps to ensure that the transfer and processing comply with
        applicable Indian law, contractual safeguards and any restriction or
        direction issued by the Central Government.
      </p>

      <h2>8. Data retention</h2>
      <p>
        We retain personal data only for as long as needed for the stated
        purpose or as required by applicable law. The period depends on the type
        of record and may include:
      </p>
      <ul>
        <li>
          account data while the account remains active and for a reasonable
          period after closure;
        </li>
        <li>
          order, payment, invoice, delivery and refund records for applicable
          tax, accounting, consumer and legal-retention periods;
        </li>
        <li>
          transaction, security and processing logs for at least the minimum
          period required by applicable law and longer where necessary for
          security, fraud prevention or a legal claim;
        </li>
        <li>
          batch-distribution, quality complaint, adverse-event and recall
          records for periods required under applicable drug, quality and
          pharmacovigilance requirements;
        </li>
        <li>
          support communications until the matter is resolved and for a
          reasonable recordkeeping period; and
        </li>
        <li>
          marketing contact data until you opt out, after which limited
          suppression data may be retained so that we can honour the opt-out.
        </li>
      </ul>
      <p>
        We may retain anonymised or aggregated information that no longer
        identifies you.
      </p>

      <h2>9. Security</h2>
      <p>
        We use reasonable technical and organisational safeguards appropriate to
        the nature of the data, which may include encryption in transit, access
        controls, credential controls, logging, monitoring, backups,
        service-provider commitments and incident-response procedures. Payment
        credentials are processed through authorised third-party payment systems
        rather than stored by us in full.
      </p>
      <p>
        No internet transmission or storage system is completely secure. You are
        responsible for keeping account credentials and one-time passwords
        confidential and for notifying us promptly of suspected unauthorised
        use.
      </p>

      <h2>10. Personal-data breaches</h2>
      <p>
        If we become aware of a personal-data breach, we will investigate,
        mitigate and make notifications to affected individuals and competent
        authorities when and in the manner required by applicable law.
      </p>

      <h2>11. Your choices and rights</h2>
      <p>Subject to applicable law and verification, you may request to:</p>
      <ul>
        <li>
          obtain information about personal data we process about you and the
          persons or categories with whom it has been shared;
        </li>
        <li>access a summary or copy where applicable;</li>
        <li>
          correct, complete or update inaccurate or incomplete personal data;
        </li>
        <li>
          erase personal data that is no longer required, subject to lawful
          retention and other exceptions;
        </li>
        <li>
          withdraw consent with ease comparable to the method used to provide
          it;
        </li>
        <li>
          opt out of marketing communications and control non-essential cookies;
        </li>
        <li>raise a grievance about our processing; and</li>
        <li>
          nominate another individual to exercise applicable data rights in the
          event of death or incapacity, where this right is in force and
          applicable.
        </li>
      </ul>
      <p>
        Send a request to{" "}
        <a href={`mailto:${LEGAL.emailGeneral}`}>{LEGAL.emailGeneral}</a> with
        the subject <strong>Privacy Request</strong> and provide the email
        address or mobile number associated with your interaction. We may
        request limited information to verify identity and prevent unauthorised
        disclosure. Rights are not absolute; for example, we may retain
        invoices, transaction, fraud, safety, complaint or legal records where
        required.
      </p>
      <p>
        Withdrawal of consent does not affect processing already lawfully
        completed. If data is necessary to provide a requested service,
        withdrawing or withholding it may prevent us from providing that part of
        the Service.
      </p>

      <h2>12. Children</h2>
      <p>
        The website and direct purchasing facility are intended for adults aged
        18 years or above. We do not knowingly create customer accounts for,
        target behavioural advertising to, or solicit personal data from
        children. A parent or lawful guardian should place any permitted order
        for a person below 18 only after checking the product label and
        obtaining appropriate professional advice.
      </p>
      <p>
        If you believe a child has provided personal data without valid parental
        consent, contact us at{" "}
        <a href={`mailto:${LEGAL.emailGeneral}`}>{LEGAL.emailGeneral}</a>. We
        will take appropriate steps consistent with applicable law.
      </p>

      <h2>13. Third-party sites and services</h2>
      <p>
        The Services may contain links to third-party websites, social networks,
        payment pages or communication tools. Their privacy practices are
        governed by their own notices. We are not responsible for a third
        party&rsquo;s independent processing.
      </p>

      <h2>14. Changes to this Policy</h2>
      <p>
        We may update this Policy to reflect changes in law, technology or our
        Services. The revised version will be posted with a new &quot;Last
        updated&quot; date. Where a change materially affects an existing consent
        or your rights, we will provide additional notice or seek fresh consent
        where required.
      </p>

      <h2>15. Privacy contact and grievance redressal</h2>
      <p>
        <strong>Privacy and Grievance Officer:</strong> {LEGAL.grievanceOfficer}
        <br />
        <strong>Designation:</strong> Grievance Officer
        <br />
        <strong>Email:</strong>{" "}
        <a href={`mailto:${LEGAL.emailGeneral}`}>{LEGAL.emailGeneral}</a>
        <br />
        <strong>Mobile:</strong> {LEGAL.careMobile}
        <br />
        <strong>Postal address:</strong> {LEGAL.company}, {LEGAL.registeredOffice}
      </p>
      <p>
        We will acknowledge a grievance within 48 hours and aim to resolve it as
        soon as reasonably possible and, in any event, within the period
        required by applicable law. Where a complaint falls within an applicable
        data-protection regime, you may pursue the remedy available under that
        regime after first using our grievance process.
      </p>
    </ContentPage>
  );
}
