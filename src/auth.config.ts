import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true, // Add this line
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Extract locale from pathname
      const currentLocale = pathname.split("/")[1];

      // Define protected paths
      const protectedPaths = ["admin", "client", "store", "data-entry", "bookings", "account"];
      const isOnProtectedPath = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(`/${currentLocale}/${path}`)
      );
      const isOnLogin =
        nextUrl.pathname.startsWith(`/${currentLocale}/login`) ||
        nextUrl.pathname.startsWith(`/${currentLocale}/register`) ||
        nextUrl.pathname.startsWith(`/${currentLocale}/forgot-password`);

      if (isOnProtectedPath) {
        if (!isLoggedIn) {
          // Redirect to login with callbackUrl
          const callbackUrl = encodeURIComponent(nextUrl.pathname);
          return Response.redirect(
            new URL(
              `/${currentLocale}/login?callbackUrl=${callbackUrl}`,
              nextUrl
            )
          );
        }

        // Admin role check: only users with the "admin" role can access /admin/* routes
        const isAdminRoute = nextUrl.pathname.startsWith(`/${currentLocale}/admin`);
        if (isAdminRoute) {
          const userRole = (auth as any)?.user?.role?.toString()?.toLowerCase();
          if (userRole !== "admin") {
            // Non-admin users are redirected to their role-appropriate path
            const fallbackPath = userRole === "client" ? `/${currentLocale}/bookings?dbgrole=${userRole || 'none'}` : `/${currentLocale}?dbgrole=${userRole || 'none'}`;
            return Response.redirect(new URL(fallbackPath, nextUrl));
          }
        }

        return true;
      }

      if (isLoggedIn && isOnLogin) {
        // Redirect authenticated users to dashboard based on role
        return Response.redirect(new URL(`/${currentLocale}/admin`, nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
