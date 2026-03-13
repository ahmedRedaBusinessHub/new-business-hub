import { NextRequest } from 'next/server';
import { apiGet, createApiResponse, handleApiError } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const res = await apiGet('/admin/additional-services/summary', { requireAuth: true });
    return await createApiResponse(res);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to fetch admin services summary');
  }
}
