import { toast } from "sonner";

/**
 * Client-side API error handler
 * Shows appropriate error messages based on status code
 */
export function handleApiError(
  response: Response,
  defaultMessage: string = "An error occurred"
): void {
  const status = response.status;

  switch (status) {
    case 403:
      toast.error("Access Forbidden", {
        description: "You don't have permission to access this resource. Please contact your administrator.",
        duration: 5000,
      });
      break;
    case 401:
      toast.error("Unauthorized", {
        description: "Please log in to access this resource.",
        duration: 5000,
      });
      break;
    case 404:
      toast.error("Not Found", {
        description: "The requested resource was not found.",
        duration: 5000,
      });
      break;
    case 500:
      toast.error("Server Error", {
        description: "An internal server error occurred. Please try again later.",
        duration: 5000,
      });
      break;
    default:
      toast.error(defaultMessage, {
        description: `Request failed with status ${status}`,
        duration: 5000,
      });
  }
}

/**
 * Check if response is forbidden (403)
 */
export function isForbidden(response: Response): boolean {
  return response.status === 403;
}

/**
 * Check if response is unauthorized (401)
 */
export function isUnauthorized(response: Response): boolean {
  return response.status === 401;
}

/**
 * Fetch wrapper that handles errors automatically
 */
export async function fetchWithErrorHandling(
  url: string,
  options?: RequestInit,
  errorMessage?: string
): Promise<Response> {
  const response = await fetch(url, options);

  if (!response.ok) {
    handleApiError(response, errorMessage);
  }

  return response;
}
