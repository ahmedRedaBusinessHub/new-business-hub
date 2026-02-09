"use client";
import { useParams } from "next/navigation";
import { defaultLocale } from "@/types/locales";
import { useTranslations } from "next-intl";

export function useI18n(key?: any) {
  const params = useParams();
  const locale = params?.locale;
  const language = (Array.isArray(locale) ? locale[0] : locale) || defaultLocale;
  const t = key ? useTranslations(key) : useTranslations();

  return { language, t };
}
