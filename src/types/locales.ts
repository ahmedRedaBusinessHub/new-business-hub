export const locales = `${process.env.NEXT_PUBLIC_LOCALES}`.split(",");
export const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;

type Lang = (typeof locales)[number];

export interface LayoutProps {
  children: React.ReactNode;
  params: { locale: Lang };
}

// types/metadata.ts
export interface GeoMetadata {
  country: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogImage: string;
  geo: GeoMetadata;
}

export interface PageProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
