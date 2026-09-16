import { mockTreatments as mockData } from "@/shared/mocks/treatments";
import { Button } from "../Button";
import styles from "./ModalTreatment.module.css";
import Image from "next/image";

interface ModalTreatmentProps {
  id: number;
  headingLevel?: "h1" | "h2";
}

const ModalTreatment = ({
  id,
  headingLevel: Heading = "h2",
}: ModalTreatmentProps) => {
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
          src={treatmentInfo.imgPath}
          alt={treatmentInfo.name}
        />
      )}
      <div className={styles.info}>
        <Heading className={styles.treatmentName}>
          {treatmentInfo?.name}
        </Heading>
        <div className={styles.descriptionWrapper}>
          <p className={styles.description}>{treatmentInfo?.description}</p>
          <div className={styles.infButton}>
            <a href={`/treatments/${id}`} className={styles.buttonText}>
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
