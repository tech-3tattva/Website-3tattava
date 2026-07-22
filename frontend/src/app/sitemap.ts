import type { MetadataRoute } from "next";
import { EDUCATION_ARTICLES } from "@/lib/education-content";
import { BLOG_ARTICLES } from "@/data/education/blog-articles.generated";

const SITE_URL = "https://www.3tattava.com";

const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/products", priority: 0.95, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/education", priority: 0.85, changeFrequency: "weekly" },
  { path: "/knowledge-center", priority: 0.8, changeFrequency: "weekly" },
  { path: "/research-testing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/vaidyaconnect", priority: 0.7, changeFrequency: "monthly" },
  { path: "/community", priority: 0.6, changeFrequency: "weekly" },
  { path: "/find-us", priority: 0.6, changeFrequency: "monthly" },
  { path: "/product-journey", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/returns", priority: 0.3, changeFrequency: "yearly" },
  { path: "/shipping", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/track-order", priority: 0.3, changeFrequency: "yearly" },
  { path: "/medical-disclaimer", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
  { path: "/payment", priority: 0.3, changeFrequency: "yearly" },
  { path: "/intellectual-property", priority: 0.3, changeFrequency: "yearly" },
  { path: "/grievance", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  // Real education articles (slugs must match app/education/[slug]).
  const educationEntries: MetadataRoute.Sitemap = EDUCATION_ARTICLES.map((article) => ({
    url: `${SITE_URL}/education/${article.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Doctor-reviewed education library (app/education/[slug]).
  const blogEntries: MetadataRoute.Sitemap = BLOG_ARTICLES.map((article) => ({
    url: `${SITE_URL}/education/${article.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...educationEntries, ...blogEntries];
}
