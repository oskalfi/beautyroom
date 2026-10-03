import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import vm from "node:vm";

const readJson = path => JSON.parse(fs.readFileSync(path, "utf8"));
const code = ts.transpileModule(fs.readFileSync("src/shared/mocks/treatments.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const context = { exports: {} };
vm.runInNewContext(code, context);
const source = JSON.parse(JSON.stringify(context.exports.mockTreatments));
const copyFields = ["name", "description", "concernsDescription", "concerns", "stepsDescription", "steps", "skinTypes", "skinDescription", "contraindications", "contraindicationsNote"];
for (const locale of ["en", "he"]) {
  const translated = readJson(`src/shared/mocks/treatments.${locale}.json`);
  assert.deepEqual(Object.keys(translated).sort(), source.map(t => String(t.id)).sort());
  for (const original of source) {
    const copy = translated[original.id];
    assert.deepEqual(Object.keys(copy).sort(), [...copyFields].sort(), `${locale}/${original.id}: fields`);
    for (const field of copyFields) {
      const value = copy[field];
      if (Array.isArray(original[field])) {
        assert.equal(value.length, original[field].length, `${locale}/${original.id}/${field}: missing items`);
        if (field === "concerns" || field === "steps") {
          value.forEach(pair => assert.ok(pair.length === 2 && pair.every(s => typeof s === "string" && s.trim())));
        } else assert.ok(value.every(s => typeof s === "string" && s.trim()));
      } else {
        assert.equal(typeof value, "string");
        assert.equal(Boolean(value.trim()), Boolean(original[field].trim()), `${locale}/${original.id}/${field}: empty copy`);
      }
      assert.ok(!/[А-Яа-яЁё]/.test(JSON.stringify(value)), `${locale}/${original.id}/${field}: Russian text`);
    }
  }
  assert.ok(translated["7"].name.includes("CO₂"));
  assert.ok(!/מזותרפיה|mesotherapy/i.test(translated["3"].name));
}
function leaves(value, prefix = "", result = {}) {
  for (const [key, item] of Object.entries(value)) {
    const path = prefix ? prefix + "." + key : key;
    if (typeof item === "string") result[path] = item;
    else leaves(item, path, result);
  }
  return result;
}
const base = leaves(readJson("messages/ru.json"));
for (const locale of ["en", "he"]) {
  const translated = leaves(readJson(`messages/${locale}.json`));
  assert.deepEqual(Object.keys(translated).sort(), Object.keys(base).sort(), `${locale}: message keys`);
  for (const key of Object.keys(base)) {
    assert.ok(translated[key].trim(), `${locale}/${key}: empty message`);
    assert.deepEqual(translated[key].match(/\{\w+\}/g) ?? [], base[key].match(/\{\w+\}/g) ?? [], `${locale}/${key}: placeholders`);
    assert.ok(!/[А-Яа-яЁё]/.test(translated[key]), `${locale}/${key}: Russian text`);
  }
}
console.log("Translation checks passed: 13 treatments × 2 languages, all UI keys and placeholders.");
