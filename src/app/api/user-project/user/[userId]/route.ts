import { NextRequest, NextResponse } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const res = await apiGet(`/user-project/user/${userId}`, {
      requireAuth: true,
    });

    if (!res.ok) {
      return await createApiResponse(res);
    }

    const data = await res.json();
    const list = Array.isArray(data.data) ? data.data : [];

    return NextResponse.json({
      ...data,
      data: list,
    });
  } catch (error: unknown) {
    return handleApiError(error, "Failed to fetch user applied projects");
  }
}
