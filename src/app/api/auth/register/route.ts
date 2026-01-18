import { NextRequest, NextResponse } from "next/server";
import { RegisterDto, RegisterResponse } from "@/types/auth";
import { apiPost, createApiResponse, handleApiError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      username,
      email,
      country_code,
      mobile,
      password,
      first_name,
      last_name,
    } = body as RegisterDto;

    // Validation
    if (!username || !email || !country_code || !mobile || !password || !first_name) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: "Missing required fields",
          error: "Bad Request",
        },
        { status: 400 }
      );
    }

    const requestBody: RegisterDto = {
      username,
      email,
      country_code,
      mobile,
      password,
      first_name,
      ...(last_name && { last_name }),
    };

    const res = await apiPost("/auth/register", requestBody);
    return await createApiResponse(res);
  } catch (error: any) {
    return handleApiError(error, "Failed to register user");
  }
}

