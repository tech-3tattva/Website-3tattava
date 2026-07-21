import type { FAQItem } from "@/components/ui/scroll-faqaccordion";

// Single source of truth for the homepage FAQ — imported by both the client
// section (accordion) and the server page (FAQPage schema).
export const HOME_FAQS: FAQItem[] = [
  {
    id: 1,
    question: "What is Shilajit and how does it work?",
    answer:
      "Shilajit is a mineral-rich resin found in the Himalayas at elevations above 16,000 ft. It contains 80+ trace minerals and over 60% fulvic acid, which enhances nutrient absorption at the cellular level.",
  },
  {
    id: 2,
    question: "How do I use Shahjeet Sticks?",
    answer:
      "Simply tear the sachet, squeeze the honey-shilajit blend directly into your mouth or into warm water/tea. One stick daily, preferably in the morning. It takes just 10 seconds.",
  },
  {
    id: 3,
    question: "Are your products lab-tested?",
    answer:
      "Yes. Every batch is NABL 3rd-party lab tested for purity, potency, and safety. We publish full lab reports with every product — heavy metals, microbial counts, and fulvic acid percentages.",
  },
  {
    id: 4,
    question: "Is it safe for women?",
    answer:
      "Absolutely. Our formulations are designed for both men and women. Shilajit has been used in Ayurveda for centuries by all genders to support everyday energy and vitality.",
  },
  {
    id: 5,
    question: "How long before I see results?",
    answer:
      "Most users report increased energy within the first week. For sustained benefits like improved recovery, stamina, and focus, we recommend consistent use for 4-6 weeks.",
  },
  {
    id: 6,
    question: "What is your return policy?",
    answer:
      "We offer hassle-free returns within 7 days of delivery. If you\u2019re not satisfied, reach out to care@3tattava.com and we\u2019ll make it right.",
  },
  {
    id: 7,
    question: "Where can I verify lab reports?",
    answer:
      "Every 3Tattava product comes with a QR code on the packaging. Scan it to access the full NABL lab report for your specific batch — or visit our Research & Testing page at 3tattava.com/research-testing.",
  },
  {
    id: 8,
    question: "How much Shilajit should I take per day?",
    answer:
      "A common recommendation is 300–500mg of purified resin per day — roughly a pea-sized amount. One Shahjeet Stick delivers 600mg in a single serve. Start low and do not exceed label directions.",
  },
  {
    id: 9,
    question: "How do I know Shilajit is real and pure?",
    answer:
      "Purified resin is dark brown to blackish, softens in warm hands, and dissolves in warm water to a reddish-brown solution. The real proof is a batch-specific 3rd-party lab report for fulvic acid, heavy metals, and microbial safety — which every 3Tattava product carries.",
  },
  {
    id: 10,
    question: "Can pregnant or breastfeeding women take Shilajit?",
    answer:
      "No. Shilajit should be avoided during pregnancy and breastfeeding due to insufficient safety data. Please consult your doctor before use.",
  },
  {
    id: 11,
    question: "Should I take Shilajit in the morning or at night?",
    answer:
      "Morning is most common because Shilajit supports energy. Taking it later in the day is fine for most people, but avoid it near bedtime if you find it energizing.",
  },
];
