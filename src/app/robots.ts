// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    rules: [
      {
        userAgent: "*",
        allow: isProduction
          ? [
              "/", // Allow homepage
              "/login", // Allow login page
              "/client/*", // Allow client pages
              "/store/*", // Allow store pages
            ]
          : [],
        disallow: isProduction
          ? [
              "/api/*", // Block API routes
              "/admin/*", // Block admin pages
              "/*settings", // Block settings pages
              "/*.json", // Block JSON files
            ]
          : ["/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: "/private/*",
      },
    ],
    sitemap: `https://${process.env.NEXT_PUBLIC_DOMAIN}/sitemap.xml`,
  };
}
