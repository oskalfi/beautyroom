import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getDb } from "@/server/db/client";
import type { Locale } from "@/i18n/routing";
import type { Treatment, TreatmentTextPair } from "@/shared/model/types";

function pairs(value: unknown): TreatmentTextPair[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is TreatmentTextPair => Array.isArray(v) && v.length === 2 && v.every(t => typeof t === "string"));
}

const readPublishedTreatments = unstable_cache(async (locale: Locale): Promise<Treatment[]> => {
  const rows = await getDb().treatment.findMany({
    where: { isPublished: true, archivedAt: null, translations: { some: { locale, name: { not: "" }, description: { not: "" } } } },
    include: {
      translations: { where: { locale } },
      photos: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }], take: 1 },
    },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
  return rows.map(row => {
    const copy = row.translations[0];
    return {
      id: row.id, name: copy.name, description: copy.description, imgPath: row.photos[0]?.url ?? "",
      priceILS: row.priceILS === null ? undefined : Number(row.priceILS), priceFrom: row.priceFrom,
      durationMinutes: row.durationMinutes ?? undefined, durationFrom: row.durationFrom,
      concernsDescription: copy.concernsDescription, concerns: pairs(copy.concerns),
      stepsDescription: copy.stepsDescription, steps: pairs(copy.steps),
      skinTypes: copy.skinTypes, skinDescription: copy.skinDescription,
      contraindications: copy.contraindications, contraindicationsNote: copy.contraindicationsNote,
      evidence: { sourceIds: [], limitations: "", reviewedAt: "", status: "draft-needs-clinical-review" },
    };
  });
}, ["published-treatments-v1"], { tags: ["treatments"], revalidate: 60 });

// Deduplicate metadata, request translations and page queries in the same render.
export const getPublishedTreatments = cache(readPublishedTreatments);
