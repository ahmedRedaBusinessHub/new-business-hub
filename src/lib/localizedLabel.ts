/**
 * Returns the localized label (English or Arabic) based on the current locale.
 * Use for static list labels (status, type, category, etc.) so only one language is shown.
 */
export function getLocalizedLabel(
  nameEn: string | null | undefined,
  nameAr: string | null | undefined,
  locale: string
): string {
  const en = (nameEn ?? "").trim();
  const ar = (nameAr ?? "").trim();
  if (locale === "ar") return ar || en;
  return en || ar;
}
