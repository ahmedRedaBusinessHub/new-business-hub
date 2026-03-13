import { NextRequest, NextResponse } from "next/server";
import { Project, CreateProjectDto } from "@/types/api/projects";
import { apiGet, apiPost, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const res = await apiGet("/projects?limit=1000", {
      requireAuth: true,
    });

    if (!res.ok) {
      return await createApiResponse(res);
    }

    const data = await res.json();
    let allData: Project[] = Array.isArray(data.data?.data) ? data.data.data : Array.isArray(data.data) ? data.data : [];

    // Apply search filter
    if (search) {
      const query = search.toLowerCase();
      allData = allData.filter((item: Project) => {
        const titleAr = (item.title_ar || "").toLowerCase();
        const titleEn = (item.title_en || "").toLowerCase();
        const detailAr = (item.detail_ar || "").toLowerCase();
        const detailEn = (item.detail_en || "").toLowerCase();
        return titleAr.includes(query) || titleEn.includes(query) || detailAr.includes(query) || detailEn.includes(query);
      });
    }

    // Apply pagination
    const total = allData.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = allData.slice(start, end);

    return NextResponse.json({
      data: paginatedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch projects");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateProjectDto;
    const res = await apiPost("/projects", body, { requireAuth: true });
    return await createApiResponse(res, { successStatus: 201 });
  } catch (error: unknown) {
    return handleApiError(error, "Failed to create project");
  }
}
