import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Use & Sale | 3TATTAVA",
  description: "The terms governing your access to www.3tattava.com and your purchase of 3Tattava products.",
  alternates: { canonical: "https://www.3tattava.com/terms" },
};

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Terms of Use & Sale"
      updated="17 July 2026"
      intro="These Terms of Use and Sale govern your access to www.3tattava.com and purchases from us. By using the website, creating an account or placing an order, you agree to them."
    >
      <h2>1. Acceptance</h2>
      <p>These Terms of Use and Sale (&quot;Terms&quot;) govern access to www.3tattava.com and purchases from {LEGAL.company}, trading under the brand 3Tattava. By using the website, creating an account or placing an order, you agree to these Terms, the Privacy Policy, Shipping Policy, Cancellation/Returns/Refund Policy and any product-specific terms shown before purchase.</p>
      <p>If you do not agree, do not use the website or place an order.</p>

      <h2>2. Eligibility</h2>
      <p>You must be at least 18 years old and capable of entering a binding contract to create an account or place an order. A parent or lawful guardian must place any permitted order intended for a person below 18, subject to the product label and appropriate professional advice.</p>

      <h2>3. Accounts and information</h2>
      <p>You must provide accurate, current and complete information and keep login credentials confidential. You are responsible for activity carried out through your account unless caused by our breach or system failure. Notify us promptly of suspected unauthorised access.</p>
      <p>We may decline or suspend an account where reasonably necessary to address fraud, abuse, security, legal non-compliance or material breach of these Terms.</p>

      <h2>4. Product classification and information</h2>
      <p>3Tattava sells products under the legal category stated on each product label and product page. Products classified as Ayurvedic medicines, including Ayurvedic proprietary medicines, are regulated as medicines under applicable Indian law and are not represented as FSSAI food supplements. If the Company later sells a separately licensed food, nutraceutical, cosmetic or other product, that product&apos;s own label and licence category will apply.</p>
      <p>The product label is the primary source for the legal name, classification, ingredients, dosage or directions, warnings, storage, net quantity, batch number, manufacture/expiry or best-before information, MRP, licence particulars and manufacturer/marketer details. Website descriptions must be read together with the label and must not be understood as expanding the approved product indication or claim.</p>
      <p>Natural ingredients may show normal, non-material variations in colour, aroma, taste or consistency from batch to batch. Such variation is not automatically a defect if the product remains within approved quality specifications.</p>

      <h2>5. Medical and wellness information</h2>
      <p>Website content, articles, assessments, FAQs, videos, testimonials and general product guidance are educational and do not replace an individual diagnosis, prescription or treatment plan. They do not create a doctor-patient relationship unless a separate professional consultation is expressly booked and accepted.</p>
      <p>Use products only as directed on the label or by a qualified healthcare professional. Read the Medical and Product Disclaimer before purchase and use.</p>

      <h2>6. Product display, availability and correction of errors</h2>
      <p>We make reasonable efforts to display products and information accurately, but screen colours, packaging updates or minor layout differences may occur. Product availability is not guaranteed until the order is accepted. We may correct genuine typographical, technical, pricing or inventory errors. If an error affects a placed order, we will inform you and offer the lawful options, including cancellation and a full refund where appropriate.</p>

      <h2>7. Orders and acceptance</h2>
      <p>Submitting an order is an offer to purchase. The automated acknowledgement confirms receipt, not final acceptance. An order is accepted when we issue dispatch confirmation or otherwise expressly confirm acceptance.</p>
      <p>We may refuse or cancel an order for stock unavailability, payment failure, suspected fraud, delivery restrictions, quantity limits, a genuine pricing error or legal/regulatory reasons. If payment has been received for a cancelled order, we will initiate a full refund within a reasonable period.</p>

      <h2>8. Prices, taxes and promotions</h2>
      <p>Prices are displayed in Indian Rupees and include applicable taxes unless clearly stated otherwise. Delivery charges, if any, are disclosed before the final purchase action. The final amount shown at checkout applies to that order.</p>
      <p>Promotional codes, gifts and offers are subject to their stated period, eligibility, stock and redemption terms. Unless expressly permitted, offers cannot be combined, transferred or redeemed for cash.</p>

      <h2>9. Payment</h2>
      <p>Available payment methods are shown at checkout and are processed through authorised third-party payment providers. You authorise the payment provider and participating bank or payment system to process the transaction. Additional details appear in the Payment Policy.</p>

      <h2>10. Shipping, title and delivery</h2>
      <p>We deliver to serviceable Indian PIN codes in accordance with the Shipping Policy. Ownership and risk in the product pass to you on confirmed delivery to the address or recipient provided by you, except where mandatory law provides otherwise.</p>

      <h2>11. Cancellation, return, replacement and refund</h2>
      <p>Cancellation, return, replacement and refund rights are governed by the Cancellation, Returns, Replacements and Refunds Policy. Nothing in these Terms limits a remedy that cannot lawfully be excluded, including for a defective, deficient, spurious, misdescribed, materially non-conforming or improperly delayed product.</p>

      <h2>12. Safe and lawful product use</h2>
      <p>You agree to:</p>
      <ul>
        <li>read the complete label, seal, expiry and storage directions before use;</li>
        <li>not use a product if the seal is broken, packaging appears tampered with, the product is expired or a recall/safety notice applies;</li>
        <li>not resell, relabel, adulterate, reverse engineer or represent yourself as authorised by 3Tattava without written permission; and</li>
        <li>promptly report a suspected quality defect, counterfeit product or adverse event with the batch and order details available.</li>
      </ul>

      <h2>13. Reviews and user submissions</h2>
      <p>Reviews must reflect a genuine experience and must not be false, paid without disclosure, unlawful, defamatory, infringing, abusive or contain another person&apos;s personal or medical information. We may moderate or remove content that violates these requirements, while not manipulating reviews merely because they are critical.</p>
      <p>By voluntarily submitting a review, image, video or testimonial for publication, you grant the Company a non-exclusive, worldwide, royalty-free licence to host, reproduce, adapt for format, publish and display it in connection with the website and brand, subject to the Privacy Policy and any specific written arrangement. You retain ownership of your original content.</p>

      <h2>14. Intellectual property</h2>
      <p>The website, brand elements, original text, graphics, product photographs, videos, layouts, software and other content are owned by or licensed to the Company and protected by applicable law. Limited personal, non-commercial browsing is permitted. Other use requires prior written permission as stated in the Intellectual Property Policy.</p>

      <h2>15. Prohibited conduct</h2>
      <p>You must not:</p>
      <ul>
        <li>use the website unlawfully or fraudulently;</li>
        <li>interfere with security, availability or another user&apos;s access;</li>
        <li>upload malicious code or attempt unauthorised access;</li>
        <li>scrape, harvest or systematically extract data or content without permission;</li>
        <li>impersonate another person or submit false order/payment details;</li>
        <li>use content to create a misleading endorsement, counterfeit product or competing copy; or</li>
        <li>violate another person&apos;s privacy, intellectual property or other legal rights.</li>
      </ul>

      <h2>16. Third-party services and links</h2>
      <p>Third-party payment, logistics, social-media, map, communication or other services may be governed by their own terms. We are not responsible for third-party content or independent acts, but this clause does not remove any responsibility imposed on us by mandatory consumer law.</p>

      <h2>17. Website availability</h2>
      <p>We may maintain, update, suspend or change website functions. We do not promise uninterrupted or error-free access, but will use reasonable efforts to operate the Services securely and reliably.</p>

      <h2>18. Disclaimer of warranties</h2>
      <p>To the extent permitted by law, the website is provided on an &quot;as available&quot; basis and individual product experience may vary. We do not make a cure guarantee, guaranteed time-bound outcome or warranty beyond an express written warranty and rights implied by mandatory law.</p>
      <p>Nothing in these Terms excludes statutory guarantees, remedies or rights under the Consumer Protection Act, 2019, the Consumer Protection (E-Commerce) Rules, 2020 or other applicable law.</p>

      <h2>19. Limitation of liability</h2>
      <p>To the extent permitted by law, the Company is not liable for indirect or consequential loss that was not reasonably foreseeable and was not caused by our breach, negligence, wilful misconduct or violation of law. Our aggregate contractual liability for a product claim will ordinarily not exceed the amount paid for the affected product, except where such limitation is prohibited by law or where liability arises from fraud, wilful misconduct, personal injury, a proven defective product or another non-excludable obligation.</p>

      <h2>20. Indemnity</h2>
      <p>You agree to be responsible for direct loss reasonably arising from your unlawful use of the website, fraud, infringement of third-party rights or material breach of these Terms. This clause does not make you responsible for loss caused by the Company or remove any statutory consumer right.</p>

      <h2>21. Events beyond reasonable control</h2>
      <p>Neither party is liable for delay caused by events beyond reasonable control, such as natural disasters, government restrictions, major transport interruption, epidemic, war, civil disturbance, widespread network outage or labour disruption. We will take reasonable steps to reduce delay and keep affected customers informed. Any mandatory remedy for non-delivery or cancellation remains available.</p>

      <h2>22. Changes</h2>
      <p>We may update these Terms prospectively. The version displayed when an order is placed will govern that order unless a change is required by law or is more favourable to you. Material changes to continuing Services will be notified where required.</p>

      <h2>23. Governing law and dispute forum</h2>
      <p>These Terms are governed by Indian law. Subject to any forum or jurisdiction available to a consumer under mandatory law, courts at Delhi will have jurisdiction over disputes arising from these Terms. This clause does not prevent a consumer from approaching a competent Consumer Commission or another authority available under law.</p>

      <h2>24. Severability and no waiver</h2>
      <p>If a provision is held unenforceable, the remaining provisions continue to apply to the extent lawful. A delay in enforcing a right is not a waiver.</p>

      <h2>25. Contact</h2>
      <p>Questions or complaints may be sent to <a href={`mailto:${LEGAL.emailGeneral}`}>{LEGAL.emailGeneral}</a>. Order matters should be sent to <a href={`mailto:${LEGAL.emailOrders}`}>{LEGAL.emailOrders}</a> with the order number. The grievance mechanism in Part 9 applies.</p>
    </ContentPage>
  );
}
