import { NextRequest } from 'next/server';
import { apiPatch, createApiResponse, handleApiError } from '@/lib/api';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const res = await apiPatch(`/admin/additional-services/catalog/${id}/status`, body, { requireAuth: true });
    return await createApiResponse(res);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to update service status');
  }
}
