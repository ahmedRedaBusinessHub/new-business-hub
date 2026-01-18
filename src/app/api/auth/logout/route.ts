import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { apiPost, createApiResponse } from "@/lib/api";

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

    // Call the external logout API with Bearer token
    // The backend will extract the token and invalidate it
    const res = await apiPost("/auth/logout", undefined, {
      accessToken: session.accessToken,
    });

    let data: any = {};
    try {
      if (res.ok) {
        data = await res.json();
      } else {
        // Try to parse error response, but don't fail if it fails
        try {
          data = await res.json();
        } catch (e) {
          console.warn("Failed to parse logout API error response");
        }
      }
    } catch (e) {
      console.warn("Failed to parse logout API response:", e);
    }

    // Return success even if external API fails (we still want to logout locally)
    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
        ...data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Logout error:", error);
    // Still return success to allow local logout even if API call fails
    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );
  }
}

