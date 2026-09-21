"use client";

import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { Select } from "@/shared/components/Select";
import styles from "./LanguageSwitcher.module.css";

const languages = [
  { id: 0, locale: "en", name: "English" },
  { id: 1, locale: "he", name: "עברית" },
  { id: 2, locale: "ru", name: "Русский" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  return (
    <div className={styles.switcher} dir="ltr">
      <Select
        className={styles.select}
        label={t("language")}
        value={languages.find(language => language.locale === locale)?.id}
        options={languages.map(({ id, name }) => ({ id, name }))}
        placement="top"
        triggerContent={<span aria-hidden="true" />}
        onChange={id => {
          const next = languages.find(language => language.id === id)?.locale;
          if (!next || next === locale) return;
          // Full navigation also resets intercepted modal slots when changing language.
          window.location.assign(getPathname({ locale: next, href: pathname }) + window.location.search + window.location.hash);
        }}
      />
    </div>
  );
}
