// app/sitemap.ts
import { MetadataRoute } from "next";

const locales = ["en", "ar", "es"];
const baseUrl = "https://yourdomain.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/about", "/contact", "/admin", "/client"];

  const sitemapEntries = routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}${route}`])
        ),
      },
    }))
  );

  return sitemapEntries;
}
