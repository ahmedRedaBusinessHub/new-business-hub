import { NextRequest } from 'next/server';
import { apiGet, apiPost, createApiResponse, handleApiError } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const query = new URL(request.url).searchParams.toString();
    const res = await apiGet(`/admin/additional-services/catalog${query ? `?${query}` : ''}`, { requireAuth: true });
    return await createApiResponse(res);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to fetch service catalog');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await apiPost('/admin/additional-services/catalog', body, { requireAuth: true });
    return await createApiResponse(res);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to create service');
  }
}
