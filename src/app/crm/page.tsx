import Link from "next/link";
import { requireOwner } from "@/server/auth/owner";
import { getDb } from "@/server/db/client";
import { CrmShell } from "./components/CrmShell";
import { RestoreButton } from "./components/RestoreButton";

export default async function CrmPage({ searchParams }: { searchParams: Promise<{ q?: string; archive?: string; archived?: string }> }) {
  await requireOwner();
  const query = await searchParams;
  const archived = query.archive === "1";
  const q = (query.q ?? "").trim().slice(0, 200);
  const treatments = await getDb().treatment.findMany({
    where: { archivedAt: archived ? { not: null } : null, ...(q ? { translations: { some: { name: { contains: q, mode: "insensitive" } } } } : {}) },
    include: { translations: { select: { locale: true, name: true, description: true } } },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
  return <CrmShell>
    <div className="crm-title-row"><div><p className="crm-eyebrow">Контент сайта</p><h1>{archived ? "Архив процедур" : "Процедуры"}</h1><p className="crm-muted">Цены, длительность и тексты на трёх языках.</p></div><Link className="crm-primary" href="/crm/treatments/new">+ Добавить процедуру</Link></div>
    {query.archived === "1" && <p className="crm-success" role="status">Процедура убрана с сайта и перенесена в архив.</p>}
    <div className="crm-toolbar"><nav aria-label="Список процедур"><Link aria-current={!archived ? "page" : undefined} href="/crm">Активные</Link><Link aria-current={archived ? "page" : undefined} href="/crm?archive=1">Архив</Link></nav><form method="get"><label className="crm-visually-hidden" htmlFor="search">Поиск по названию</label><input id="search" name="q" defaultValue={q} placeholder="Найти процедуру…" />{archived && <input type="hidden" name="archive" value="1" />}<button className="crm-secondary">Найти</button></form></div>
    <div className="crm-table-wrap"><table className="crm-table"><thead><tr><th>Процедура</th><th>Цена</th><th>Длительность</th><th>Переводы</th><th>Статус</th><th><span className="crm-visually-hidden">Действия</span></th></tr></thead><tbody>
      {treatments.map(treatment => {
        const name = treatment.translations.find(copy => copy.locale === "ru")?.name || treatment.translations.find(copy => copy.name)?.name || `Процедура №${treatment.id}`;
        return <tr key={treatment.id}><td><strong>{name}</strong><small>№{treatment.id} · порядок {treatment.sortOrder}</small></td><td>{treatment.priceILS === null ? "Не указана" : `${treatment.priceFrom ? "от " : ""}${treatment.priceILS.toString()} ₪`}</td><td>{treatment.durationMinutes === null ? "Не указана" : `${treatment.durationFrom ? "от " : ""}${treatment.durationMinutes} мин`}</td><td className="crm-languages">{(["he", "en", "ru"] as const).map(locale => { const copy = treatment.translations.find(c => c.locale === locale); const ready = !!copy?.name && !!copy?.description; return <span key={locale} className={ready ? "crm-badge" : "crm-badge crm-incomplete"} title={ready ? "Название и описание заполнены" : "Перевод не заполнен"}>{locale.toUpperCase()}{!ready && " •"}</span>; })}</td><td><span className="crm-badge">{archived ? "В архиве" : treatment.isPublished ? "На сайте" : "Черновик"}</span></td><td>{archived ? <RestoreButton id={treatment.id} /> : <Link className="crm-edit-link" href={`/crm/treatments/${treatment.id}`}>Редактировать →</Link>}</td></tr>;
      })}
    </tbody></table>{treatments.length === 0 && <div className="crm-empty">{q ? "По этому запросу ничего не найдено." : archived ? "Архив пока пуст." : "Процедур пока нет. Добавьте первую процедуру."}</div>}</div>
  </CrmShell>;
}
