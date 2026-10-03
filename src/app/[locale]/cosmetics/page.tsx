import { initPageLocale } from "@/i18n/pageLocale";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import styles from "./page.module.css";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await initPageLocale(params);
  const t = await getTranslations({ locale, namespace: "Cosmetics" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}
export default async function CosmeticsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initPageLocale(params);
  const t = await getTranslations({ locale, namespace: "Cosmetics" });
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero} aria-labelledby="cosmetics-title">
          <p className={styles.eyebrow}>{t("eyebrow")}</p>
          <h1 id="cosmetics-title" className={styles.title}>{t("title")}</h1>
          <p className={styles.lead}>{t("lead")}</p>
          <Link data-press-feedback href="/contacts" className={styles.button}>{t("discuss")} <span aria-hidden="true">↗</span></Link>
        </section>
        <div className={styles.sections}>
          <section className={styles.panel} aria-labelledby="personal-care-title">
            <h2 id="personal-care-title">{t("careTitle")}</h2>
            <p>{t("care1")}</p><p>{t("care2")}</p>
          </section>
          <section className={styles.panel} aria-labelledby="after-treatment-title">
            <h2 id="after-treatment-title">{t("afterTitle")}</h2>
            <p>{t.rich("after1", { procedures: (chunks) => <Link data-press-feedback href="/procedures" className={styles.link}>{chunks}</Link> })}</p>
            <p>{t("after2")}</p>
          </section>
        </div>
        <section className={styles.booking} aria-labelledby="consultation-title">
          <h2 id="consultation-title">{t("consultTitle")}</h2>
          <p>{t("consult")}</p>
          <p>{t.rich("location", { address: (chunks) => <Link data-press-feedback href="/address">{chunks}</Link> })}</p>
          <Link data-press-feedback href="/contacts" className={styles.button}>{t("contact")} <span aria-hidden="true">↗</span></Link>
        </section>
      </div>
    </main>
  );
}
