import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const messages = {
  en: () => import("../../messages/en.json"),
  he: () => import("../../messages/he.json"),
  ru: () => import("../../messages/ru.json"),
};
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return { locale, timeZone: "Asia/Jerusalem", messages: (await messages[locale]()).default };
});
