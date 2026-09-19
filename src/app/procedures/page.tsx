import type { Metadata } from "next";
import { mockTreatments } from "@/shared/mocks/treatments";
import { TreatmentsCatalog } from "./TreatmentsCatalog";

export const metadata: Metadata = { title: "Процедуры | Beauty Room", description: "Выберите процедуру в студии Beauty Room: описание, подробности и запись." };

export default function ProceduresPage() {
  const treatments = mockTreatments.map(({ id, name, imgPath, description, priceILS, durationMinutes }) => ({ id, name, imgPath, description, priceILS, durationMinutes }));
  return <TreatmentsCatalog treatments={treatments} />;
}
