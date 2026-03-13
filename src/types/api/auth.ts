export interface LoginDto {
  identifier: string
  password: string
  country_code?: string
  platform?: string
  client_info?: string
  firebase_token?: string
}

export interface LoginSuccessResponse {
  access_token: string
}

export interface Login2FAResponse {
  message: string
  actions: 'sent_email' | 'sent_sms' | 'already_sent_sms' | 'already_sent_email'
  retry_after?: Date
}

export type LoginResponse = LoginSuccessResponse | Login2FAResponse

export enum OtpType {
  VERIFICATION = 'verification',
  LOGIN = 'login',
  RESET_PASSWORD = 'reset_password',
}

export enum OtpChannel {
  EMAIL = 'email',
  SMS = 'sms',
}

export interface VerifyOTPDto {
  identifier: string
  otp: string
  country_code?: string
  type: OtpType
  channel: OtpChannel
}

export type UserRole = 'admin' | 'data-entry' | 'operation' | 'client' | 'store' | 'guest' | 'user' | 'moderator'

export interface UserData {
  id: number
  username?: string | null
  email: string
  first_name?: string | null
  last_name?: string | null
  role?: UserRole | string | null
  image_url?: string | null
  status?: number
  organization_id?: number | null
  created_at?: string
  updated_at?: string
}

export interface AuthSession {
  user: UserData
  accessToken: string
}
