import { NextRequest, NextResponse } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get("lang") || "en";

    const res = await apiGet(`/objects/navigation?lang=${lang}`, {
      requireAuth: true,
    });

    return await createApiResponse(res);
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch navigation");
  }
}
