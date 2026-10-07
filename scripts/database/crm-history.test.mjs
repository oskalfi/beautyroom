import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
function load(path, overrides = {}) {
  const context = { exports: {}, require: name => overrides[name] ?? require(name) };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context);
  return context.exports;
}
const editor = load("src/shared/model/treatment-editor.ts");
const audit = load("src/server/treatments/history.ts", { "@/shared/model/treatment-editor": editor });
const before = editor.emptyTreatment();
before.priceILS = "350";
before.durationMinutes = "60";
before.translations.ru.description = "Старый текст";
const after = structuredClone(before);
after.priceILS = "400";
after.translations.ru.description = "Новый текст";
let changes = audit.treatmentDiff(before, after);
assert.equal(changes.length, 2);
assert.equal(changes[0].field, "Цена");
assert.equal(changes[0].before, "350.00 ₪");
assert.equal(changes[0].after, "400.00 ₪");
assert.equal(changes[1].locale, "ru");
assert.equal(changes[1].before, "Старый текст");
assert.equal(changes[1].after, "Новый текст");
after.priceILS = "350.00";
after.durationMinutes = "060";
after.translations.ru.description = before.translations.ru.description;
assert.equal(audit.treatmentDiff(before, after).length, 0, "Formatting alone is not a content change");
for (const locale of ["he", "en", "ru"]) {
  for (const key of Object.keys(after.translations[locale])) {
    after.translations[locale][key] = Array.isArray(after.translations[locale][key]) ? [key === "steps" || key === "concerns" ? ["Название", "Текст"] : "Пункт"] : "Изменено";
  }
}
changes = audit.treatmentDiff(before, after);
assert.equal(changes.length, 30, "All ten fields in all three languages must be tracked");
let written;
await audit.writeHistory({ treatmentChange: { createMany: async args => { written = args.data; } } }, { id: "admin", name: "Анна", email: "admin@example.invalid" }, 5, "Чистка лица", "edit", changes);
assert.equal(written.length, 30);
assert.ok(written.every(row => row.actorId === "admin" && row.actorName === "Анна" && row.treatmentId === 5));
assert.equal(new Set(written.map(row => row.operationId)).size, 1);
await assert.rejects(audit.writeHistory({ treatmentChange: { createMany: async () => { throw new Error("DB failure"); } } }, { id: "admin", name: "Анна" }, 5, "Чистка лица", "edit", changes), /DB failure/, "History failures must reach the transaction");
console.log("PASS: before/after values, all translated fields, numeric normalization, actor snapshots and write failure propagation.");
