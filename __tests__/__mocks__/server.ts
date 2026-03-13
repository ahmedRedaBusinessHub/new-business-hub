import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const server = setupServer(
  // Auth endpoints
  http.post('*/auth/login', () => {
    return HttpResponse.json({
      access_token: 'mock-token',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'client',
        avatar: null,
        bio: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }),

  http.post('*/auth/verify-otp', () => {
    return HttpResponse.json({
      access_token: 'mock-token',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'client',
        avatar: null,
        bio: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }),

  http.get('*/auth/me', () => {
    return HttpResponse.json({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'client',
      avatar: null,
      bio: null,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }),

  // Programs endpoints
  http.get('*/programs', () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          title: 'Test Program',
          title_ar: 'برنامج اختبار',
          description: 'Test description',
          description_ar: 'وصف الاختبار',
          image_url: null,
          organization_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      meta: {
        total: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
    });
  }),

  http.post('*/programs', () => {
    return HttpResponse.json({
      id: 1,
      title: 'New Program',
      description: 'New description',
      created_at: new Date(),
      updated_at: new Date(),
    });
  }),

  // Projects endpoints
  http.get('*/projects', () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: 'Test Project',
          name_ar: 'مشروع اختبار',
          description: 'Test description',
          description_ar: 'وصف الاختبار',
          organization_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      meta: {
        total: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
    });
  }),

  http.post('*/projects', () => {
    return HttpResponse.json({
      id: 1,
      name: 'New Project',
      description: 'New description',
      created_at: new Date(),
      updated_at: new Date(),
    });
  }),

  // Organizations endpoints
  http.get('*/organizations', () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: 'Test Organization',
          description: 'Test description',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      meta: {
        total: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
    });
  }),

  http.post('*/organizations', () => {
    return HttpResponse.json({
      id: 1,
      name: 'New Organization',
      description: 'New description',
      created_at: new Date(),
      updated_at: new Date(),
    });
  }),
);
