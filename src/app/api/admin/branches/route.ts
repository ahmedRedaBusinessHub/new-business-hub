import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPost } from "@/lib/api";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const endpoint = `/branches/admin${query ? `?${query}` : ''}`;

    try {
        const res = await apiGet(endpoint, { requireAuth: true });
        const data = await res.json().catch(() => null);
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const res = await apiPost('/branches/admin', body, { requireAuth: true });
        const data = await res.json().catch(() => null);
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
