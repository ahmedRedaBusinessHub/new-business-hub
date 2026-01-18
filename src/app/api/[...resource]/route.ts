import { NextRequest, NextResponse } from "next/server";
import { handleCrudRequest } from "@/lib/crud-handler";

/**
 * Catch-all route handler for CRUD operations
 * Handles routes like:
 * - GET /api/users
 * - GET /api/users/123
 * - POST /api/users
 * - PATCH /api/users/123
 * - DELETE /api/users/123
 * - POST /api/users/123/upload
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string[] }> }
) {
  const { resource } = await params;
  return handleCrudRequest(request, ...parseResourcePath(resource));
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string[] }> }
) {
  const { resource } = await params;
  return handleCrudRequest(request, ...parseResourcePath(resource));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string[] }> }
) {
  const { resource } = await params;
  return handleCrudRequest(request, ...parseResourcePath(resource));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string[] }> }
) {
  const { resource } = await params;
  return handleCrudRequest(request, ...parseResourcePath(resource));
}

/**
 * Parse resource path array into resource name, id, and action
 * Examples:
 * - ['users'] -> ['users', undefined, undefined]
 * - ['users', '123'] -> ['users', '123', undefined]
 * - ['users', '123', 'upload'] -> ['users', '123', 'upload']
 */
function parseResourcePath(resource: string[]): [string, string?, string?] {
  if (resource.length === 0) {
    throw new Error("Resource path is required");
  }

  const resourceName = resource[0];
  const id = resource.length > 1 ? resource[1] : undefined;
  const action = resource.length > 2 ? resource[2] : undefined;

  return [resourceName, id, action];
}

