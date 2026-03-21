import styles from "./Button.module.css";
import { FingerprintSVG } from "@/shared/assets/svg/Fingerprint";
import { ArrowSVG } from "@/shared/assets/svg/Arrow";

type ButtonProps = {
  children: React.ReactNode;
};

export const Button = ({ children }: ButtonProps) => {
  return (
    <button type="button" className={styles.button}>
      <div className={styles.arrowsContainer}>
        <ArrowSVG className={styles.arrow} />
        <ArrowSVG className={styles.arrow} />
        <ArrowSVG className={styles.arrow} />
      </div>
      <FingerprintSVG className={styles.fingerprint} />
      <span className={styles.text}>{children}</span>
    </button>
  );
};
