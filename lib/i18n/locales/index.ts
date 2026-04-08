import en from "./en";
import es from "./es";
import ar from "./ar";
import he from "./he";
import type { TranslationKeys } from "./en";
import type { Locale } from "../config";

export type { TranslationKeys };

const translations: Record<Locale, TranslationKeys> = { en, es, ar, he };

export default translations;
