import Link from "next/link";
import { getDb } from "@/server/db/client";
import { requireOwner } from "@/server/auth/owner";

const dates = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jerusalem",
});
const actions: Record<string, string> = {
  create: "Создание",
  edit: "Редактирование",
  publish: "Публикация",
  archive: "Перенос в архив",
  restore: "Восстановление из архива",
  reorder: "Изменение порядка",
};
const languages = { ru: "русский", he: "иврит", en: "английский" };

export async function TreatmentHistory({
  query,
  page,
}: {
  query: string;
  page: number;
}) {
  await requireOwner();
  const rows = await getDb().treatmentChange.findMany({
    where: query
      ? { treatmentName: { contains: query, mode: "insensitive" } }
      : {},
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 51,
    skip: (page - 1) * 50,
  });
  function pageUrl(next: number) {
    return `/crm?${new URLSearchParams({ history: "1", page: String(next), ...(query ? { q: query } : {}) })}`;
  }
  return (
    <>
      <p className="crm-muted">
        Здесь сохраняются изменения процедур: кто, когда и что поменял. Время
        указано по Израилю.
      </p>
      <ol className="crm-history-list" aria-label="Журнал изменений">
        {rows.slice(0, 50).map((row) => (
          <li key={row.id} className="crm-history-entry">
            <div className="crm-history-heading">
              <strong>
                <time dateTime={row.createdAt.toISOString()}>
                  {dates.format(row.createdAt)}
                </time>{" "}
                — {row.actorName}
              </strong>
              <span className="crm-muted">
                {actions[row.action] ?? row.action}
              </span>
            </div>
            <p>
              Процедура:{" "}
              <Link href={`/crm/treatments/${row.treatmentId}`}>
                {row.treatmentName}
              </Link>
            </p>
            <h2>
              {row.field}
              {row.locale ? `, ${languages[row.locale]}` : ""}
            </h2>
            <div className="crm-history-diff">
              <dl>
                <dt>Было</dt>
                <dd dir="auto">{row.before || "Не заполнено"}</dd>
              </dl>
              <span aria-hidden="true">→</span>
              <dl>
                <dt>Стало</dt>
                <dd dir="auto">{row.after || "Не заполнено"}</dd>
              </dl>
            </div>
          </li>
        ))}
      </ol>
      {!rows.length && (
        <p className="crm-empty">
          {query
            ? "Изменения по этому запросу не найдены."
            : "Записей пока нет. Они появятся после следующих изменений процедур."}
        </p>
      )}
      <nav className="crm-history-pagination" aria-label="Страницы журнала">
        {page > 1 && (
          <Link className="crm-secondary" href={pageUrl(page - 1)}>
            ← Новее
          </Link>
        )}
        <span>Страница {page}</span>
        {rows.length > 50 && (
          <Link className="crm-secondary" href={pageUrl(page + 1)}>
            Старее →
          </Link>
        )}
      </nav>
    </>
  );
}
