import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { defaultLocale, locales } from "./types/locales";
import { NextResponse } from "next/server";

const authMiddleware = NextAuth(authConfig).auth;

export async function middleware(req: any) {
  const { pathname } = req.nextUrl;

  // Get the current locale from the URL if it exists
  const currentLocale = pathname.split("/")[1];
  const pathnameHasLocale = locales.includes(currentLocale);

  // Get the stored locale from cookies
  const storedLocale = req.cookies.get("NEXT_LOCALE")?.value;
  const cookieOptions = {
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
    sameSite: "lax" as const,
    httpOnly: true,
  };

  if (pathnameHasLocale) {
    // URL has a valid locale
    const authResponse = await authMiddleware(req);

    if (authResponse) {
      // If cookies API is not available, try to append a Set-Cookie header to the response.
      try {
        const res = authResponse as unknown as Response;
        const cookieValue = `NEXT_LOCALE=${currentLocale}; Path=/; Max-Age=${
          365 * 24 * 60 * 60
        }; HttpOnly; SameSite=Lax`;
        const newHeaders = new Headers(
          res.headers instanceof Headers ? res.headers : (res as any).headers
        );
        newHeaders.append("Set-Cookie", cookieValue);
        return new Response(res.body, {
          status: res.status,
          statusText: res.statusText,
          headers: newHeaders,
        });
      } catch (e) {
        console.log("Could not append Set-Cookie header to authResponse:", e);
      }

      return authResponse;
    }

    // Set cookie to current URL locale and continue
    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", currentLocale, cookieOptions);
    return response;
  } else {
    // No locale in URL - use stored locale or default
    const targetLocale =
      storedLocale && locales.includes(storedLocale)
        ? storedLocale // Use stored locale if it exists and is valid
        : defaultLocale; // Fall back to default locale

    // Create new URL with the target locale
    const newUrl = new URL(`/${targetLocale}${pathname}`, req.url);
    const response = NextResponse.redirect(newUrl);

    // Keep the same locale in cookie
    response.cookies.set("NEXT_LOCALE", targetLocale, cookieOptions);
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)"],
};
