import type { Metadata } from "next";
import DoctorApplicationForm from "@/components/doctors/DoctorApplicationForm";

export const metadata: Metadata = {
  title: "Join the 3TATTAVA Doctor Network | For Ayurveda Practitioners",
  description:
    "Join Delhi NCR's most trusted directory of genuine Ayurveda practitioners. Free listing, branded prescription pads, patient bookings, and co-branded clinic materials.",
  robots: { index: false, follow: false },
};

export default function DoctorJoinPage() {
  return <DoctorApplicationForm />;
}
