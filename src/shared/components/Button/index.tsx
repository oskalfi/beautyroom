import styles from "./Button.module.css";
import { FingerprintSVG } from "@/shared/assets/svg/Fingerprint";
import { ArrowSVG } from "@/shared/assets/svg/Arrow";

type ButtonProps = {
  children: React.ReactNode;
  type?: "primary" | "secondary" | "treatmentCard";
  className: string;
  "aria-label"?: string;
} & (
  | { href: string; onClick?: React.MouseEventHandler<HTMLAnchorElement> }
  | { href?: never; onClick?: React.MouseEventHandler<HTMLButtonElement> }
);

export const Button = (props: ButtonProps) => {
  const { children, type = "primary", className, "aria-label": ariaLabel } = props;
  const buttonClassName = `${styles.button} ${styles[type]} ${className}`;
  const content = (
    <>
      {type === "primary" && (
        <span className={styles.arrowsContainer} aria-hidden="true">
          <ArrowSVG className={styles.arrow} />
          <ArrowSVG className={styles.arrow} />
          <ArrowSVG className={styles.arrow} />
        </span>
      )}
      <FingerprintSVG className={styles.fingerprint} />
      <span className={styles.text}>{children}</span>
    </>
  );

  if (props.href !== undefined) {
    return (
      <a data-press-feedback href={props.href} onClick={props.onClick} aria-label={ariaLabel} className={buttonClassName}>
        {content}
      </a>
    );
  }

  return (
    <button data-press-feedback type="button" onClick={props.onClick} aria-label={ariaLabel} className={buttonClassName}>
      {content}
    </button>
  );
};
