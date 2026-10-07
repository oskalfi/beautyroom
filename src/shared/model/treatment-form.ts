import type { TreatmentEditorData } from "./treatment-editor";

/** Only fields the administrator can edit; publication/version are server metadata. */
export function treatmentFormSnapshot(data: TreatmentEditorData): string {
  return JSON.stringify({
    priceILS: data.priceILS, priceFrom: data.priceFrom,
    durationMinutes: data.durationMinutes, durationFrom: data.durationFrom,
    photoUrl: data.photoUrl,
    translations: ["he", "en", "ru"].map(locale => data.translations[locale as keyof typeof data.translations]),
  });
}
