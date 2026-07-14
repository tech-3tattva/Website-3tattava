import Link from "next/link";

export const metadata = {
  title: "Gift Sets | 3Tattva Ayurveda",
  description: "Luxurious Ayurvedic gift sets for your loved ones.",
  robots: { index: false, follow: true },
};

export default function GiftingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="premium-card p-8 mb-8 text-center bg-gradient-to-r from-beige to-cream">
        <p className="text-gold text-xs uppercase tracking-[0.2em] mb-2">Curated for Celebration</p>
        <h1 className="font-display text-4xl text-text-dark mb-3">Gift Sets</h1>
        <p className="text-text-medium">Luxurious Ayurvedic gifting bundles for every occasion.</p>
      </div>
      <div className="premium-card p-10 text-center max-w-2xl mx-auto">
        <p className="text-gold text-xs uppercase tracking-[0.2em] mb-3">Coming Soon</p>
        <h2 className="font-display text-3xl text-text-dark mb-4">Gift sets are coming soon</h2>
        <p className="text-text-medium mb-8">
          We&apos;re curating thoughtful Ayurvedic gifting bundles. In the meantime, gift one of our
          signature rituals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products/shahjeet-sticks"
            className="premium-card px-6 py-4 text-primary-green font-medium hover:underline"
          >
            Shahjeet Sticks →
          </Link>
          <Link
            href="/products/shodhit-shilajit-resin"
            className="premium-card px-6 py-4 text-primary-green font-medium hover:underline"
          >
            Shodhit Shilajit Resin →
          </Link>
        </div>
        <p className="text-text-medium mt-8">
          <Link href="/products" className="text-primary-green hover:underline">View all products</Link>
        </p>
      </div>
    </div>
  );
}
