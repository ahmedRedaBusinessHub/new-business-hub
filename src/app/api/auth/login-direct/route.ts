import { NextRequest, NextResponse } from "next/server";
import { LoginDto, LoginResponse } from "@/types/auth";
import { apiPost, createApiResponse, handleApiError } from "@/lib/api";

/**
 * Direct login API route that bypasses NextAuth's error handling
 * This allows us to get the actual error message (including Arabic text)
 * before calling NextAuth's signIn
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password, country_code, platform, client_info, firebase_token } = body as LoginDto;

    if (!identifier || !password) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: "Identifier and password are required",
          error: "Bad Request",
        },
        { status: 400 }
      );
    }

    const requestBody: LoginDto = {
      identifier,
      password,
    };

    if (country_code) {
      requestBody.country_code = country_code;
    }
    if (platform) {
      requestBody.platform = platform;
    }
    if (client_info) {
      requestBody.client_info = client_info;
    }
    if (firebase_token) {
      requestBody.firebase_token = firebase_token;
    }

    const res = await apiPost("/auth/login", requestBody, {
      requireAuth: false,
    });

    // Parse response
    const text = await res.text();
    let data: LoginResponse | any = {};
    
    try {
      if (text) {
        data = JSON.parse(text);
      }
    } catch (e) {
      // If parsing fails, return the text as message
      return NextResponse.json(
        {
          statusCode: res.status,
          message: text || "Unknown error",
          error: "Parse Error",
        },
        { status: res.status }
      );
    }

    // Return the response as-is (including errors with Arabic text)
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return handleApiError(error, "Failed to process login request");
  }
}

