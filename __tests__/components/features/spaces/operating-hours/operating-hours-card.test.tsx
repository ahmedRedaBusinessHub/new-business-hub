import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../../utils/test-providers'
import { OperatingHoursCard } from '@/components/features/spaces/operating-hours/operating-hours-card'
import type { OperatingHours } from '@/types/space'

describe('OperatingHoursCard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render operating hours with open status', () => {
    const operatingHours: OperatingHours = {
      timezone: 'UTC',
      regularHours: [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          openTime: '09:00',
          closeTime: '18:00',
        },
      ],
    }

    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'))

    renderWithProviders(
      <OperatingHoursCard operatingHours={operatingHours} />
    )

    expect(screen.getByText('Operating Hours')).toBeInTheDocument()
    expect(screen.getByText('Open Now')).toBeInTheDocument()
  })

  it('should render operating hours with closed status', () => {
    const operatingHours: OperatingHours = {
      timezone: 'UTC',
      regularHours: [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          openTime: '09:00',
          closeTime: '18:00',
        },
      ],
    }

    vi.setSystemTime(new Date('2024-01-01T20:00:00Z'))

    renderWithProviders(
      <OperatingHoursCard operatingHours={operatingHours} />
    )

    expect(screen.getByText('Operating Hours')).toBeInTheDocument()
    expect(screen.getByText('Closed')).toBeInTheDocument()
  })

  it('should display permanently closed state', () => {
    const operatingHours: OperatingHours = {
      timezone: 'America/New_York',
      regularHours: [
        {
          days: ['monday'],
          openTime: '09:00',
          closeTime: '18:00',
        },
      ],
    }

    renderWithProviders(
      <OperatingHoursCard operatingHours={operatingHours} permanentlyClosed={true} />
    )

    expect(screen.getByText('Permanently Closed')).toBeInTheDocument()
    expect(screen.getByText('This space is no longer available.')).toBeInTheDocument()
  })

  it('should render special hours when available', () => {
    const operatingHours: OperatingHours = {
      timezone: 'America/New_York',
      regularHours: [
        {
          days: ['monday'],
          openTime: '09:00',
          closeTime: '18:00',
        },
      ],
      specialHours: [
        {
          date: '2024-12-25',
          isClosed: true,
          reason: 'Christmas Day',
        },
      ],
    }

    renderWithProviders(
      <OperatingHoursCard operatingHours={operatingHours} />
    )

    expect(screen.getByText(/Special Hours/)).toBeInTheDocument()
  })

  it('should handle 24/7 hours', () => {
    const operatingHours: OperatingHours = {
      timezone: 'UTC',
      regularHours: [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          openTime: '00:00',
          closeTime: '00:00',
        },
      ],
    }

    renderWithProviders(
      <OperatingHoursCard operatingHours={operatingHours} />
    )

    expect(screen.getByText('Open 24/7')).toBeInTheDocument()
  })

  it('should render special hours when available', () => {
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
          date: '2024-12-25',
          isClosed: true,
          reason: 'Christmas Day',
        },
      ],
    }

    renderWithProviders(
      <OperatingHoursCard operatingHours={operatingHours} />
    )

    expect(screen.getByText(/Special Hours/)).toBeInTheDocument()
  })

  it('should display permanently closed state', () => {
    const operatingHours: OperatingHours = {
      timezone: 'UTC',
      regularHours: [
        {
          days: ['monday'],
          openTime: '09:00',
          closeTime: '18:00',
        },
      ],
    }

    renderWithProviders(
      <OperatingHoursCard operatingHours={operatingHours} permanentlyClosed={true} />
    )

    expect(screen.getByText('Permanently Closed')).toBeInTheDocument()
    expect(screen.getByText('This space is no longer available.')).toBeInTheDocument()
  })

  it('should handle special hour closure', () => {
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
          date: '2024-01-01',
          isClosed: true,
          reason: 'Holiday',
        },
      ],
    }

    renderWithProviders(
      <OperatingHoursCard operatingHours={operatingHours} />
    )

    expect(screen.getByText('Operating Hours')).toBeInTheDocument()
    expect(screen.queryByText('Permanently Closed')).not.toBeInTheDocument()
  })

  it('should handle current special hour in effect', () => {
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
          date: '2024-01-01',
          openTime: '08:00',
          closeTime: '20:00',
          reason: 'Extended hours',
        },
      ],
    }

    renderWithProviders(
      <OperatingHoursCard operatingHours={operatingHours} />
    )

    expect(screen.getByText(/Special Hours/)).toBeInTheDocument()
  })
})
