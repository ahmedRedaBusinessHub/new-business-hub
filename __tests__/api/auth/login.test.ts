import { describe, it, expect, beforeEach } from 'vitest'
import { POST } from '@/app/api/auth/login-direct/route'
import { server } from '../../__mocks__/server'
import { http, HttpResponse } from 'msw'
import { NextRequest } from 'next/server'

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  it('should return 200 with valid credentials and typed response', async () => {
    server.use(
      http.post('*/auth/login', () => {
        return HttpResponse.json({
          access_token: 'mock-token-123',
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            role: 'client',
            avatar: 'https://example.com/avatar.jpg',
            bio: 'Test user bio',
            created_at: new Date('2024-01-01'),
            updated_at: new Date('2024-01-01'),
          },
        })
      })
    )

    const request = new NextRequest('http://localhost:3000/api/auth/login-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'test@example.com',
        password: 'password123',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('access_token')
    expect(data.access_token).toBe('mock-token-123')
    expect(data.user).toMatchObject({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'client',
    })
  })

  it('should return 400 with missing identifier', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: 'password123',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toMatchObject({
      statusCode: 400,
      message: 'Identifier and password are required',
      error: 'Bad Request',
    })
  })

  it('should return 400 with missing password', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'test@example.com',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toMatchObject({
      statusCode: 400,
      message: 'Identifier and password are required',
      error: 'Bad Request',
    })
  })

  it('should accept optional login fields (country_code, platform, etc.)', async () => {
    server.use(
      http.post('*/auth/login', () => {
        return HttpResponse.json({
          access_token: 'mock-token-123',
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            role: 'client',
            avatar: 'https://example.com/avatar.jpg',
            bio: 'Test user bio',
            created_at: new Date('2024-01-01'),
            updated_at: new Date('2024-01-01'),
          },
        })
      })
    )

    const request = new NextRequest('http://localhost:3000/api/auth/login-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'test@example.com',
        password: 'password123',
        country_code: '+1',
        platform: 'web',
        client_info: 'test-client',
        firebase_token: 'firebase-token-123',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('access_token')
  })

  it('should handle 2FA response from backend', async () => {
    server.use(
      http.post('*/auth/login', () => {
        return HttpResponse.json({
          message: '2FA required',
          actions: 'sent_email',
          retry_after: new Date(Date.now() + 60000),
        })
      })
    )

    const request = new NextRequest('http://localhost:3000/api/auth/login-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'test@example.com',
        password: 'password123',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('message')
    expect(data.actions).toBe('sent_email')
    expect(data).toHaveProperty('retry_after')
  })
})
