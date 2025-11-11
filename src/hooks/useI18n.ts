"use client";
import { useParams } from "next/navigation";
import { defaultLocale } from "@/types/locales";
import { useTranslations } from "next-intl";

export function useI18n(key?: any) {
  const language = useParams().locale || defaultLocale;
  const t = key ? useTranslations(key) : useTranslations();

  return { language, t };
}
