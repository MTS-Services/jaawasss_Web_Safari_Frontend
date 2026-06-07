// Public API — import everything from "lib/i18n"
export { I18nProvider, useTranslation } from "./context";
export {
  LOCALES,
  LOCALE_MAP,
  DEFAULT_LOCALE,
  STORAGE_KEY,
  getDirection,
  isValidLocale,
  type Locale,
  type Direction,
  type LocaleConfig,
} from "./config";
export type { TranslationKeys } from "./locales";
