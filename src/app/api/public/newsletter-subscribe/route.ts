import { NextRequest, NextResponse } from "next/server";
import { apiPost, createApiResponse, handleApiError } from "@/lib/api";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // call backend /public/newsletter-subscribe
        // requireAuth: false/undefined means no auth token will be attached or checked (if implementation follows)
        const res = await apiPost("/public/newsletter-subscribe", body);
        return await createApiResponse(res, { successStatus: 201 });
    } catch (error: any) {
        return handleApiError(error, "Failed to create newsletter subscription");
    }
}
