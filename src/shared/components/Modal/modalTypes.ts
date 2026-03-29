import { lazy } from "react";

export const ModalTypes = {
  none: null,
  TREATMENT: lazy(() => import("../ModalTreatment")),
};
