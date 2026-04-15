import type { MetadataRoute } from "next";

const SITE_URL = "https://www.3tattava.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/checkout/",
          "/account/",
          "/wishlist/",
          "/order-confirmation/",
          "/api/",
          "/search",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/checkout/", "/account/", "/api/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/checkout/", "/account/", "/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/checkout/", "/account/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
