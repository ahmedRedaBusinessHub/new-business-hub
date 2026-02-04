import { NextRequest, NextResponse } from "next/server";
import { apiDelete, createApiResponse, handleApiError } from "@/lib/api";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userProjectId } = await params;
    const body = await req.json();
    const { fileId, refColumn } = body;

    if (!fileId || !refColumn) {
      return NextResponse.json(
        { error: "fileId and refColumn are required" },
        { status: 400 }
      );
    }

    const res = await apiDelete(
      `/user-project/${userProjectId}/remove-file`,
      { fileId, refColumn },
      { requireAuth: true }
    );

    return await createApiResponse(res);
  } catch (error: any) {
    return handleApiError(error, "Failed to remove file");
  }
}
