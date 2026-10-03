import { getTranslations } from "next-intl/server";
import { initPageLocale } from "@/i18n/pageLocale";
import { getBookingUrl } from "@/shared/config/booking";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTreatmentById } from "@/shared/api/treatments";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  await initPageLocale(params);
  const { id } = await params;
  const treatment = await getTreatmentById(id);
  if (!treatment) notFound();

  return {
    title: `${treatment.name} | Beauty Room`,
    description: treatment.description,
  };
}

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const locale = await initPageLocale(params);
  const { id } = await params;
  const treatment = await getTreatmentById(id);
  if (!treatment) notFound();

  const t = await getTranslations("Treatment");
  return (
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <nav aria-label={t("breadcrumb")} className={styles.breadcrumbs}>
        <Link href="/">{t("home")}</Link><span aria-hidden="true">/</span>
        <Link href="/procedures">{t("procedures")}</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{treatment.name}</span>
      </nav>

      <section className={styles.hero} aria-labelledby="treatment-title">
        {treatment.imgPath ? <Image src={treatment.imgPath} alt={treatment.name} width={525} height={700}
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1180px) 45vw, 525px"
          quality={85} preload className={styles.photo} /> : <div className={`${styles.photo} ${styles.photoPlaceholder}`}>{t("photo")}</div>}
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Beauty Room / {t("facialCare")}</p>
          <h1 id="treatment-title" className={styles.title}>{treatment.name}</h1>
          <p className={styles.description}>{treatment.description}</p>
          <a data-press-feedback href={getBookingUrl(locale)} className={styles.primaryLink}>{t("book")} <span aria-hidden="true">↗</span></a>
          <p className={styles.caption}>{t("caption")}</p>
        </div>
      </section>

      <nav aria-label={t("about")} className={styles.sectionNav}>
        <a href="#treatment-concerns">{t("concerns")} ↗</a>
        <a href="#treatment-steps">{t("steps")} ↗</a>
        <a href="#treatment-skin">{t("skin")} ↗</a>
        <a href="#treatment-contraindications">{t("contraindications")} ↗</a>
      </nav>

      <section id="treatment-concerns" className={styles.section} aria-labelledby="concerns-title">
        <div className={styles.sectionHeading}>
          <h2 id="concerns-title">{t("concerns")}</h2>
          <p>{treatment.concernsDescription}</p>
        </div>
        <ul className={styles.concerns}>
          {treatment.concerns.map(([title, description], index) => (
            <li key={title} className={styles.concern}>
              <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ul>
      </section>

      <section id="treatment-steps" className={styles.section} aria-labelledby="steps-title">
        <div className={styles.sectionHeading}>
          <h2 id="steps-title">{t("steps")}</h2>
          <p>{treatment.stepsDescription}</p>
        </div>
        <ol className={styles.steps}>
          {treatment.steps.map(([title, description], index) => (
            <li key={title} className={styles.step}>
              <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <div className={styles.suitability}>
        <section id="treatment-skin" aria-labelledby="skin-title">
          <p className={styles.eyebrow}>{t("individual")}</p>
          <h2 id="skin-title">{t("skin")}</h2>
          <ul className={styles.skinTypes}>{treatment.skinTypes.map((type) => <li key={type}>{type}</li>)}</ul>
          <p className={styles.note}>{treatment.skinDescription}</p>
        </section>
        <section id="treatment-contraindications" className={styles.contraindications} aria-labelledby="contraindications-title">
          <p className={styles.eyebrow}>{t("before")}</p>
          <h2 id="contraindications-title">{t("contraindications")}</h2>
          <ul className={styles.limitations}>
            {treatment.contraindications.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className={styles.note}>{treatment.contraindicationsNote}</p>
        </section>
      </div>

      <section id="treatment-booking" className={styles.booking} aria-labelledby="booking-title">
        <div><p className={styles.eyebrow}>{t("next")}</p>
          <h2 id="booking-title">{t("meet")}</h2>
          <p>{t("discuss")}</p>
        </div>
        <a data-press-feedback href={getBookingUrl(locale)} className={styles.primaryLink}>{t("whatsapp")} <span aria-hidden="true">↗</span></a>
      </section>
    </main>
  );
}
