export interface Project {
  id: number
  title_en: string
  title_ar?: string
  detail_en?: string
  detail_ar?: string
  type?: number | null
  category_ids?: number[]
  main_image_url?: string
  image_urls?: string[]
  link?: string
  social_media?: unknown
  status?: number
  organization_id?: number
  created_at?: string
  updated_at?: string
}

export interface CreateProjectDto {
  title_en: string
  title_ar?: string
  detail_en?: string
  detail_ar?: string
  type?: number | null
  category_ids?: number[]
  link?: string
  social_media?: unknown
  status?: number
  organization_id?: number
}

export type UpdateProjectDto = Partial<CreateProjectDto>

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
}
