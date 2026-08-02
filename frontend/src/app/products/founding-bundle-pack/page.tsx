import type { Metadata } from "next";
import BundleClient from "./BundleClient";

export const metadata: Metadata = {
  title: "Founding Bundle Pack — RockResin™ + Shahjeet™ | 3TATTAVA",
  description:
    "The complete Balance · Build · Become ritual in one pack — RockResin™ purified Shilajit resin + 30 Shahjeet™ honey sticks. ₹2,398 (save ₹600); founding members ₹2,198.",
  alternates: { canonical: "https://www.3tattava.com/products/founding-bundle-pack" },
  openGraph: {
    title: "Founding Bundle Pack — RockResin™ + Shahjeet™ | 3TATTAVA",
    description:
      "RockResin™ resin + Shahjeet™ honey sticks — the full ritual in one pack. Save ₹600; founding price ₹2,198.",
    url: "https://www.3tattava.com/products/founding-bundle-pack",
  },
};

export default function FoundingBundlePage() {
  return <BundleClient />;
}
