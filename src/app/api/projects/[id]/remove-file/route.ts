import { NextRequest, NextResponse } from 'next/server';
import { apiDelete, createApiResponse, handleApiError } from '@/lib/api';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await req.json();
    const { fileId, refColumn } = body;

    if (!fileId || !refColumn) {
      return NextResponse.json(
        { error: 'fileId and refColumn are required' },
        { status: 400 }
      );
    }

    // Call the backend API to remove the file
    const res = await apiDelete(
      `/projects/${projectId}/remove-file`,
      { fileId, refColumn },
      { requireAuth: true }
    );

    return await createApiResponse(res);
  } catch (error: any) {
    return handleApiError(error, 'Failed to remove file');
  }
}
