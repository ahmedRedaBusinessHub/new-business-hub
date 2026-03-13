import { NextRequest, NextResponse } from "next/server";
import { apiPost, createApiResponse, handleApiError } from "@/lib/api";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Fetch from backend's check-availability endpoint
        const res = await apiPost(`/coworking-spaces/check-availability`, body, {
            requireAuth: false,
        });

        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to check space availability");
    }
}
