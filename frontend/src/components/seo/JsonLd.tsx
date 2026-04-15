/**
 * JSON-LD schema components for 3TATTAVA.
 * Render as children of a page's root. Next.js App Router inlines these in <head>.
 *
 * Use:
 *   <OrganizationSchema />              // on every page (ideally in layout)
 *   <WebsiteSchema />                   // on homepage
 *   <ProductSchema product={...} />     // on product detail pages
 *   <FAQSchema faqs={...} />            // on product pages, education articles
 *   <ArticleSchema article={...} />     // on education articles
 *   <BreadcrumbSchema items={...} />    // anywhere breadcrumbs appear
 */

import { BRAND } from "@/lib/brand-content";

function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization + MedicalBusiness (because the brand is founded by a BAMS doctor). */
export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["Organization", "MedicalBusiness"],
    name: BRAND.name,
    alternateName: "3TATTAVA Ayurveda",
    url: BRAND.url,
    logo: `${BRAND.url}/logo.png`,
    email: BRAND.email,
    description:
      "India's first Performance Ayurveda brand. Pure Himalayan Shilajit Resin & Honey Sticks. Lab-certified, doctor-formulated by Dr. Kashish Gupta, BAMS.",
    foundingDate: "2026",
    founder: {
      "@type": "Person",
      name: `${BRAND.founderName}, ${BRAND.founderCredentials}`,
      jobTitle: "Founder & Chief Ayurveda Doctor",
      description: "Qualified Ayurveda Doctor (BAMS), founder of 3TATTAVA.",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.instagram.com/3tattava",
      "https://www.facebook.com/3tattava",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: BRAND.email,
      availableLanguage: ["en", "hi"],
    },
    medicalSpecialty: "Ayurveda",
  } as const;

  return <JsonLdScript data={data} />;
}

export function WebsiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND.name,
    url: BRAND.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BRAND.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  } as const;
  return <JsonLdScript data={data} />;
}

export type ProductLike = {
  name: string;
  slug: string;
  description: string;
  image?: string;
  price?: number;
  currency?: string;
  inStock?: boolean;
  ratingValue?: number;
  reviewCount?: number;
  sku?: string;
  brand?: string;
};

export function ProductSchema({ product }: { product: ProductLike }) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: `${BRAND.url}/products/${product.slug}`,
    sku: product.sku ?? product.slug,
    brand: { "@type": "Brand", name: product.brand ?? BRAND.name },
    image: product.image ?? `${BRAND.url}/og-product.png`,
  };

  if (typeof product.price === "number") {
    data.offers = {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: product.currency ?? "INR",
      availability: `https://schema.org/${product.inStock === false ? "OutOfStock" : "InStock"}`,
      url: `${BRAND.url}/products/${product.slug}`,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };
  }

  if (product.ratingValue && product.reviewCount) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.ratingValue,
      reviewCount: product.reviewCount,
    };
  }

  return <JsonLdScript data={data} />;
}

export type FaqItem = { question: string; answer: string };

export function FAQSchema({ faqs }: { faqs: FaqItem[] }) {
  if (faqs.length === 0) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  } as const;
  return <JsonLdScript data={data} />;
}

export type ArticleLike = {
  title: string;
  slug: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
};

export function ArticleSchema({ article }: { article: ArticleLike }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: article.title,
    description: article.description,
    url: `${BRAND.url}/education/${article.slug}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    image: article.image ?? `${BRAND.url}/og-education.png`,
    author: {
      "@type": "Person",
      name: `${BRAND.founderName}, ${BRAND.founderCredentials}`,
      jobTitle: "Founder, 3TATTAVA",
    },
    reviewedBy: {
      "@type": "Person",
      name: `${BRAND.founderName}, ${BRAND.founderCredentials}`,
      jobTitle: "Qualified Ayurveda Doctor (BAMS)",
    },
    publisher: {
      "@type": "Organization",
      name: BRAND.name,
      logo: { "@type": "ImageObject", url: `${BRAND.url}/logo.png` },
    },
    mainEntityOfPage: `${BRAND.url}/education/${article.slug}`,
    about: "Ayurveda, Shilajit, Performance Ayurveda",
  } as const;
  return <JsonLdScript data={data} />;
}

export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  if (items.length === 0) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  } as const;
  return <JsonLdScript data={data} />;
}
