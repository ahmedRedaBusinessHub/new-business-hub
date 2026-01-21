import { NextRequest, NextResponse } from "next/server";
import { apiPost, createApiResponse, handleApiError } from "@/lib/api";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { identifier, otp, newPassword } = body;

        if (!identifier || !otp || !newPassword) {
            return NextResponse.json(
                {
                    statusCode: 400,
                    message: "All fields are required",
                    error: "Bad Request",
                },
                { status: 400 }
            );
        }

        const res = await apiPost("/auth/reset-password", body, {
            requireAuth: false,
        });
        return await createApiResponse(res);
    } catch (error: any) {
        return handleApiError(error, "Failed to process reset password request");
    }
}
