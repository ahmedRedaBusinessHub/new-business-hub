import { NextRequest } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const query = new URL(request.url).searchParams.toString();
    const res = await apiGet(`/reports/utilization${query ? `?${query}` : ""}`, { requireAuth: true });
    return await createApiResponse(res);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch utilization report");
  }
}
