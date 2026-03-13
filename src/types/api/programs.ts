export interface Program {
  id: number
  name_en: string
  name_ar?: string
  detail_en?: string
  detail_ar?: string
  main_image_url?: string
  from_datetime?: string | null
  to_datetime?: string | null
  last_registration_date?: string | null
  type?: number | null
  subtype?: number | null
  status?: number
  organization_id?: number
  created_at?: string
  updated_at?: string
}

export interface CreateProgramDto {
  name_en: string
  name_ar?: string
  detail_en?: string
  detail_ar?: string
  from_datetime?: string | null
  to_datetime?: string | null
  last_registration_date?: string | null
  type?: number | null
  subtype?: number | null
  status?: number
  organization_id?: number
}

export type UpdateProgramDto = Partial<CreateProgramDto>

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
  programs?: {
    id?: number
    name_ar?: string
    name_en?: string
  }
}
