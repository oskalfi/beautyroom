import type { Metadata } from "next";
import { mockTreatments } from "@/shared/mocks/treatments";
import { TreatmentsCatalog } from "./TreatmentsCatalog";

export const metadata: Metadata = {
  title: "Процедуры  | Beauty Room",
  description:
    "Выберите процедуру для лица в Beauty Room: чистка, аппаратный уход и другие услуги. Узнайте, как проходит процедура, кому подходит и как записаться. Тель-Авив — Яффо",
};

export default function ProceduresPage() {
  const treatments = mockTreatments.map(
    ({ id, name, imgPath, description, priceILS, durationMinutes }) => ({
      id,
      name,
      imgPath,
      description,
      priceILS,
      durationMinutes,
    }),
  );
  return <TreatmentsCatalog treatments={treatments} />;
}
