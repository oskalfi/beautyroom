import { Suspense } from "react";
import styles from "./InstagramSection.module.css";
import { Posts } from "./Posts";

export function InstagramSection() {
  return (
    <section className={styles.sectionContainer}>
      <h2 className={styles.heading}>Остаёмся на связи</h2>
      <div className={styles.gallery}>
        <Suspense fallback={<div className={styles.fallback}>Загрузка</div>}>
          <Posts />
        </Suspense>
      </div>
    </section>
  );
}
