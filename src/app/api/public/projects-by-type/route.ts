import { NextRequest, NextResponse } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "1";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const searchBy = searchParams.get("search_by") || "";
    const include = searchParams.get("include") || "";

    // Build query params for backend API
    const queryParams = new URLSearchParams({
      type,
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      queryParams.append("search", search);
    }

    if (searchBy) {
      queryParams.append("search_by", searchBy);
    }

    if (include) {
      queryParams.append("include", include);
    }

    const res = await apiGet(`/public/projects-by-type?${queryParams.toString()}`);

    if (!res.ok) {
      return await createApiResponse(res);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch projects by type");
  }
}
