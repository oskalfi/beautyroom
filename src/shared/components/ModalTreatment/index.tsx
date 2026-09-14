import { mockData } from "@/shared/store/mockTreatments";
import { Button } from "../Button";
import styles from "./ModalTreatment.module.css";
import Image from "next/image";

interface ModalTreatmentProps {
  id: number;
}

const ModalTreatment = ({ id }: ModalTreatmentProps) => {
  const treatmentInfo = mockData.find((mockTreatment) => {
    return mockTreatment.id === id;
  });

  return (
    <div className={styles.modalTreatment}>
      {treatmentInfo?.imgPath && (
        <Image
          width={1575}
          height={2100}
          className={styles.image}
          src={treatmentInfo!.imgPath}
          alt="Treatment image"
        />
      )}
      <div className={styles.info}>
        <h2 className={styles.treatmentName}>{treatmentInfo?.name}</h2>
        <div className={styles.descriptionWrapper}>
          <p className={styles.description}>{treatmentInfo?.description}</p>
          <div className={styles.infButton}>
            <a className={styles.buttonText} type="button">
              Узнать подробнее
            </a>
            <img className={styles.arrow} src="/arrow.svg" alt="icon" />
          </div>
        </div>

        <Button type="secondary" className={styles.button}>
          Запись
        </Button>
      </div>
    </div>
  );
};

export default ModalTreatment;
