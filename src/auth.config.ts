import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl, cookies } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      // Check if the pathname already contains a locale
      const currentLocale = pathname.split("/")[1];
      const isOnApp =
        nextUrl.pathname.startsWith(`/${currentLocale}/admin`) ||
        nextUrl.pathname.startsWith(`/${currentLocale}/client`) ||
        nextUrl.pathname.startsWith(`/${currentLocale}/store`) ||
        nextUrl.pathname.startsWith(`/${currentLocale}/data-entry`);
      const isOnLogin = nextUrl.pathname.startsWith(`/${currentLocale}/login`);

      if (isOnApp) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isLoggedIn && isOnLogin) {
        // Redirect authenticated users away from login
        return Response.redirect(new URL("/admin", nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
