import { NextRequest, NextResponse } from "next/server";
import { apiGet, getApiUrl, handleApiError } from "@/lib/api";

/**
 * Proxy route for /public/file endpoint
 * Forwards file requests to the backend public file API
 * Supports query parameters: file_url, main_image_url, image_url, document_ar_url, 
 * document_en_url, thumbnail_url, file_urls[0], image_urls[0], document_urls[0]
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Try to get file_url from various possible parameter names
    const fileUrl = 
      searchParams.get("file_url") ||
      searchParams.get("main_image_url") ||
      searchParams.get("image_url") ||
      searchParams.get("document_ar_url") ||
      searchParams.get("document_en_url") ||
      searchParams.get("thumbnail_url") ||
      searchParams.get("file_urls[0]") ||
      searchParams.get("image_urls[0]") ||
      searchParams.get("document_urls[0]");

    if (!fileUrl) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: "file_url parameter is required",
          error: "Bad Request",
        },
        { status: 400 }
      );
    }

    const apiUrl = getApiUrl();
    
    // Forward the request to backend /public/file endpoint
    const response = await fetch(`${apiUrl}/public/file?file_url=${encodeURIComponent(fileUrl)}`, {
      method: "GET",
      headers: {
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        errorData || {
          statusCode: response.status,
          message: "Failed to fetch file",
          error: "File Not Found",
        },
        { status: response.status }
      );
    }

    // Get the content type from response headers
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const contentDisposition = response.headers.get("content-disposition") || "";

    // Get the file buffer
    const fileBuffer = await response.arrayBuffer();

    // Return the file with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch file");
  }
}

