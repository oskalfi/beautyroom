import { notFound } from "next/navigation";
import { requireOwner } from "@/server/auth/owner";
import { getTreatmentForEditor } from "@/server/treatments/editor";
import { CrmShell } from "../../components/CrmShell";
import { TreatmentEditor } from "../../components/TreatmentEditor";

export default async function EditTreatmentPage({ params }: { params: Promise<{ id: string }> }) {
  await requireOwner();
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isSafeInteger(numericId) || numericId <= 0) notFound();
  const treatment = await getTreatmentForEditor(numericId);
  if (!treatment) notFound();
  return <CrmShell><TreatmentEditor key={id} initial={treatment} /></CrmShell>;
}
