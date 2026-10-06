"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/server/auth/owner";
import { getDb } from "@/server/db/client";
import { treatmentEditorSchema, type EditorState } from "@/shared/model/treatment-editor";

function refreshTreatments() {
  updateTag("treatments");
  revalidatePath("/[locale]", "layout");
  revalidatePath("/crm", "layout");
}

export async function saveTreatment(_state: EditorState, formData: FormData): Promise<EditorState> {
  await requireOwner();
  const raw = formData.get("data");
  if (typeof raw !== "string" || raw.length > 500_000) return { version: _state.version, error: "Данные формы слишком большие или отсутствуют." };
  let input: unknown;
  try { input = JSON.parse(raw); } catch { return { version: _state.version, error: "Не удалось прочитать форму. Обновите страницу." }; }
  const parsed = treatmentEditorSchema.safeParse(input);
  if (!parsed.success) return { version: _state.version, error: parsed.error.issues.map(issue => issue.message).join(" ") };
  const data = parsed.data;
  let result: { id: number; version: string };
  try {
    result = await getDb().$transaction(async (tx) => {
      const values = {
        priceILS: data.priceILS || null, priceFrom: data.priceFrom,
        durationMinutes: data.durationMinutes ? Number(data.durationMinutes) : null,
        durationFrom: data.durationFrom, sortOrder: data.sortOrder, isPublished: data.isPublished,
      };
      let id = data.id;
      if (id === null) {
        id = (await tx.treatment.create({ data: values })).id;
      } else {
        const updated = await tx.treatment.updateMany({
          where: { id, archivedAt: null, updatedAt: new Date(data.version!) }, data: values,
        });
        if (updated.count !== 1) throw new Error("EDIT_CONFLICT");
      }
      for (const locale of ["he", "en", "ru"] as const) {
        const copy = data.translations[locale];
        await tx.treatmentTranslation.upsert({
          where: { treatmentId_locale: { treatmentId: id, locale } },
          create: { treatmentId: id, locale, ...copy }, update: copy,
        });
      }
      const photo = await tx.media.findFirst({ where: { treatmentId: id }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
      if (data.photoUrl) {
        if (photo) await tx.media.update({ where: { id: photo.id }, data: { url: data.photoUrl } });
        else await tx.media.create({ data: { treatmentId: id, url: data.photoUrl } });
      } else if (photo) {
        // Detach photos rather than deleting shared files or leaving a second cover visible.
        await tx.media.updateMany({ where: { treatmentId: id }, data: { treatmentId: null } });
      }
      const saved = await tx.treatment.findUniqueOrThrow({ where: { id } });
      return { id, version: saved.updatedAt.toISOString() };
    }, { maxWait: 10_000, timeout: 20_000 });
  } catch (error) {
    if (error instanceof Error && error.message === "EDIT_CONFLICT") return { version: _state.version, error: "Процедура уже изменена в другой вкладке или архивирована. Обновите страницу перед сохранением." };
    return { version: _state.version, error: "Не удалось сохранить процедуру. Проверьте соединение и попробуйте ещё раз." };
  }
  refreshTreatments();
  if (data.id === null) redirect(`/crm/treatments/${result.id}?created=1`);
  return { saved: true, version: result.version };
}

export async function archiveTreatment(_state: EditorState, formData: FormData): Promise<EditorState> {
  await requireOwner();
  const id = Number(formData.get("id"));
  const version = String(formData.get("version"));
  if (!Number.isSafeInteger(id) || id <= 0 || !Number.isFinite(Date.parse(version))) return { error: "Некорректная процедура." };
  try {
    const archived = await getDb().treatment.updateMany({
      where: { id, archivedAt: null, updatedAt: new Date(version) },
      data: { archivedAt: new Date(), isPublished: false },
    });
    if (archived.count !== 1) return { error: "Процедура уже изменена. Обновите страницу." };
  } catch { return { error: "Не удалось архивировать процедуру." }; }
  refreshTreatments();
  redirect("/crm?archived=1");
}

export async function restoreTreatment(_state: EditorState, formData: FormData): Promise<EditorState> {
  await requireOwner();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) return { error: "Некорректная процедура." };
  try {
    const restored = await getDb().treatment.updateMany({ where: { id, archivedAt: { not: null } }, data: { archivedAt: null, isPublished: false } });
    if (restored.count !== 1) return { error: "Процедура уже восстановлена. Обновите страницу." };
  } catch { return { error: "Не удалось восстановить процедуру." }; }
  refreshTreatments();
  redirect(`/crm/treatments/${id}`);
}
