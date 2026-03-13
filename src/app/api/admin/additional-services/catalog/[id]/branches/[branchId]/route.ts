import { NextRequest } from 'next/server';
import { apiDelete, createApiResponse, handleApiError } from '@/lib/api';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; branchId: string }> }
) {
  try {
    const { id, branchId } = await params;
    const res = await apiDelete(`/admin/additional-services/catalog/${id}/branches/${branchId}`, undefined, { requireAuth: true });
    return await createApiResponse(res);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to remove service from branch');
  }
}
