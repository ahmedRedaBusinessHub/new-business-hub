'use client'

import { OperatingHours } from '@/types/space'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { formatDisplayTime } from '@/lib/utils/timezone-helpers'

interface OperatingHoursListProps {
  operatingHours: OperatingHours
}

export function OperatingHoursList({ operatingHours }: OperatingHoursListProps) {
  const t = useTranslations()
  const { regularHours, timezone } = operatingHours

  const groupedHours = regularHours.reduce((acc, schedule) => {
    const key = `${schedule.openTime}-${schedule.closeTime}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(schedule.days)
    return acc
  }, {} as Record<string, string[][]>)

  if (Object.keys(groupedHours).length === 0) {
    return null
  }

  const today = new Date().getDay()
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const todayName = dayNames[today]

  return (
    <div className="flex flex-col space-y-1">
      {Object.entries(groupedHours).map(([times, daysGroups]) => {
        const allDays = daysGroups.flat()
        const isToday = allDays.includes(todayName)
        const isAllWeekdays = allDays.length === 5 && allDays.every(d => d !== 'saturday' && d !== 'sunday')
        const isAllWeekends = allDays.length === 2 && allDays.every(d => d === 'saturday' || d === 'sunday')
        const isAllDays = allDays.length === 7
        const is24Hours = times === '00:00-00:00'

        return (
          <div
            key={times}
            className={cn(
              "group flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors",
              isToday ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted/40"
            )}
          >
            <span className={cn(
              "font-medium text-sm flex items-center gap-2.5",
              isToday ? "text-primary" : "text-muted-foreground"
            )}>
              <div className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                isToday ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "bg-primary/40 group-hover:bg-primary"
              )} />
              {isAllDays ? t('operating_hours_every_day') :
                isAllWeekdays ? t('operating_hours_mon_fri') :
                  isAllWeekends ? t('operating_hours_sat_sun') :
                    formatDays(allDays, t)}
            </span>
            <span className={cn(
              "font-semibold bg-background shadow-sm border border-border/40 px-3 py-1 rounded-md text-sm transition-all",
              isToday ? "border-primary/30 text-primary shadow-primary/10" : "text-foreground/90 group-hover:border-primary/20 group-hover:text-primary"
            )}>
              {is24Hours ? t('operating_hours_24_7') : formatTimeRange(times, timezone)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function formatDays(days: string[], t: ReturnType<typeof useTranslations>): string {
  const dayLabels: Record<string, string> = {
    monday: t('mon'),
    tuesday: t('tue'),
    wednesday: t('wed'),
    thursday: t('thu'),
    friday: t('fri'),
    saturday: t('sat'),
    sunday: t('sun')
  }
  return days.map(d => dayLabels[d]).join(', ')
}

function formatTimeRange(times: string, timezone: string): string {
  const [openTime, closeTime] = times.split('-')
  return `${formatDisplayTime(openTime, timezone)} - ${formatDisplayTime(closeTime, timezone)}`
}
