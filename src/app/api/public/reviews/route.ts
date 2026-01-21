import { NextRequest, NextResponse } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Construct query parameters
    const query = new URLSearchParams();
    searchParams.forEach((value, key) => query.append(key, value));

    // Ensure we search in the right fields if search is present
    if (searchParams.has('search') && !searchParams.has('search_by')) {
      query.set('search_by', 'name_en,name_ar,comment_en,comment_ar');
    }

    const res = await apiGet(`/public/reviews?${query.toString()}`);

    return await createApiResponse(res);
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch reviews");
  }
}
