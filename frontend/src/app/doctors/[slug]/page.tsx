import type { Metadata } from "next";
import DoctorProfile from "@/components/doctors/DoctorProfile";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const displaySlug = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${displaySlug} | Ayurveda Doctor | 3TATTAVA`,
    description: `Book a consultation with ${displaySlug}. 3TATTAVA Verified Ayurveda doctor. Read reviews, check availability, and book online.`,
    alternates: { canonical: `https://www.3tattava.com/doctors/${slug}` },
  };
}

export default async function DoctorProfilePage({ params }: Props) {
  const { slug } = await params;
  return <DoctorProfile slug={slug} />;
}
