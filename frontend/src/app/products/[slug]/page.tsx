import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import ProductPageClient from "./ProductPageClient";
import { PAGE_METADATA } from "@/lib/brand-content";
import { ProductSchema, BreadcrumbSchema, FAQSchema } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // Prefer curated spec metadata for the two launch SKUs.
  if (slug === "shilajit-resin") {
    return {
      title: PAGE_METADATA.shilajitResin.title,
      description: PAGE_METADATA.shilajitResin.description,
      alternates: { canonical: `https://www.3tattava.com/products/${slug}` },
      openGraph: {
        type: "website",
        title: PAGE_METADATA.shilajitResin.title,
        description: PAGE_METADATA.shilajitResin.description,
        url: `https://www.3tattava.com/products/${slug}`,
      },
    };
  }
  if (slug === "shilajit-honey-sticks") {
    return {
      title: PAGE_METADATA.honeySticks.title,
      description: PAGE_METADATA.honeySticks.description,
      alternates: { canonical: `https://www.3tattava.com/products/${slug}` },
      openGraph: {
        type: "website",
        title: PAGE_METADATA.honeySticks.title,
        description: PAGE_METADATA.honeySticks.description,
        url: `https://www.3tattava.com/products/${slug}`,
      },
    };
  }

  if (!product) {
    return {
      title: "Product Not Found",
      robots: { index: false, follow: false },
    };
  }

  const description = product.shortDescription
    ? `${product.shortDescription} Lab-certified by 3TATTAVA Performance Ayurveda.`
    : `Shop ${product.name} by 3TATTAVA — Performance Ayurveda. Lab-certified, doctor-formulated.`;

  return {
    title: `${product.name} | 3TATTAVA`,
    description,
    alternates: { canonical: `https://www.3tattava.com/products/${slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | 3TATTAVA`,
      description,
      url: `https://www.3tattava.com/products/${slug}`,
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.slug, product.category);

  const faqs = (product.faqs ?? []).map((f: { question: string; answer: string }) => ({
    question: f.question,
    answer: f.answer,
  }));

  return (
    <>
      <ProductSchema
        product={{
          name: product.name,
          slug: product.slug,
          description: product.description ?? product.shortDescription ?? "",
          image: product.images?.[0],
          price: product.price,
          currency: "INR",
          inStock: (product.stockQuantity ?? 0) > 0,
          sku: product.slug,
          brand: "3TATTAVA",
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://www.3tattava.com" },
          { name: "Shop", url: "https://www.3tattava.com/products" },
          { name: product.name, url: `https://www.3tattava.com/products/${product.slug}` },
        ]}
      />
      {faqs.length > 0 ? <FAQSchema faqs={faqs} /> : null}
      <ProductPageClient product={product} related={related} />
    </>
  );
}
