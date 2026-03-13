import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../../utils/test-providers'
import { OperatingHoursList } from '@/components/features/spaces/operating-hours/operating-hours-list'
import type { OperatingHours } from '@/types/space'

describe('OperatingHoursList', () => {
  it('should render operating hours grouped by pattern', () => {
    const operatingHours: OperatingHours = {
      timezone: 'America/New_York',
      regularHours: [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          openTime: '09:00',
          closeTime: '18:00',
        },
        {
          days: ['saturday', 'sunday'],
          openTime: '10:00',
          closeTime: '16:00',
        },
      ],
    }

    renderWithProviders(<OperatingHoursList operatingHours={operatingHours} />)

    expect(screen.getByText(/Mon - Fri/)).toBeInTheDocument()
    expect(screen.getByText(/Sat - Sun/)).toBeInTheDocument()
  })

  it('should display 24/7 hours', () => {
    const operatingHours: OperatingHours = {
      timezone: 'America/New_York',
      regularHours: [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          openTime: '00:00',
          closeTime: '00:00',
        },
      ],
    }

    renderWithProviders(<OperatingHoursList operatingHours={operatingHours} />)

    expect(screen.getByText(/Every day/)).toBeInTheDocument()
    expect(screen.getByText(/24\/7/)).toBeInTheDocument()
  })

  it('should display individual days when patterns vary', () => {
    const operatingHours: OperatingHours = {
      timezone: 'America/New_York',
      regularHours: [
        {
          days: ['monday', 'wednesday', 'friday'],
          openTime: '09:00',
          closeTime: '18:00',
        },
        {
          days: ['tuesday', 'thursday'],
          openTime: '08:00',
          closeTime: '17:00',
        },
      ],
    }

    renderWithProviders(<OperatingHoursList operatingHours={operatingHours} />)

    expect(screen.getByText(/Mon, Wed, Fri/)).toBeInTheDocument()
    expect(screen.getByText(/Tue, Thu/)).toBeInTheDocument()
  })

  it('should format times with timezone', () => {
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

    renderWithProviders(<OperatingHoursList operatingHours={operatingHours} />)

    expect(screen.getByText(/9:00 AM UTC/)).toBeInTheDocument()
    expect(screen.getByText(/6:00 PM UTC/)).toBeInTheDocument()
  })

  it('should handle empty regular hours array', () => {
    const operatingHours: OperatingHours = {
      timezone: 'UTC',
      regularHours: [],
    }

    const { container } = renderWithProviders(<OperatingHoursList operatingHours={operatingHours} />)

    expect(container.firstChild).toBeNull()
  })

  it('should display variable daily hours correctly', () => {
    const operatingHours: OperatingHours = {
      timezone: 'UTC',
      regularHours: [
        {
          days: ['monday', 'wednesday', 'friday'],
          openTime: '09:00',
          closeTime: '17:00',
        },
        {
          days: ['tuesday', 'thursday'],
          openTime: '10:00',
          closeTime: '18:00',
        },
      ],
    }

    renderWithProviders(<OperatingHoursList operatingHours={operatingHours} />)

    expect(screen.getByText(/Mon, Wed, Fri/)).toBeInTheDocument()
    expect(screen.getByText(/Tue, Thu/)).toBeInTheDocument()
  })

  it('should display closed days for specific days', () => {
    const operatingHours: OperatingHours = {
      timezone: 'UTC',
      regularHours: [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          openTime: '09:00',
          closeTime: '18:00',
        },
        {
          days: ['saturday', 'sunday'],
          openTime: '00:00',
          closeTime: '00:00',
        },
      ],
    }

    renderWithProviders(<OperatingHoursList operatingHours={operatingHours} />)

    expect(screen.getByText(/Sat - Sun/)).toBeInTheDocument()
    expect(screen.getByText(/24\/7/)).toBeInTheDocument()
  })
})
