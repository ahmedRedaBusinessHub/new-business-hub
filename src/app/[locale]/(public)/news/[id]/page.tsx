//  import { NewsInterface } from "@/app/admin/projects/page";

import NewsDetail from "@/components/features/NewsDetail";

// import { fetchNews,fetchNewsById } from "@/lib/api";
// import { notFound } from "next/navigation";

// Generate metadata for SEO and GEO
// Generate metadata for SEO and GEO
// export async function generateMetadata({ params }: any) {
//   const { id, lang } = await params;
//   const project: ProjectInterface = await fetchProjectById(id);

//   console.log("🚀 ~ generateMetadata ~ project:", project);

//   if (!project) {
//     return {
//       title: "project Not Found",
//       description: "The requested project could not be found.",
//     };
//   }
//   const [{ translations }, geo]: any = await Promise.all([
//     getI18nProps(lang),
//     getGeoData(),
//   ]);

//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
//   const canonicalUrl = `${baseUrl}/ar/projects/${id}`;

//   // Check if it's a Middle Eastern country for RTL support
//   const isRTL = middleEastConfig.isRTLLanguage(geo.country);
//   let isAr = isRTL || lang == "ar";
//   let title = project[isAr ? "ar_name" : "en_name"];
//   let doc = project[isAr ? "ar_description" : "en_description"] || "";
//   // GEO-specific title and description
//   const geoTitle = `${title} | ${doc}`;
//   const geoDescription = `${title} | ${doc}`;
//   let lastTitle = isRTL
//     ? `${geoTitle} | ${process.env.NEXT_PUBLIC_SITE_NAME_AR} - ${geo.country}`
//     : `${geoTitle} | ${process.env.NEXT_PUBLIC_SITE_NAME_EN} - ${geo.country}`;
//   lastTitle =
//     lastTitle.length > 160 ? `${lastTitle.substring(0, 160)}...` : lastTitle;

//   return {
//     title: lastTitle,
//     description: geoDescription,
//     keywords: title.split(" ").join(", ") || translations?.homeSEO?.keywords,

//     // Language and direction
//     metadataBase: new URL(baseUrl),
//     alternates: {
//       canonical: canonicalUrl,
//       languages: {
//         "x-default": canonicalUrl,
//         "ar-SA": `${baseUrl}/ar/projects/${id}`,
//         "en-US": `${baseUrl}/en/projects/${id}`,
//       },
//     },

//     // Open Graph with Arabic support
//     openGraph: {
//       title: geoTitle,
//       description: geoDescription,
//       url: canonicalUrl,
//       siteName: isRTL
//         ? process.env.NEXT_PUBLIC_SITE_NAME_AR
//         : process.env.NEXT_PUBLIC_SITE_NAME_EN,
//       images: [
//         {
//           url: project.main_image,
//           width: 1200,
//           height: 630,
//           alt: geoTitle,
//         },
//       ],
//       locale: geo.language,
//       type: "website",
//     },

//     // Twitter
//     twitter: {
//       card: "summary_large_image",
//       title: geoTitle,
//       description: geoDescription,
//       images: [project.main_image],
//     },
//   };
// }

// Generate static params for SSG
export async function generateStaticParams() {
  const projects = [{ id: 1 }]; //await fetchNews();

  return projects.map((project: any) => ({
    id: project.id.toString(),
  }));
}
export default async function Project({ params }: any) {
  return <NewsDetail />;
  //   const { id } = await params;
  //   if (!isNaN(id)) {
  //     const project: NewsInterface = await fetchNewsById(id);
  //     if (project.ar_name || project.en_name) {
  //       return
  //     }
  //   }
  //   return notFound();
}
