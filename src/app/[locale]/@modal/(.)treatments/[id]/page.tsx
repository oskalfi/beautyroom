import { initPageLocale } from "@/i18n/pageLocale";
import { notFound } from "next/navigation";
import { Modal } from "@/shared/components/Modal";
import ModalTreatment from "@/shared/components/ModalTreatment";
import { getTreatmentById } from "@/shared/api/treatments";

export default async function TreatmentModalPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  await initPageLocale(params);
  const { id } = await params;
  const treatment = await getTreatmentById(id);
  if (!treatment) notFound();

  return (
    <Modal key={id} label={treatment.name}>
      <ModalTreatment id={treatment.id} />
    </Modal>
  );
}
