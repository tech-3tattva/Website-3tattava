import type { Metadata } from 'next'
import ShahjeetClient from './ShahjeetClient'

export const metadata: Metadata = {
  title: 'Shahjeet® — Honey Shilajit Sticks 30-Pack | Portable Single-Serve | Doctor Reviewed | 3TATTAVA',
  description: 'Shodhit Shilajit + Madhu in a portable honey stick. 600mg Shilajit per stick, 30 single-serve packs. Triphala purified. Tear, Squeeze, Perform. Doctor reviewed by Dr. Kashish Gupta (BAMS).',
  alternates: { canonical: 'https://www.3tattava.com/products/shahjeet-sticks' },
  openGraph: {
    type: 'website',
    title: 'Shahjeet® — Honey Shilajit Sticks | Performance In Your Pocket | 3TATTAVA',
    description: '600mg Shodhit Shilajit per stick. Honey-based formula. Portable single-serve. Tear. Squeeze. Perform.',
    url: 'https://www.3tattava.com/products/shahjeet-sticks',
    images: [{ url: 'https://media.3tattava.com/products/shahjeet-box.png' }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Shahjeet?',
      acceptedAnswer: { '@type': 'Answer', text: 'Shahjeet is a doctor-formulated, honey-based Shilajit stick pack containing Shodhit Shilajit — purified through classical Triphala Shodhana. Each stick provides 600mg of Shilajit resin in a portable, ready-to-consume format. No preparation, no measuring, no cleanup.' },
    },
    {
      '@type': 'Question',
      name: 'How do I consume Shahjeet?',
      acceptedAnswer: { '@type': 'Answer', text: 'Tear the stick at the notch. Squeeze the contents directly into your mouth, or into water. No spoon, no warm water, no preparation required — anywhere, anytime.' },
    },
    {
      '@type': 'Question',
      name: 'Is Shahjeet suitable for both men and women?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Energy, resilience, consistency, and long-term vitality are human goals — not gender-specific ones. Shahjeet is designed for any adult pursuing daily wellbeing.' },
    },
    {
      '@type': 'Question',
      name: 'Why honey specifically?',
      acceptedAnswer: { '@type': 'Answer', text: 'Madhu (honey) is classified as Yogavahi in classical Ayurvedic texts — a carrier substance that enhances compatibility and palatability of what it accompanies. Honey also makes the experience consistently enjoyable, which directly supports daily adherence.' },
    },
    {
      '@type': 'Question',
      name: 'Can people with diabetes consume Shahjeet?',
      acceptedAnswer: { '@type': 'Answer', text: 'Shahjeet contains honey, which has a natural sugar content. Individuals living with diabetes or managing blood sugar should consult a qualified physician before use, review the nutritional information, and incorporate Shahjeet within their broader dietary and medical plan.' },
    },
    {
      '@type': 'Question',
      name: 'Can Shahjeet replace RockResin?',
      acceptedAnswer: { '@type': 'Answer', text: 'They are different rituals for different contexts. RockResin is the Deep Ritual — precise, immersive, ideal for a dedicated morning routine. Shahjeet is the Fast Ritual — portable, convenient, for environments where the Deep Ritual is not practical. They share the same philosophy but serve different needs.' },
    },
    {
      '@type': 'Question',
      name: 'Is Shahjeet suitable for travel?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. It was specifically designed for this. Shahjeet is portable by design — fits in a pocket, gym bag, travel kit, or carry-on. No jars, no spoons, no warm water required.' },
    },
    {
      '@type': 'Question',
      name: 'How do I view the testing reports?',
      acceptedAnswer: { '@type': 'Answer', text: 'Every Shahjeet box carries a QR code linking to batch-specific quality documentation. You can also visit our Transparency page to access available lab reports and manufacturing certifications before purchasing.' },
    },
  ],
}

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Shahjeet® — Honey Shilajit Sticks 30-Pack',
  description: 'Shodhit Shilajit + Madhu in a portable honey stick. 600mg Shilajit per stick, 30 single-serve packs. Triphala purified. Tear, Squeeze, Perform.',
  image: 'https://media.3tattava.com/products/shahjeet-box.png',
  brand: { '@type': 'Brand', name: '3TATTAVA' },
  offers: {
    '@type': 'Offer',
    url: 'https://www.3tattava.com/products/shahjeet-sticks',
    priceCurrency: 'INR',
    price: '999',
    availability: 'https://schema.org/InStock',
    seller: { '@type': 'Organization', name: 'SankalpaSiddhi Ayupharma Pvt. Ltd.' },
  },
  manufacturer: { '@type': 'Organization', name: 'URMI Lifesciences LLP' },
}

export default function ShahjeetSticksPage() {
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
      <ShahjeetClient />
    </>
  )
}
