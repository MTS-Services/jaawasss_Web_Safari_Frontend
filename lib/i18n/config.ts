// ---------------------------------------------------------------------------
// i18n configuration — single source of truth for supported locales.
// ---------------------------------------------------------------------------

export type Locale = "en" | "es" | "ar" | "he";

export type Direction = "ltr" | "rtl";

export interface LocaleConfig {
  /** BCP-47 language code sent as `Accept-Language` to the backend. */
  code: Locale;
  /** Native name shown in the language dropdown. */
  nativeName: string;
  /** English name shown as a secondary label. */
  englishName: string;
  /** Flag emoji for visual identification. */
  flag: string;
  /** Text direction — Arabic and Hebrew are RTL. */
  dir: Direction;
}

export const LOCALES: readonly LocaleConfig[] = [
  { code: "en", nativeName: "English",    englishName: "English",  flag: "🇺🇸", dir: "ltr" },
  { code: "es", nativeName: "Español",    englishName: "Spanish",  flag: "🇪🇸", dir: "ltr" },
  { code: "ar", nativeName: "العربية",    englishName: "Arabic",   flag: "🇸🇦", dir: "rtl" },
  { code: "he", nativeName: "עברית",      englishName: "Hebrew",   flag: "🇮🇱", dir: "rtl" },
] as const;

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_MAP: Record<Locale, LocaleConfig> = Object.fromEntries(
  LOCALES.map((l) => [l.code, l])
) as Record<Locale, LocaleConfig>;

/** Storage key used in localStorage (matches the existing API client key). */
export const STORAGE_KEY = "sourcenest_lang";

/** Returns the direction for a given locale code. */
export function getDirection(locale: Locale): Direction {
  return LOCALE_MAP[locale]?.dir ?? "ltr";
}

/** Validates whether a string is a supported locale code. */
export function isValidLocale(value: unknown): value is Locale {
  return typeof value === "string" && value in LOCALE_MAP;
}
