"use client";
import { useTranslations, useLocale } from "next-intl";


import { getBookingUrl } from "@/shared/config/booking";
import { useState } from "react";
import { skinProblems } from "@/shared/mocks/skinProblems";
import { Button } from "@/shared/components/Button";
import { RevealHeading } from "@/shared/components/RevealHeading";
import styles from "./BeforeAfterSection.module.css";
import { BeforeAfter } from "@/shared/components/BeforeAfter";
import { Select } from "@/shared/components/Select";

export const BeforeAfterSection = () => {
  const t = useTranslations("Home");
  const locale = useLocale();
  const names = t.raw("skinProblems") as string[];
  const problems = skinProblems.map((problem, index) => ({ ...problem, name: names[index] }));
  const booking = useTranslations("Navigation");
  const [selectedId, setSelectedId] = useState<number | null>(skinProblems[0].id);
  const selectedProblem = problems.find(problem => problem.id === selectedId) ?? problems[0];
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.contentWrapper}>
        <RevealHeading id="heading" className={styles.heading}>
          {t("beforeAfter")}
        </RevealHeading>
        <Select className={styles.select} options={problems}
          value={selectedProblem.id} onChange={setSelectedId} label={t("selectConcern")} />
        <Button href={getBookingUrl(locale)} type="primary" className={styles.button}>
          {booking("booking")}
        </Button>
        <BeforeAfter key={selectedProblem.id} className={styles.beforeAfter}
          beforeSrc={selectedProblem.before} afterSrc={selectedProblem.after} name={selectedProblem.name} />
      </div>
    </section>
  );
};
