"use client";

import { useTranslations } from "next-intl";
import type { Treatment } from "@/shared/model/types";
import styles from "./TreatmentMeta.module.css";

export type TreatmentMetaData = Pick<Treatment, "priceILS" | "priceFrom" | "durationMinutes" | "durationFrom">;

export function TreatmentMeta({ treatment, className = "" }: { treatment: TreatmentMetaData; className?: string }) {
  const t = useTranslations("Treatment");
  return (
    <div className={`${styles.meta} ${className}`} dir="ltr">
      <span dir="ltr">{treatment.priceILS != null ? `₪ ${treatment.priceILS}${treatment.priceFrom ? "+" : ""}` : t("priceRequest")}</span>
      <span dir="ltr">{treatment.durationMinutes != null ? t(treatment.durationFrom ? "minutesFrom" : "minutes", { count: treatment.durationMinutes }) : t("durationRequest")}</span>
    </div>
  );
}
