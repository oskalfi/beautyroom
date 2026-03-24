import styles from "./Treatment.module.css";

type treatmentData = {
  name: string;
  id: string;
  description: string;
};

export const Treatment = (treatmentsList: treatmentData[]) => {
  return (
    <>
      {treatmentsList.map((treatment) => {
        return (
          <li className={styles.button} key={treatment.id}>
            <div className={styles.movingBlock}>
              <span className={styles.text}>{treatment.name}</span>
              <img
                className={styles.movingArrow}
                src="/Vector.svg"
                alt="moving icon"
              />
            </div>
            <span className={styles.buttonText}>{treatment.name}</span>
          </li>
        );
      })}
    </>
  );
};
