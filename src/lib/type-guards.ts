import type { ApiErrorResponse } from '@/types/api/common'
import type { UserData, LoginSuccessResponse, Login2FAResponse } from '@/types/api/auth'

export function isApiError(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'statusCode' in response &&
    'message' in response &&
    'error' in response
  )
}

export function isLogin2FAResponse(response: unknown): response is Login2FAResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'actions' in response &&
    typeof (response as Login2FAResponse).actions === 'string'
  )
}

export function isLoginSuccessResponse(response: unknown): response is LoginSuccessResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'access_token' in response &&
    'user' in response
  )
}

export function isAdmin(user: UserData | undefined): boolean {
  return user?.role === 'admin'
}

export function isModerator(user: UserData | undefined): boolean {
  return user?.role === 'moderator'
}
