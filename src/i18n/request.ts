import { defaultLocale, locales } from "@/types/locales";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }: any) => {
  // This typically corresponds to the `[locale]` segment

  let locale = await requestLocale;
  if (locale) {
    // console.log("🚀 ~ requestLocalerequestLocale:", locale);

    // Ensure the locale is valid
    if (!locale || !locales.includes(locale)) {
      locale = defaultLocale;
    }

    return {
      locale,
      messages: (await import(`../../messages/${locale}.json`)).default,
    };
  } else {
    // console.log("🚀 ~ defaultLocale:", defaultLocale);
    return {
      locale: defaultLocale,
      messages: (await import(`../../messages/${defaultLocale}.json`)).default,
    };
  }
});
