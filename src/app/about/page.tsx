export const metadata = {
  title: "Our Story | 3Tattva Ayurveda",
  description: "The story of 3Tattva — born from conviction, built on science, rooted in Ayurveda.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="relative h-[70vh] min-h-[400px] flex items-center justify-center bg-primary-green overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 text-center text-white px-4">
          <h1
            className="font-display text-4xl md:text-6xl mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            The Story of 3Tattva
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Born from conviction. Built on science. Rooted in Ayurveda.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-[55%_45%] gap-12 items-center">
        <div className="aspect-video bg-beige-dark rounded-xl" />
        <div>
          <h2 className="font-display text-3xl md:text-4xl text-text-dark mb-6">
            WELCOME TO THE WORLD OF 3TATTVA...
          </h2>
          <p className="text-text-medium mb-4">
            A world where ancient Vedic knowledge meets modern clinical science.
          </p>
          <p className="text-text-medium mb-4">
            A world where every ingredient has a story, a source, and a purpose.
          </p>
          <p className="text-text-medium">
            A world of three elements — Balance, Build, Become — that we want to bring to every home.
          </p>
        </div>
      </section>

      <section className="bg-primary-green text-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-3xl mb-4">OUR BRAND</h2>
            <p className="text-gold text-sm uppercase tracking-wider mb-4">
              AUTHENTIC AYURVEDA · BORN OF NATURE · RAISED BY SCIENCE
            </p>
            <p className="text-white/90 mb-6">
              3Tattva was founded to make authentic, dosha-guided Ayurveda accessible. Our certified Ayurvedacharyas work alongside modern scientists to create formulations that honour tradition and meet today&apos;s standards.
            </p>
            <h3 className="font-sans font-bold uppercase text-sm mb-3">OUR 4 PILLARS OF INNOVATION</h3>
            <ul className="space-y-2 text-white/90 text-sm">
              <li>• WE STUDY the 5,000-year corpus of Ayurvedic texts.</li>
              <li>• WE SOURCE ingredients at their geographic origin.</li>
              <li>• WE FORMULATE using GMP-certified facilities.</li>
              <li>• WE DELIVER holistic wellness — not just products.</li>
            </ul>
            <p className="font-bold mt-6">TRANSFORM HEALTH. TRANSFORM LIFE.</p>
          </div>
          <div className="space-y-4">
            <div className="aspect-video bg-white/10 rounded-lg" />
            <div className="aspect-video bg-white/10 rounded-lg" />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-4xl text-text-dark mb-8 text-center">
          OUR INSPIRATIONS
        </h2>
        <div className="space-y-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="font-display text-6xl text-gold mb-2">01</p>
              <h3 className="font-sans font-bold uppercase mb-2">The Vedic Texts</h3>
              <p className="text-gold text-sm uppercase mb-2">THE KNOWLEDGE OF LIFE</p>
              <p className="text-text-medium">Charaka Samhita, Sushruta Samhita, and Ashtanga Hridayam form the foundation of our formulations.</p>
            </div>
            <div className="aspect-video bg-beige-dark rounded-xl" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="md:order-2">
              <p className="font-display text-6xl text-gold mb-2">02</p>
              <h3 className="font-sans font-bold uppercase mb-2">The Himalayas</h3>
              <p className="text-gold text-sm uppercase mb-2">THE SOURCE OF PURITY</p>
              <p className="text-text-medium">We source Shilajit and rare herbs from the high Himalayas, where potency is at its peak.</p>
            </div>
            <div className="aspect-video bg-beige-dark rounded-xl md:order-1" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="font-display text-6xl text-gold mb-2">03</p>
              <h3 className="font-sans font-bold uppercase mb-2">The Tridosha System</h3>
              <p className="text-gold text-sm uppercase mb-2">THE MAP OF THE HUMAN BODY</p>
              <p className="text-text-medium">Vata, Pitta, Kapha — every product is designed to bring your unique constitution into balance.</p>
            </div>
            <div className="aspect-video bg-beige-dark rounded-xl" />
          </div>
        </div>
      </section>

      <section className="bg-beige-dark py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-display text-2xl md:text-3xl italic text-text-dark mb-8">
            Our mission is not to sell you products. It is to restore the conversation between you and your body.
          </p>
        </div>
      </section>
    </div>
  );
}
