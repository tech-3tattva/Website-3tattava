import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Medical & Product Disclaimer | 3TATTAVA",
  description:
    "Understand the legal status of 3TATTAVA products and the limits of the educational information on this website before you buy or use them.",
  alternates: { canonical: "https://www.3tattava.com/medical-disclaimer" },
};

export default function MedicalDisclaimerPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Medical & Product Disclaimer"
      updated="17 July 2026"
      intro="Please read this before buying or using any product. It explains the legal status of our products and the limits of the educational information on this website."
    >
      <h2>1. Product status</h2>
      <p>
        Products sold by {LEGAL.brand} must be understood according to the legal category printed on the product label. Current products classified and licensed as Ayurvedic medicines, including Ayurvedic proprietary medicines, are medicines regulated under applicable Indian drug law; they are not food supplements merely because they are sold online or used for wellness support.
      </p>
      <p>
        The label and approved product particulars govern the ingredients, indication, dose/directions, warnings, contraindications, storage, manufacturer, licence, batch and expiry. No website statement is intended to expand or replace those particulars.
      </p>

      <h2>2. Educational information is not individual medical advice</h2>
      <p>
        Website articles, videos, FAQs, assessments, social content, lab-report explanations, testimonials and general guidance are for education and product information. They do not constitute an individual diagnosis, prescription, emergency service or treatment plan and do not create a doctor-patient relationship unless a separate professional consultation is expressly booked and accepted.
      </p>
      <p>
        Do not delay or disregard professional medical advice, stop prescribed treatment or self-diagnose a disease because of website content.
      </p>

      <h2>3. Before using a product</h2>
      <p>
        Read the complete label and use only as directed. Seek advice from a qualified healthcare professional before use if you:
      </p>
      <ul>
        <li>are pregnant, planning pregnancy or breastfeeding;</li>
        <li>are below 18 years of age;</li>
        <li>have a chronic, acute or undiagnosed medical condition;</li>
        <li>take prescription or regular medication;</li>
        <li>have a known allergy or prior reaction to an ingredient; or</li>
        <li>are scheduled for surgery or are under active medical treatment.</li>
      </ul>
      <p>
        Keep products out of reach of children. Do not use a product with a broken seal, signs of tampering, an expired date or a recall notice.
      </p>

      <h2>4. Results and claims</h2>
      <p>
        Individual experience varies with age, constitution, diet, lifestyle, adherence, health status, medication and other factors. No result, cure, disease prevention, time-bound transformation or performance outcome is guaranteed unless expressly permitted and substantiated under applicable law.
      </p>
      <p>
        Testimonials describe individual experiences and are not a promise of typical results or a substitute for clinical evidence. Laboratory reports relate to the tested sample, batch, method and parameters stated in the report; they do not independently establish a treatment outcome for every person.
      </p>

      <h2>5. Adverse reactions and emergencies</h2>
      <p>
        Stop use and seek professional advice if you experience an unexpected reaction. In a severe reaction or medical emergency, contact emergency services immediately. You may separately report the product and batch to{" "}
        <a href={`mailto:${LEGAL.emailGeneral}`}>{LEGAL.emailGeneral}</a> so that the matter can be documented and investigated.
      </p>
    </ContentPage>
  );
}
