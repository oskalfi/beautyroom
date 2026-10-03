import { getTranslations } from "next-intl/server";
import { initPageLocale } from "@/i18n/pageLocale";
import type { Metadata } from "next";
import styles from "./page.module.css";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await initPageLocale(params);
  const t = await getTranslations({ locale, namespace: "AccessibilityPage" });
  return { title: `${t("text0")} | Beauty Room`, description: t("description") };
}
export default async function AccessibilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initPageLocale(params);
  const t = await getTranslations({ locale, namespace: "AccessibilityPage" });
  return (
    <main id="main-content" className={styles.page}>
      <h1>{t("text0")}</h1>
      <p>{t("text1")}</p>
      <h2>{t("text2")}</h2>
      <p>{t("text3")}</p>
      <p>{t("text4")}</p>
      <p>{t("text5")}</p>
      <h2>{t("text6")}</h2>
      <p>{t("text7")}</p>
      <h2>{t("text8")}</h2>
      <p>{t("text9")}</p>
      <ul>
        <li>{t("text10")}</li>
        <li>{t("text11")}</li>
        <li>{t("text12")}</li>
      </ul>
      <p>{t("text13")}</p>
      <h2>{t("text14")}</h2>
      <p>{t("text15")}</p>
      <ul>
        <li>
          {t("phone")}: {" "}
          <a href="tel:+972544546420" dir="ltr">
            +972-54-454-64-20
          </a>
        </li>
        <li>
          {t("email")}: {" "}
          <a href="mailto:stadnikov.adam@gmail.com">stadnikov.adam@gmail.com</a>
        </li>
      </ul>
      <p>{t("text16")}</p>
    </main>
  );
}
