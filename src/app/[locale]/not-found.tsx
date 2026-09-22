import { getLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { NotFoundPage } from "@/components/NotFoundPage";

export default async function NotFound() {
  const locale = await getLocale();
  return <NotFoundPage locale={hasLocale(routing.locales, locale) ? locale : routing.defaultLocale} />;
}
