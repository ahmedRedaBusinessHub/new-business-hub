import { NextRequest, NextResponse } from "next/server";
import { handleApiError, getToken, getApiUrl } from "@/lib/api";

/**
 * Upload documents for program application (user apply flow).
 * Requires JWT. Returns [{ file_id, name }] to include in POST /api/user-program/apply as upload_documents.
 */
export async function POST(request: NextRequest) {
  try {
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

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const fileNames = formData.getAll("fileNames") as string[];

    if (!files?.length) {
      return NextResponse.json(
        { statusCode: 400, message: "No files provided" },
        { status: 400 }
      );
    }

    const apiUrl = getApiUrl();
    const backendFormData = new FormData();
    files.forEach((file) => backendFormData.append("files", file));
    fileNames.forEach((name) => backendFormData.append("fileNames", name));

    const response = await fetch(`${apiUrl}/user-program/upload-application-documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return handleApiError(error, "Failed to upload application documents");
  }
}
