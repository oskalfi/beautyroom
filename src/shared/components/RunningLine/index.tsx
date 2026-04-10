import styles from "./RunningLine.module.css";

type RunningLineProps = {
  facts: string[];
};

export const RunningLine = ({ facts }: RunningLineProps) => {
  return (
    <div className={styles.runningLine}>
      <div className={styles.factsWrapper}>
        {[...facts, ...facts].map((fact, index) => {
          return (
            <span className={styles.fact} key={index}>
              {fact}
            </span>
          );
        })}
      </div>
    </div>
  );
};
