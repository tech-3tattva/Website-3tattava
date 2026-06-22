import type { Metadata } from 'next'
import RockResinClient from './RockResinClient'

export const metadata: Metadata = {
  title: 'RockResin® — Shodhit Himalayan Shilajit Resin 20g | NABL Lab-Tested | Doctor-Formulated | 3TATTAVA',
  description: 'Pure Himalayan Shodhit Shilajit resin. NABL lab-tested, ≥70% fulvic acid, 80+ trace minerals. Doctor-formulated by Dr. Kashish Gupta (BAMS). Classical Triphala Shodhana purification.',
  alternates: { canonical: 'https://www.3tattava.com/products/shodhit-shilajit-resin' },
  openGraph: {
    type: 'website',
    title: 'RockResin® — Shodhit Himalayan Shilajit Resin | 3TATTAVA',
    description: 'NABL lab-tested, ≥70% fulvic acid. Doctor-formulated by Dr. Kashish Gupta BAMS.',
    url: 'https://www.3tattava.com/products/shodhit-shilajit-resin',
    images: [{ url: 'https://media.3tattava.com/products/Rockresin-hero.jpeg' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is RockResin?',
      acceptedAnswer: { '@type': 'Answer', text: 'RockResin is a doctor-formulated Shodhit Himalayan Shilajit resin — purified using classical Triphala Shodhana as prescribed in Ashtanga Hridayam. Every batch is NABL lab-tested for fulvic acid content (≥70%), heavy metals, and microbial safety before it reaches you.' },
    },
    {
      '@type': 'Question',
      name: 'How should I consume RockResin?',
      acceptedAnswer: { '@type': 'Answer', text: 'Dip the included spatula into the jar and hook a pea-sized amount (approx. 300–500mg). Drop into warm water or milk and swirl gently until dissolved. The spatula rests on the glass rim — hands-free, mess-free, effortless.' },
    },
    {
      '@type': 'Question',
      name: 'When is the best time to take it?',
      acceptedAnswer: { '@type': 'Answer', text: 'Most users prefer the morning — taken as a conscious daily ritual before food or with warm water. Ayurveda recommends consistent timing for Rasayana use. Morning or evening work equally well; what matters most is daily consistency.' },
    },
    {
      '@type': 'Question',
      name: 'Is RockResin suitable for both men and women?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Shilajit is recommended in classical Ayurvedic texts for both men and women as a Rasayana. RockResin is designed for any adult looking to support their daily energy, recovery, and wellbeing.' },
    },
    {
      '@type': 'Question',
      name: 'Are there any side effects?',
      acceptedAnswer: { '@type': 'Answer', text: 'Side effects with genuine, purified Shilajit are uncommon when taken at recommended doses. If you have kidney conditions, are pregnant or breastfeeding, or take regular medication, consult a qualified physician before use.' },
    },
    {
      '@type': 'Question',
      name: 'How is RockResin different from other Shilajit products?',
      acceptedAnswer: { '@type': 'Answer', text: 'Key differences are process-based: Himalayan source documentation, Triphala Shodhana purification by AYUSH-GMP facility (URMI Lifesciences LLP), independent NABL 3rd-party lab testing, batch-specific QR verification, glass packaging, and formulation by Dr. Kashish Gupta BAMS.' },
    },
    {
      '@type': 'Question',
      name: 'Can I view your testing reports?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Every batch carries a QR code on the jar linking to the batch-specific NABL lab report. NABL Batch Reference: #RK2024-08. You can also visit our Lab Reports page to view available reports before purchasing.' },
    },
    {
      '@type': 'Question',
      name: 'What does ≥70% fulvic acid mean?',
      acceptedAnswer: { '@type': 'Answer', text: 'Fulvic acid is the primary active compound in Shilajit — a natural electrolyte transporter that carries minerals into cells. Our NABL-certified lab report verifies every batch contains at least 70% fulvic acid by dry weight.' },
    },
    {
      '@type': 'Question',
      name: 'Where is RockResin sourced and manufactured?',
      acceptedAnswer: { '@type': 'Answer', text: 'Raw Shilajit is sourced from Himalayan deposits at 10,000–16,000ft altitude. Purified and manufactured by URMI Lifesciences LLP (Mfg. Lic. No. RJ-926AYU E, Rajasthan) — AYUSH-GMP certified. Marketed by SankalpaSiddhi Ayupharma Pvt. Ltd., 690A/1 Kabool Nagar, Shahdara, Delhi.' },
    },
  ],
}

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'RockResin® — Shodhit Himalayan Shilajit Resin 20g',
  description: 'Pure Himalayan Shodhit Shilajit resin. NABL lab-tested, ≥70% fulvic acid, 80+ trace minerals. Doctor-formulated by Dr. Kashish Gupta (BAMS). Classical Triphala Shodhana purification.',
  image: 'https://media.3tattava.com/products/Rockresin-hero.jpeg',
  brand: { '@type': 'Brand', name: '3TATTAVA' },
  offers: {
    '@type': 'Offer',
    url: 'https://www.3tattava.com/products/shodhit-shilajit-resin',
    priceCurrency: 'INR',
    price: '1299',
    availability: 'https://schema.org/InStock',
    seller: { '@type': 'Organization', name: 'SankalpaSiddhi Ayupharma Pvt. Ltd.' },
  },
  manufacturer: { '@type': 'Organization', name: 'URMI Lifesciences LLP' },
  review: {
    '@type': 'Review',
    author: { '@type': 'Person', name: 'Dr. Kashish Gupta', jobTitle: 'BAMS' },
    reviewBody: 'Formulated and reviewed by Dr. Kashish Gupta, BAMS — alumnus of CBPACS, Govt. of NCT Delhi.',
  },
}

export default function RockResinPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <RockResinClient />
    </>
  )
}
