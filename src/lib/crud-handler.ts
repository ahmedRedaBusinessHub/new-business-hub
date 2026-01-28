import { NextRequest, NextResponse } from "next/server";
import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
  createApiResponse,
  handleApiError,
} from "@/lib/api";

/**
 * Special route handlers that don't follow standard CRUD pattern
 */
const SPECIAL_ROUTES: Record<
  string,
  (request: NextRequest, id?: string) => Promise<NextResponse>
> = {
  "user-access-tokens": async (request: NextRequest) => {
    // This route doesn't have a backend controller, returns empty array
    if (request.method === "GET") {
      return NextResponse.json({ data: [] }, { status: 200 });
    }
    return NextResponse.json(
      { statusCode: 405, message: "Method not allowed" },
      { status: 405 }
    );
  },
};

/**
 * Base CRUD handler for standard REST operations
 */
export async function handleCrudRequest(
  request: NextRequest,
  resource: string,
  id?: string,
  action?: string
): Promise<NextResponse> {
  const method = request.method;

  // Handle special routes that don't follow standard CRUD pattern
  if (SPECIAL_ROUTES[resource]) {
    return SPECIAL_ROUTES[resource](request, id);
  }

  try {
    switch (method) {
      case "GET":
        if (id && action) {
          // Handle nested actions like /users/1/upload
          return handleAction(request, resource, id, action);
        } else if (id) {
          // GET /resource/:id - Get single item
          return await handleGetOne(resource, id);
        } else {
          // GET /resource - Get list with pagination
          return await handleGetList(request, resource);
        }

      case "POST":
        if (id && action) {
          // Handle nested actions like POST /users/1/upload
          return handleAction(request, resource, id, action);
        } else {
          // POST /resource - Create item
          return await handleCreate(request, resource);
        }

      case "PATCH":
        if (!id) {
          return NextResponse.json(
            { statusCode: 400, message: "ID is required for PATCH" },
            { status: 400 }
          );
        }
        // PATCH /resource/:id - Update item
        return await handleUpdate(request, resource, id);

      case "DELETE":
        if (!id) {
          return NextResponse.json(
            { statusCode: 400, message: "ID is required for DELETE" },
            { status: 400 }
          );
        }
        // DELETE /resource/:id - Delete item
        return await handleDelete(resource, id);

      default:
        return NextResponse.json(
          { statusCode: 405, message: `Method ${method} not allowed` },
          { status: 405 }
        );
    }
  } catch (error: any) {
    const errorMessage = getErrorMessage(method, resource, id, action);
    return handleApiError(error, errorMessage);
  }
}

/**
 * Handle GET list request
 */
async function handleGetList(
  request: NextRequest,
  resource: string
): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "100";

  // Build query string from all search params
  const queryParams = new URLSearchParams({ page, limit });
  searchParams.forEach((value, key) => {
    if (key !== "page" && key !== "limit") {
      queryParams.append(key, value);
    }
  });

  const endpoint = `/${resource}?${queryParams.toString()}`;
  const res = await apiGet(endpoint, { requireAuth: true });
  return await createApiResponse(res);
}

/**
 * Handle GET one request
 */
async function handleGetOne(
  resource: string,
  id: string
): Promise<NextResponse> {
  const res = await apiGet(`/${resource}/${id}`, { requireAuth: true });
  return await createApiResponse(res);
}

/**
 * Handle POST create request
 */
async function handleCreate(
  request: NextRequest,
  resource: string
): Promise<NextResponse> {
  const body = await request.json();
  const res = await apiPost(`/${resource}`, body, { requireAuth: true });
  return await createApiResponse(res, { successStatus: 201 });
}

/**
 * Handle PATCH update request
 */
async function handleUpdate(
  request: NextRequest,
  resource: string,
  id: string
): Promise<NextResponse> {
  const body = await request.json();
  const res = await apiPatch(`/${resource}/${id}`, body, { requireAuth: true });
  return await createApiResponse(res);
}

/**
 * Handle DELETE request
 */
async function handleDelete(resource: string, id: string): Promise<NextResponse> {
  const res = await apiDelete(`/${resource}/${id}`, undefined, { requireAuth: true });
  return await createApiResponse(res);
}

/**
 * Handle special actions like upload
 */
async function handleAction(
  request: NextRequest,
  resource: string,
  id: string,
  action: string
): Promise<NextResponse> {
  // Handle file upload
  if (action === "upload" && request.method === "POST") {
    return await handleUpload(request, resource, id);
  }

  // For other actions, you can extend this
  return NextResponse.json(
    { statusCode: 404, message: `Action ${action} not found` },
    { status: 404 }
  );
}

/**
 * Handle file upload action
 */
async function handleUpload(
  request: NextRequest,
  resource: string,
  id: string
): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const refColumn = (formData.get("refColumn") as string) || "image_id";

    const { getToken, getApiUrl } = await import("@/lib/api");
    const token = await getToken();
    if (!token) {
      return NextResponse.json(
        {
          statusCode: 401,
          message: "Authentication required",
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const apiUrl = getApiUrl();

    // Forward the FormData to backend
    const backendFormData = new FormData();
    const files = formData.getAll("files") as File[];
    files.forEach((file) => {
      backendFormData.append("files", file);
    });
    backendFormData.append("refColumn", refColumn);

    const response = await fetch(`${apiUrl}/${resource}/${id}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return handleApiError(error, "Failed to upload file");
  }
}

/**
 * Get error message based on operation
 */
function getErrorMessage(
  method: string,
  resource: string,
  id?: string,
  action?: string
): string {
  const resourceName = resource.replace(/-/g, " ");
  const actionText = action ? ` ${action}` : "";

  switch (method) {
    case "GET":
      return id
        ? `Failed to fetch ${resourceName}${actionText}`
        : `Failed to fetch ${resourceName} list`;
    case "POST":
      return action
        ? `Failed to ${action} ${resourceName}`
        : `Failed to create ${resourceName}`;
    case "PATCH":
      return `Failed to update ${resourceName}`;
    case "DELETE":
      return `Failed to delete ${resourceName}`;
    default:
      return `Failed to process ${resourceName} request`;
  }
}

