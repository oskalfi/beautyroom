import styles from "./MediaLoader.module.css";

export function MediaLoader({ label = "Загрузка…" }: { label?: string }) {
  return (
    <div className={styles.overlay} role="status" aria-label={label}>
      <span className={styles.spinner} aria-hidden="true" />
    </div>
  );
}
