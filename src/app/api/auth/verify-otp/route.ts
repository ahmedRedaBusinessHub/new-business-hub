import { NextRequest, NextResponse } from "next/server";
import { VerifyOtpDto, VerifyOtpResponse } from "@/types/auth";
import { apiPost, createApiResponse, handleApiError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, otp, type, channel, country_code } = body as VerifyOtpDto;

    if (!identifier || !otp || !type || !channel) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: "Missing required fields",
          error: "Bad Request",
        },
        { status: 400 }
      );
    }

    const requestBody: VerifyOtpDto = {
      identifier,
      otp,
      type,
      channel,
    };

    if (country_code) {
      requestBody.country_code = country_code;
    }

    const res = await apiPost("/auth/verify-otp", requestBody);
    return await createApiResponse(res);
  } catch (error: any) {
    return handleApiError(error, "Failed to verify OTP");
  }
}

