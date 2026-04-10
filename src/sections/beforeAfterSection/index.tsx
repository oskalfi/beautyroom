import { Button } from "@/shared/components/Button";
import styles from "./BeforeAfterSection.module.css";
import { SliderSVG } from "@/shared/assets/svg/Slider";

export const BeforeAfterSection = () => {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.heading}>Выберите процедуру</h2>
        <div className={styles.controls}>
          <Button type="secondary">Запись</Button>
          <Button type="secondary">Запись</Button>
        </div>
        <div className={styles.beforeAfterComponent}>
          <img
            className={styles.beforeImage}
            src="/before.jpg"
            alt="before «Treatment»"
          />
          <div className={styles.afterImage} />
          <SliderSVG className={styles.slider} />
        </div>
      </div>
    </section>
  );
};
