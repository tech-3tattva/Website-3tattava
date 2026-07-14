"use client";

import ScrollFAQAccordion from "@/components/ui/scroll-faqaccordion";

import { HOME_FAQS as faqs } from "@/data/faqs/home";

export default function FAQRevamp() {
  return (
    <section style={{ background: "#f7f0e2", padding: "6rem 1.5rem" }}>
      <ScrollFAQAccordion
        data={faqs}
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about Shilajit, Shahjeet Sticks, purity, and delivery."
      />
    </section>
  );
}
