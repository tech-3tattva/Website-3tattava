import type { MetadataRoute } from "next";

const SITE_URL = "https://www.3tattava.com";

// Private/thin routes kept out of every crawler's index.
const PRIVATE = [
  "/checkout/",
  "/account/",
  "/admin/",
  "/api/",
  "/wishlist/",
  "/order-confirmation/",
  "/search",
];

// Major AI / answer-engine crawlers we explicitly welcome (GEO). Each gets the
// same policy as the default agent so content is indexable but private routes stay out.
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "CCBot",
  "cohere-ai",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "DuckAssistBot",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
