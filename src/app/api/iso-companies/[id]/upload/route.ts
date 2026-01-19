import { NextRequest, NextResponse } from "next/server";
import { handleApiError, getToken, getApiUrl } from "@/lib/api";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const refColumn = (formData.get("refColumn") as string) || "image_id";

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

    // Forward the FormData to backend
    const backendFormData = new FormData();
    const files = formData.getAll("files") as File[];
    files.forEach((file) => {
      backendFormData.append("files", file);
    });
    backendFormData.append("refColumn", refColumn);

    const response = await fetch(`${apiUrl}/iso-companies/${id}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "role-namespace": "admin",
      },
      body: backendFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return handleApiError(error, "Failed to upload file");
  }
}
