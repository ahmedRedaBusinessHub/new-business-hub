import { NextRequest } from 'next/server';
import { apiPost, createApiResponse, handleApiError } from '@/lib/api';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const res = await apiPost(`/admin/additional-services/catalog/${id}/branches`, body, { requireAuth: true });
    return await createApiResponse(res);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to assign service to branch');
  }
}
