import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Get the base API URL from environment variables
 */
export function getApiUrl(): string {
  const apiUrl =
    process.env.EXTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("API URL is not configured");
  }
  return apiUrl;
}

/**
 * Get the access token from the current session
 */
async function getAccessToken(): Promise<string | null> {
  try {
    const session = await auth();
    console.log("🚀 ~ getAccessToken ~ session:", session);
    return session?.accessToken || null;
  } catch (error) {
    console.warn("Failed to get access token from session:", error);
    return null;
  }
}

/**
 * Build headers for API requests
 */
async function buildHeaders(
  options: {
    requireAuth?: boolean;
    accessToken?: string;
    customHeaders?: Record<string, string>;
  } = {},
): Promise<Record<string, string>> {
  console.log("🚀 ~ buildHeaders ~ options:", options);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.customHeaders,
  };

  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  } else if (options.requireAuth) {
    const token = await getAccessToken();
    console.log("🚀 ~ buildHeaders ~ token:", token);
    if (!token) {
      throw new Error("Authentication required but no access token found");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Parse API response, handling both JSON and non-JSON responses
 */
async function parseResponse(res: Response): Promise<unknown> {
  try {
    const text = await res.text();
    if (!text) {
      return {};
    }
    return JSON.parse(text);
  } catch (error) {
    console.warn("Failed to parse API response as JSON:", error);
    return {};
  }
}

/**
 * Handle API errors and return appropriate NextResponse
 */
export function handleApiError(
  error: unknown,
  defaultMessage: string = "Internal server error",
): NextResponse {
  console.error("API error:", error);
  const errorMessage = error instanceof Error ? error.message : defaultMessage;
  return NextResponse.json(
    {
      statusCode: 500,
      message: errorMessage,
      error: "Internal Server Error",
    },
    { status: 500 },
  );
}

/**
 * GET request helper
 */
export async function apiGet(
  endpoint: string,
  options: {
    requireAuth?: boolean;
    accessToken?: string;
    customHeaders?: Record<string, string>;
  } = {},
): Promise<Response> {
  const apiUrl = getApiUrl();
  const headers = await buildHeaders(options);

  const startTime = performance.now();
  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: "GET",
    headers,
  });
  const endTime = performance.now();
  console.log(
    `[API Latency] GET ${endpoint} took ${Math.round(endTime - startTime)}ms`,
  );
  return response;
}

/**
 * POST request helper
 */
export async function apiPost(
  endpoint: string,
  body?: unknown,
  options: {
    requireAuth?: boolean;
    accessToken?: string;
    customHeaders?: Record<string, string>;
  } = {},
): Promise<Response> {
  const apiUrl = getApiUrl();
  const headers = await buildHeaders(options);

  const startTime = performance.now();
  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: "POST",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const endTime = performance.now();
  console.log(
    `[API Latency] POST ${endpoint} took ${Math.round(endTime - startTime)}ms`,
  );
  return response;
}

/**
 * PATCH request helper
 */
export async function apiPatch(
  endpoint: string,
  body?: unknown,
  options: {
    requireAuth?: boolean;
    accessToken?: string;
    customHeaders?: Record<string, string>;
  } = {},
): Promise<Response> {
  const apiUrl = getApiUrl();
  const headers = await buildHeaders(options);

  const startTime = performance.now();
  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: "PATCH",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const endTime = performance.now();
  console.log(
    `[API Latency] PATCH ${endpoint} took ${Math.round(endTime - startTime)}ms`,
  );
  return response;
}

/**
 * PUT request helper
 */
export async function apiPut(
  endpoint: string,
  body?: unknown,
  options: {
    requireAuth?: boolean;
    accessToken?: string;
    customHeaders?: Record<string, string>;
  } = {},
): Promise<Response> {
  const apiUrl = getApiUrl();
  const headers = await buildHeaders(options);

  const startTime = performance.now();
  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: "PUT",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const endTime = performance.now();
  console.log(
    `[API Latency] PUT ${endpoint} took ${Math.round(endTime - startTime)}ms`,
  );
  return response;
}

/**
 * DELETE request helper
 */
export async function apiDelete(
  endpoint: string,
  body?: unknown,
  options: {
    requireAuth?: boolean;
    accessToken?: string;
    customHeaders?: Record<string, string>;
  } = {},
): Promise<Response> {
  const apiUrl = getApiUrl();
  const headers = await buildHeaders(options);

  const startTime = performance.now();
  const response = await fetch(`${apiUrl}${endpoint}`, {
    method: "DELETE",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const endTime = performance.now();
  console.log(
    `[API Latency] DELETE ${endpoint} took ${Math.round(endTime - startTime)}ms`,
  );
  return response;
}

/**
 * Helper to create a NextResponse from an API response
 */
export async function createApiResponse(
  res: Response,
  options: {
    successStatus?: number;
    parseError?: boolean;
  } = {},
): Promise<NextResponse> {
  const { successStatus = 200, parseError = true } = options;

  try {
    const data = await parseResponse(res);

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: successStatus });
  } catch (error) {
    if (parseError && !res.ok) {
      // If we can't parse the error, return a generic error response
      return NextResponse.json(
        {
          statusCode: res.status,
          message: `Request failed with status ${res.status}`,
          error: "Request Failed",
        },
        { status: res.status },
      );
    }
    throw error;
  }
}

/**
 * Helper for API route handlers - wraps the request logic
 */
export async function handleApiRequest<T = unknown>(
  requestFn: () => Promise<Response>,
  options: {
    successStatus?: number;
    parseError?: boolean;
    onSuccess?: (data: T) => NextResponse | Promise<NextResponse>;
    onError?: (error: unknown) => NextResponse | Promise<NextResponse>;
  } = {},
): Promise<NextResponse> {
  try {
    const res = await requestFn();

    if (options.onSuccess) {
      const data = await parseResponse(res);
      if (res.ok) {
        return await options.onSuccess(data as T);
      }
    }

    return await createApiResponse(res, {
      successStatus: options.successStatus,
      parseError: options.parseError,
    });
  } catch (error: unknown) {
    if (options.onError) {
      return await options.onError(error);
    }
    return handleApiError(error);
  }
}

/**
 * Helper to get access token directly (for use outside of API routes)
 */
export async function getToken(): Promise<string | null> {
  return getAccessToken();
}
