import type { SpaceFilters, SpacesListResponse, SpaceDetailsResponse } from "@/types/api/spaces";
import type { AvailabilityRequest, AvailabilityResponse } from "@/types/api/availability";
import { apiPost, apiPatch, apiDelete } from "@/lib/api";
import type { CreateSpaceData, UpdateSpaceData } from "@/lib/schemas/space";

/**
 * Fetches a paginated list of coworking spaces based on filters.
 */
export async function fetchSpaces(
  filters?: SpaceFilters,
  page = 1,
  limit = 10,
): Promise<SpacesListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters) {
    if (filters.branch_id !== undefined)
      params.append("branch_id", filters.branch_id.toString());
    if (filters.space_type !== undefined)
      params.append("space_type", filters.space_type.toString());
    if (filters.min_capacity !== undefined)
      params.append("min_capacity", filters.min_capacity.toString());
    if (filters.max_capacity !== undefined)
      params.append("max_capacity", filters.max_capacity.toString());
    if (filters.min_price !== undefined)
      params.append("min_price", filters.min_price.toString());
    if (filters.max_price !== undefined)
      params.append("max_price", filters.max_price.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.status !== undefined)
      params.append("status", filters.status.toString());

    if (filters.amenity_ids && filters.amenity_ids.length > 0) {
      filters.amenity_ids.forEach((id) =>
        params.append("amenity_ids[]", id.toString()),
      );
    }
  }

  const response = await fetch(`/api/public/spaces?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch coworking spaces");
  }

  const responseData = await response.json();

  // Backend response is wrapped by TransformResponseInterceptor:
  // { statusCode, data: { status, data: [...spaces...], total, page, limit } }
  const inner = responseData.data;
  return {
    data: inner?.data || [],
    total: inner?.total || 0,
    page: inner?.page || page,
    limit: inner?.limit || limit,
    totalPages: Math.ceil((inner?.total || 0) / (inner?.limit || limit)),
  };
}

/**
 * Fetches detailed information for a specific coworking space.
 */
export async function fetchSpaceDetails(id: string | number): Promise<SpaceDetailsResponse> {
  const baseUrl = process.env.EXTERNAL_API_URL || "http://localhost:8000/api/v1";
  const url = typeof window !== 'undefined'
    ? `/api/public/spaces/${id}`
    : `${baseUrl}/coworking-spaces/${id}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("🚀 ~ fetchSpaceDetails ~ response:", response)

  if (!response.ok) {
    throw new Error(`Failed to fetch details for space ${id}`);
  }

  const responseData = await response.json();
  // The frontend proxy returns: { statusCode, data: { status, data: {...space...}, message } }
  // The actual space object is at responseData.data.data
  const outerData = responseData.data;
  const space = outerData?.data ?? outerData;
  return space;
}

/**
 * Checks availability for a specific coworking space and time period.
 */
export async function fetchAvailability(request: AvailabilityRequest): Promise<AvailabilityResponse> {
  const response = await fetch('/api/public/spaces/check-availability', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to check availability for space ${request.space_id}`);
  }

  const responseData = await response.json();
  return responseData.data;
}

/**
 * Creates a new coworking space (Admin)
 */
export async function createSpace(data: CreateSpaceData): Promise<SpaceDetailsResponse> {
  const payload: any = { ...data };
  payload.hourly_rate = payload.hourly_rate ?? 0;
  payload.daily_rate = payload.daily_rate ?? 0;
  payload.weekly_rate = payload.weekly_rate ?? 0;
  payload.monthly_rate = payload.monthly_rate ?? 0;

  if (!payload.code) {
    payload.code = `SPACE-${Math.floor(Math.random() * 10000)}-${Date.now().toString().slice(-4)}`;
  }

  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => formData.append(`${key}[]`, v));
      } else {
        formData.append(key, value as string);
      }
    }
  }

  const response = await fetch('/api/admin/spaces', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to create coworking space");
  }
  const result = await response.json();
  return result.data || result;
}

/**
 * Updates an existing coworking space (Admin)
 */
export async function updateSpace(id: number | string, data: UpdateSpaceData): Promise<SpaceDetailsResponse> {
  const payload: any = { ...data };
  if (payload.hourly_rate === undefined) payload.hourly_rate = 0;
  if (payload.daily_rate === undefined) payload.daily_rate = 0;
  if (payload.weekly_rate === undefined) payload.weekly_rate = 0;
  if (payload.monthly_rate === undefined) payload.monthly_rate = 0;

  // The backend DTO explicitly omits these fields from update operations
  delete payload.branch_id;
  delete payload.code;
  delete payload.space_type;

  // Don't send empty objects or undefined operating_hours as they cause validation errors
  if (payload.operating_hours === undefined || payload.operating_hours === null) {
    delete payload.operating_hours;
  }

  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          value.forEach(v => formData.append(`${key}[]`, v));
        }
      } else {
        formData.append(key, value as string);
      }
    }
  }

  const response = await fetch(`/api/admin/spaces/${id}`, {
    method: 'PATCH',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to update space ${id}`);
  }
  const result = await response.json();
  return result.data || result;
}

/**
 * Deletes a coworking space (Admin)
 */
export async function deleteSpace(id: number | string): Promise<void> {
  const response = await fetch(`/api/admin/spaces/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to delete space ${id}`);
  }
}

/**
 * Uploads images for a coworking space (Admin)
 */
export async function uploadImages(spaceId: number | string, files: FileList | File[]): Promise<any> {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append("images[]", file);
  });

  // Need to handle FormData specifically because it is not JSON
  // If apiPost stringifies by default, we'll just use raw fetch
  const { getToken, getApiUrl } = await import('@/lib/api');
  const token = await getToken();

  const response = await fetch(`${getApiUrl()}/api/admin/spaces/${spaceId}/images`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload images for space ${spaceId}`);
  }
  return response.json();
}
