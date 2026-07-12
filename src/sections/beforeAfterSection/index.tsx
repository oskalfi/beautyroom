import { Button } from "@/shared/components/Button";
import styles from "./BeforeAfterSection.module.css";
import { BeforeAfter } from "@/shared/components/BeforeAfter";
import { Select } from "@/shared/components/Select";

export const BeforeAfterSection = () => {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.contentWrapper}>
        <h2 id="heading" className={styles.heading}>
          До / После
        </h2>
        <Select className={styles.select}></Select>
        <Button type="primary" className={styles.button}>
          Запись
        </Button>
        <BeforeAfter className={styles.beforeAfter} />
      </div>
    </section>
  );
};
