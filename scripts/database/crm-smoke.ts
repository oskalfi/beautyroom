import { config } from "dotenv";
import assert from "node:assert/strict";
import { randomUUID, randomBytes } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { emptyTreatment, type TreatmentEditorData } from "../../src/shared/model/treatment-editor";

config({ path: [".env.local", ".env"], quiet: true });
const base = process.env.CRM_TEST_BASE_URL ?? "http://localhost:3000";
if (!/^http:\/\/localhost:\d+$/.test(base)) throw new Error("CRM tests require a local server.");
const ids = [randomUUID(), randomUUID()];
const emails = ids.map(id => `crm-test-${id}@example.invalid`);
const password = randomBytes(24).toString("base64url");
const testName = `CRM smoke ${randomUUID()}`;
const ip = `198.18.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`;
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function request(path: string, cookie = "", options: RequestInit = {}) {
  const response = await fetch(base + path, { ...options, signal: AbortSignal.timeout(30_000), redirect: "manual", headers: { Origin: base, "x-forwarded-for": ip, Cookie: cookie, ...options.headers } });
  // Server-rendered HTML can stream headers before the action has finished.
  await response.clone().arrayBuffer();
  return response;
}

async function signIn(email: string, suppliedPassword = password) {
  const response = await request("/api/auth/sign-in/email", "", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password: suppliedPassword }) });
  return { response, cookie: response.headers.getSetCookie().map(value => value.split(";")[0]).join("; ") };
}

function decode(value: string) {
  return value.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

function actionForm(html: string, data: TreatmentEditorData, formIndex = 0) {
  const form = [...html.matchAll(/<form\b[^>]*>([\s\S]*?)<\/form>/g)][formIndex]?.[1];
  assert.ok(form, "Editor form is missing");
  const result = new FormData();
  for (const tag of form.match(/<input\b[^>]*>/g) ?? []) {
    const attributes = Object.fromEntries([...tag.matchAll(/([\w:$-]+)="([^"]*)"/g)].map(match => [match[1], decode(match[2])]));
    if (attributes.name?.startsWith("$ACTION_")) result.append(attributes.name, attributes.value ?? "");
  }
  assert.ok([...result.keys()].some(key => key.startsWith("$ACTION_REF_") || key.startsWith("$ACTION_ID_")), "Server action binding is missing");
  result.set("data", JSON.stringify({ ...data, lastEditedById: ids[1], lastEditedByName: "Forged author" }));
  return result;
}

async function protectedPage(path: string, cookie = "") {
  const response = await request(path, cookie);
  const html = await response.text();
  assert.ok(response.headers.get("location")?.includes("/crm/login") || (html.includes("NEXT_REDIRECT") && html.includes("/crm/login")), `${path} was not protected`);
  assert.ok(!html.includes("Цены, длительность и тексты на трёх языках."));
}

async function main() {
  let treatmentId: number | undefined;
  try {
    const hashed = await hashPassword(password);
    for (const [i, id] of ids.entries()) await db.user.create({ data: { id, email: emails[i], name: "CRM test", isOwner: i === 0,
      accounts: { create: { id: randomUUID(), accountId: id, providerId: "credential", password: hashed } } } });
    await protectedPage("/crm");
    await protectedPage("/crm?history=1");
    await protectedPage("/crm/treatments/new");
    const wrong = await signIn(emails[0], "Wrong-password-12345");
    assert.equal(wrong.response.status, 401);
    const signup = await request("/api/auth/sign-up/email", "", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Unauthorized", email: `blocked-${ids[0]}@example.invalid`, password }) });
    assert.ok(signup.status >= 400 && signup.status < 500, "Public signup must be disabled");
    const owner = await signIn(emails[0]);
    assert.equal(owner.response.status, 200);
    assert.ok(owner.cookie);
    const visitor = await signIn(emails[1]);
    assert.equal(visitor.response.status, 200);
    await protectedPage("/crm", visitor.cookie);
    const newPage = await request("/crm/treatments/new", owner.cookie);
    const newHtml = await newPage.text();
    assert.ok(newHtml.includes("Новая процедура"));
    const data = emptyTreatment();
    data.priceILS = "321.45"; data.durationMinutes = "45";
    for (const locale of ["ru", "he", "en"] as const) data.translations[locale] = { ...data.translations[locale], name: `${testName} ${locale}`, description: `Test description ${locale}` };
    const rejected = await request("/crm/treatments/new", "", { method: "POST", body: actionForm(newHtml, data) });
    const rejectedHtml = await rejected.text();
    assert.ok(rejected.headers.get("location")?.includes("/crm/login") || rejectedHtml.includes("NEXT_REDIRECT"));
    assert.equal(await db.treatment.count({ where: { translations: { some: { name: { startsWith: testName } } } } }), 0);
    const deniedMutation = await request("/crm/treatments/new", visitor.cookie, { method: "POST", body: actionForm(newHtml, data) });
    const deniedHtml = await deniedMutation.text();
    assert.ok(deniedMutation.headers.get("location")?.includes("/crm/login") || deniedHtml.includes("NEXT_REDIRECT"));
    assert.equal(await db.treatment.count({ where: { translations: { some: { name: { startsWith: testName } } } } }), 0);
    const created = await request("/crm/treatments/new", owner.cookie, { method: "POST", body: actionForm(newHtml, data) });
    assert.equal(created.status, 303);
    const row = await db.treatment.findFirstOrThrow({ where: { translations: { some: { name: { startsWith: testName } } } }, include: { translations: true } });
    treatmentId = row.id;
    assert.equal(row.isPublished, false);
    assert.equal(row.translations.length, 3);
    assert.equal(row.priceILS?.toString(), "321.45");
    assert.equal(row.lastEditedById, ids[0]);
    assert.equal(row.lastEditedByName, "CRM test");
    const creationHistory = await db.treatmentChange.findMany({ where: { treatmentId: row.id } });
    assert.ok(creationHistory.some(change => change.action === "create" && change.after === "Черновик"));
    assert.ok(creationHistory.every(change => change.actorId === ids[0] && change.actorName === "CRM test"));
    const historyHtml = await (await request(`/crm?history=1&q=${encodeURIComponent(testName)}`, owner.cookie)).text();
    assert.ok(historyHtml.includes("Было") && historyHtml.includes("Стало") && historyHtml.includes(testName));
    const draftsHtml = await (await request("/crm?draft=1", owner.cookie)).text();
    assert.ok(draftsHtml.includes(testName), "Draft is missing from the drafts tab");
    assert.ok(draftsHtml.includes("Администратор:") && draftsHtml.includes("CRM test"), "Author is missing from the procedure card");
    assert.ok(!(await (await request("/crm", owner.cookie)).text()).includes(testName), "Draft must not appear in the published tab");
    const draft = await request(`/en/treatments/${row.id}`);
    const draftHtml = await draft.text();
    assert.ok(draft.status === 404 || draftHtml.includes("NEXT_HTTP_ERROR_FALLBACK;404"), "Draft must resolve to not-found");
    assert.ok(!draftHtml.includes(testName), "Draft content must not appear on the public site");
    const editPath = `/crm/treatments/${row.id}`;
    const editHtml = await (await request(editPath, owner.cookie)).text();
    data.id = row.id; data.version = row.updatedAt.toISOString(); data.isPublished = true;
    const englishName = data.translations.en.name;
    data.translations.en.name = "";
    const publishForm = () => { const form = actionForm(editHtml, data); form.set("publication", "publish"); return form; };
    const incomplete = await request(editPath, owner.cookie, { method: "POST", body: publishForm() });
    assert.ok((await incomplete.text()).includes("Для публикации заполните"));
    assert.equal((await db.treatment.findUniqueOrThrow({ where: { id: row.id } })).isPublished, false);
    data.translations.en.name = englishName;
    data.isPublished = false; // The explicit publish button overrides the hidden draft value.
    await request(editPath, owner.cookie, { method: "POST", body: publishForm() });
    assert.ok((await (await request("/crm", owner.cookie)).text()).includes(testName));
    assert.ok(!(await (await request("/crm?draft=1", owner.cookie)).text()).includes(testName));
    assert.equal((await db.treatment.findUniqueOrThrow({ where: { id: row.id } })).isPublished, true);
    assert.equal(await db.treatmentChange.count({ where: { treatmentId: row.id, action: "publish", before: "Черновик", after: "На сайте" } }), 1);
    for (const locale of ["ru", "he", "en"]) {
      const path = locale === "he" ? `/treatments/${row.id}` : `/${locale}/treatments/${row.id}`;
      const published = await request(path);
      assert.equal(published.status, 200);
      assert.ok((await published.text()).includes(`${testName} ${locale}`), `Published ${locale} copy missing`);
    }
    const catalog = await request("/en/procedures");
    assert.ok((await catalog.text()).includes(`${testName} en`), "The public catalog was not refreshed after publishing");
    // A stale edit must not overwrite the successful publish.
    data.priceILS = "999";
    const stale = await request(editPath, owner.cookie, { method: "POST", body: actionForm(editHtml, data) });
    assert.ok((await stale.text()).includes("уже изменена"));
    assert.equal((await db.treatment.findUniqueOrThrow({ where: { id: row.id } })).priceILS?.toString(), "321.45");
    // Removing the old status control must also prevent status/order tampering.
    data.priceILS = "321.45"; data.isPublished = false; data.sortOrder = 9999;
    data.version = (await db.treatment.findUniqueOrThrow({ where: { id: row.id } })).updatedAt.toISOString();
    const freshHtml = await (await request(editPath, owner.cookie)).text();
    const previousOrder = (await db.treatment.findUniqueOrThrow({ where: { id: row.id } })).sortOrder;
    await request(editPath, owner.cookie, { method: "POST", body: actionForm(freshHtml, data) });
    const preserved = await db.treatment.findUniqueOrThrow({ where: { id: row.id } });
    assert.equal(preserved.isPublished, true); assert.equal(preserved.sortOrder, previousOrder);
    assert.equal(preserved.lastEditedById, ids[0]);
    assert.equal(preserved.lastEditedByName, "CRM test");
    const forbiddenDraft = actionForm(freshHtml, data); forbiddenDraft.set("publication", "draft");
    await request(editPath, owner.cookie, { method: "POST", body: forbiddenDraft });
    assert.equal((await db.treatment.findUniqueOrThrow({ where: { id: row.id } })).isPublished, true);
    // Archive through the real action, then restore as a draft. Clear public caches.
    const archiveHtml = await (await request(editPath, owner.cookie)).text();
    const archiveForm = actionForm(archiveHtml, data, 1);
    archiveForm.set("id", String(row.id)); archiveForm.set("version", preserved.updatedAt.toISOString());
    const archivedResponse = await request(editPath, owner.cookie, { method: "POST", body: archiveForm });
    assert.equal(archivedResponse.status, 303);
    const archivedRow = await db.treatment.findUniqueOrThrow({ where: { id: row.id } });
    assert.equal(archivedRow.lastEditedById, ids[0]);
    assert.equal(archivedRow.lastEditedByName, "CRM test");
    assert.equal((await db.treatment.findUniqueOrThrow({ where: { id: row.id } })).isPublished, false);
    assert.ok(!(await (await request("/en/procedures")).text()).includes(testName));
    console.log("Checking archived editor...");
    const archivedHtml = await (await request(editPath, owner.cookie)).text();
    assert.ok(archivedHtml.includes("Процедура в архиве"));
    console.log("Checking restore action...");
    const restoreForm = actionForm(archivedHtml, data, 1); restoreForm.set("id", String(row.id));
    const restoredResponse = await request(editPath, owner.cookie, { method: "POST", body: restoreForm });
    assert.equal(restoredResponse.status, 303);
    const restoredRow = await db.treatment.findUniqueOrThrow({ where: { id: row.id } });
    assert.equal(restoredRow.lastEditedById, ids[0]);
    assert.equal(restoredRow.lastEditedByName, "CRM test");
    assert.equal(await db.treatmentChange.count({ where: { treatmentId: row.id, action: "archive", after: "Архив" } }), 1);
    assert.equal(await db.treatmentChange.count({ where: { treatmentId: row.id, action: "restore", before: "Архив", after: "Черновик" } }), 1);
    data.version = restoredRow.updatedAt.toISOString();
    data.priceILS = "400";
    data.translations.ru.description = "Новое описание процедуры";
    const restoredHtml = await (await request(editPath, owner.cookie)).text();
    await request(editPath, owner.cookie, { method: "POST", body: actionForm(restoredHtml, data) });
    const fieldChanges = await db.treatmentChange.findMany({ where: { treatmentId: row.id, action: "edit" } });
    assert.ok(fieldChanges.some(change => change.field === "Цена" && change.before === "321.45 ₪" && change.after === "400.00 ₪"));
    assert.ok(fieldChanges.some(change => change.field === "Описание" && change.locale === "ru" && change.before === "Test description ru" && change.after === "Новое описание процедуры"));
    const logCount = await db.treatmentChange.count({ where: { treatmentId: row.id } });
    // A stale submission must neither change the procedure nor add history.
    await request(editPath, owner.cookie, { method: "POST", body: actionForm(restoredHtml, data) });
    assert.equal(await db.treatmentChange.count({ where: { treatmentId: row.id } }), logCount);
    data.version = (await db.treatment.findUniqueOrThrow({ where: { id: row.id } })).updatedAt.toISOString();
    const unchangedHtml = await (await request(editPath, owner.cookie)).text();
    await request(editPath, owner.cookie, { method: "POST", body: actionForm(unchangedHtml, data) });
    assert.equal(await db.treatmentChange.count({ where: { treatmentId: row.id } }), logCount, "No-op saves must not add history");
    assert.ok((await (await request("/crm?draft=1", owner.cookie)).text()).includes(testName));
    const blockedOrigin = await request("/api/auth/sign-in/email", "", { method: "POST", headers: { Origin: "https://untrusted.example", "Content-Type": "application/json" }, body: JSON.stringify({ email: emails[0], password }) });
    assert.equal(blockedOrigin.status, 403);
    await request("/api/auth/sign-out", owner.cookie, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    await protectedPage("/crm", owner.cookie);
    console.log("PASS: login/logout, role protection, disabled signup, protected mutations, draft visibility, publishing in three languages, edit conflict and CSRF protection.");
  } finally {
    await db.treatmentChange.deleteMany({ where: { actorId: { in: ids } } });
    // Delete only this test's own synthetic records; never touch real owner accounts.
    if (treatmentId) { await db.media.deleteMany({ where: { treatmentId } }); await db.treatment.delete({ where: { id: treatmentId } }); }
    await db.treatment.deleteMany({ where: { translations: { some: { name: { startsWith: testName } } } } });
    await db.user.deleteMany({ where: { id: { in: ids } } });
    await db.rateLimit.deleteMany({ where: { key: { contains: ip } } });
    await db.$disconnect();
  }
}

main().catch(error => { console.error(error instanceof assert.AssertionError ? error.message : "CRM integration check failed. Inspect the local server log."); process.exitCode = 1; });
