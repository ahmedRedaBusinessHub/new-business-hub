import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPatch, apiDelete } from "@/lib/api";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const res = await apiGet(`/coworking-spaces/admin/${id}`, { requireAuth: true });
        const data = await res.json().catch(() => null);
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        return NextResponse.json({
            statusCode: 500,
            message: "Internal server error"
        }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const formData = await request.formData();
        const { getToken, getApiUrl } = await import('@/lib/api');
        const token = await getToken();

        const response = await fetch(`${getApiUrl()}/coworking-spaces/admin/${id}`, {
            method: 'PATCH',
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        const data = await response.json().catch(() => null);
        return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
        return NextResponse.json({
            statusCode: 500,
            message: "Internal server error"
        }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const res = await apiDelete(`/coworking-spaces/admin/${id}`, undefined, { requireAuth: true });
        const data = await res.json().catch(() => null);
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        return NextResponse.json({
            statusCode: 500,
            message: "Internal server error"
        }, { status: 500 });
    }
}
