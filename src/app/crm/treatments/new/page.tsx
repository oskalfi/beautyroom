import { requireOwner } from "@/server/auth/owner";
import { emptyTreatment } from "@/shared/model/treatment-editor";
import { CrmShell } from "../../components/CrmShell";
import { TreatmentEditor } from "../../components/TreatmentEditor";

export default async function NewTreatmentPage() {
  await requireOwner();
  return <CrmShell><TreatmentEditor initial={emptyTreatment()} /></CrmShell>;
}
