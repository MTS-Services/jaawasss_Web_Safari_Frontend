"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOCALES, useTranslation, type Locale } from "@/lib/i18n";

/**
 * Shared language dropdown used in all three dashboard settings pages.
 *
 * Changing the value instantly:
 * 1. Persists to `localStorage` (key: `sourcenest_lang`)
 * 2. Updates `<html lang>` and `<html dir>` for RTL support
 * 3. Sends the new locale as `Accept-Language` on all subsequent API calls
 */
export function LanguageSelector() {
  const { locale, setLocale } = useTranslation();

  return (
    <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
      <SelectTrigger className="mt-2">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LOCALES.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            <span className="inline-flex items-center gap-2">
              <span>{l.flag}</span>
              <span>{l.nativeName}</span>
              {l.code !== "en" && (
                <span className="text-muted-foreground text-xs">
                  ({l.englishName})
                </span>
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
