import type { Treatment } from "@/shared/model/types";
import { mockTreatments } from "@/shared/mocks/treatments";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

type TreatmentCopy = Pick<Treatment, "name" | "description" | "concernsDescription" | "stepsDescription" | "skinTypes" | "skinDescription" | "contraindications" | "contraindicationsNote"> & { concerns: string[][]; steps: string[][] };

function textPairs(pairs: string[][]): Treatment["steps"] {
  return pairs.map(pair => {
    if (pair.length !== 2) throw new Error("Treatment translation must contain title/description pairs");
    return [pair[0], pair[1]];
  });
}

/** Load only the requested language; Russian remains the editorial source. */
export async function getTreatments(locale: Locale): Promise<Treatment[]> {
  if (locale === "ru") return mockTreatments;
  const translations = (locale === "he"
    ? (await import("@/shared/mocks/treatments.he.json")).default
    : (await import("@/shared/mocks/treatments.en.json")).default) as Record<string, TreatmentCopy>;
  return mockTreatments.map(treatment => {
    const copy = translations[String(treatment.id)];
    if (!copy) throw new Error(`Missing ${locale} treatment translation: ${treatment.id}`);
    return { ...treatment, ...copy, concerns: textPairs(copy.concerns), steps: textPairs(copy.steps) };
  });
}

/** Replace this adapter with the server request when the backend is available. */
export async function getTreatmentById(id: string): Promise<Treatment | null> {
  const treatments = await getTreatments(await getLocale());
  return treatments.find((treatment) => String(treatment.id) === id) ?? null;
}
