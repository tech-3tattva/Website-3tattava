import type { Metadata } from "next";
import KnowledgeCenterClient from "./KnowledgeCenterClient";

export const metadata: Metadata = {
  title: "Knowledge Center | 3TATTAVA — Performance Ayurveda™",
  description:
    "Evidence-backed articles on Shilajit, Ayurvedic nutrition, recovery, and Performance Ayurveda. 5 pillars, 35+ topics reviewed by Dr. Kashish Gupta, BAMS. Updated continuously.",
};

export default function KnowledgeCenterPage() {
  return <KnowledgeCenterClient />;
}
