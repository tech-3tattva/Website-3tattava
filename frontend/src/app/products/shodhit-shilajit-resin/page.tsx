import type { Metadata } from 'next'
import RockResinClient from './RockResinClient'
import { ROCKRESIN_FAQS } from '@/data/faqs/rockresin'
import { ProductSchema, FAQSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'
import { fetchAggregateRating } from '@/lib/reviews'

export const metadata: Metadata = {
  title: 'RockResin™ — Himalayan Shilajit Resin (20g) | 3TATTAVA',
  description:
    'RockResin™ — authentic Himalayan Shilajit resin, Triphala-purified and NABL 3rd-party lab-tested. ≥70% fulvic acid, 80+ trace minerals. One Resin. Complete Vitality.',
  alternates: { canonical: 'https://www.3tattava.com/products/shodhit-shilajit-resin' },
  openGraph: {
    type: 'website',
    title: 'RockResin™ — Himalayan Shilajit Resin | 3TATTAVA',
    description:
      'Authentic Himalayan Shilajit resin. Triphala-purified. NABL tested. One Resin. Complete Vitality.',
    url: 'https://www.3tattava.com/products/shodhit-shilajit-resin',
  },
}

export default async function RockResinPage() {
  // Fetch real reviews at request time; only attach AggregateRating when
  // real, approved reviews exist (brief §6.1 / PR6 — never fabricate).
  const aggregate = await fetchAggregateRating('shodhit-shilajit-resin')
  return (
    <>
      <ProductSchema
        product={{
          name: 'CLASSICALLY PURIFIED SHILAJIT RESIN',
          slug: 'shodhit-shilajit-resin',
          description:
            'RockResin™ — authentic Himalayan Shilajit resin, Triphala-purified and NABL lab-tested. One Resin. Complete Vitality.',
          image: 'https://media.3tattava.com/products/Rockresin-hero.jpeg',
          price: 1199,
          currency: 'INR',
          brand: '3TATTAVA',
          ...(aggregate
            ? { ratingValue: aggregate.ratingValue, reviewCount: aggregate.reviewCount }
            : {}),
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.3tattava.com' },
          { name: 'Shop', url: 'https://www.3tattava.com/products' },
          { name: 'RockResin™ — Shilajit Resin', url: 'https://www.3tattava.com/products/shodhit-shilajit-resin' },
        ]}
      />
      <FAQSchema faqs={ROCKRESIN_FAQS.map((f) => ({ question: f.question, answer: f.answer }))} />
      <RockResinClient />
    </>
  )
}
