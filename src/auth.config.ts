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
      const protectedPaths = ["admin", "client", "store", "data-entry"];
      const isOnProtectedPath = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(`/${currentLocale}/${path}`)
      );
      const isOnLogin = nextUrl.pathname.startsWith(`/${currentLocale}/login`);

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
        // Check role-based access here if needed
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
