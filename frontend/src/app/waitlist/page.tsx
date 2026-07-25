import type { Metadata } from "next";
import WaitlistLanding from "@/components/waitlist/WaitlistLanding";

export const metadata: Metadata = {
  title: "Join the Founding Waitlist | 3TATTAVA",
  description:
    "The waitlist gets the dose first. Read the published lab reports and get first-access + \u20B9200 off at launch.",
  alternates: { canonical: "https://www.3tattava.com/waitlist" },
  robots: { index: true, follow: true },
};

export default function WaitlistPage() {
  return <WaitlistLanding />;
}
