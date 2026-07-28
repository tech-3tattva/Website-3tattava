import type { Metadata } from "next";
import AssessmentClient from "./AssessmentClient";

export const metadata: Metadata = {
  title: "Prakriti Analysis | 3TATTAVA — Discover Your Ayurvedic Body Type",
  description:
    "A guided Prakriti (body-type) analysis reviewed by our Ayurvedic doctor. Answer one question at a time; your Vaidya finalises your Vata · Pitta · Kapha constitution.",
  alternates: { canonical: "https://www.3tattava.com/assessment" },
};

export default function AssessmentPage() {
  return <AssessmentClient />;
}
