import { http, HttpResponse } from 'msw'
import { mockLoginResponse, mockUserData, mockProgram, mockProject } from '../utils/mock-factories'
import type { Program } from '@/types/api/programs'
import type { Project } from '@/types/api/projects'

export const handlers = [
  http.post('*/auth/login', () => {
    return HttpResponse.json(mockLoginResponse())
  }),

  http.post('*/auth/verify-otp', () => {
    return HttpResponse.json({
      message: 'OTP verified successfully',
      access_token: 'mock-access-token-123',
    })
  }),

  http.get('*/auth/me', () => {
    return HttpResponse.json({ data: mockUserData() })
  }),

  http.get('*/programs', () => {
    return HttpResponse.json({
      data: [mockProgram(), mockProgram({ id: 2, title: 'Another Program' })],
      meta: {
        total: 2,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
    })
  }),

  http.post('*/programs', async ({ request }) => {
    const body = (await request.json()) as Partial<Program>
    return HttpResponse.json(mockProgram(body))
  }),

  http.get('*/projects', () => {
    return HttpResponse.json({
      data: [mockProject(), mockProject({ id: 2, name: 'Another Project' })],
      meta: {
        total: 2,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
    })
  }),

  http.post('*/projects', async ({ request }) => {
    const body = (await request.json()) as Partial<Project>
    return HttpResponse.json(mockProject(body))
  }),
]
