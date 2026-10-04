import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { getTreatments } from "@/shared/api/treatments";

const messages = {
  en: () => import("../../messages/en.json"),
  he: () => import("../../messages/he.json"),
  ru: () => import("../../messages/ru.json"),
};
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const treatments = await getTreatments(locale);
  // Client components need only short cards, never all clinical copy or other languages.
  const summaries = treatments.map(({ id, name, description, imgPath, priceILS, priceFrom, durationMinutes, durationFrom }) =>
    ({ id, name, description, imgPath, priceILS, priceFrom, durationMinutes, durationFrom }));
  return { locale, timeZone: "Asia/Jerusalem", messages: {
    ...(await messages[locale]()).default,
    TreatmentSummaries: summaries,
  } };
});
