import Link from "next/link";
import EducationNewsletterSection from "@/components/education/EducationNewsletterSection";

export const metadata = {
  title: "Education Hub | 3Tattva Ayurveda",
  description: "5,000 years of Ayurvedic knowledge, made accessible for modern life.",
};

export default function EducationPage() {
  return (
    <div>
      <section className="bg-primary-green text-white py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[60%_40%] gap-12 items-center">
          <div>
            <h1
              className="font-display text-4xl md:text-6xl mb-4"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              The 3Tattva Education Hub
            </h1>
            <p className="text-lg text-white/90 mb-6">
              5,000 years of Ayurvedic knowledge, made accessible for modern life.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/education#doshas"
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-sm font-medium"
              >
                Dosha Guide
              </Link>
              <Link
                href="/education#ingredients"
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-sm font-medium"
              >
                Ingredient Library
              </Link>
              <Link
                href="/education#seasonal"
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-sm font-medium"
              >
                Seasonal Wellness
              </Link>
            </div>
          </div>
          <div className="aspect-square bg-white/10 rounded-xl" />
        </div>
      </section>

      <section id="doshas" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl md:text-4xl text-text-dark mb-8 text-center">
          Understand Your Dosha
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {["Vata", "Pitta", "Kapha"].map((d) => (
            <div
              key={d}
              className="border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">☸</div>
              <h3 className="font-display text-2xl text-text-dark mb-2">{d}</h3>
              <p className="text-text-medium text-sm mb-4">Air & Space</p>
              <p className="text-text-medium text-sm mb-4">
                Characteristics, imbalance signs, balancing foods, and 3Tattva products for {d}.
              </p>
              <Link
                href={`/products?dosha=${d.toLowerCase()}`}
                className="text-primary-green font-medium text-sm hover:underline"
              >
                Explore {d} Products →
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center mt-8">
          <Link href="/dosha-quiz" className="text-gold font-medium hover:underline">
            Not sure which dosha you are? Take our free quiz.
          </Link>
        </p>
      </section>

      <section className="bg-beige py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl text-text-dark mb-8">Wellness Wisdom</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((_i) => (
              <article key={_i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-video bg-beige-dark" />
                <div className="p-4">
                  <span className="text-gold text-xs uppercase">Nutrition</span>
                  <h3 className="font-sans font-medium text-lg mt-2 line-clamp-2">
                    Morning Rituals for Balance
                  </h3>
                  <p className="text-text-light text-sm mt-2">5 min read</p>
                  <Link href="/blog" className="text-primary-green text-sm font-medium mt-2 inline-block hover:underline">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
</div>
    </section>

    <EducationNewsletterSection />

    <section id="ingredients" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl text-text-dark mb-6">Our Ingredient Library</h2>
        <div className="flex gap-2 flex-wrap mb-6">
          {["All", "Adaptogen", "Skin", "Hair", "Immunity"].map((f) => (
            <button
              key={f}
              type="button"
              className="px-4 py-2 rounded-full border border-border text-sm hover:bg-beige"
            >
              {f}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {["Ashwagandha", "Turmeric", "Neem", "Saffron", "Brahmi", "Shilajit"].map((ing) => (
            <div key={ing} className="text-center p-4 border border-border rounded-lg">
              <div className="w-16 h-16 rounded-full bg-beige mx-auto mb-2" />
              <p className="font-medium text-sm">{ing}</p>
              <p className="text-text-light text-xs mt-1">Learn More</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
