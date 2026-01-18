import { NextRequest, NextResponse } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const res = await apiGet(`/reset-password-tokens/user/${userId}`, {
      requireAuth: true,
    });

    if (!res.ok) {
      return await createApiResponse(res);
    }

    const data = await res.json();
    let allData = Array.isArray(data.data) ? data.data : [];

    // Apply search filter
    if (search) {
      const query = search.toLowerCase();
      allData = allData.filter((token: any) => {
        const tokenStr = (token.token || "").toLowerCase();
        const used = token.used ? "used" : "unused";
        const expiresAt = token.expires_at
          ? new Date(token.expires_at).toLocaleString().toLowerCase()
          : "";
        const createdAt = token.created_at
          ? new Date(token.created_at).toLocaleDateString().toLowerCase()
          : "";
        return (
          tokenStr.includes(query) ||
          used.includes(query) ||
          expiresAt.includes(query) ||
          createdAt.includes(query)
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
    return handleApiError(error, "Failed to fetch reset password tokens");
  }
}

