import { notFound } from "next/navigation";
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-data";
import ProductPageClient from "./ProductPageClient";

export async function generateStaticParams() {
  return PLACEHOLDER_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PLACEHOLDER_PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  return <ProductPageClient product={product} />;
}
