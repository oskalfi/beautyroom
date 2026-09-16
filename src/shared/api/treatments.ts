import type { Treatment } from "@/shared/model/types";
import { mockTreatments } from "@/shared/mocks/treatments";

/** Replace this adapter with the server request when the backend is available. */
export async function getTreatmentById(id: string): Promise<Treatment | null> {
  return mockTreatments.find((treatment) => String(treatment.id) === id) ?? null;
}
