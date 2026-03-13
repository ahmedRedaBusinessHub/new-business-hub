import { describe, it, expect, vi } from 'vitest'
import { OperatingHours } from '@/types/space'

describe('Special Hours Filtering (FR-007)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T00:00:00Z'))
  })

  it('should filter out past special hours', () => {
    const operatingHours: OperatingHours = {
      timezone: 'UTC',
      regularHours: [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          openTime: '09:00',
          closeTime: '18:00',
        },
      ],
      specialHours: [
        {
          date: '2023-12-25',
          isClosed: true,
          reason: 'Christmas Day 2023',
        },
        {
          date: '2024-12-25',
          isClosed: true,
          reason: 'Christmas Day 2024',
        },
        {
          date: '2025-01-01',
          openTime: '09:00',
          closeTime: '17:00',
          reason: 'New Year 2025',
        },
      ],
    }

    const todayString = '2024-01-15'

    const filteredSpecialHours = operatingHours.specialHours?.filter(
      (sh) => sh.date >= todayString
    )

    expect(filteredSpecialHours).toHaveLength(2)
    expect(filteredSpecialHours?.[0].date).toBe('2024-12-25')
    expect(filteredSpecialHours?.[1].date).toBe('2025-01-01')
  })

  it('should keep future special hours', () => {
    const operatingHours: OperatingHours = {
      timezone: 'UTC',
      regularHours: [
        {
          days: ['monday'],
          openTime: '09:00',
          closeTime: '18:00',
        },
      ],
      specialHours: [
        {
          date: '2024-12-31',
          openTime: '09:00',
          closeTime: '20:00',
          reason: 'New Year\'s Eve',
        },
      ],
    }

    const todayString = '2024-01-15'

    const filteredSpecialHours = operatingHours.specialHours?.filter(
      (sh) => sh.date >= todayString
    )

    expect(filteredSpecialHours).toHaveLength(1)
    expect(filteredSpecialHours?.[0].reason).toBe('New Year\'s Eve')
  })
})
