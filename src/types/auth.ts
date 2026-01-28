export type UserRole = "admin" | "data-entry" | "operation" | "client" | "store" | "guest" | "user";

// Only "user" role sees Avatar dropdown, all other roles see Control button
export const USER_ROLE: UserRole = "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accessToken: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  expires: number;
}

// OTP Types
export enum OtpType {
  VERIFICATION = "verification",
  LOGIN = "login",
  RESET_PASSWORD = "reset_password",
}

export enum OtpChannel {
  EMAIL = "email",
  SMS = "sms",
}

// Login DTO
export interface LoginDto {
  identifier: string;
  country_code?: string;
  password: string;
  platform?: string;
  client_info?: string;
  firebase_token?: string;
}

// Verify OTP DTO
export interface VerifyOtpDto {
  identifier: string;
  country_code?: string;
  otp: string;
  type: OtpType;
  channel: OtpChannel;
}

// Resend OTP DTO
export interface ResendOtpDto {
  identifier: string;
  country_code?: string;
  type: OtpType;
  channel: OtpChannel;
}

// Login Response Types
export interface LoginSuccessResponse {
  access_token: string;
}

export interface Login2FAResponse {
  message: string;
  actions: string | string[]; // Can be a string or array of strings
  retry_after?: string;
}

export type LoginResponse = LoginSuccessResponse | Login2FAResponse;

// Verify OTP Response
export interface VerifyOtpResponse {
  status: number;
  actions?: Array<{ message: string; action: string }>;
  access_token?: string;
}

// Register DTO
export interface RegisterDto {
  username: string;
  email: string;
  country_code: string;
  mobile: string;
  password: string;
  first_name: string;
  last_name?: string;
}

// Register Response
export interface RegisterResponse {
  message: string;
  userId: number;
  actions: Array<{ message: string; action: string }>;
}

// Change Password DTO
export interface ChangePasswordDto {
  old_password: string;
  new_password: string;
}

// Verify Required Response
export interface VerifyRequiredResponse {
  userId: number;
  status: number; // 0 = verification pending, 1 = already verified
  messages: string[];
}
