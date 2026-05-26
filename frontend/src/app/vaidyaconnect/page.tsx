import type { Metadata } from "next";
import VaidyaConnectClient from "./VaidyaConnectClient";

export const metadata: Metadata = {
  title: "VaidyaConnect — Find Verified Ayurveda Doctors Near You | 3TATTAVA",
  description:
    "Browse 3T-verified Ayurveda doctors across India. Every doctor in this network has been vetted by Dr. Kashish and recommends 3TATTAVA as part of their practice.",
  alternates: { canonical: "https://www.3tattava.com/vaidyaconnect" },
  openGraph: {
    title: "VaidyaConnect — Verified Ayurveda Doctors | 3TATTAVA",
    description: "Find verified Ayurveda doctors near you. Vetted by Dr. Kashish.",
    url: "https://www.3tattava.com/vaidyaconnect",
  },
};

export default function VaidyaConnectPage() {
  return <VaidyaConnectClient />;
}
