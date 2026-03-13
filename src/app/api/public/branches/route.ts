import { NextRequest } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "100";

        const backendParams = new URLSearchParams();
        backendParams.append("page", page);
        backendParams.append("limit", limit);
        backendParams.append("status", "1");

        const res = await apiGet(`/branches?${backendParams.toString()}`, {
            requireAuth: false,
        });

        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch public branches");
    }
}
