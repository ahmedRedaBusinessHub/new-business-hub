import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { LayoutProps } from "@/types/locales";
import "./globals.css";
import { Metadata } from "next";
import { getGeoData, middleEastConfig } from "@/lib/geo";
import { ThemeProvider } from "@/contexts/ThemeProvider";

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { locale }: any = await params;
  const messages = await getMessages({ locale });
  const geo = await getGeoData();
  const isRTL = middleEastConfig.isRTLLanguage(geo.country);
  const t = messages;
  return {
    icons: {
      icon: "/images/logo.svg",
      shortcut: "/images/logo.svg",
      apple: "/images/logo.svg",
    },
    title: {
      default: t?.metadata?.home?.title,
      template: "%s | " + t?.metadata?.home?.title,
    },
    description: t?.metadata?.home?.description,
    keywords: t?.metadata?.home?.keywords,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${locale}`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en`,
        ar: `${process.env.NEXT_PUBLIC_DOMAIN}/ar`,
        "x-default": `${process.env.NEXT_PUBLIC_DOMAIN}/ar`,
      },
    },
    authors: [{ name: t?.metadata?.home?.authors }],
    creator: t?.metadata?.home?.authors,
    publisher: t?.metadata?.home?.authors,
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_DOMAIN}`),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // GEO Tags for Saudi Arabia
    other: {
      "geo.region": geo.country,
      "geo.position": "24.7136;46.6753", // Riyadh coordinates
      ICBM: "24.7136, 46.6753",

      // Local Business Schema for Saudi Arabia
      "business:contact_data:country_name": isRTL
        ? "المملكة العربية السعودية"
        : "Saudi Arabia",
      "business:contact_data:region":
        geo.region || (isRTL ? "الرياض" : "Riyadh"),
      "business:contact_data:locality":
        geo.city || (isRTL ? "الرياض" : "Riyadh"),

      // Arabic language support
      ...(isRTL && {
        "content-language": "ar",
        "content-script-type": "text/javascript",
        "content-style-type": "text/css",
      }),
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // Detect RTL
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction}>
      <body>
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
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
