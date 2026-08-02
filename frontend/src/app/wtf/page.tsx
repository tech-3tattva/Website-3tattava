import type { Metadata } from "next";
import WtfClient from "./WtfClient";

export const metadata: Metadata = {
  title: "WTF Gyms + 3Tattava | Purified Shilajit for People Who Train",
  description:
    "Third-party NABL-tested, Triphala-purified Shilajit formulated by a BAMS physician. RockResin Classically Purified Shilajit Resin and Shahjeet Honey Shilajit Sticks — made for people who train.",
  alternates: { canonical: "https://www.3tattava.com/wtf" },
  robots: { index: true, follow: true },
};

export default function WtfLandingPage() {
  return <WtfClient />;
}
