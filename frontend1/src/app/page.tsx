import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-center">
      <div className="max-w-xl">
        <div className="mb-4">
          <BrandLogo />
        </div>
        <p className="text-text-medium mb-6">
          QR destination is set up and ready.
        </p>
        <Link
          href="/labreports"
          className="inline-flex rounded-full bg-primary-green px-6 py-3 text-white hover:bg-secondary-green transition-colors"
        >
          Open Lab Reports Page
        </Link>
      </div>
    </main>
  );
}
