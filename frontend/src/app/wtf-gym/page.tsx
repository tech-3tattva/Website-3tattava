import type { Metadata } from "next";
import WtfGymClient from "./WtfGymClient";

export const metadata: Metadata = {
  title: "WTF Gyms × 3TATTAVA — Performance Ayurveda Meets Fitness",
  description:
    "Exclusive collaboration between WTF Gyms and 3TATTAVA. Discover doctor-formulated Shilajit products designed for athletes and fitness enthusiasts. Available at 28 WTF gym locations across Delhi NCR.",
  alternates: { canonical: "https://www.3tattava.com/wtf-gym" },
  robots: { index: false, follow: true }, // QR landing — no organic indexing needed
};

export default function WtfGymPage() {
  return <WtfGymClient />;
}
