
import { NextRequest, NextResponse } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const res = await apiGet(`/public/programs/${id}`, {
            requireAuth: false,
        });

        return await createApiResponse(res);
    } catch (error: any) {
        return handleApiError(error, "Failed to fetch program details");
    }
}
