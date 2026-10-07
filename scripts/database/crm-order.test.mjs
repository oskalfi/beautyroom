import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let authorized = true;
let rows = [1, 2, 3].map((id, sortOrder) => ({ id, sortOrder, updatedAt: new Date("2026-01-01T00:00:00.000Z") }));
let writes = 0;
const db = { $transaction: async callback => {
  const before = rows.map(r => ({ ...r }));
  try { return await callback({ $queryRaw: async () => [], treatment: {
    findMany: async () => [...rows].sort((a,b) => a.sortOrder - b.sortOrder),
    update: async ({ where, data }) => { writes++; Object.assign(rows.find(r => r.id === where.id), data, { updatedAt: new Date("2026-01-02T00:00:00.000Z") }); },
  } }); } catch (error) { rows = before; throw error; }
} };
const context = { Error, exports: {}, require(name) {
  if (name === "next/cache") return { revalidatePath() {}, updateTag() {} };
  if (name === "next/navigation") return { redirect() { throw new Error("redirect"); } };
  if (name.includes("auth/owner")) return { requireOwner: async () => { if (!authorized) throw new Error("denied"); return { id: "test-owner", name: "Тестовый администратор", email: "owner@example.invalid" }; } };
  if (name.includes("db/client")) return { getDb: () => db };
  if (name.includes("model/treatment-editor")) return {};
  return require(name);
} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync("src/app/crm/actions.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context);
const reorder = context.exports.reorderTreatments;
const expected = () => [...rows].sort((a,b) => a.sortOrder - b.sortOrder).map(r => ({ id: r.id, version: r.updatedAt.toISOString() }));
const old = expected();
authorized = false; await assert.rejects(reorder({ expected: old, ids: [3,2,1] }), /denied/); assert.equal(writes, 0);
authorized = true;
assert.ok((await reorder({ expected: old, ids: [1,1,3] })).error); assert.equal(writes, 0);
assert.ok((await reorder({ expected: old, ids: [1,2,4] })).error); assert.equal(writes, 0);
assert.ok((await reorder({ expected: old.slice(1), ids: [2,3] })).error); assert.equal(writes, 0);
assert.equal((await reorder({ expected: old, ids: [3,1,2], lastEditedById: "forged-owner", lastEditedByName: "Подменённое имя" })).saved, true);
assert.deepEqual(expected().map(r => r.id), [3,1,2]);
assert.ok(rows.every(row => row.lastEditedById === "test-owner" && row.lastEditedByName === "Тестовый администратор"), "Author must come from the authenticated session, never from client input");
const writeCount = writes;
assert.ok((await reorder({ expected: old, ids: [1,2,3] })).error); assert.equal(writes, writeCount);
assert.deepEqual(expected().map(r => r.id), [3,1,2]);
console.log("PASS: order permissions, complete membership, unique IDs, persisted positions and stale-order protection.");
