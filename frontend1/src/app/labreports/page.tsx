import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

const contactUrl =
  process.env.NEXT_PUBLIC_LABREPORTS_CONTACT_URL ??
  "mailto:support@3tattva.com?subject=Lab%20Reports%20Support";

export const metadata: Metadata = {
  title: "Lab Reports | 3tattava",
  description:
    "3tattava Lab Reports portal is launching soon. Reach us directly for support.",
};

export default function LabReportsPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-14">
      <section className="w-full max-w-2xl rounded-3xl border border-border bg-white/90 p-8 md:p-12 shadow-[0_16px_40px_rgba(0,0,0,0.08)] text-center">
        <div className="mb-4">
          <BrandLogo />
        </div>
        <h1
          className="text-4xl md:text-6xl text-primary-green leading-tight mb-4"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Launching Soon
        </h1>
        <p className="text-text-medium text-base md:text-lg mb-8">
          Our Lab Reports portal is under preparation and will be available
          shortly.
        </p>

        <Link
          href={contactUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary-green text-white px-6 py-3 text-sm md:text-base hover:bg-secondary-green transition-colors"
        >
          <MessageCircle size={18} />
          Contact Support
        </Link>

        <p className="mt-6 text-sm text-text-light">
          Need immediate help? Our team is available on chat.
        </p>
      </section>
    </main>
  );
}
