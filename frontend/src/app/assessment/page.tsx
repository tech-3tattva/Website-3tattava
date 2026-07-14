import type { Metadata } from "next";
import AssessmentClient from "./AssessmentClient";

export const metadata: Metadata = {
  title: "Performance Assessment | 3TATTAVA — Discover Your Starting Point",
  description: "A 60-second Performance Ayurveda assessment. Discover your energy and recovery baseline, your Balance · Build · Become stage, and the ritual that fits your life.",
  alternates: { canonical: "https://www.3tattava.com/assessment" },
};

export default function AssessmentPage() {
  return <AssessmentClient />;
}
