import { NextRequest, NextResponse } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await apiGet(`/public/news/${id}`);

    if (!res.ok) {
      return await createApiResponse(res);
    }

    const data = await res.json();

    return NextResponse.json({
      data
    });
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch programs");
  }
}
