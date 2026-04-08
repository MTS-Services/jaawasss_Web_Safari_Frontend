"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  getDirection,
  isValidLocale,
  STORAGE_KEY,
  type Direction,
  type Locale,
} from "./config";
import translations from "./locales";
import type { TranslationKeys } from "./locales";

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface I18nContextValue {
  /** Current active locale code. */
  locale: Locale;
  /** Text direction for the current locale. */
  dir: Direction;
  /** Full translation object for the current locale. */
  t: TranslationKeys;
  /** Switch to a different locale. Persists to localStorage & updates <html>. */
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && isValidLocale(stored)) return stored;

  return DEFAULT_LOCALE;
}

/**
 * Apply `lang` and `dir` to the `<html>` element so the entire page
 * respects the chosen locale's direction (critical for Arabic & Hebrew).
 */
function applyToDocument(locale: Locale, dir: Direction) {
  if (typeof document === "undefined") return;

  const html = document.documentElement;
  html.setAttribute("lang", locale);
  html.setAttribute("dir", dir);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = readStoredLocale();
    setLocaleState(stored);
    applyToDocument(stored, getDirection(stored));
  }, []);

  const setLocale = useCallback((next: Locale) => {
    if (!isValidLocale(next)) return;

    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyToDocument(next, getDirection(next));
  }, []);

  const dir = getDirection(locale);
  const t = translations[locale];

  const value = useMemo<I18nContextValue>(
    () => ({ locale, dir, t, setLocale }),
    [locale, dir, t, setLocale]
  );

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Access translations and the current locale from any client component.
 *
 * ```tsx
 * const { t, locale, setLocale, dir } = useTranslation();
 * ```
 */
export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within an <I18nProvider>");
  }
  return ctx;
}
