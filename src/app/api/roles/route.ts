import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPost, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const res = await apiGet("/roles", {
      requireAuth: true,
    });

    if (!res.ok) {
      return await createApiResponse(res);
    }

    const data = await res.json();
    let allData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

    // Apply search filter
    if (search) {
      const query = search.toLowerCase();
      allData = allData.filter((role: any) => {
        const name = (role.name || "").toLowerCase();
        const namespace = (role.namespace || "").toLowerCase();
        const status = role.status === 1 ? "active" : "inactive";
        return (
          name.includes(query) ||
          namespace.includes(query) ||
          status.includes(query)
        );
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
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch roles");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await apiPost("/roles", body, { requireAuth: true });
    return await createApiResponse(res, { successStatus: 201 });
  } catch (error: any) {
    return handleApiError(error, "Failed to create role");
  }
}
