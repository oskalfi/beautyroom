import { config } from "dotenv";
import assert from "node:assert/strict";
import { randomUUID, randomBytes } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { emptyTreatment, type TreatmentEditorData } from "../../src/shared/model/treatment-editor";

config({ path: [".env.local", ".env"], quiet: true });
const base = "http://localhost:3000";
const ids = [randomUUID(), randomUUID()];
const emails = ids.map(id => `crm-test-${id}@example.invalid`);
const password = randomBytes(24).toString("base64url");
const testName = `CRM smoke ${randomUUID()}`;
const ip = `198.18.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`;
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function request(path: string, cookie = "", options: RequestInit = {}) {
  return fetch(base + path, { ...options, redirect: "manual", headers: { Origin: base, "x-forwarded-for": ip, Cookie: cookie, ...options.headers } });
}

async function signIn(email: string, suppliedPassword = password) {
  const response = await request("/api/auth/sign-in/email", "", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password: suppliedPassword }) });
  return { response, cookie: response.headers.getSetCookie().map(value => value.split(";")[0]).join("; ") };
}

function decode(value: string) {
  return value.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

function actionForm(html: string, data: TreatmentEditorData) {
  const form = html.match(/<form\b[^>]*>([\s\S]*?)<\/form>/)?.[1];
  assert.ok(form, "Editor form is missing");
  const result = new FormData();
  for (const tag of form.match(/<input\b[^>]*>/g) ?? []) {
    const attributes = Object.fromEntries([...tag.matchAll(/([\w:$-]+)="([^"]*)"/g)].map(match => [match[1], decode(match[2])]));
    if (attributes.name?.startsWith("$ACTION_")) result.append(attributes.name, attributes.value ?? "");
  }
  assert.ok([...result.keys()].some(key => key.startsWith("$ACTION_REF_") || key.startsWith("$ACTION_ID_")), "Server action binding is missing");
  result.set("data", JSON.stringify(data));
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
    const draft = await request(`/en/treatments/${row.id}`);
    const draftHtml = await draft.text();
    assert.ok(draft.status === 404 || draftHtml.includes("NEXT_HTTP_ERROR_FALLBACK;404"), "Draft must resolve to not-found");
    assert.ok(!draftHtml.includes(testName), "Draft content must not appear on the public site");
    const editPath = `/crm/treatments/${row.id}`;
    const editHtml = await (await request(editPath, owner.cookie)).text();
    data.id = row.id; data.version = row.updatedAt.toISOString(); data.isPublished = true;
    const englishName = data.translations.en.name;
    data.translations.en.name = "";
    const incomplete = await request(editPath, owner.cookie, { method: "POST", body: actionForm(editHtml, data) });
    assert.ok((await incomplete.text()).includes("Для публикации заполните"));
    assert.equal((await db.treatment.findUniqueOrThrow({ where: { id: row.id } })).isPublished, false);
    data.translations.en.name = englishName;
    await request(editPath, owner.cookie, { method: "POST", body: actionForm(editHtml, data) });
    assert.equal((await db.treatment.findUniqueOrThrow({ where: { id: row.id } })).isPublished, true);
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
    // Unpublish through the real action before cleanup, invalidating public caches.
    data.priceILS = "321.45";
    data.isPublished = false;
    data.version = (await db.treatment.findUniqueOrThrow({ where: { id: row.id } })).updatedAt.toISOString();
    const freshHtml = await (await request(editPath, owner.cookie)).text();
    await request(editPath, owner.cookie, { method: "POST", body: actionForm(freshHtml, data) });
    assert.equal((await db.treatment.findUniqueOrThrow({ where: { id: row.id } })).isPublished, false);
    const hiddenCatalog = await request("/en/procedures");
    assert.ok(!(await hiddenCatalog.text()).includes(testName), "Unpublished procedure is still in the catalog");
    const blockedOrigin = await request("/api/auth/sign-in/email", "", { method: "POST", headers: { Origin: "https://untrusted.example", "Content-Type": "application/json" }, body: JSON.stringify({ email: emails[0], password }) });
    assert.equal(blockedOrigin.status, 403);
    await request("/api/auth/sign-out", owner.cookie, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    await protectedPage("/crm", owner.cookie);
    console.log("PASS: login/logout, role protection, disabled signup, protected mutations, draft visibility, publishing in three languages, edit conflict and CSRF protection.");
  } finally {
    // Delete only this test's own synthetic records; never touch real owner accounts.
    if (treatmentId) { await db.media.deleteMany({ where: { treatmentId } }); await db.treatment.delete({ where: { id: treatmentId } }); }
    await db.treatment.deleteMany({ where: { translations: { some: { name: { startsWith: testName } } } } });
    await db.user.deleteMany({ where: { id: { in: ids } } });
    await db.rateLimit.deleteMany({ where: { key: { contains: ip } } });
    await db.$disconnect();
  }
}

main().catch(error => { console.error(error instanceof assert.AssertionError ? error.message : "CRM integration check failed. Inspect the local server log."); process.exitCode = 1; });
