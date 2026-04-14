import Link from "next/link";

export const metadata = {
  title: "Dosha Quiz | 3Tattva Ayurveda",
  description: "Discover your unique Ayurvedic mind-body type.",
};

export default function DoshaQuizPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="premium-card p-10">
        <p className="text-gold text-xs uppercase tracking-[0.2em] mb-3">Personalized Ayurveda</p>
        <h1 className="font-display text-4xl text-text-dark mb-4">Find Your Dosha</h1>
        <p className="text-text-medium mb-8">
          Take our short quiz to discover whether you&apos;re Vata, Pitta, or Kapha — and get product recommendations.
        </p>
        <div className="bg-beige rounded-xl p-8">
          <p className="text-text-medium mb-6">Quiz coming soon. Explore our products by category in the meantime.</p>
          <Link href="/products" className="text-primary-green font-medium hover:underline">
            Shop All Products →
          </Link>
        </div>
      </div>
    </div>
  );
}
