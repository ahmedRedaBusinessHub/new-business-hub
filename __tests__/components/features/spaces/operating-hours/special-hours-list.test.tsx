import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../../utils/test-providers'
import { SpecialHoursList } from '@/components/features/spaces/operating-hours/special-hours-list'
import type { SpecialHour } from '@/types/space'

describe('SpecialHoursList', () => {
  it('should render special hours with dates and reasons', () => {
    const specialHours: SpecialHour[] = [
      {
        date: '2024-12-25',
        isClosed: true,
        reason: 'Christmas Day',
      },
      {
        date: '2024-12-31',
        openTime: '09:00',
        closeTime: '20:00',
        reason: 'New Year\'s Eve Extended Hours',
      },
    ]

    renderWithProviders(
      <SpecialHoursList specialHours={specialHours} timezone="UTC" />
    )

    expect(screen.getByText(/December 25, 2024/)).toBeInTheDocument()
    expect(screen.getByText(/Christmas Day/)).toBeInTheDocument()
    expect(screen.getByText(/December 31, 2024/)).toBeInTheDocument()
    expect(screen.getByText(/New Year's Eve Extended Hours/)).toBeInTheDocument()
  })

  it('should display "Closed" for special hour closure', () => {
    const specialHours: SpecialHour[] = [
      {
        date: '2024-12-25',
        isClosed: true,
        reason: 'Holiday',
      },
    ]

    renderWithProviders(
      <SpecialHoursList specialHours={specialHours} timezone="UTC" />
    )

    expect(screen.getByText('Closed')).toBeInTheDocument()
  })

  it('should format times correctly', () => {
    const specialHours: SpecialHour[] = [
      {
        date: '2024-12-31',
        openTime: '09:00',
        closeTime: '20:00',
      },
    ]

    renderWithProviders(
      <SpecialHoursList specialHours={specialHours} timezone="UTC" />
    )

    expect(screen.getByText(/9:00 AM UTC/)).toBeInTheDocument()
    expect(screen.getByText(/8:00 PM UTC/)).toBeInTheDocument()
  })
})
