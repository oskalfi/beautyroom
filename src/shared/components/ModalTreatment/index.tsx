import { Button } from "../Button";
import { ArrowSVG } from "@/shared/assets/svg/Arrow";
import styles from "./ModalTreatment.module.css";

const ModalTreatment = () => {
  return (
    <div className={styles.modalTreatment}>
      <img className={styles.image} src="/mockImage.jpg" alt="фотка заглушка" />
      <div className={styles.info}>
        <h2 className={styles.treatmentName}>Название процедуры</h2>
        <div className={styles.descriptionWrapper}>
          <p className={styles.description}>
            Целенаправленная процедура для глубокой очистки пор, снижения
            воспалений и профилактики высыпаний. Включает мягкое отшелушивание,
            распаривание, ручную чистку (удаление комедонов) и успокаивающий
            завершающий этап.
          </p>
          <div className={styles.infButton}>
            <a className={styles.buttonText} type="button">
              Узнать подробнее
            </a>
            {/*TODO: ЗАМЕНИТЬ текущую анимацию на движущуюся стрелку или смену opacity каждой буквы*/}
            <img className={styles.arrow} src="/arrow.svg" alt="icon" />
          </div>
        </div>

        <Button type="secondary">Запись</Button>
      </div>
    </div>
  );
};

export default ModalTreatment;
