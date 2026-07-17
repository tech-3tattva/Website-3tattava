import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Intellectual Property Policy | 3TATTAVA",
  description:
    "How the 3Tattava brand, content, and creative assets are protected, and the limited use permitted without prior written permission.",
  alternates: { canonical: "https://www.3tattava.com/intellectual-property" },
};

export default function IntellectualPropertyPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Intellectual Property Policy"
      updated="17 July 2026"
      intro="The brand assets, content, and creative work behind 3Tattava are protected by law. This policy explains what you may do and what requires our written permission."
    >
      <h2>1. Ownership</h2>
      <p>
        Unless stated otherwise, the 3Tattava name and brand assets, product and campaign names,
        logos, packaging artwork, website design, original text, photographs, videos, illustrations,
        audio, graphics, databases, code and marketing materials are owned by or licensed to{" "}
        {LEGAL.company} and are protected by trademark, copyright, design, passing-off and other
        applicable laws.
      </p>
      <p>
        Third-party names and marks belong to their respective owners. Their appearance does not
        imply an endorsement beyond the relationship expressly stated.
      </p>

      <h2>2. Limited permission</h2>
      <p>
        You may view the website and retain a reasonable copy of an invoice or policy for personal,
        non-commercial use. No other licence or transfer of intellectual property is granted.
      </p>

      <h2>3. Restricted uses</h2>
      <p>Without prior written permission, you must not:</p>
      <ul>
        <li>
          reproduce, republish, sell, license, modify, distribute, frame, mirror, scrape or
          commercially exploit protected content;
        </li>
        <li>remove rights notices;</li>
        <li>create misleading derivative branding;</li>
        <li>use content to promote counterfeit or competing goods; or</li>
        <li>
          use substantial website content or proprietary datasets to train or evaluate an
          artificial-intelligence or machine-learning system.
        </li>
      </ul>
      <p>Fair dealing and other rights expressly allowed by applicable law remain unaffected.</p>

      <h2>4. Reporting infringement</h2>
      <p>
        To report suspected infringement involving 3Tattava assets, or to notify us of content on
        our website that you believe infringes your rights, email{" "}
        <a href={`mailto:${LEGAL.emailGeneral}`}>{LEGAL.emailGeneral}</a> with identification of the
        work/right, the disputed material and URL, your contact information, and a statement
        explaining the basis of the claim.
      </p>
    </ContentPage>
  );
}
