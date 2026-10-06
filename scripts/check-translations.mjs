import assert from "node:assert/strict";
import fs from "node:fs";

const readJson = path => JSON.parse(fs.readFileSync(path, "utf8"));
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
console.log("Translation checks passed: all UI keys and placeholders.");
