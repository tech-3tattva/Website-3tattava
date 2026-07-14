import type { Metadata } from "next";
import KnowledgeCenterClient from "./KnowledgeCenterClient";
import { BreadcrumbSchema, FAQSchema, CollectionPageSchema } from "@/components/seo/JsonLd";
import { PILLARS } from "@/data/education/pillars";
import { BLOGS } from "@/data/education/blogs";
import { FAQS } from "@/data/education/faqs";

const URL = "https://www.3tattava.com/knowledge-center";

export const metadata: Metadata = {
  title: "Knowledge Center | 3TATTAVA — Performance Ayurveda™",
  description: `Evidence-informed Ayurveda library: ${BLOGS.length} guides across ${PILLARS.length} pillars and ${FAQS.length} doctor-reviewed answers on Shilajit, Triphala, digestion, women's & men's health. Reviewed by Dr. Kashish Gupta, BAMS.`,
  alternates: { canonical: URL },
  openGraph: {
    title: "The Performance Ayurveda™ Library | 3TATTAVA",
    description: `${BLOGS.length} guides · ${FAQS.length} answers · ${PILLARS.length} pillars. Shilajit, Triphala and personalised Ayurvedic living — reviewed by Dr. Kashish Gupta, BAMS.`,
    url: URL,
    type: "website",
  },
};

// Highest-priority, doctor-reviewed answers power the page-level FAQ rich result.
const SCHEMA_FAQS = FAQS.filter((f) => f.priority === "P1")
  .slice(0, 40)
  .map((f) => ({ question: f.q, answer: f.a }));

export default function KnowledgeCenterPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://www.3tattava.com" },
          { name: "Knowledge Center", url: URL },
        ]}
      />
      <CollectionPageSchema
        name="3TATTAVA Knowledge Center — The Performance Ayurveda Library"
        description={`A hub-and-spoke Ayurveda library: ${BLOGS.length} guides across ${PILLARS.length} pillars and ${FAQS.length} answers on Shilajit, Triphala, digestion and personalised Ayurvedic living.`}
        url={URL}
        items={PILLARS.map((p) => ({ name: p.pillar, url: `https://www.3tattava.com${p.page}` }))}
      />
      <FAQSchema faqs={SCHEMA_FAQS} />
      <KnowledgeCenterClient />
    </>
  );
}
