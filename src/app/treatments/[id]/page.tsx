import Link from "next/link";
import { notFound } from "next/navigation";
import ModalTreatment from "@/shared/components/ModalTreatment";
import { mockData } from "@/shared/store/mockTreatments";
import styles from "./page.module.css";

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const treatment = mockData.find((item) => String(item.id) === id);
  if (!treatment) notFound();

  return (
    <main className={styles.page}>
      <Link href="/" className={styles.back}>← Все процедуры</Link>
      <ModalTreatment id={treatment.id} headingLevel="h1" />
    </main>
  );
}
