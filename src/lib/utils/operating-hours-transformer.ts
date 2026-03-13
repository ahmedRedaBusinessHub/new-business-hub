import type { OperatingHours as ApiOperatingHours } from '@/types/api/branches'
import type { OperatingHours, RegularHourSchedule, SpecialHour, DayOfWeek } from '@/types/space'

const DAYS: DayOfWeek[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

export function transformOperatingHours(
  apiHours: ApiOperatingHours
): OperatingHours | null {
  if (!apiHours?.schedule) return null

  const regularHoursMap = new Map<string, DayOfWeek[]>()

  for (const day of DAYS) {
    const slot = apiHours.schedule[day]
    if (!slot) continue

    const timeRange = `${slot.open}-${slot.close}`
    if (!regularHoursMap.has(timeRange)) {
      regularHoursMap.set(timeRange, [])
    }
    regularHoursMap.get(timeRange)!.push(day)
  }

  const regularHours: RegularHourSchedule[] = Array.from(
    regularHoursMap.entries()
  ).map(([timeRange, days]) => {
    const dashIndex = timeRange.lastIndexOf('-')
    const openTime = timeRange.slice(0, dashIndex)
    const closeTime = timeRange.slice(dashIndex + 1)
    return { days, openTime, closeTime }
  })

  const specialHours: SpecialHour[] | undefined = apiHours.special_hours?.map(
    (sh) => ({
      date: sh.date,
      openTime: sh.open,
      closeTime: sh.close,
      isClosed: sh.is_closed,
      reason: sh.reason,
    })
  )

  return {
    timezone: apiHours.timezone,
    regularHours,
    ...(specialHours && specialHours.length > 0 ? { specialHours } : {}),
  }
}
