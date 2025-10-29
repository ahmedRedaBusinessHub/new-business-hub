export type UserRole = "admin" | "data-entry" | "client" | "store" | "guest";

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
