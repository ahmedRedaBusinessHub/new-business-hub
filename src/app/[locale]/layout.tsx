import { NextIntlClientProvider } from "next-intl";

import { Suspense } from "react";
import { locales } from "@/types/locales";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { somar } from "@/assets/fonts"; // Adjust the import path as needed
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { AuthSession } from "@/types/auth";
import { getMessages } from "next-intl/server";
import { createGenerateMetadata } from "@/lib/geo";

export const generateMetadata = createGenerateMetadata("home");

// This function tells Next.js which locales to statically generate
export async function generateStaticParams() {
  return locales.map((locale) => ({
    locale: locale,
  }));
}

// A simple loading component to use as a fallback
function LoadingFallback() {
  return <div>Loading...</div>;
}
export default async function RootLayout({ children, params }: any) {
  const session: AuthSession | any = await auth();
  // Validate that the incoming `locale` parameter is valid
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={somar.variable}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div
          className="min-h-screen transition-colors duration-300"
          style={{ backgroundColor: "var(--theme-bg-primary)" }}
        >
          {/* <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
            <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
              <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                To get started, edit the page.tsx file.
              </h1>
              <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                Looking for a starting point or more instructions? Head over to{" "}
                <a
                  href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  className="font-medium text-zinc-950 dark:text-zinc-50"
                >
                  Templates
                </a>{" "}
                or the{" "}
                <a
                  href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  className="font-medium text-zinc-950 dark:text-zinc-50"
                >
                  Learning
                </a>{" "}
                center.
              </p>
            </div>
            <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
              <a
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
                href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Deploy Now
              </a>
              <a
                className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
                href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            </div>
          </main>
        </div> */}
          <NextIntlClientProvider messages={messages} locale={locale}>
            <SessionProvider session={session}>
              <ThemeProvider
              // attribute="class"
              // enableSystem
              // disableTransitionOnChange
              >
                <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
              </ThemeProvider>
            </SessionProvider>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
