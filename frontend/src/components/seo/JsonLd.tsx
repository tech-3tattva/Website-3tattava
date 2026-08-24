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

/** Standalone Person schema for Dr. Kashish Gupta — the E-E-A-T anchor.
 *  Uses a stable @id so OrganizationSchema.founder and ProductSchema.reviewedBy
 *  can reference him without duplicating the full entity. This is the #1 fix
 *  from the AI visibility scorecard: LLMs need an explicit, referenceable expert
 *  entity to cite the brand in "doctor-formulated shilajit" queries. */
const FOUNDER_ID = `${BRAND.url}/#founder`;

export function PersonSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: BRAND.founderName,
    jobTitle: "Founder & Formulating Ayurveda Doctor",
    description:
      "Qualified Ayurveda Doctor (BAMS) and founder of 3TATTAVA. Formulates all products using classical Ayurvedic texts and modern quality standards. Graduate of CBPACS, New Delhi (Govt. of NCT of Delhi); former consultant, NCISM, Ministry of Ayush.",
    url: `${BRAND.url}/about`,
    sameAs: [
      "https://www.instagram.com/3tattava",
      "https://www.linkedin.com/company/3tattava",
    ],
    worksFor: { "@type": "Organization", "@id": `${BRAND.url}/#org`, name: BRAND.name },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "CBPACS, University of Delhi (Government of NCT of Delhi)",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: "Bachelor of Ayurvedic Medicine and Surgery (BAMS)",
    },
    knowsAbout: [
      "Ayurveda",
      "Shilajit",
      "Triphala Shodhana",
      "Himalayan Shilajit Purification",
      "Ayurvedic Formulation",
      "Fulvic Acid",
    ],
  };
  return <JsonLdScript data={data} />;
}

/** Organization + MedicalBusiness (because the brand is founded by a BAMS doctor). */
export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["Organization", "MedicalBusiness"],
    name: BRAND.name,
    alternateName: "3TATTAVA Ayurveda",
    url: BRAND.url,
    // /logo.png does not exist and returned 404, so Google was told to fetch a
    // logo it could never load. Point at a file that is actually shipped.
    logo: `${BRAND.url}${BRAND.logoPath}`,
    legalName: "SankalpaSiddhi Ayupharma Pvt. Ltd.",
    email: BRAND.email,
    description:
      "India's first Performance Ayurveda brand. Pure Himalayan Shilajit Resin & Honey Sticks. Lab-tested, doctor-formulated by Dr. Kashish Gupta, BAMS.",
    foundingDate: "2026",
    founder: {
      "@type": "Person",
      "@id": FOUNDER_ID,
      name: `${BRAND.founderName}, ${BRAND.founderCredentials}`,
      jobTitle: "Founder & Chief Ayurveda Doctor",
    },
    // Mirrors the Google Business Profile exactly so the two corroborate each
    // other rather than reading as two different businesses.
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.address.street,
      addressLocality: BRAND.address.locality,
      addressRegion: BRAND.address.region,
      postalCode: BRAND.address.postalCode,
      addressCountry: BRAND.address.country,
    },
    telephone: BRAND.phone,
    sameAs: [
      "https://www.instagram.com/3tattava",
      "https://www.facebook.com/3tattava",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: BRAND.phone,
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

  // AI visibility: link the product to its formulating doctor
  data.reviewedBy = { "@type": "Person", "@id": FOUNDER_ID };

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
      logo: { "@type": "ImageObject", url: `${BRAND.url}${BRAND.logoPath}` },
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

/** CollectionPage for hub/library pages (Knowledge Center). Optional ItemList of entries. */
export function CollectionPageSchema({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description: string;
  url: string;
  items?: Array<{ name: string; url?: string }>;
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: BRAND.name, url: BRAND.url },
    about: "Ayurveda, Shilajit, Triphala, digestive health, Performance Ayurveda",
    publisher: { "@type": "Organization", name: BRAND.name, url: BRAND.url },
    reviewedBy: {
      "@type": "Person",
      name: `${BRAND.founderName}, ${BRAND.founderCredentials}`,
      jobTitle: "Qualified Ayurveda Doctor (BAMS)",
    },
  };
  if (items && items.length > 0) {
    data.hasPart = {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        ...(it.url ? { url: it.url } : {}),
      })),
    };
  }
  return <JsonLdScript data={data} />;
}
