import type { Treatment } from "@/shared/model/types";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getPublishedTreatments } from "@/server/treatments/public";

/** Neon is the only source of procedure content, including translations. */
export async function getTreatments(locale: Locale): Promise<Treatment[]> {
  return getPublishedTreatments(locale);
}

/** Drafts and archived treatments are never returned to public pages. */
export async function getTreatmentById(id: string): Promise<Treatment | null> {
  const treatments = await getTreatments(await getLocale());
  return treatments.find((treatment) => String(treatment.id) === id) ?? null;
}
