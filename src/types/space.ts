export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

export interface RegularHourSchedule {
  days: DayOfWeek[]
  openTime: string
  closeTime: string
}

export interface SpecialHour {
  date: string
  openTime?: string
  closeTime?: string
  isClosed?: boolean
  reason?: string
}

export interface OperatingHours {
  timezone: string
  regularHours: RegularHourSchedule[]
  specialHours?: SpecialHour[]
}

export interface Space {
  id: string
  name: string
  timezone: string
  permanentlyClosed?: boolean
  operatingHours?: OperatingHours
}
