import type { Metadata } from "next";
import { PAGE_METADATA } from "@/lib/brand-content";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: PAGE_METADATA.about.title,
  description: PAGE_METADATA.about.description,
  alternates: { canonical: "https://www.3tattava.com/about" },
  openGraph: {
    title: PAGE_METADATA.about.title,
    description: PAGE_METADATA.about.description,
    url: "https://www.3tattava.com/about",
    type: "article",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
