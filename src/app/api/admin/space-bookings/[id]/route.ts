import { NextRequest } from 'next/server';
import { apiGet, createApiResponse, handleApiError } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const res = await apiGet(`/admin/bookings/${id}`, {
      requireAuth: true,
    });
    return await createApiResponse(res);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to fetch admin booking details');
  }
}
