"use client";

import { BOOKING_URL } from "@/shared/config/booking";
import { useState } from "react";
import { skinProblems } from "@/shared/mocks/skinProblems";
import { Button } from "@/shared/components/Button";
import { RevealHeading } from "@/shared/components/RevealHeading";
import styles from "./BeforeAfterSection.module.css";
import { BeforeAfter } from "@/shared/components/BeforeAfter";
import { Select } from "@/shared/components/Select";

export const BeforeAfterSection = () => {
  const [selectedId, setSelectedId] = useState<number | null>(skinProblems[0].id);
  const selectedProblem = skinProblems.find(problem => problem.id === selectedId) ?? skinProblems[0];
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.contentWrapper}>
        <RevealHeading id="heading" className={styles.heading}>
          До / После
        </RevealHeading>
        <Select className={styles.select} options={skinProblems}
          value={selectedProblem.id} onChange={setSelectedId} label="Выберите проблему кожи" />
        <Button href={BOOKING_URL} type="primary" className={styles.button}>
          Запись
        </Button>
        <BeforeAfter key={selectedProblem.id} className={styles.beforeAfter}
          beforeSrc={selectedProblem.before} afterSrc={selectedProblem.after} name={selectedProblem.name} />
      </div>
    </section>
  );
};
