import { NextRequest, NextResponse } from "next/server";
import { apiPost, createApiResponse, handleApiError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailOrMobile } = body;

    if (!emailOrMobile) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: "Email or mobile is required",
          error: "Bad Request",
        },
        { status: 400 }
      );
    }

    // Backend DTO expects 'mobile' field, but the service searches for both email and mobile
    // So we can send the value as 'mobile' regardless of whether it's an email or mobile number
    const res = await apiPost("/auth/forget-password", { mobile: emailOrMobile }, {
      requireAuth: false,
    });
    return await createApiResponse(res);
  } catch (error: any) {
    return handleApiError(error, "Failed to process forget password request");
  }
}

