import type { ReactNode } from 'react'

export interface DataTableColumn<T> {
  key: keyof T | string
  header: string
  render?: (row: T) => ReactNode
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  isLoading?: boolean
  onRowClick?: (row: T) => void
  emptyMessage?: string
  className?: string
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
  }
}

export interface FormField {
  name: string
  label: string
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'datetime-local'
    | 'time'
    | 'week'
    | 'month'
    | 'url'
    | 'tel'
    | 'search'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'switch'
    | 'toggle'
    | 'slider'
    | 'range'
    | 'color'
    | 'file'
    | 'fileuploader'
    | 'imageuploader'
    | 'tags'
    | 'calendar'
    | 'richtext'
    | 'map'
    | 'rating'
    | 'section'
    | 'hidden'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: Array<{ value: string | number; label: string }>
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    message?: string
  }
  defaultValue?: unknown
  multiple?: boolean
  accept?: string
  maxSize?: number
  helperText?: string
}

export interface DynamicFormProps {
  fields: FormField[]
  onSubmit: (data: Record<string, unknown>) => void | Promise<void>
  defaultValues?: Record<string, unknown>
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  isLoading?: boolean
  className?: string
}

export type ThemeColor = 'default' | 'ocean' | 'sunset' | 'forest' | 'purple'
export type ThemeMode = 'light' | 'dark'

export interface ThemeSelectorProps {
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
  showModeToggle?: boolean
  showColorPicker?: boolean
}

// User Components Types
export interface User {
  id: number
  username: string
  email: string
  country_code: string
  mobile: string
  first_name: string
  last_name: string | null
  dob: string | null
  gender: number | null
  national_id: string | null
  image_id: number | null
  image_url?: string | null
  status: number
  organization_id: number | null
  email_verified_at: string | null
  sms_verified_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface UserProfile {
  name: string
  email: string
  role: string
  avatar: string
  bio: string
}

export interface UserRolesProps {
  userId: number
  organizationId?: number | null
}

export interface UserProgramsProps {
  userId: number
}

export interface UserProjectsProps {
  userId: number
}

export interface UserContactsProps {
  userId: number
}

export interface UserAccessTokensProps {
  userId: number
}

export interface UserResetPasswordTokensProps {
  userId: number
}

export interface UserFormProps {
  user: User | null
  onSubmit: (data: Omit<User, 'id' | 'created_at' | 'updated_at' | 'organization_id' | 'email_verified_at' | 'sms_verified_at' | 'image_id' | 'image_url'> & { password?: string; profileImage?: File[] }) => void
  onCancel: () => void
  onErrorStateChange?: (hasError: boolean) => void
}

// Program Components Types
export interface Program {
  id: number
  name_ar: string
  name_en: string | null
  detail_ar: string | null
  detail_en: string | null
  from_datetime: string | null
  to_datetime: string | null
  last_registration_date: string | null
  type: number | null
  subtype: number | null
  promo_video: string | null
  promo_image: string | null
  status: number
  organization_id: number | null
  main_image_url?: string | null
  main_image_id?: number | null
  document_ar_id?: number | null
  document_ar_url?: string | null
  document_en_id?: number | null
  document_en_url?: string | null
  values: string | Array<{ text_ar: string; text_en: string; desc_ar: string; desc_en: string; number: number }>
  progress_steps: string | Array<{ text_ar: string; text_en: string; desc_ar: string; desc_en: string; number: number }>
  application_requirements: string | Array<{ text_ar: string; text_en: string; desc_ar: string; desc_en: string; number: number }>
  documents_requirements: string | Array<{ text_ar: string; text_en: string; desc_ar: string; desc_en: string; number: number }>
  focusAreas: string | Array<{ text_ar: string; text_en: string; desc_ar: string; desc_en: string; number: number }>
  image_ids: number[] | null
  image_urls: string[] | null
  created_at: string | null
  updated_at: string | null
}

export interface ProgramFormProps {
  program: Program | null
  onSubmit: (data: Omit<Program, 'id' | 'created_at' | 'updated_at' | 'organization_id'> & {
    mainImage?: File[]
    imageIds?: File[]
    document_ar?: File[]
    document_en?: File[]
  }) => void
  onCancel: () => void
}

// Project Components Types
export interface Project {
  id: number
  title_ar: string
  title_en: string | null
  detail_ar: string | null
  detail_en: string | null
  type: number | null
  category_ids: number[] | null
  link: string | null
  social_media: string | Record<string, string>
  status: number
  organization_id: number | null
  main_image_url?: string | null
  main_image_id?: number | null
  image_ids: number[] | null
  image_urls: string[] | null
  file_ids: number[] | null
  file_urls: string[] | null
  created_at: string | null
  updated_at: string | null
}

export interface ProjectFormProps {
  project: Project | null
  onSubmit: (data: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'main_image_url'> & {
    mainImage?: File[]
    imageIds?: File[]
    fileIds?: File[]
  }) => void
  onCancel: () => void
}

// Organization Components Types
export interface Organization {
  id: number
  name: string
  name_ar?: string | null
  description?: string | null
  description_ar?: string | null
  logo_url?: string | null
  status: number
  created_at: string | null
  updated_at: string | null
}

export interface OrganizationFormProps {
  organization: Organization | null
  onSubmit: (data: Omit<Organization, 'id' | 'created_at' | 'updated_at' | 'logo_url'> & {
    logo?: File[]
  }) => void
  onCancel: () => void
}

// Role Components Types
export interface Role {
  id: number
  name: string
  namespace?: string | null
  status: number
  created_at: string | null
  updated_at: string | null
}

export interface RoleFormProps {
  role: Role | null
  onSubmit: (data: Omit<Role, 'id' | 'created_at' | 'updated_at'>) => void
  onCancel: () => void
}

// News Components Types
export interface News {
  id: number
  title: string
  title_ar?: string | null
  content: string
  content_ar?: string | null
  image_url?: string | null
  image_id?: number | null
  status: number
  published_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface NewsFormProps {
  news: News | null
  onSubmit: (data: Omit<News, 'id' | 'created_at' | 'updated_at' | 'image_url'> & {
    image?: File[]
  }) => void
  onCancel: () => void
}

// Gallery Components Types
export interface Gallery {
  id: number
  title: string
  title_ar?: string | null
  description?: string | null
  description_ar?: string | null
  image_ids: number[] | null
  image_urls: string[] | null
  status: number
  created_at: string | null
  updated_at: string | null
}

export interface GalleryFormProps {
  gallery: Gallery | null
  onSubmit: (data: Omit<Gallery, 'id' | 'created_at' | 'updated_at'> & {
    images?: File[]
  }) => void
  onCancel: () => void
}

// Static List Components Types
export interface StaticList {
  id: number
  name: string
  namespace: string
  config: Array<{ id: number; name_en: string; name_ar: string }>
  status: number
  created_at: string | null
  updated_at: string | null
}

export interface StaticListFormProps {
  list: StaticList | null
  onSubmit: (data: Omit<StaticList, 'id' | 'created_at' | 'updated_at'>) => void
  onCancel: () => void
}

// Common Types
export interface ViewHeader<T> {
  type: 'text' | 'avatar'
  title: (data: T) => string
  subtitle?: (data: T) => string
  imageIdField?: string
  fetchImageUrl?: (data: T) => string | null | Promise<string | null>
  avatarFallback?: (data: T) => string
  badges?: Array<{
    field: string
    variant?: string
    map?: Record<string | number, { label: string; variant?: string }>
  }>
}

export interface ViewTab<T = Record<string, unknown>> {
  id: string
  label: string
  gridCols?: number
  fields?: Array<{
    name: string
    label: string
    type: string
    format?: (value: unknown, data: T) => string | ReactNode
    colSpan?: number
    badgeMap?: Record<string | number, { label: string; variant?: string }>
  }>
  customContent?: (data: T) => ReactNode
}

export interface DynamicViewProps<T = Record<string, unknown>> {
  data: T
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  header?: ViewHeader<T>
  tabs?: ViewTab<T>[]
  maxWidth?: string
}

// Section Types
export interface SectionProps {
  className?: string
  children: ReactNode
  id?: string
}

export interface HeroSectionProps extends SectionProps {
  title?: string
  title_ar?: string
  description?: string
  description_ar?: string
  ctaText?: string
  ctaText_ar?: string
  ctaLink?: string
  backgroundImage?: string
}

export interface AboutSectionProps extends SectionProps {
  title?: string
  title_ar?: string
  description?: string
  description_ar?: string
}

export interface CompaniesSectionProps extends SectionProps {
  companies?: Array<{ name: string; logo?: string }>
}

export interface ProjectsSectionProps extends SectionProps {
  projects?: Array<{ title: string; title_ar?: string; description?: string; description_ar?: string }>
}

export interface ServicesSectionProps extends SectionProps {
  services?: Array<{ title: string; title_ar?: string; description?: string; description_ar?: string; icon?: string }>
}

export interface MissionSectionProps extends SectionProps {
  mission?: string
  mission_ar?: string
}

export interface ValuesSectionProps extends SectionProps {
  values?: Array<{ title: string; title_ar?: string; description?: string; description_ar?: string; icon?: string }>
}

export interface RequirementsSectionProps extends SectionProps {
  requirements?: Array<{ title: string; title_ar?: string; description?: string; description_ar?: string }>
}

export interface ReviewsSectionProps extends SectionProps {
  reviews?: Array<{ name: string; comment: string; rating: number }>
}

export interface CEOSectionProps extends SectionProps {
  name?: string
  name_ar?: string
  position?: string
  position_ar?: string
  image?: string
  bio?: string
  bio_ar?: string
}

export interface PartnersSectionProps extends SectionProps {
  partners?: Array<{ name: string; logo?: string; website?: string }>
}

export interface StagesSectionProps extends SectionProps {
  stages?: Array<{ title: string; title_ar?: string; description?: string; description_ar?: string; order: number }>
}

export interface FAQSectionProps extends SectionProps {
  faqs?: Array<{ question: string; question_ar?: string; answer: string; answer_ar?: string }>
}

export interface ContactSectionProps extends SectionProps {
  email?: string
  phone?: string
  address?: string
  address_ar?: string
}

export interface FollowUsProps extends SectionProps {
  socialLinks?: Array<{ platform: string; url: string; icon?: ReactNode }>
}

// Page Types
export interface PageProps {
  className?: string
  children: ReactNode
}

export interface DashboardContentProps extends PageProps {}

export interface AboutPageProps extends PageProps {}

export interface FAQPageProps extends PageProps {}

export interface PrivacyPageProps extends PageProps {}

export interface TermsPageProps extends PageProps {}

export interface RefundPageProps extends PageProps {}

export interface GalleryPageProps extends PageProps {}

export interface NewsPageProps extends PageProps {}

export interface TeamPageProps extends PageProps {}

export interface ISOPageProps extends PageProps {}

export interface IncubationPageProps extends PageProps {}

export interface AcceleratorPageProps extends PageProps {}

export interface ProgramsPageProps extends PageProps {}

export interface ProgramsListProps extends PageProps {
  programs?: Program[]
  isLoading?: boolean
}

export interface ProgramViewPageProps extends PageProps {
  programId?: number
}

export interface ProgramUserProgramsProps extends PageProps {
  programId: number
}

export interface MyProgramsListProps extends PageProps {}

export interface ProgramsManagementProps extends PageProps {}

export interface ProjectsManagementProps extends PageProps {}

export interface OrganizationsManagementProps extends PageProps {}

export interface NewsManagementProps extends PageProps {}

export interface ReviewsManagementProps extends PageProps {}

export interface SuccessPartnersManagementProps extends PageProps {}

export interface StaticListsManagementProps extends PageProps {}

export interface CacheManagementProps extends PageProps {}

export interface SettingsManagementProps extends PageProps {}

export interface ObjectsManagementProps extends PageProps {}

export interface IsoCompaniesManagementProps extends PageProps {}

export interface IsoRequestsManagementProps extends PageProps {}

export interface ContactsManagementProps extends PageProps {}

export interface NotificationListProps extends PageProps {
  notifications?: Array<{ id: number; message: string; created_at: string; read: boolean }>
}

// Form Page Types
export interface LoginPageProps extends PageProps {}

export interface RegisterPageProps extends PageProps {}

export interface ForgotPasswordPageProps extends PageProps {}

export interface ChangePasswordPageProps extends PageProps {
  token?: string
}

export interface OTPVerificationProps extends PageProps {
  identifier?: string
}

export interface ContactFormProps extends PageProps {}

export interface ContactInteractionFormProps extends PageProps {}

export interface TestFormProps extends PageProps {}

// Modal/Form Types
export interface UserViewModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

export interface UserProjectFormProps {
  userId: number
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export interface UserProgramFormProps {
  userId: number
  program: Program | null
  isOpen: boolean
  onClose: () => void
}

export interface ThirdPartyServiceFormProps {
  service: Record<string, unknown> | null
  isOpen: boolean
  onClose: () => void
}

// Management Components Types
export interface UserManagementProps extends PageProps {}

export interface ProgramsManagementPageProps extends PageProps {}

export interface ProjectsManagementPageProps extends PageProps {}

export interface RolePermissionsProps extends PageProps {
  role?: Role | null
}

// Custom Cursor Props
export interface CustomCursorProps extends PageProps {}

// Logo Props
export interface LogoProps {
  className?: string
  variant?: 'full' | 'icon' | 'wordmark'
}

// Related News Props
export interface RelatedNewsProps extends PageProps {
  newsId?: number
  category?: string
}

// Contact Interaction Management Props
export interface ContactInteractionManagementProps extends PageProps {}

// Notification List Types
export interface NotificationItem {
  id: number
  message: string
  message_ar?: string | null
  type?: string
  read: boolean
  created_at: string
  link?: string | null
}

// File Upload Helpers
export interface FileUploadData {
  file: File
  progress?: number
  error?: string
}

export interface UploadedFile {
  id: number
  name: string
  url: string
  size: number
}

// Form Validation Types
export interface FormFieldError {
  field: string
  message: string
}

export interface FormValidationErrors {
  [field: string]: string | FormFieldError
}
