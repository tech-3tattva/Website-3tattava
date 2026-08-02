import type { Metadata } from "next";
import KanwarSevaSection from "@/components/home-revamp/KanwarSevaSection";

export const metadata: Metadata = {
  title: "Events — Indraprastha Kanwar Swasthya Seva Yatra 2026 | 3TATTAVA",
  description:
    "A 3TATTAVA Seva initiative: Indraprastha Kanwar Swasthya Seva Yatra 2026 — a doctor-led Ayurveda health camp for Kanwar Yatris. 3–8 August 2026, Shahdara, Delhi. Free consultations, first aid, foot & blister care, hydration and heat-safety support.",
  alternates: { canonical: "https://www.3tattava.com/events" },
  openGraph: {
    title: "Indraprastha Kanwar Swasthya Seva Yatra 2026 — A 3TATTAVA Seva Initiative",
    description:
      "A doctor-led Ayurveda health camp for Kanwar Yatris — 3–8 August 2026, Shahdara, Delhi. Free for all.",
    url: "https://www.3tattava.com/events",
  },
};

export default function EventsPage() {
  return (
    <main>
      <KanwarSevaSection />
    </main>
  );
}
