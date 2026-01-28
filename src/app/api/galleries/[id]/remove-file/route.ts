import { NextRequest, NextResponse } from "next/server";
import { handleApiError, getToken, getApiUrl } from "@/lib/api";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { fileId, refColumn } = body;

    const token = await getToken();
    if (!token) {
      return NextResponse.json(
        {
          statusCode: 401,
          message: "Authentication required",
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const apiUrl = getApiUrl();

    const response = await fetch(`${apiUrl}/galleries/${id}/remove-file`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileId, refColumn }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return handleApiError(error, "Failed to remove file");
  }
}
