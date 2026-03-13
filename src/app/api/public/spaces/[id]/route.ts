import { NextRequest } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // Fetch from backend's public spaces endpoint
        const res = await apiGet(`/coworking-spaces/${id}`, {
            requireAuth: false,
        });

        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, `Failed to fetch space details for ID ${await params.then(p => p.id).catch(() => 'unknown')}`);
    }
}
