"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/server/auth/owner";
import { getDb } from "@/server/db/client";
import { z } from "zod";
import { treatmentEditorSchema, type EditorState } from "@/shared/model/treatment-editor";

function refreshTreatments() {
  updateTag("treatments");
  revalidatePath("/[locale]", "layout");
  revalidatePath("/crm", "layout");
}

export async function saveTreatment(_state: EditorState, formData: FormData): Promise<EditorState> {
  await requireOwner();
  const raw = formData.get("data");
  if (typeof raw !== "string" || raw.length > 500_000) return { version: _state.version, isPublished: _state.isPublished, error: "Данные формы слишком большие или отсутствуют." };
  let input: unknown;
  try { input = JSON.parse(raw); } catch { return { version: _state.version, isPublished: _state.isPublished, error: "Не удалось прочитать форму. Обновите страницу." }; }
  const publication = formData.get("publication");
  if (publication !== null && publication !== "publish") return { version: _state.version, isPublished: _state.isPublished, error: "Некорректное действие публикации." };
  if (publication && typeof input === "object" && input !== null && !Array.isArray(input)) {
    input = { ...input, isPublished: true };
  }
  const parsed = treatmentEditorSchema.safeParse(input);
  if (!parsed.success) return { version: _state.version, isPublished: _state.isPublished, error: parsed.error.issues.map(issue => issue.message).join(" ") };
  const data = parsed.data;
  let result: { id: number; version: string; isPublished: boolean };
  try {
    result = await getDb().$transaction(async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(610071001)::text`;
      const existing = data.id === null ? null : await tx.treatment.findUnique({ where: { id: data.id } });
      if (data.id !== null && (!existing || existing.archivedAt || existing.updatedAt.toISOString() !== data.version)) throw new Error("EDIT_CONFLICT");
      const isPublished = existing?.isPublished === true || publication === "publish";
      treatmentEditorSchema.parse({ ...data, isPublished });
      const publishing = isPublished && !existing?.isPublished;
      const last = publishing ? await tx.treatment.aggregate({ where: { isPublished: true, archivedAt: null }, _max: { sortOrder: true } }) : null;
      const sortOrder = publishing ? (last?._max.sortOrder ?? -1) + 1 : existing?.sortOrder ?? 0;
      const values = {
        priceILS: data.priceILS || null, priceFrom: data.priceFrom,
        durationMinutes: data.durationMinutes ? Number(data.durationMinutes) : null,
        durationFrom: data.durationFrom, sortOrder, isPublished,
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
      return { id, version: saved.updatedAt.toISOString(), isPublished: saved.isPublished };
    }, { maxWait: 10_000, timeout: 20_000 });
  } catch (error) {
    if (error instanceof z.ZodError) return { version: _state.version, isPublished: _state.isPublished, error: error.issues.map(issue => issue.message).join(" ") };
    if (error instanceof Error && error.message === "EDIT_CONFLICT") return { version: _state.version, isPublished: _state.isPublished, error: "Процедура уже изменена в другой вкладке или архивирована. Обновите страницу перед сохранением." };
    return { version: _state.version, isPublished: _state.isPublished, error: "Не удалось сохранить процедуру. Проверьте соединение и попробуйте ещё раз." };
  }
  refreshTreatments();
  if (data.id === null) redirect(`/crm/treatments/${result.id}?created=1`);
  return { saved: true, version: result.version, isPublished: result.isPublished };
}

export async function archiveTreatment(_state: EditorState, formData: FormData): Promise<EditorState> {
  await requireOwner();
  const id = Number(formData.get("id"));
  const version = String(formData.get("version"));
  if (!Number.isSafeInteger(id) || id <= 0 || !Number.isFinite(Date.parse(version))) return { error: "Некорректная процедура." };
  try {
    const archived = await getDb().$transaction(async tx => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(610071001)::text`;
      return tx.treatment.updateMany({
      where: { id, archivedAt: null, updatedAt: new Date(version) },
      data: { archivedAt: new Date(), isPublished: false },
      });
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

const orderSchema = z.object({
  expected: z.array(z.object({ id: z.number().int().positive(), version: z.string().datetime() })).max(500),
  ids: z.array(z.number().int().positive()).max(500),
});

export async function reorderTreatments(input: unknown): Promise<{ error?: string; saved?: boolean }> {
  await requireOwner();
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) return { error: "Некорректный список процедур." };
  const { expected, ids } = parsed.data;
  if (new Set(ids).size !== ids.length || new Set(expected.map(t => t.id)).size !== expected.length || ids.length !== expected.length || ids.some(id => !expected.some(t => t.id === id))) return { error: "Некорректный список процедур." };
  try {
    await getDb().$transaction(async tx => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(610071001)::text`;
      const current = await tx.treatment.findMany({ where: { isPublished: true, archivedAt: null }, select: { id: true, updatedAt: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
      if (current.length !== expected.length || current.some((row, index) => row.id !== expected[index].id || row.updatedAt.toISOString() !== expected[index].version)) throw new Error("ORDER_CONFLICT");
      for (const [sortOrder, id] of ids.entries()) await tx.treatment.update({ where: { id }, data: { sortOrder } });
    }, { maxWait: 10_000, timeout: 30_000 });
  } catch (error) {
    return { error: error instanceof Error && error.message === "ORDER_CONFLICT" ? "Список изменился в другой вкладке. Обновите страницу перед изменением порядка." : "Не удалось сохранить порядок. Попробуйте снова." };
  }
  refreshTreatments();
  return { saved: true };
}
