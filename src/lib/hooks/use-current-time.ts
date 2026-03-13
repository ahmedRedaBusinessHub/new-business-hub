import { useState, useEffect } from 'react'
import { OperatingHours } from '@/types/space'
import { isTimeInRange, getDayOfWeek } from '@/lib/utils/timezone-helpers'
import { toZonedTime } from 'date-fns-tz'

export interface OpenNowStatus {
  isOpen: boolean
  isOpen24Hours: boolean
  message: string
}

function calculateStatus(
  operatingHours: OperatingHours,
  timezone: string
): OpenNowStatus {
  const now = new Date()
  const zonedNow = toZonedTime(now, timezone)
  const today = getDayOfWeek(zonedNow)

  const zonedDateStr = `${zonedNow.getFullYear()}-${String(zonedNow.getMonth() + 1).padStart(2, '0')}-${String(zonedNow.getDate()).padStart(2, '0')}`
  const todaySpecialHour = operatingHours.specialHours?.find(
    (sh) => sh.date === zonedDateStr
  )

  if (todaySpecialHour?.isClosed) {
    return { isOpen: false, isOpen24Hours: false, message: 'Closed' }
  }

  if (todaySpecialHour && todaySpecialHour.openTime && todaySpecialHour.closeTime) {
    const isOpen = isTimeInRange(now, todaySpecialHour.openTime, todaySpecialHour.closeTime, timezone)
    return {
      isOpen,
      isOpen24Hours: false,
      message: isOpen ? 'Open Now' : 'Closed'
    }
  }

  const todaySchedule = operatingHours.regularHours.find((rh) => rh.days.includes(today))

  if (!todaySchedule) {
    return { isOpen: false, isOpen24Hours: false, message: 'Closed' }
  }

  if (todaySchedule.openTime === '00:00' && todaySchedule.closeTime === '00:00') {
    return { isOpen: true, isOpen24Hours: true, message: 'Open 24/7' }
  }

  const isOpen = isTimeInRange(now, todaySchedule.openTime, todaySchedule.closeTime, timezone)
  return {
    isOpen,
    isOpen24Hours: false,
    message: isOpen ? 'Open Now' : 'Closed'
  }
}

export function useOpenNowStatus(
  operatingHours: OperatingHours | undefined,
  timezone: string
): OpenNowStatus | null {
  const [status, setStatus] = useState<OpenNowStatus | null>(() => {
    if (!operatingHours) return null
    return calculateStatus(operatingHours, timezone)
  })

  useEffect(() => {
    const updateStatus = () => {
      if (!operatingHours) return
      setStatus(calculateStatus(operatingHours, timezone))
    }

    updateStatus()
    const interval = setInterval(updateStatus, 30000)

    return () => clearInterval(interval)
  }, [operatingHours, timezone])

  return status
}
