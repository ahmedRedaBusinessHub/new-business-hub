export interface ApiUser {
  id: number
  email: string
  username?: string | null
  first_name?: string | null
  last_name?: string | null
  image_url?: string | null
  role?: string | null
  status?: number
  created_at?: string
  updated_at?: string
}

export interface CreateUserDto {
  email: string
  username?: string
  first_name?: string
  last_name?: string
  password: string
  role?: string
  status?: number
}

export interface UpdateUserDto {
  email?: string
  username?: string
  first_name?: string
  last_name?: string
  role?: string
  status?: number
}

export interface TenantBenefits {
  free_meeting_room_hours: number;
  used_free_hours: number;
  discount_percentage: number;
}
