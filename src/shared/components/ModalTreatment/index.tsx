import { Button } from "../Button";
import styles from "./ModalTreatment.module.css";

const ModalTreatment = () => {
  return (
    <div className={styles.modalTreatment}>
      <img className={styles.image} src="/mockImage.jpg" alt="фотка заглушка" />
      <div className={styles.descriptionWrapper}>
        <h2 className={styles.name}>Название процедуры</h2>
        <p className={styles.description}>
          Целенаправленная процедура для глубокой очистки пор, снижения
          воспалений и профилактики высыпаний. Включает мягкое отшелушивание,
          распаривание, ручную чистку (удаление комедонов) и успокаивающий
          завершающий этап.
        </p>
        <Button type="secondary">Запись</Button>
      </div>
    </div>
  );
};

export default ModalTreatment;
