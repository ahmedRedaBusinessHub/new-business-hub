// lib/geo.ts
import { headers } from "next/headers";
import { GeoMetadata } from "@/types/locales";

export async function getGeoData(): Promise<GeoMetadata> {
  try {
    const headersList = await headers();

    // Get from headers (Vercel, Cloudflare, etc.)
    const country =
      headersList.get("x-vercel-ip-country") ||
      headersList.get("cf-ipcountry") ||
      "SA"; // Default to Saudi Arabia for Middle East focus

    const city =
      headersList.get("x-vercel-ip-city") ||
      headersList.get("cf-ipcity") ||
      undefined;

    const region =
      headersList.get("x-vercel-ip-region") ||
      headersList.get("cf-ipregion") ||
      undefined;

    return {
      country,
      region,
      city,
    };
  } catch (error) {
    return {
      country: "SA", // Fallback to Saudi Arabia
    };
  }
}

// GEO-specific content mapping
export const geoConfig = {
  // Middle East
  SA: {
    currency: "SAR",
    language: "ar-SA",
    defaultCity: "الرياض", // Riyadh
    timezone: "Asia/Riyadh",
    direction: "rtl",
  },
  AE: {
    currency: "AED",
    language: "ar-AE",
    defaultCity: "دبي", // Dubai
    timezone: "Asia/Dubai",
    direction: "rtl",
  },
  QA: {
    currency: "QAR",
    language: "ar-QA",
    defaultCity: "الدوحة", // Doha
    timezone: "Asia/Qatar",
    direction: "rtl",
  },
  KW: {
    currency: "KWD",
    language: "ar-KW",
    defaultCity: "الكويت", // Kuwait City
    timezone: "Asia/Kuwait",
    direction: "rtl",
  },
  BH: {
    currency: "BHD",
    language: "ar-BH",
    defaultCity: "المنامة", // Manama
    timezone: "Asia/Bahrain",
    direction: "rtl",
  },
  OM: {
    currency: "OMR",
    language: "ar-OM",
    defaultCity: "مسقط", // Muscat
    timezone: "Asia/Muscat",
    direction: "rtl",
  },

  // Rest of the world
  US: {
    currency: "USD",
    language: "en-US",
    defaultCity: "New York",
    timezone: "America/New_York",
    direction: "ltr",
  },
  GB: {
    currency: "GBP",
    language: "en-GB",
    defaultCity: "London",
    timezone: "Europe/London",
    direction: "ltr",
  },
  DE: {
    currency: "EUR",
    language: "de-DE",
    defaultCity: "Berlin",
    timezone: "Europe/Berlin",
    direction: "ltr",
  },
  FR: {
    currency: "EUR",
    language: "fr-FR",
    defaultCity: "Paris",
    timezone: "Europe/Paris",
    direction: "ltr",
  },
  // Add more countries as needed
};

// Saudi Arabia specific cities
export const saudiCities = {
  riyadh: "الرياض",
  jeddah: "جدة",
  mecca: "مكة",
  medina: "المدينة المنورة",
  dammam: "الدمام",
  khobar: "الخبر",
  taif: "الطائف",
  abha: "أبها",
};

// Middle East specific configuration
export const middleEastConfig = {
  defaultCurrency: "SAR",
  defaultLanguage: "ar-SA",
  supportedCountries: ["SA", "AE", "QA", "KW", "BH", "OM"],
  isRTLLanguage: (country: string) =>
    ["SA", "AE", "QA", "KW", "BH", "OM"].includes(country),
};
