import { defineRouting } from "next-intl/routing";

export const locales = [
  "en",
  "es",
  "fr",
  "de",
  "it",
  "pt",
  "ru",
  "zh",
  "ja",
  "ko",
  "ar",
  "he",
  "fa",
  "ur",
  "hi",
  "tr",
  "vi",
  "th",
  "id",
  "nl",
  "pl",
  "uk",
  "sv",
  "cs",
  "ro",
  "el",
  "hu",
  "bg",
  "da",
  "fi",
  "no",
  "sk",
] as const;

export type Locale = (typeof locales)[number];

export const rtlLocales: Locale[] = ["ar", "he", "fa", "ur"];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
});
