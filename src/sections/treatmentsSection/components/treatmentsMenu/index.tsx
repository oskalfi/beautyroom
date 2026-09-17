import styles from "./TreatmentsMenu.module.css";
import { treatmentDataProps } from "../../../../shared/model/types";
import { TreatmentItem } from "../treatmentsItem";
import { revealMenu } from "../../animations/revealMenu";
import { useTreatmentKeyboardNavigation } from "./useTreatmentKeyboardNavigation";
import { useGSAP } from "@gsap/react";

export const TreatmentsMenu = ({ data }: { data: treatmentDataProps[] }) => {
  const keyboardNavigation = useTreatmentKeyboardNavigation();
  useGSAP(() => {
    revealMenu(styles.menu, styles.menuCoverBlock);
  });
  return (
    <div className={styles.menu} {...keyboardNavigation}>
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
