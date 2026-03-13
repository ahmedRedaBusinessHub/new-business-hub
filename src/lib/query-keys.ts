export const queryKeys = {
    spaces: {
        all: ["spaces"] as const,
        lists: () => [...queryKeys.spaces.all, "list"] as const,
        list: (filters: Record<string, any>) => [...queryKeys.spaces.lists(), filters] as const,
        details: () => [...queryKeys.spaces.all, "detail"] as const,
        detail: (id: string) => [...queryKeys.spaces.details(), id] as const,
        adminSpaces: ["admin_spaces"] as const,
    },
    bookings: {
        all: ["bookings"] as const,
        lists: () => [...queryKeys.bookings.all, "list"] as const,
        list: (filters: Record<string, any>) => [...queryKeys.bookings.lists(), filters] as const,
        details: () => [...queryKeys.bookings.all, "detail"] as const,
        detail: (id: string) => [...queryKeys.bookings.details(), id] as const,
        userBookings: ["user_bookings"] as const,
        availability: (spaceId: string) => ["availability", spaceId] as const,
    },
    branches: {
        all: ["branches"] as const,
        lists: () => [...queryKeys.branches.all, "list"] as const,
        list: (filters: Record<string, any>) => [...queryKeys.branches.lists(), filters] as const,
        details: () => [...queryKeys.branches.all, "detail"] as const,
        detail: (id: string) => [...queryKeys.branches.details(), id] as const,
    },
    analytics: {
        all: ["analytics"] as const,
        overview: (filters: Record<string, any>) => [...queryKeys.analytics.all, "overview", filters] as const,
        trends: (filters: Record<string, any>) => [...queryKeys.analytics.all, "trends", filters] as const,
        utilization: (filters: Record<string, any>) => [...queryKeys.analytics.all, "utilization", filters] as const,
    },
    subscriptions: {
        all: ["subscriptions"] as const,
        plans: () => [...queryKeys.subscriptions.all, "plans"] as const,
        user: () => [...queryKeys.subscriptions.all, "user"] as const,
    },
    services: {
        all: ["services"] as const,
        lists: () => [...queryKeys.services.all, "list"] as const,
    },
    reviews: {
        all: ["reviews"] as const,
        spaceReviews: (spaceId: string | number) => [...queryKeys.reviews.all, "space", spaceId] as const,
        bookingReview: (bookingId: string | number) => [...queryKeys.reviews.all, "booking", bookingId] as const,
        adminReviews: (params?: Record<string, any>) => [...queryKeys.reviews.all, "admin", params] as const,
        reviewById: (reviewId: string | number | null | undefined) => [...queryKeys.reviews.all, "detail", reviewId] as const,
    },
    notifications: {
        all: ["notifications"] as const,
        user: () => [...queryKeys.notifications.all, "user"] as const,
        list: (params?: Record<string, unknown>) => [...queryKeys.notifications.all, "list", params] as const,
        preferences: () => [...queryKeys.notifications.all, "preferences"] as const,
    },
};
