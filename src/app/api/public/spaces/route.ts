import { NextRequest } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = new URLSearchParams(searchParams.toString());

    // Fetch from backend's public spaces endpoint
    const res = await apiGet(`/coworking-spaces?${queryParams.toString()}`, {
      requireAuth: false,
    });
    console.log("🚀 ~ GET ~ res: coworking-spaces", res);

    return await createApiResponse(res);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch public spaces");
  }
}
