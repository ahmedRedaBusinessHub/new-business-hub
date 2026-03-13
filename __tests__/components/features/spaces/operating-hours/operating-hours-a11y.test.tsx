import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { expect, test } from 'vitest'
import { OperatingHoursCard } from '@/components/features/spaces/operating-hours/operating-hours-card'
import { OperatingHours } from '@/types/space'
import { TestProviders } from '../../../utils/test-providers'

expect.extend(toHaveNoViolations)

test('OperatingHoursCard should have no accessibility violations', async () => {
  const operatingHours: OperatingHours = {
    timezone: 'UTC',
    regularHours: [
      {
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        openTime: '09:00',
        closeTime: '17:00'
      }
    ],
    specialHours: [
      {
        date: '2024-12-25',
        isClosed: true,
        reason: 'Christmas'
      }
    ]
  }

  const { container } = render(
    <TestProviders>
      <OperatingHoursCard operatingHours={operatingHours} />
    </TestProviders>
  )
  
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
