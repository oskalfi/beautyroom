import { Button } from "@/shared/components/Button";
import { RevealHeading } from "@/shared/components/RevealHeading";
import styles from "./BeforeAfterSection.module.css";
import { BeforeAfter } from "@/shared/components/BeforeAfter";
import { Select } from "@/shared/components/Select";

export const BeforeAfterSection = () => {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.contentWrapper}>
        <RevealHeading id="heading" className={styles.heading}>
          До / После
        </RevealHeading>
        <Select className={styles.select}></Select>
        <Button type="primary" className={styles.button}>
          Запись
        </Button>
        <BeforeAfter className={styles.beforeAfter} />
      </div>
    </section>
  );
};
