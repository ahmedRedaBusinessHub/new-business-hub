import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPost } from "@/lib/api";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const endpoint = `/coworking-spaces/admin${query ? `?${query}` : ''}`;

    try {
        const res = await apiGet(endpoint, { requireAuth: true });
        const data = await res.json().catch(() => null);
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        return NextResponse.json({
            statusCode: 500,
            message: "Internal server error"
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const { getToken, getApiUrl } = await import('@/lib/api');
        const token = await getToken();

        const response = await fetch(`${getApiUrl()}/coworking-spaces/admin`, {
            method: 'POST',
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
