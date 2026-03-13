// Entity types for API responses

export interface Review {
  id: number
  name_ar?: string
  name_en?: string
  job_title_ar?: string
  job_title_en?: string
  comment_ar?: string
  comment_en?: string
  image_url?: string
  status?: number
  organization_id?: number
  created_at?: string
  updated_at?: string
}

export interface Setting {
  id: number
  name?: string
  namespace?: string
  key_value?: string
  created_at?: string
  updated_at?: string
}

export interface Contact {
  id: number
  name?: string
  email?: string
  phone?: string
  contact_type?: string
  subject?: string
  message?: string
  status?: number
  user_id?: number
  created_at?: string
  updated_at?: string
}

export interface Organization {
  id: number
  name?: string
  namespace?: string
  email?: string
  country_code?: string
  mobile?: string
  category_id?: number | null
  image_url?: string
  status?: number
  organization_id?: number | null
  created_at?: string
  updated_at?: string
}

export interface ThirdParty {
  id: number
  name?: string
  namespace?: string
  website?: string
  type?: string
  api_key?: string
  api_secret?: string
  status?: number
  created_at?: string
  updated_at?: string
}

export interface Role {
  id: number
  name?: string
  namespace?: string
  description?: string
  permissions?: string[]
  status?: number
  created_at?: string
  updated_at?: string
}

export interface UserRole {
  id: number
  user_id: number
  role_id: number
  role_name?: string
  roles?: Role
  role?: Role
  deleted_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface AccessToken {
  id: number
  user_id: number
  app_token: string
  auth_expire_at?: string
  created_at?: string
  updated_at?: string
}

export interface ResetPasswordToken {
  id: number
  user_id: number
  reset_token: string
  expire_at?: string
  used_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface NewsletterSubscription {
  id: number
  email: string
  name?: string
  status?: number
  subscribed_at?: string
  created_at?: string
  updated_at?: string
}

export interface SuccessPartner {
  id: number
  name_ar?: string
  name_en?: string
  image_url?: string
  status?: number
  organization_id?: number
  created_at?: string
  updated_at?: string
}

export interface Gallery {
  id: number
  title_ar?: string
  title_en?: string
  description_ar?: string
  description_en?: string
  image_url?: string
  status?: number
  created_at?: string
  updated_at?: string
}

export interface IsoCompany {
  id: number
  company_name?: string
  name?: string
  name_ar?: string
  name_en?: string
  email?: string
  phone?: string
  description_ar?: string
  description_en?: string
  logo_url?: string
  status?: number
  created_at?: string
  updated_at?: string
}

export interface News {
  id: number
  title_ar?: string
  title_en?: string
  detail_ar?: string
  detail_en?: string
  main_image_url?: string
  image_urls?: string[]
  social_media?: unknown
  status?: number
  organization_id?: number
  created_at?: string
  updated_at?: string
}

export interface UserProgram {
  id: number
  user_id: number
  program_id: number
  company_name?: string
  project_name?: string
  project_description?: string
  team_size?: number
  fund_needed?: string
  why_applying?: string
  upload_documents?: unknown[]
  status?: number
  created_at?: string
  updated_at?: string
  users_user_program_user_idTousers?: {
    first_name?: string
    last_name?: string
    email?: string
  }
  programs?: {
    id?: number
    name_ar?: string
    name_en?: string
  }
}

export interface UserProject {
  id: number
  user_id: number
  project_id: number
  company_name?: string
  project_name?: string
  status?: number
  applied_at?: string
  approved_at?: string
  created_at?: string
  updated_at?: string
  users_user_project_user_idTousers?: {
    first_name?: string
    last_name?: string
    email?: string
  }
}

export interface Permission {
  id: number
  object_id?: number
  name?: string
  description?: string
  assigned?: boolean
  created_at?: string
  updated_at?: string
}

export interface RolePermission {
  id: number
  role_id: number
  permission_id: number
  created_at?: string
  updated_at?: string
}

export interface UserAccessToken {
  id: number
  user_id: number
  app_token?: string
  platform?: string
  auth_expire_at?: string
  created_at?: string
  updated_at?: string
}

// Generic searchable item for flexibility
export interface SearchableItem {
  id?: number
  name?: string
  name_ar?: string
  name_en?: string
  title?: string
  title_ar?: string
  title_en?: string
  description?: string
  description_ar?: string
  description_en?: string
  email?: string
  status?: number
  [key: string]: unknown
}
