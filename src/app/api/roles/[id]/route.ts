import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPatch, apiDelete, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await apiGet(`/roles/${id}`, {
      requireAuth: true,
    });
    return await createApiResponse(res);
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch role");
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const res = await apiPatch(`/roles/${id}`, body, {
      requireAuth: true,
    });
    return await createApiResponse(res);
  } catch (error: any) {
    return handleApiError(error, "Failed to update role");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await apiDelete(`/roles/${id}`, undefined, {
      requireAuth: true,
    });
    return await createApiResponse(res);
  } catch (error: any) {
    return handleApiError(error, "Failed to delete role");
  }
}
