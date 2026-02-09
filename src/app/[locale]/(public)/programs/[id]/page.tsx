import ProgramViewPage from "@/components/features/ProgramViewPage";
import { apiGet } from "@/lib/api";
import { getLocalizedLabel } from "@/lib/localizedLabel";
import { Metadata } from "next";

// Fetch program data helper
async function getProgram(id: string) {
  try {
    const res = await apiGet(`/public/programs/${id}`, { requireAuth: false });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch program", error);
    return null;
  }
}

// Generate metadata for SEO and GEO
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id, locale } = await params;
  const program = await getProgram(id);

  if (!program) {
    return {
      title: "Program Not Found",
      description: "The requested program could not be found.",
    };
  }

  const title = getLocalizedLabel(program.name_en, program.name_ar, locale);
  const description = getLocalizedLabel(program.detail_en, program.detail_ar, locale);

  return {
    title: title,
    description: description,
    openGraph: {
      title: title || "",
      description: description || "",
      images: program.main_image_url ? [program.main_image_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: title || "",
      description: description || "",
      images: program.main_image_url ? [program.main_image_url] : [],
    },
  };
}

// Generate static params for SSG
export async function generateStaticParams() {
  try {
    // Fetch first page of programs
    const res = await apiGet('/public/programs?limit=100', { requireAuth: false });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data.map((program: any) => ({
      id: program.id.toString(),
    }));
  } catch (e) {
    console.error("Failed to generate static params", e);
    return [];
  }
}

export default async function Program({ params }: any) {
  const { id } = await params;
  const program = await getProgram(id);

  // JSON-LD for Course/Event
  const jsonLd = program ? {
    "@context": "https://schema.org",
    "@type": "Event", // Or Course, or Product depending on the program nature
    "name": program.name_en || program.name_ar,
    "description": program.detail_en || program.detail_ar,
    "startDate": program.from_datetime,
    "endDate": program.to_datetime,
    "image": program.main_image_url,
    "offers": {
      "@type": "Offer",
      "price": program.price || "0",
      "priceCurrency": "SAR", // Or dynamic if available
      "availability": "https://schema.org/InStock"
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProgramViewPage initialData={program} />
    </>
  );
}
