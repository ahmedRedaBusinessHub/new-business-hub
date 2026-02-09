// app/sitemap.ts
import { MetadataRoute } from "next";
import { apiGet } from "@/lib/api";

const locales = `${process.env.NEXT_PUBLIC_LOCALES}`.split(",");

// Fetch all programs for sitemap
async function getAllPrograms() {
  try {
    const res = await apiGet('/public/programs?limit=1000', { requireAuth: false });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch programs for sitemap", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Add all your static routes
  const staticRoutes = [
    "", // home
    "/login", // login page
    "/admin", // admin dashboard
    "/client", // client dashboard
    "/data-entry", // data entry
    "/store", // store
    "/programs", // programs list
    "/about-us",
    "/contact-us",
    "/faq",
    "/gallery",
    "/incubation",
    "/iso",
    "/team",
    "/workspaces",
    "/privacy",
    "/terms",
    "/refund",
    "/follow-us",
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

  // 3. Add dynamic routes (Programs)
  const programs = await getAllPrograms();
  const programEntries = programs.flatMap((program: any) =>
    locales.map((locale) => ({
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/programs/${program.id}`,
      lastModified: new Date(program.updated_at || program.created_at || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [
            l,
            `${process.env.NEXT_PUBLIC_DOMAIN}/${l}/programs/${program.id}`,
          ])
        ),
      },
    }))
  );

  // 4. Combine all entries
  return [...staticEntries, ...programEntries];
}
