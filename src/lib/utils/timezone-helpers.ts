import { formatInTimeZone, toZonedTime } from 'date-fns-tz'

export function formatDisplayTime(time: string, timezone: string): string {
  const [hours, minutes] = time.split(':')
  const date = new Date(Date.UTC(1970, 0, 1, parseInt(hours, 10), parseInt(minutes, 10)))

  // Format time in UTC to prevent hour shifting
  const timeStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date)

  // Get the timezone abbreviation for the target timezone using current date
  const abbr = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short'
  }).formatToParts(new Date()).find(p => p.type === 'timeZoneName')?.value || ''

  return `${timeStr} ${abbr}`
}

export function formatDate(date: Date | string, timezone: string): string {
  return formatInTimeZone(date, timezone, 'MMMM d, yyyy')
}

export function isTimeInRange(
  currentTime: Date,
  openTime: string,
  closeTime: string,
  timezone: string
): boolean {
  const [openHours, openMinutes] = openTime.split(':').map(Number)
  const [closeHours, closeMinutes] = closeTime.split(':').map(Number)

  const currentInTz = toZonedTime(currentTime, timezone)
  const currentHours = currentInTz.getHours()
  const currentMinutes = currentInTz.getMinutes()

  const currentTotalMinutes = currentHours * 60 + currentMinutes
  const openTotalMinutes = openHours * 60 + openMinutes
  const closeTotalMinutes = closeHours * 60 + closeMinutes

  if (openTotalMinutes === 0 && closeTotalMinutes === 0) {
    return true
  }

  return currentTotalMinutes >= openTotalMinutes && currentTotalMinutes < closeTotalMinutes
}

import { DayOfWeek } from '@/types/space'

export function getDayOfWeek(date: Date): DayOfWeek {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
  return days[date.getDay()] as DayOfWeek
}
