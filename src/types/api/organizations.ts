export interface Organization {
  id: number
  name: string
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

export interface CreateOrganizationDto {
  name: string
  namespace?: string
  email?: string
  country_code?: string
  mobile?: string
  category_id?: number | null
  status?: number
}

export type UpdateOrganizationDto = Partial<CreateOrganizationDto>
