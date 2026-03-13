import { describe, it, expect, vi } from 'vitest'
import { formatDisplayTime, formatDate, isTimeInRange, getDayOfWeek } from '@/lib/utils/timezone-helpers'

describe('formatDisplayTime', () => {
  it('should format time to 12-hour format with timezone', () => {
    const result = formatDisplayTime('09:00', 'UTC')
    expect(result).toMatch(/9:00 AM UTC/)
  })

  it('should format midnight correctly', () => {
    const result = formatDisplayTime('00:00', 'UTC')
    expect(result).toMatch(/12:00 AM UTC/)
  })

  it('should format time correctly without shifting hours in different timezones', () => {
    const result = formatDisplayTime('09:00', 'America/New_York')
    // Should contain 9:00 AM and EST or EDT depending on time of year
    expect(result).toMatch(/9:00 AM E[SD]T/)
  })

  it('should format noon correctly', () => {
    const result = formatDisplayTime('12:00', 'UTC')
    expect(result).toMatch(/12:00 PM UTC/)
  })

  it('should format time in 24-hour format to 12-hour format', () => {
    const result = formatDisplayTime('18:30', 'UTC')
    expect(result).toMatch(/6:30 PM UTC/)
  })
})

describe('formatDate', () => {
  it('should format date in the space timezone', () => {
    const date = new Date('2024-12-25T12:00:00Z')
    const result = formatDate(date, 'America/New_York')
    expect(result).toMatch(/December 25, 2024/)
  })

  it('should accept date string as input', () => {
    const result = formatDate('2024-12-25', 'America/New_York')
    expect(result).toMatch(/December [0-9]{1,2}, 2024/)
  })
})

describe('isTimeInRange', () => {
  it('should return true when current time is within range', () => {
    const now = new Date('2024-01-01T12:00:00Z')
    const result = isTimeInRange(now, '09:00', '18:00', 'UTC')
    expect(result).toBe(true)
  })

  it('should return false when current time is outside range', () => {
    const now = new Date('2024-01-01T20:00:00Z')
    const result = isTimeInRange(now, '09:00', '18:00', 'UTC')
    expect(result).toBe(false)
  })

  it('should return true for 24/7 hours', () => {
    const now = new Date('2024-01-01T12:00:00Z')
    const result = isTimeInRange(now, '00:00', '00:00', 'UTC')
    expect(result).toBe(true)
  })

  it('should handle boundary cases - opening time', () => {
    const now = new Date('2024-01-01T09:00:00Z')
    const result = isTimeInRange(now, '09:00', '18:00', 'UTC')
    expect(result).toBe(true)
  })

  it('should handle boundary cases - closing time', () => {
    const now = new Date('2024-01-01T18:00:00Z')
    const result = isTimeInRange(now, '09:00', '18:00', 'UTC')
    expect(result).toBe(false)
  })
})

describe('getDayOfWeek', () => {
  it('should return monday for Monday', () => {
    const monday = new Date('2024-01-01')
    expect(getDayOfWeek(monday)).toBe('monday')
  })

  it('should return tuesday for Tuesday', () => {
    const tuesday = new Date('2024-01-02')
    expect(getDayOfWeek(tuesday)).toBe('tuesday')
  })

  it('should return wednesday for Wednesday', () => {
    const wednesday = new Date('2024-01-03')
    expect(getDayOfWeek(wednesday)).toBe('wednesday')
  })

  it('should return thursday for Thursday', () => {
    const thursday = new Date('2024-01-04')
    expect(getDayOfWeek(thursday)).toBe('thursday')
  })

  it('should return friday for Friday', () => {
    const friday = new Date('2024-01-05')
    expect(getDayOfWeek(friday)).toBe('friday')
  })

  it('should return saturday for Saturday', () => {
    const saturday = new Date('2024-01-06')
    expect(getDayOfWeek(saturday)).toBe('saturday')
  })

  it('should return sunday for Sunday', () => {
    const sunday = new Date('2024-01-07')
    expect(getDayOfWeek(sunday)).toBe('sunday')
  })
})
