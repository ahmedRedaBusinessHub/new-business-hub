import { NextRequest, NextResponse } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const res = await apiGet(`/user-project/project/${projectId}`, {
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
      allData = allData.filter((userProject: any) => {
        const userName = `${userProject.users_user_project_user_idTousers?.first_name || ""} ${userProject.users_user_project_user_idTousers?.last_name || ""}`.toLowerCase();
        const userEmail = (userProject.users_user_project_user_idTousers?.email || "").toLowerCase();
        const companyName = (userProject.company_name || "").toLowerCase();
        const projectName = (userProject.project_name || "").toLowerCase();
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
    return handleApiError(error, "Failed to fetch user projects");
  }
}
