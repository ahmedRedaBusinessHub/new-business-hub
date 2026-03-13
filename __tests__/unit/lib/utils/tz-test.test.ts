import { expect, it } from 'vitest'
import { formatInTimeZone } from 'date-fns-tz'

it('tz test', () => {
  const time = '09:00'
  const timezone = 'America/New_York'
  const [h, m] = time.split(':')
  
  console.log('Method:', formatInTimeZone(`2024-01-08T${h}:${m}:00`, timezone, 'h:mm a zzz'))
  expect(true).toBe(true)
})
