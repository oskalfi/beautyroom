"use client";
import { useTranslations } from "next-intl";


import { useState } from "react";
import { Select } from "@/shared/components/Select";
import { TreatmentCard, type TreatmentCardData } from "@/shared/components/TreatmentCard";
import styles from "./page.module.css";

export function TreatmentsCatalog({ treatments }: { treatments: TreatmentCardData[] }) {
  const t = useTranslations("Treatment");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const visibleTreatments = selectedId === null ? treatments : treatments.filter(treatment => treatment.id === selectedId);
  return <main className={styles.page}>
    <div className={styles.container}>
      <h1 className={styles.title}>{t("select")}</h1>
      <Select className={styles.filter} value={selectedId} onChange={setSelectedId} options={treatments} allLabel={t("all")} />
      <p role="status" className={styles.status}>{t("count", { count: visibleTreatments.length })}</p>
      <div className={styles.grid}>{visibleTreatments.map(treatment => <TreatmentCard key={treatment.id} treatment={treatment} />)}</div>
    </div>
  </main>;
}
