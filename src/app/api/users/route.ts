import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPost, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const res = await apiGet("/users", {
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
      allData = allData.filter((user: any) => {
        const firstName = (user.first_name || "").toLowerCase();
        const lastName = (user.last_name || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        const username = (user.username || "").toLowerCase();
        const mobile = (user.mobile || "").toLowerCase();
        const fullName = `${firstName} ${lastName}`.trim().toLowerCase();
        const status = user.status === 1 ? "active" : "inactive";
        return (
          firstName.includes(query) ||
          lastName.includes(query) ||
          fullName.includes(query) ||
          email.includes(query) ||
          username.includes(query) ||
          mobile.includes(query) ||
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
    return handleApiError(error, "Failed to fetch users");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await apiPost("/users", body, { requireAuth: true });
    return await createApiResponse(res, { successStatus: 201 });
  } catch (error: any) {
    return handleApiError(error, "Failed to create user");
  }
}
