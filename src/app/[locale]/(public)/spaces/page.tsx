import { getTranslations } from "next-intl/server";
import { SpacesView } from "@/components/features/spaces/spaces-view";
import { SpacesHero } from "@/components/features/spaces/spaces-hero";
import { apiGet } from "@/lib/api";
import { SpaceFilters, SpaceType, SpacesListResponse } from "@/types/api/spaces";

// Revalidate cached space data every hour (ISR)
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("workspaces_meta_title"),
    description: t("workspaces_meta_description"),
  };
}

export default async function SpacesPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}) {
  const searchParams = await props.searchParams;

  // Parse filters from searchParams
  const page = parseInt((searchParams.page as string) || "1");
  const limit = parseInt((searchParams.limit as string) || "12");

  const filters: SpaceFilters = {
    branch_id: searchParams.branch_id
      ? parseInt(searchParams.branch_id as string)
      : undefined,
    space_type: searchParams.space_type
      ? (searchParams.space_type as SpaceType)
      : undefined,
    min_capacity: searchParams.min_capacity
      ? parseInt(searchParams.min_capacity as string)
      : undefined,
    max_capacity: searchParams.max_capacity
      ? parseInt(searchParams.max_capacity as string)
      : undefined,
    min_price: searchParams.min_price
      ? parseInt(searchParams.min_price as string)
      : undefined,
    max_price: searchParams.max_price
      ? parseInt(searchParams.max_price as string)
      : undefined,
    search: searchParams.search as string | undefined,
  };

  // Build query string for API
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters.branch_id)
    queryParams.append("branch_id", filters.branch_id.toString());
  if (filters.space_type)
    queryParams.append("space_type", filters.space_type.toString());
  if (filters.min_capacity)
    queryParams.append("min_capacity", filters.min_capacity.toString());
  if (filters.max_capacity)
    queryParams.append("max_capacity", filters.max_capacity.toString());
  if (filters.min_price)
    queryParams.append("min_price", filters.min_price.toString());
  if (filters.max_price)
    queryParams.append("max_price", filters.max_price.toString());
  if (filters.search) queryParams.append("search", filters.search);

  // Fetch initial spaces data and branches in parallel on the server
  let initialData: SpacesListResponse | null = null;
  let branches: { id: number; name_en: string; name_ar: string }[] = [];

  try {
    const [spacesRes, branchesRes] = await Promise.all([
      apiGet(`/coworking-spaces?${queryParams.toString()}`, { requireAuth: false }),
      apiGet(`/branches?page=1&limit=100&status=1`, { requireAuth: false }),
    ]);

    if (spacesRes.ok) {
      // Backend response is wrapped by TransformResponseInterceptor:
      // { statusCode, data: { status, data: [...spaces...], total, page, limit } }
      const x = await spacesRes.json();
      const inner = x.data;
      initialData = {
        data: inner?.data || [],
        total: inner?.total || 0,
        page: inner?.page || page,
        limit: inner?.limit || limit,
        totalPages: Math.ceil((inner?.total || 0) / (inner?.limit || limit)),
      };
    }

    if (branchesRes.ok) {
      // Backend response is wrapped: { statusCode, data: { data: [...branches...], total, page, limit } }
      const b = await branchesRes.json();
      branches = b.data?.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch initial spaces/branches data:", error);
  }

  const fallbackData: SpacesListResponse = initialData || {
    data: [],
    page: page,
    totalPages: 1,
    limit: limit,
    total: 0,
  };

  return (
    <div className="pb-2">

      <SpacesHero />



      <SpacesView
        initialData={fallbackData}
        initialFilters={filters}
        initialPage={page}
        branches={branches}
      />

    </div>
  );
}
