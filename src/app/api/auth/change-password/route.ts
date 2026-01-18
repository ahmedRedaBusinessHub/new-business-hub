import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ChangePasswordDto } from "@/types/auth";
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

    const body = await request.json();
    const { old_password, new_password } = body as ChangePasswordDto;

    if (!old_password || !new_password) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: "Old password and new password are required",
          error: "Bad Request",
        },
        { status: 400 }
      );
    }

    if (new_password.length < 6) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: "New password must be at least 6 characters",
          error: "Bad Request",
        },
        { status: 400 }
      );
    }

    const res = await apiPost(
      "/auth/change-password",
      { old_password, new_password },
      {
        accessToken: session.accessToken,
      }
    );
    
    return await createApiResponse(res);
  } catch (error: any) {
    return handleApiError(error, "Failed to change password");
  }
}

