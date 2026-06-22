import type { Metadata } from "next";
import ResearchClient from "./ResearchClient";

export const metadata: Metadata = {
  title: "Research & Testing | 3TATTAVA — Evidence Before Claims™",
  description:
    "3TATTAVA's six-layer testing protocol: NABL 3rd-party lab testing by Eurofins, AYUSH-GMP certification, US-FDA Registered Facility, classical Triphala Shodhana, Himalayan sourcing above 16,000ft, and full batch-level COA transparency. Ancient wisdom deserves modern verification.",
};

export default function ResearchTestingPage() {
  return <ResearchClient />;
}
