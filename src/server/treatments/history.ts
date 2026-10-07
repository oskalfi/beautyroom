import { randomUUID } from "node:crypto";
import type { Prisma } from "@/generated/prisma/client";
import { emptyTreatment, type TreatmentEditorData } from "@/shared/model/treatment-editor";

type Actor = { id: string; name: string; email: string };
export type Change = { field: string; locale?: "he" | "en" | "ru"; before: string; after: string };
type Snapshot = Prisma.TreatmentGetPayload<{ include: { translations: true; photos: true } }>;

export function historySnapshot(row: Snapshot | null): TreatmentEditorData {
  const result = emptyTreatment();
  if (!row) return result;
  result.priceILS = row.priceILS?.toString() ?? "";
  result.priceFrom = row.priceFrom;
  result.durationMinutes = row.durationMinutes?.toString() ?? "";
  result.durationFrom = row.durationFrom;
  result.photoUrl = row.photos[0]?.url ?? "";
  for (const copy of row.translations) result.translations[copy.locale] = {
    name: copy.name, description: copy.description, concernsDescription: copy.concernsDescription,
    concerns: copy.concerns as [string, string][], stepsDescription: copy.stepsDescription,
    steps: copy.steps as [string, string][], skinTypes: copy.skinTypes,
    skinDescription: copy.skinDescription, contraindications: copy.contraindications,
    contraindicationsNote: copy.contraindicationsNote,
  };
  return result;
}

const fields = {
  name: "Название", description: "Описание", concernsDescription: "Описание показаний",
  concerns: "Показания", stepsDescription: "Описание этапов", steps: "Этапы процедуры",
  skinTypes: "Типы кожи", skinDescription: "Описание типов кожи",
  contraindications: "Противопоказания", contraindicationsNote: "Примечание к противопоказаниям",
} as const;
function text(value: string | string[] | [string, string][]) {
  if (typeof value === "string") return value;
  return value.map((item, i) => Array.isArray(item) ? `${i + 1}. ${item[0]}\n${item[1]}` : `${i + 1}. ${item}`).join("\n\n");
}
export function treatmentDiff(before: TreatmentEditorData, after: TreatmentEditorData): Change[] {
  const changes: Change[] = [];
  function add(field: string, old: string, next: string, locale?: Change["locale"]) {
    if (old !== next) changes.push({ field, before: old, after: next, ...(locale ? { locale } : {}) });
  }
  const price = (v: string) => v ? `${Number(v).toFixed(2)} ₪` : "";
  add("Цена", price(before.priceILS), price(after.priceILS));
  add("Цена «от»", before.priceFrom ? "Да" : "Нет", after.priceFrom ? "Да" : "Нет");
  const duration = (v: string) => v ? `${Number(v)} мин` : "";
  add("Длительность", duration(before.durationMinutes), duration(after.durationMinutes));
  add("Длительность «от»", before.durationFrom ? "Да" : "Нет", after.durationFrom ? "Да" : "Нет");
  add("Фотография", before.photoUrl, after.photoUrl);
  for (const locale of ["he", "en", "ru"] as const) {
    for (const key of Object.keys(fields) as (keyof typeof fields)[]) {
      add(fields[key], text(before.translations[locale][key]), text(after.translations[locale][key]), locale);
    }
  }
  return changes;
}

export function treatmentName(row: { translations: { locale: string; name: string }[] }) {
  return row.translations.find(t => t.locale === "ru" && t.name)?.name || row.translations.find(t => t.name)?.name || "Без названия";
}

export async function writeHistory(tx: Prisma.TransactionClient, actor: Actor, treatmentId: number, name: string, action: string, changes: Change[], operationId = randomUUID()) {
  if (!changes.length) return;
  await tx.treatmentChange.createMany({ data: changes.map(change => ({
    operationId, actorId: actor.id, actorName: actor.name || actor.email,
    treatmentId, treatmentName: name, action, ...change,
  })) });
}
