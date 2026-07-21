import type { FAQItem } from "@/components/ui/scroll-faqaccordion";

// Single source of truth for RockResin FAQs — imported by both the client
// (on-page accordion) and the server page (FAQPage schema). Kept in a plain
// module so the server component receives real data, not a client reference.
export const ROCKRESIN_FAQS: FAQItem[] = [
  { id: 1, question: "What is RockResin?", answer: "RockResin is authentic Himalayan Shilajit resin, sourced above 16,000 ft and traditionally purified using Triphala Shodhana. Every batch is Eurofins & NABL 3rd-party lab-tested for fulvic acid (≥70%), heavy metals, and microbial safety." },
  { id: 2, question: "How do I consume it?", answer: "Dip the folded end of the included spoon into the jar and hook a pea-sized amount (approx. 300–500mg). Drop it into warm water or milk and swirl gently until it dissolves. Dip. Hook. Swirl — hands-free, mess-free." },
  { id: 3, question: "How much should I take and when?", answer: "One pea-sized serving (300–500mg) per day, ideally in the morning with warm water. A single jar lasts roughly 40–50 days. Shilajit is a classical Rasayana designed for consistent daily use." },
  { id: 4, question: "Is it for men or women?", answer: "Both. Classical Ayurvedic texts recommend Shilajit as a Rasayana for men and women alike — for energy, mineral balance, and healthy ageing. Avoid during pregnancy or breastfeeding without medical advice." },
  { id: 5, question: "Why Triphala purification?", answer: "Triphala Shodhana is the classical purification prescribed for Shilajit. It supports the removal of rock and heavy-metal impurities while preserving the fulvic-acid matrix that gives Shilajit its bioactivity." },
  { id: 6, question: "Where can I see the lab reports?", answer: "Every jar carries a QR code linking to its batch-specific Eurofins/NABL report. You can also view available reports on our Lab Reports page before purchasing." },
  { id: 7, question: "How should I store it?", answer: "Keep the jar tightly closed at room temperature, away from direct sunlight and moisture. Use the dry spoon provided — resin is naturally sticky and reacts to humidity." },
  { id: 8, question: "What is fulvic acid?", answer: "Fulvic acid is a small organic molecule formed during the natural decomposition of plant matter. In Shilajit it is a primary marker compound thought to aid mineral transport and antioxidant activity." },
  { id: 9, question: "What percentage of fulvic acid is good in Shilajit?", answer: "There is no universal standard, but reputable resins commonly declare 60–80% fulvic acid with the test method stated. 3Tattava RockResin is lab-verified at ≥70%." },
  { id: 10, question: "Why does the fulvic acid test method matter?", answer: "Different methods (HPLC vs colorimetric) can produce very different numbers, so a percentage without a stated method is not comparable or fully meaningful." },
  { id: 11, question: "How much should beginners take?", answer: "Beginners should start low — about 250mg (one scoop / half a pea) once daily for the first 1–2 weeks — then adjust as tolerated." },
  { id: 12, question: "Can I take too much Shilajit?", answer: "Yes. Exceeding recommended amounts increases the risk of side effects and excess mineral intake. Stay within 300–500mg per day unless advised otherwise by a physician." },
];
