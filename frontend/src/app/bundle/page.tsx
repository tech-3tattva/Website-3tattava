import type { Metadata } from "next";
import BundleLandingClient from "./BundleLandingClient";

export const metadata: Metadata = {
  title: "The Founding Bundle — RockResin™ + Shahjeet™ | 3TATTAVA",
  description:
    "The complete Balance · Build · Become ritual in one pack — RockResin™ classically purified Shilajit resin + 30 Shahjeet™ honey sticks. ₹2,398 (save ₹600); founding members ₹2,198 with your welcome code.",
  alternates: { canonical: "https://www.3tattava.com/bundle" },
  openGraph: {
    title: "The Founding Bundle — RockResin™ + Shahjeet™ | 3TATTAVA",
    description:
      "RockResin™ resin + Shahjeet™ honey sticks — the full ritual in one pack. Save ₹600; founding price ₹2,198.",
    url: "https://www.3tattava.com/bundle",
  },
};

export default function BundleLandingPage() {
  return <BundleLandingClient />;
}
