import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPatch, apiDelete } from "@/lib/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const res = await apiGet(`/branches/admin/${id}`, { requireAuth: true });
        const data = await res.json().catch(() => null);
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const res = await apiPatch(`/branches/admin/${id}`, body, { requireAuth: true });
        const data = await res.json().catch(() => null);
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const res = await apiDelete(`/branches/admin/${id}`, undefined, { requireAuth: true });
        const data = await res.json().catch(() => null);
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
