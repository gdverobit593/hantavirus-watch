export type Locale = "en" | "ru";

export const locales: Locale[] = ["en", "ru"];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
