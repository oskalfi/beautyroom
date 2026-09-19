import styles from "./Button.module.css";
import { FingerprintSVG } from "@/shared/assets/svg/Fingerprint";
import { ArrowSVG } from "@/shared/assets/svg/Arrow";

type ButtonProps = {
  children: React.ReactNode;
  type?: "primary" | "secondary" | "treatmentCard";
  className: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  "aria-label"?: string;
};

export const Button = ({
  children,
  type = "primary",
  className,
  onClick,
  "aria-label": ariaLabel,
}: ButtonProps) => {
  const decor = styles[type];

  return type === "primary" ? (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
      className={`${styles.button} ${decor} ${className}`}
    >
      <div className={styles.arrowsContainer}>
        <ArrowSVG className={styles.arrow} />
        <ArrowSVG className={styles.arrow} />
        <ArrowSVG className={styles.arrow} />
      </div>
      <FingerprintSVG className={styles.fingerprint} />
      <span className={styles.text}>{children}</span>
    </button>
  ) : (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
      className={`${styles.button} ${decor} ${className}`}
    >
      <FingerprintSVG className={styles.fingerprint} />
      <span className={styles.text}>{children}</span>
    </button>
  );
};
