import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOpenNowStatus } from '@/lib/hooks/use-current-time'
import type { OperatingHours } from '@/types/space'

describe('useOpenNowStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return null when operatingHours is undefined', () => {
    const { result } = renderHook(() =>
      useOpenNowStatus(undefined, 'America/New_York')
    )

    expect(result.current).toBeNull()
  })

  it('should return open status when current time is within operating hours', () => {
    const operatingHours: OperatingHours = {
      timezone: 'America/New_York',
      regularHours: [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          openTime: '09:00',
          closeTime: '18:00',
        },
      ],
    }

    vi.setSystemTime(new Date('2024-01-01T14:00:00Z'))

    const { result } = renderHook(() =>
      useOpenNowStatus(operatingHours, 'America/New_York')
    )

    expect(result.current).toEqual({
      isOpen: true,
      isOpen24Hours: false,
      message: 'Open Now',
    })
  })

  it('should return closed status when current time is outside operating hours', () => {
    const operatingHours: OperatingHours = {
      timezone: 'America/New_York',
      regularHours: [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          openTime: '09:00',
          closeTime: '18:00',
        },
      ],
    }

    vi.setSystemTime(new Date('2024-01-01T02:00:00Z'))

    const { result } = renderHook(() =>
      useOpenNowStatus(operatingHours, 'America/New_York')
    )

    expect(result.current).toEqual({
      isOpen: false,
      isOpen24Hours: false,
      message: 'Closed',
    })
  })

  it('should return open 24/7 status for 24/7 hours', () => {
    const operatingHours: OperatingHours = {
      timezone: 'America/New_York',
      regularHours: [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          openTime: '00:00',
          closeTime: '00:00',
        },
      ],
    }

    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'))

    const { result } = renderHook(() =>
      useOpenNowStatus(operatingHours, 'America/New_York')
    )

    expect(result.current).toEqual({
      isOpen: true,
      isOpen24Hours: true,
      message: 'Open 24/7',
    })
  })

  it('should return closed status for permanently closed special hour', () => {
    const operatingHours: OperatingHours = {
      timezone: 'America/New_York',
      regularHours: [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          openTime: '09:00',
          closeTime: '18:00',
        },
      ],
      specialHours: [
        {
          date: '2024-01-01',
          isClosed: true,
          reason: 'Holiday',
        },
      ],
    }

    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'))

    const { result } = renderHook(() =>
      useOpenNowStatus(operatingHours, 'America/New_York')
    )

    expect(result.current).toEqual({
      isOpen: false,
      isOpen24Hours: false,
      message: 'Closed',
    })
  })

  it('should return open status based on special hours', () => {
    const operatingHours: OperatingHours = {
      timezone: 'America/New_York',
      regularHours: [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          openTime: '09:00',
          closeTime: '18:00',
        },
      ],
      specialHours: [
        {
          date: '2024-01-01',
          openTime: '08:00',
          closeTime: '20:00',
          reason: 'Extended hours',
        },
      ],
    }

    vi.setSystemTime(new Date('2024-01-01T14:00:00Z'))

    const { result } = renderHook(() =>
      useOpenNowStatus(operatingHours, 'America/New_York')
    )

    expect(result.current).toEqual({
      isOpen: true,
      isOpen24Hours: false,
      message: 'Open Now',
    })
  })

  it('should update status every 30 seconds', () => {
    const operatingHours: OperatingHours = {
      timezone: 'America/New_York',
      regularHours: [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          openTime: '09:00',
          closeTime: '18:00',
        },
      ],
    }

    vi.setSystemTime(new Date('2024-01-01T02:00:00Z'))

    const { result } = renderHook(() =>
      useOpenNowStatus(operatingHours, 'America/New_York')
    )

    expect(result.current).toEqual({
      isOpen: false,
      isOpen24Hours: false,
      message: 'Closed',
    })

    act(() => {
      vi.setSystemTime(new Date('2024-01-01T14:00:00Z'))
      vi.advanceTimersByTime(30000)
    })

    expect(result.current).toEqual({
      isOpen: true,
      isOpen24Hours: false,
      message: 'Open Now',
    })
  })
})
