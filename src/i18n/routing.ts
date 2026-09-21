import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "he", "ru"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // The unprefixed site is always English, regardless of browser language.
  localeDetection: false,
});
export type Locale = (typeof routing.locales)[number];
