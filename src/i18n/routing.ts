import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "he", "ru"],
  defaultLocale: "he",
  localePrefix: "as-needed",
  // The unprefixed site is always Hebrew, regardless of browser language.
  localeDetection: false,
});
export type Locale = (typeof routing.locales)[number];
