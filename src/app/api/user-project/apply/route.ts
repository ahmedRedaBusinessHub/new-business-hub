import { NextRequest, NextResponse } from "next/server";
import { apiPost, createApiResponse, handleApiError } from "@/lib/api";

/**
 * Apply to a project (user apply flow). Requires JWT.
 * Body: { project_id, company_name?, project_name?, project_description?, team_size?, fund_needed?, why_applying?, upload_documents?: [{ file_id, name? }] }
 * Upload documents first via POST /api/user-project/upload-application-documents, then pass the returned array as upload_documents.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await apiPost("/user-project/apply", body, { requireAuth: true });
    return await createApiResponse(res, { successStatus: 201 });
  } catch (error: any) {
    return handleApiError(error, "Failed to apply to project");
  }
}
