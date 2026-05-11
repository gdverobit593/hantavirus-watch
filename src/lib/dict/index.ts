import type { Locale } from "@/lib/i18n";
import { en } from "@/lib/dict/en";
import { ru } from "@/lib/dict/ru";

export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
  return locale === "ru" ? ru : en;
}
