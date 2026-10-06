import { z } from "zod";

const text = z.string().trim().max(10_000, "Текст не должен превышать 10 000 символов.");
const pair = z.tuple([text, text]);
const translation = z.object({
  name: z.string().trim().max(200),
  description: text,
  concernsDescription: text,
  concerns: z.array(pair).max(40),
  stepsDescription: text,
  steps: z.array(pair).max(40),
  skinTypes: z.array(z.string().trim().max(200)).max(40),
  skinDescription: text,
  contraindications: z.array(text).max(40),
  contraindicationsNote: text,
});

const photoUrl = z.string().trim().max(2_000).refine((value) => {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}, "Укажите путь к фото на сайте или HTTPS-ссылку.");

export const treatmentEditorSchema = z.object({
  archived: z.boolean().optional(),
  id: z.number().int().positive().nullable(),
  version: z.string().datetime().nullable(),
  priceILS: z.string().trim().refine(v => v === "" || /^\d{1,7}(\.\d{1,2})?$/.test(v), "Цена: положительное число, максимум два знака после точки."),
  priceFrom: z.boolean(),
  durationMinutes: z.string().trim().refine(v => v === "" || (/^\d+$/.test(v) && Number(v) >= 1 && Number(v) <= 1440), "Длительность должна быть от 1 до 1440 минут."),
  durationFrom: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
  isPublished: z.boolean(),
  photoUrl,
  translations: z.object({ he: translation, en: translation, ru: translation }),
}).superRefine((value, ctx) => {
  if (value.id !== null && !value.version) ctx.addIssue({ code: "custom", message: "Не указана версия процедуры. Обновите страницу." });
  if (!value.isPublished) return;
  for (const locale of ["he", "en", "ru"] as const) {
    const copy = value.translations[locale];
    if (!copy.name || !copy.description) ctx.addIssue({ code: "custom", message: `Для публикации заполните название и описание: ${locale.toUpperCase()}.` });
    for (const [title, description] of [...copy.concerns, ...copy.steps]) {
      if (!title || !description) ctx.addIssue({ code: "custom", message: `Заполните оба поля пунктов в переводе ${locale.toUpperCase()} или удалите пустой пункт.` });
    }
  }
});

export type TreatmentEditorData = z.infer<typeof treatmentEditorSchema>;
export type TranslationEditorData = TreatmentEditorData["translations"]["ru"];
export type EditorState = { error?: string; saved?: boolean; version?: string; isPublished?: boolean };

export function emptyTranslation(): TranslationEditorData {
  return { name: "", description: "", concernsDescription: "", concerns: [], stepsDescription: "", steps: [], skinTypes: [], skinDescription: "", contraindications: [], contraindicationsNote: "" };
}

export function emptyTreatment(): TreatmentEditorData {
  return { id: null, version: null, priceILS: "", priceFrom: false, durationMinutes: "", durationFrom: false, sortOrder: 0, isPublished: false, photoUrl: "", translations: { he: emptyTranslation(), en: emptyTranslation(), ru: emptyTranslation() } };
}
