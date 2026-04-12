import { Button } from "@/shared/components/Button";
import styles from "./BeforeAfterSection.module.css";
import { BeforeAfter } from "@/shared/components/BeforeAfter";
import { Select } from "@/shared/components/Select";

export const BeforeAfterSection = () => {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.contentWrapper}>
        <h2 id="heading" className={styles.heading}>
          Выберите процедуру
        </h2>
        <div className={styles.controls}>
          <Select></Select>
          <Button type="primary">Запись</Button>
        </div>
        <BeforeAfter />
      </div>
    </section>
  );
};
