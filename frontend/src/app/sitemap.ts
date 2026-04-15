import type { MetadataRoute } from "next";
import { EDUCATION_HUB } from "@/lib/brand-content";

const SITE_URL = "https://www.3tattava.com";

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" },
  { path: "/products/shilajit-resin", priority: 0.95, changeFrequency: "weekly" },
  { path: "/products/shilajit-honey-sticks", priority: 0.95, changeFrequency: "weekly" },
  { path: "/products/starter-kit", priority: 0.85, changeFrequency: "weekly" },
  { path: "/products/honey-sticks-subscription", priority: 0.85, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/education", priority: 0.85, changeFrequency: "weekly" },
  { path: "/product-journey", priority: 0.7, changeFrequency: "monthly" },
  { path: "/dosha-quiz", priority: 0.6, changeFrequency: "monthly" },
  { path: "/gifting", priority: 0.5, changeFrequency: "monthly" },
  { path: "/track-order", priority: 0.3, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/returns", priority: 0.3, changeFrequency: "yearly" },
  { path: "/shipping", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  // Education articles derived from the 4 pillars in brand-content.
  const educationEntries: MetadataRoute.Sitemap = EDUCATION_HUB.pillars.flatMap((pillar) =>
    pillar.articles.map((title) => ({
      url: `${SITE_URL}/education/${slugify(title)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [...staticEntries, ...educationEntries];
}
