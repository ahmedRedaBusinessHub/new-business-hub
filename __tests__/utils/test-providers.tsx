import type { ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'

export const mockMessages = {
  auth: {
    login: 'Login',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    submit: 'Submit',
    error: 'Invalid credentials',
  },
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
  },
  programs: {
    title: 'Programs',
    create: 'Create Program',
    edit: 'Edit Program',
    delete: 'Delete Program',
    apply: 'Apply',
  },
  projects: {
    title: 'Projects',
    create: 'Create Project',
    edit: 'Edit Project',
    delete: 'Delete Project',
  },
  operating_hours_title: 'Operating Hours',
  operating_hours_open_now: 'Open Now',
  operating_hours_closed: 'Closed',
  operating_hours_open_24_7: 'Open 24/7',
  operating_hours_permanently_closed: 'Permanently Closed',
  operating_hours_permanently_closed_desc: 'This space is no longer available.',
  operating_hours_special_hours: 'Special Hours',
  operating_hours_special_hours_count: 'Special Hours ({count})',
  operating_hours_every_day: 'Every day',
  operating_hours_mon_fri: 'Mon - Fri',
  operating_hours_sat_sun: 'Sat - Sun',
  operating_hours_24_7: '24/7',
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
}

interface TestProvidersProps {
  children: ReactNode
  locale?: string
  messages?: typeof mockMessages
  session?: Session | null
}

// Default mock session with expiration 1 hour from now
const DEFAULT_MOCK_SESSION: Session = {
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    image: 'https://example.com/avatar.jpg',
    role: 'client',
    bio: 'Test user bio',
  },
  accessToken: 'mock-access-token-123',
  expires: new Date(Date.now() + 3600 * 1000).toISOString(),
}

export function TestProviders({
  children,
  locale = 'en',
  messages = mockMessages,
  session,
}: TestProvidersProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

  const mockSession: Session | null = session ?? DEFAULT_MOCK_SESSION

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SessionProvider session={mockSession}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </SessionProvider>
    </NextIntlClientProvider>
  )
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: string
  messages?: typeof mockMessages
  session?: Session | null
}

export function renderWithProviders(ui: React.ReactElement, options?: CustomRenderOptions) {
  const { locale, messages, session, ...renderOptions } = options || {}

  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders locale={locale} messages={messages} session={session}>
        {children}
      </TestProviders>
    ),
    ...renderOptions,
  })
}
