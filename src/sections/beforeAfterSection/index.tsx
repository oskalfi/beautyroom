import { Button } from "@/shared/components/Button";
import styles from "./BeforeAfterSection.module.css";
import { BeforeAfter } from "@/shared/components/BeforeAfter";

export const BeforeAfterSection = () => {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.heading}>Выберите процедуру</h2>
        <div className={styles.controls}>
          <Button type="secondary">Запись</Button>
          <Button type="primary">Запись</Button>
        </div>
        <BeforeAfter />
      </div>
    </section>
  );
};
