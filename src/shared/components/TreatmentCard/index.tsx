"use client";

import { useLocale, useTranslations } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import Image from "next/image";
import { Button } from "@/shared/components/Button";
import type { Treatment } from "@/shared/model/types";
import styles from "./TreatmentCard.module.css";

export type TreatmentCardData = Pick<
  Treatment,
  "id" | "name" | "imgPath" | "description" | "priceILS" | "priceFrom" | "durationMinutes" | "durationFrom"
>;

export const TreatmentCard = ({
  treatment,
}: {
  treatment: TreatmentCardData;
}) => {
  const locale = useLocale();
  const t = useTranslations("Treatment");
  const href = getPathname({ locale, href: `/treatments/${treatment.id}` });
  const details = [
    treatment.priceILS != null ? `₪ ${treatment.priceILS}${treatment.priceFrom ? "+" : ""}` : t("priceRequest"),
    treatment.durationMinutes != null
      ? t(treatment.durationFrom ? "minutesFrom" : "minutes", { count: treatment.durationMinutes })
      : t("durationRequest"),
  ];
  return (
    <article
      className={styles.card}
      aria-labelledby={`treatment-${treatment.id}`}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={treatment.imgPath}
          alt={treatment.name}
          fill
          quality={85}
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1440px) calc((100vw - 120px) / 2), 660px"
          className={styles.image}
        />
      </div>
      <div className={styles.headingRow}>
        <h2 id={`treatment-${treatment.id}`} className={styles.title}>
          {treatment.name}
        </h2>
        <Button
          type="treatmentCard"
          className={styles.button}
          aria-label={t("chooseNamed", { name: treatment.name })}
          onClick={() => window.location.assign(`${href}#treatment-booking`)}
        >
          {t("choose")}
        </Button>
      </div>
      <p className={styles.description}>{treatment.description}</p>
      <div className={styles.footer}>
        <a
          href={href}
          className={styles.details}
          aria-label={t("detailsNamed", { name: treatment.name })}
        >
          {t("details")}
        </a>
        <p className={styles.meta} dir="ltr">{details.join(" | ")}</p>
      </div>
    </article>
  );
};
