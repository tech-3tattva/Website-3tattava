import type { Metadata } from "next";
import Link from "next/link";
import LabReportLookup from "@/components/search/LabReportLookup";

export const metadata: Metadata = {
  title: "Search | 3tattava",
  description: "Search page for 3tattava products.",
};

export default function SearchPage() {
  return (
    <main className="min-h-[60vh] px-4 py-16">
      <section className="max-w-3xl mx-auto premium-card p-8 text-center">
        <h1
          className="text-4xl md:text-5xl text-primary-green mb-3"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Search
        </h1>
        <p className="text-text-medium mb-6">
          Smart product search is being prepared. Browse our collection for now.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center rounded-full bg-primary-green text-white px-6 py-3 hover:bg-secondary-green transition-colors"
          >
            Explore Products
          </Link>
          <LabReportLookup />
        </div>
      </section>
    </main>
  );
}
