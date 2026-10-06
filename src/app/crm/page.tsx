import Link from "next/link";
import { requireOwner } from "@/server/auth/owner";
import { getDb } from "@/server/db/client";
import { CrmShell } from "./components/CrmShell";
import { TreatmentCards } from "./components/TreatmentCards";

export default async function CrmPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    draft?: string;
    archive?: string;
    archived?: string;
  }>;
}) {
  await requireOwner();
  const query = await searchParams;
  const archived = query.archive === "1";
  const drafts = !archived && query.draft === "1";
  const q = (query.q ?? "").trim().slice(0, 200);
  const treatments = await getDb().treatment.findMany({
    where: {
      archivedAt: archived ? { not: null } : null,
      ...(!archived ? { isPublished: !drafts } : {}),
    },
    include: {
      translations: { select: { locale: true, name: true, description: true } },
    },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
  return (
    <CrmShell>
      <div className="crm-title-row">
        <div>
          <p className="crm-eyebrow">Контент сайта</p>
          <h1>
            {archived
              ? "Архив процедур"
              : drafts
                ? "Черновики процедур"
                : "Процедуры"}
          </h1>
          <p className="crm-muted">
            Цены, длительность и тексты на трёх языках.
          </p>
        </div>
        {drafts && (
          <Link className="crm-primary" href="/crm/treatments/new">
            + Добавить процедуру
          </Link>
        )}
      </div>
      {query.archived === "1" && (
        <p className="crm-success" role="status">
          Процедура убрана с сайта и перенесена в архив.
        </p>
      )}
      <div className="crm-toolbar">
        <nav aria-label="Список процедур">
          <Link
            aria-current={!archived && !drafts ? "page" : undefined}
            href="/crm"
          >
            На сайте
          </Link>
          <Link aria-current={drafts ? "page" : undefined} href="/crm?draft=1">
            Черновики
          </Link>
          <Link
            aria-current={archived ? "page" : undefined}
            href="/crm?archive=1"
          >
            Архив
          </Link>
        </nav>
        <form method="get">
          <label className="crm-visually-hidden" htmlFor="search">
            Поиск по названию
          </label>
          <input
            id="search"
            name="q"
            defaultValue={q}
            placeholder="Найти процедуру…"
          />
          {archived && <input type="hidden" name="archive" value="1" />}
          {drafts && <input type="hidden" name="draft" value="1" />}
          <button className="crm-secondary">Найти</button>
        </form>
      </div>
      {drafts && (
        <section className="crm-panel" aria-labelledby="draft-help-title">
          <h2 id="draft-help-title">Для чего нужен черновик?</h2>
          <p>
            Черновик — процедура, скрытая от посетителей сайта. Можно заполнить
            часть данных, сохранить их и вернуться к редактированию позже.
          </p>
          <p>
            Когда процедура готова на всех 3 языках (иврит, английском и
            русский) её можно опубликовать (кнопка «Опубликовать в редакторе»).
            После этого процедура появится на сайте.
          </p>
          <p className="crm-muted">
            Сохранение изменений опубликованной процедуры сразу обновляет сайт.
            Чтобы временно убрать услугу с сайта, перенесите её в архив. После
            восстановления она появится здесь как черновик.
          </p>
        </section>
      )}
      {archived && (
        <section className="crm-panel" aria-labelledby="archive-help-title">
          <h2 id="archive-help-title">Для чего нужен архив?</h2>
          <p>
            Архив позволяет убрать процедуру с сайта, сохранив её данные.
            Например, если вы временно перестали оказывать услугу, перенесите её
            сюда — тексты, переводы, цена сохранятся.
          </p>
          <p>
            Когда услуга снова станет доступна, нажмите «Восстановить».
            Процедура появится во вкладке «Черновики»: проверьте её данные и
            опубликуйте снова.
          </p>
          <p className="crm-muted">
            Черновики находятся в отдельной вкладке и предназначены для
            подготовки услуг к публикации. Архив помогает хранить неактуальные
            услуги отдельно.
          </p>
        </section>
      )}
      <TreatmentCards
        key={
          treatments
            .map((t) => `${t.id}:${t.updatedAt.toISOString()}`)
            .join(",") + q
        }
        initial={treatments.map((treatment) => ({
          id: treatment.id,
          version: treatment.updatedAt.toISOString(),
          name:
            treatment.translations.find((copy) => copy.locale === "ru")?.name ||
            treatment.translations.find((copy) => copy.name)?.name ||
            "Без названия",
          searchText: treatment.translations.map((copy) => copy.name).join(" "),
          price:
            treatment.priceILS === null
              ? "Не указана"
              : `${treatment.priceFrom ? "от " : ""}${treatment.priceILS.toString()} ₪`,
          duration:
            treatment.durationMinutes === null
              ? "Не указана"
              : `${treatment.durationFrom ? "от " : ""}${treatment.durationMinutes} мин`,
        }))}
        view={archived ? "archive" : drafts ? "drafts" : "published"}
        query={q}
      />
    </CrmShell>
  );
}
