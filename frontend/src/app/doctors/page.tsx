import type { Metadata } from "next";
import DoctorDirectory from "@/components/doctors/DoctorDirectory";

export const metadata: Metadata = {
  title: "Find a Verified Ayurveda Doctor Near You | 3TATTAVA",
  description:
    "Browse credential-verified Ayurveda doctors in Delhi NCR. Book consultations, read patient reviews, and find the right practitioner for your health needs. 3TATTAVA Doctor Network.",
  alternates: { canonical: "https://www.3tattava.com/doctors" },
  openGraph: {
    title: "Find a Verified Ayurveda Doctor Near You | 3TATTAVA",
    description: "Browse verified Ayurveda doctors in Delhi NCR. Book consultations online.",
    url: "https://www.3tattava.com/doctors",
  },
};

export default function DoctorsPage() {
  return <DoctorDirectory />;
}
