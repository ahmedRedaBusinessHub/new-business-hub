import { NextRequest } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET() {
    try {
        const res = await apiGet("/subscriptions/plans", { requireAuth: false });
        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch subscription plans");
    }
}
