import "server-only";
import { getDb } from "@/server/db/client";
import { requireOwner } from "@/server/auth/owner";
import { emptyTranslation, type TreatmentEditorData } from "@/shared/model/treatment-editor";
import type { TreatmentTextPair } from "@/shared/model/types";

function pairs(value: unknown): TreatmentTextPair[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is TreatmentTextPair => Array.isArray(v) && v.length === 2 && v.every(t => typeof t === "string"));
}

export async function getTreatmentForEditor(id: number): Promise<TreatmentEditorData | null> {
  await requireOwner();
  const treatment = await getDb().treatment.findFirst({
    where: { id },
    include: { translations: true, photos: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }], take: 1 } },
  });
  if (!treatment) return null;
  const translations = { he: emptyTranslation(), en: emptyTranslation(), ru: emptyTranslation() };
  for (const copy of treatment.translations) {
    translations[copy.locale] = {
      name: copy.name, description: copy.description, concernsDescription: copy.concernsDescription,
      concerns: pairs(copy.concerns), stepsDescription: copy.stepsDescription, steps: pairs(copy.steps),
      skinTypes: copy.skinTypes, skinDescription: copy.skinDescription,
      contraindications: copy.contraindications, contraindicationsNote: copy.contraindicationsNote,
    };
  }
  return {
    id, archived: treatment.archivedAt !== null, version: treatment.updatedAt.toISOString(), priceILS: treatment.priceILS?.toString() ?? "",
    priceFrom: treatment.priceFrom, durationMinutes: treatment.durationMinutes?.toString() ?? "",
    durationFrom: treatment.durationFrom, sortOrder: treatment.sortOrder, isPublished: treatment.isPublished,
    photoUrl: treatment.photos[0]?.url ?? "", translations,
  };
}
