import NewsDetail from "@/components/features/NewsDetail";
import { getGeoData, middleEastConfig } from "@/lib/geo";
import { apiGet } from "@/lib/api";

async function fetchNewsById(id: string) {
  try {
    const res = await apiGet(`/public/news/${id}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch news", error);
  }
  return null;
}

// Generate metadata for SEO and GEO
export async function generateMetadata({ params }: any) {
  const { id, locale } = await params;
  const newsItem = await fetchNewsById(id);

  if (!newsItem) {
    return {
      title: "News Not Found",
      description: "The requested news article could not be found.",
    };
  }

  const geo = await getGeoData();
  const isRTL = middleEastConfig.isRTLLanguage(geo.country) || locale === "ar";

  const title = isRTL ? newsItem.title_ar : (newsItem.title_en || newsItem.title_ar);
  const description = (isRTL ? newsItem.detail_ar : (newsItem.detail_en || newsItem.detail_ar)) || "";

  // Truncate description if too long
  const truncatedDesc = description.substring(0, 160) + (description.length > 160 ? "..." : "");

  // GEO-specific title and description
  const geoTitle = title;

  let finalTitle = isRTL
    ? `${geoTitle} | ${process.env.NEXT_PUBLIC_SITE_NAME_AR || "بيزنس هب"}`
    : `${geoTitle} | ${process.env.NEXT_PUBLIC_SITE_NAME_EN || "Business Hub"}`;

  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "https://businesshub.sa";
  const canonicalUrl = `${baseUrl}/${locale}/news/${id}`;

  return {
    title: finalTitle,
    description: truncatedDesc,
    keywords: [title, "Business Hub", "News", "Entrepreneurship"].join(", "),

    // Language and direction
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": `${baseUrl}/ar/news/${id}`,
        "ar-SA": `${baseUrl}/ar/news/${id}`,
        "en-US": `${baseUrl}/en/news/${id}`,
      },
    },

    // Open Graph
    openGraph: {
      title: finalTitle,
      description: truncatedDesc,
      url: canonicalUrl,
      siteName: isRTL
        ? (process.env.NEXT_PUBLIC_SITE_NAME_AR || "بيزنس هب")
        : (process.env.NEXT_PUBLIC_SITE_NAME_EN || "Business Hub"),
      images: [
        {
          url: newsItem.main_image_url || "/images/logo.svg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: isRTL ? "ar_SA" : "en_US",
      type: "article",
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: truncatedDesc,
      images: [newsItem.main_image_url || "/images/logo.svg"],
    },
  };
}

export default async function NewsDetailPage() {
  return <NewsDetail />;
}
