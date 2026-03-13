'use client'

import { SpecialHour } from '@/types/space'
import { formatDate, formatDisplayTime } from '@/lib/utils/timezone-helpers'
import { useTranslations } from 'next-intl'

interface SpecialHoursListProps {
  specialHours: SpecialHour[]
  timezone: string
}

export function SpecialHoursList({ specialHours, timezone }: SpecialHoursListProps) {
  const t = useTranslations()
  return (
    <div className="flex flex-col space-y-1.5">
      {specialHours.map((specialHour, index) => (
        <div
          key={`${specialHour.date}-${index}`}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2.5 px-3 rounded-lg bg-background/50 border border-border/30 hover:border-orange-500/20 transition-colors gap-2 shadow-sm"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">
              {formatDate(specialHour.date, timezone)}
            </span>
            {specialHour.reason && (
              <span className="text-xs text-muted-foreground/80 italic">
                {specialHour.reason}
              </span>
            )}
          </div>
          <span className={`self-start sm:self-auto font-semibold text-xs px-2.5 py-1 rounded-md border ${specialHour.isClosed
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
              : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
            }`}>
            {specialHour.isClosed ? t('operating_hours_closed') :
              specialHour.openTime && specialHour.closeTime ?
                `${formatDisplayTime(specialHour.openTime, timezone)} - ${formatDisplayTime(specialHour.closeTime, timezone)}` :
                'N/A'}
          </span>
        </div>
      ))}
    </div>
  )
}
