export const metadata = {
  title: "Product Journey | 3Tattva Ayurveda",
  description: "From nature to you — our promise of purity. Trace every step of our product journey.",
};

const STAGES = [
  { num: "01", name: "Sourcing", desc: "We identify every ingredient at its most potent geographic source." },
  { num: "02", name: "Testing", desc: "All raw materials are tested for heavy metals, microbial contamination, and potency." },
  { num: "03", name: "Formulation", desc: "Our Ayurvedacharyas co-develop formulations using classical texts as the foundation." },
  { num: "04", name: "Manufacturing", desc: "GMP-certified, FSSAI-approved facilities. Batch-coded for traceability." },
  { num: "05", name: "Quality Control", desc: "Triple-stage QC: Pre-production, in-process, and finished goods testing." },
  { num: "06", name: "Delivery", desc: "Eco-friendly packaging. Carbon-neutral last-mile delivery (in progress)." },
];

export default function ProductJourneyPage() {
  return (
    <div>
      <section className="relative h-[50vh] min-h-[300px] flex items-center justify-center bg-primary-green overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg')] bg-cover" />
        <h1
          className="relative z-10 font-display text-4xl md:text-5xl text-white text-center px-4"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          From Nature to You — Our Promise of Purity
        </h1>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:flex-wrap md:items-stretch gap-8">
          {STAGES.map((stage) => (
            <div
              key={stage.num}
              className="premium-card flex-1 min-w-[280px] flex gap-4 p-6"
            >
              <span className="font-display text-4xl text-gold shrink-0">
                {stage.num}
              </span>
              <div>
                <h3 className="font-sans font-bold uppercase text-text-dark mb-2">
                  {stage.name}
                </h3>
                <p className="text-text-medium text-sm">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-beige-dark py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl text-text-dark mb-8 text-center">
            Our Sustainability Commitment
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {["Packaging", "Sourcing", "Carbon", "Community"].map((title) => (
              <div key={title} className="bg-white rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary-green/20 mx-auto mb-3" />
                <h3 className="font-sans font-bold text-text-dark">{title}</h3>
                <p className="text-text-medium text-sm mt-2">
                  Recyclable, ethical, offset, partnerships.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
