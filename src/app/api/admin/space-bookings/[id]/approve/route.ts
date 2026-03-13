import { NextRequest } from 'next/server';
import { apiPatch, createApiResponse, handleApiError } from '@/lib/api';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const res = await apiPatch(`/admin/bookings/${id}/approve`, null, {
      requireAuth: true,
    });
    return await createApiResponse(res);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to approve booking');
  }
}
