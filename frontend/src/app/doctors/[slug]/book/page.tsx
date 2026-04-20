import type { Metadata } from "next";
import BookingFlow from "@/components/doctors/BookingFlow";

export const metadata: Metadata = {
  title: "Book Consultation | 3TATTAVA Doctor Network",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookingPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const date = typeof sp.date === "string" ? sp.date : "";
  const slot = typeof sp.slot === "string" ? sp.slot : "";
  const type = typeof sp.type === "string" ? sp.type : "in-clinic";

  return <BookingFlow slug={slug} date={date} slot={slot} type={type as "in-clinic" | "online"} />;
}
