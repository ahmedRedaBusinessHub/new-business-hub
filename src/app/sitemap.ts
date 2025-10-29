// app/sitemap.ts
import { MetadataRoute } from "next";

const locales = `${process.env.NEXT_PUBLIC_LOCALES}`.split(",");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Add all your static routes
  const staticRoutes = [
    "", // home
    "/login", // login page
    "/admin", // admin dashboard
    "/client", // client dashboard
    "/data-entry", // data entry
    "/store", // store
  ];

  // 2. Generate sitemap entries for static routes
  const staticEntries = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [
            l,
            `${process.env.NEXT_PUBLIC_DOMAIN}/${l}${route}`,
          ])
        ),
      },
    }))
  );

  // 3. Add dynamic routes (from database/API)
  // Example:
  // const products = await fetchProducts();
  // const productEntries = products.flatMap((product) =>
  //   locales.map((locale) => ({
  //     url: `${baseUrl}/${locale}/products/${product.slug}`,
  //     lastModified: product.updatedAt,
  //     changeFrequency: "weekly" as const,
  //     priority: 0.6
  //   }))
  // );

  // 4. Combine all entries
  return [...staticEntries /* ...productEntries */];
}
