export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiErrorResponse {
  statusCode: number
  message: string | string[]
  error: string
}

export type ApiResponse<T> = T | ApiErrorResponse

export interface ApiRequestOptions {
  requireAuth?: boolean
  accessToken?: string
  customHeaders?: Record<string, string>
}
