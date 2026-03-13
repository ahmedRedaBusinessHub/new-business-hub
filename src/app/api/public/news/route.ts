import { NextRequest } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search") || "";

    const backendParams = new URLSearchParams();
    backendParams.append("page", page);
    backendParams.append("limit", limit);
    if (search) {
      backendParams.append("search", search);
      backendParams.append("search_by", "title_ar,title_en,detail_ar,detail_en");
    }

    const res = await apiGet(`/public/news?${backendParams.toString()}`);
    return await createApiResponse(res);
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch news");
  }
}
