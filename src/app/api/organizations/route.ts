import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPost, createApiResponse, handleApiError } from "@/lib/api";
import type { Organization } from "@/types/entities";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const res = await apiGet("/organizations?limit=1000", {
      requireAuth: true,
    });

    if (!res.ok) {
      return await createApiResponse(res);
    }

    const data = await res.json();
    let allData: Organization[] = Array.isArray(data.data?.data) ? data.data.data : Array.isArray(data.data) ? data.data : [];

    // Apply search filter
    if (search) {
      const query = search.toLowerCase();
      allData = allData.filter((org: Organization) => {
        const name = (org.name || "").toLowerCase();
        const namespace = (org.namespace || "").toLowerCase();
        const email = (org.email || "").toLowerCase();
        return name.includes(query) || namespace.includes(query) || email.includes(query);
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
    return handleApiError(error, "Failed to fetch organizations");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await apiPost("/organizations", body, { requireAuth: true });
    return await createApiResponse(res, { successStatus: 201 });
  } catch (error: unknown) {
    return handleApiError(error, "Failed to create organization");
  }
}
