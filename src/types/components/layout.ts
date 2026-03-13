import type { ReactNode } from 'react'

export interface RootLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export interface NavbarProps {
  locale: string
  user?: {
    id: number
    name: string
    email: string
    role?: string
    avatar?: string
  }
}

export interface FooterProps {
  locale: string
}

export interface ProfileMenuProps {
  user: {
    id: number
    name: string
    email: string
    role?: string
    avatar?: string
  }
  onLogout: () => void
}
