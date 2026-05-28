import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/fr/admin", "/en/admin", "/fr/tableau-de-bord", "/en/tableau-de-bord"]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
