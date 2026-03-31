import styles from "./Button.module.css";
import { FingerprintSVG } from "@/shared/assets/svg/Fingerprint";
import { ArrowSVG } from "@/shared/assets/svg/Arrow";

type ButtonProps = {
  children: React.ReactNode;
  type?: "primary" | "secondary";
};

export const Button = ({ children, type = "primary" }: ButtonProps) => {
  const decor = type === "primary" ? styles.primary : styles.secondary;

  //TODO: сделать чтобы стрелки были равны высоте текста (обернуть в общий контейнер)
  // TODO: убрать условие в return

  return type === "primary" ? (
    <button type="button" className={`${styles.button} ${decor} `}>
      <div className={styles.arrowsContainer}>
        <ArrowSVG className={styles.arrow} />
        <ArrowSVG className={styles.arrow} />
        <ArrowSVG className={styles.arrow} />
      </div>
      <FingerprintSVG className={styles.fingerprint} />
      <span className={styles.text}>{children}</span>
    </button>
  ) : (
    <button type="button" className={`${styles.button} ${decor} `}>
      <FingerprintSVG className={styles.fingerprint} />
      <span className={styles.text}>{children}</span>
    </button>
  );
};
