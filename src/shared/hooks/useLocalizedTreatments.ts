"use client";

import { useMessages } from "next-intl";
import type { Treatment } from "@/shared/model/types";

export type TreatmentSummary = Pick<Treatment, "id" | "name" | "description" | "imgPath" | "priceILS" | "priceFrom" | "durationMinutes" | "durationFrom">;

export function useLocalizedTreatments(): TreatmentSummary[] {
  const messages = useMessages() as unknown as { TreatmentSummaries: TreatmentSummary[] };
  return messages.TreatmentSummaries;
}
