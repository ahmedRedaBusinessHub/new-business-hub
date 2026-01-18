import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { apiPost, createApiResponse, handleApiError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.accessToken) {
      return NextResponse.json(
        {
          statusCode: 401,
          message: "Not authenticated",
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const res = await apiPost("/auth/verify-required", undefined, {
      accessToken: session.accessToken,
    });
    
    return await createApiResponse(res);
  } catch (error: any) {
    return handleApiError(error, "Failed to check verification status");
  }
}

