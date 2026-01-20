import { NextRequest, NextResponse } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    const { programId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const res = await apiGet(`/user-program/program/${programId}`, {
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
      allData = allData.filter((userProgram: any) => {
        const userName = `${userProgram.users_user_program_user_idTousers?.first_name || ""} ${userProgram.users_user_program_user_idTousers?.last_name || ""}`.toLowerCase();
        const userEmail = (userProgram.users_user_program_user_idTousers?.email || "").toLowerCase();
        const companyName = (userProgram.company_name || "").toLowerCase();
        const projectName = (userProgram.project_name || "").toLowerCase();
        return userName.includes(query) || userEmail.includes(query) || companyName.includes(query) || projectName.includes(query);
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
    return handleApiError(error, "Failed to fetch user programs");
  }
}
