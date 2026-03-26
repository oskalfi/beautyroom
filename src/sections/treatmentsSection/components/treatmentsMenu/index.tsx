import styles from "./TreatmentsMenu.module.css";
import { treatmentDataProps } from "../../../../shared/model/types";
import { TreatmentItem } from "../treatmentsItem";
import { revealMenu } from "../../animations/revealMenu";
import { useGSAP } from "@gsap/react";

export const TreatmentsMenu = ({ data }: { data: treatmentDataProps[] }) => {
  useGSAP(() => {
    revealMenu(styles.menu, styles.menuCoverBlock);
  });
  return (
    <div className={styles.menu}>
      <div className={styles.menuCoverBlock} />
      {data.map((treatment) => {
        return (
          <TreatmentItem
            key={treatment.id}
            id={treatment.id}
            name={treatment.name}
          />
        );
      })}
    </div>
  );
};
