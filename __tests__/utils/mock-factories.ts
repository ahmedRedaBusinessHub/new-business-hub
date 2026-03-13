import type { UserData, LoginSuccessResponse, Program, Project } from '@/types/api'

export function mockUserData(overrides?: Partial<UserData>): UserData {
  return {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'client',
    avatar: 'https://example.com/avatar.jpg',
    bio: 'Test user bio',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
    ...overrides,
  }
}

export function mockAdminUser(overrides?: Partial<UserData>): UserData {
  return mockUserData({ role: 'admin', ...overrides })
}

export function mockModeratorUser(overrides?: Partial<UserData>): UserData {
  return mockUserData({ role: 'moderator', ...overrides })
}

export function mockLoginResponse(overrides?: Partial<LoginSuccessResponse>): LoginSuccessResponse {
  return {
    access_token: 'mock-access-token-123',
    user: mockUserData(),
    ...overrides,
  }
}

export function mockProgram(overrides?: Partial<Program>): Program {
  return {
    id: 1,
    title: 'Test Program',
    title_ar: 'برنامج تجريبي',
    description: 'This is a test program',
    description_ar: 'هذا برنامج تجريبي',
    image_url: 'https://example.com/program.jpg',
    organization_id: 1,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
    ...overrides,
  }
}

export function mockProject(overrides?: Partial<Project>): Project {
  return {
    id: 1,
    name: 'Test Project',
    name_ar: 'مشروع تجريبي',
    description: 'This is a test project',
    description_ar: 'هذا مشروع تجريبي',
    organization_id: 1,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
    ...overrides,
  }
}
