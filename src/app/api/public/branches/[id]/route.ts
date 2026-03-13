import { NextRequest } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id }: any = await params;
    try {


        const res = await apiGet(`/branches/${id}`, {
            requireAuth: false,
        });

        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, `Failed to fetch branch ${id} details`);
    }
}
