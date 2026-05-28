import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const routes = ["", "/catalogue", "/tarifs", "/auth/connexion", "/auth/inscription"];

  return ["fr", "en"].flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "/catalogue" ? "daily" : "weekly",
      priority: route === "" ? 1 : 0.7
    }))
  );
}
