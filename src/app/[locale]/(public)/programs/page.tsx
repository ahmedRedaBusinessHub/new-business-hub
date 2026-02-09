import ProgramsPage from "@/components/features/ProgramsPage";
import { createGenerateMetadata } from "@/lib/geo";
import { apiGet } from "@/lib/api";

export const generateMetadata = createGenerateMetadata("allPrograms", "programs");

async function Programs() {
  let initialData = null;
  try {
    const res = await apiGet('/public/programs?page=1&limit=9', { requireAuth: false });
    if (res.ok) {
      initialData = await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch programs for SSR", e);
  }

  // Prepare JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": initialData?.data?.map((program: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Event",
        "name": program.name_en || program.name_ar,
        "description": program.detail_en || program.detail_ar,
        "startDate": program.from_datetime,
        "endDate": program.to_datetime,
        "image": program.main_image_url,
        "url": `${process.env.NEXT_PUBLIC_DOMAIN}/programs/${program.id}`
      }
    })) || []
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProgramsPage initialData={initialData} />
    </>
  );
}

export default Programs;
