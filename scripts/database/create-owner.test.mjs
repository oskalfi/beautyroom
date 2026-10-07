import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";
import { parseArgs } from "node:util";

const require = createRequire(import.meta.url);
const source = ts.transpileModule(fs.readFileSync("scripts/database/create-owner.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText.replace("main().catch", "exports.completion = main().catch");

async function run(args, answers = ["Test-password-123", "Test-password-123"], existing = null) {
  const first = { id: "first-admin", email: "first@example.invalid", name: "Первый", isOwner: true };
  const users = [first];
  const updates = [];
  const sessions = [];
  const errors = [];
  const prompts = [...answers];
  const processStub = { stdin: { isTTY: true }, stdout: { write() {} }, env: { DATABASE_URL: "mock-only" } };
  const db = {
    $transaction: async callback => callback({
      $queryRaw: async () => [],
      user: {
        findUnique: async () => existing,
        count: async () => users.length,
        create: async ({ data }) => { users.push(data); },
      },
      account: { updateMany: async args => { updates.push(args); return { count: 1 }; } },
      session: { deleteMany: async args => { sessions.push(args); } },
    }),
    $disconnect: async () => {},
  };
  const context = {
    exports: {}, process: processStub,
    console: { log() {}, error(message) { errors.push(message); } },
    require(name) {
      if (name === "dotenv") return { config() {} };
      if (name === "node:util") return { parseArgs: options => parseArgs({ ...options, args }) };
      if (name === "node:readline/promises") return { createInterface: () => ({ question: async () => prompts.shift(), close() {} }) };
      if (name === "better-auth/crypto") return { hashPassword: async password => `hashed:${password}` };
      if (name === "@prisma/adapter-pg") return { PrismaPg: class {} };
      if (name.includes("generated/prisma/client")) return { PrismaClient: class { constructor() { return db; } } };
      return require(name);
    },
  };
  vm.runInNewContext(source, context);
  await context.exports.completion;
  return { users, first, updates, sessions, errors, exitCode: processStub.exitCode };
}

const added = await run(["SECOND@example.invalid", "--name", "  Анна  "]);
assert.equal(added.exitCode, undefined);
assert.equal(added.users.length, 2, "Must allow a second administrator");
assert.equal(added.users[0], added.first, "Must preserve the first administrator");
assert.equal(added.users[1].email, "second@example.invalid");
assert.equal(added.users[1].name, "Анна");
assert.equal(added.users[1].isOwner, true);
assert.equal(added.users[1].accounts.create.providerId, "credential");
assert.notEqual(added.users[1].accounts.create.password, "Test-password-123");
assert.equal(added.users[1].accounts.create.accountId, added.users[1].id);
assert.equal(added.updates.length, 0);

const prompted = await run(["second@example.invalid"], ["Анна", "Test-password-123", "Test-password-123"]);
assert.equal(prompted.users[1].name, "Анна");
const duplicate = await run(["second@example.invalid", "--name", "Анна"], undefined, { id: "existing", isOwner: true });
assert.equal(duplicate.exitCode, 1);
assert.equal(duplicate.users.length, 1);
assert.equal(duplicate.updates.length, 0);
assert.ok(duplicate.errors[0].includes("email уже занят"));

const reset = await run(["second@example.invalid", "--reset-password"], undefined, { id: "existing", isOwner: true });
assert.equal(reset.exitCode, undefined);
assert.equal(reset.users.length, 1);
assert.equal(reset.updates[0].where.userId, "existing");
assert.equal(reset.sessions[0].where.userId, "existing");
const visitor = await run(["visitor@example.invalid", "--reset-password"], undefined, { id: "visitor", isOwner: false });
assert.equal(visitor.exitCode, 1);
assert.equal(visitor.updates.length, 0);
for (const args of [
  ["bad-email", "--name", "Анна"],
  ["second@example.invalid", "--name", "  "],
  ["second@example.invalid", "--unknown"],
  ["second@example.invalid", "--reset-password", "--name", "Анна"],
]) {
  const invalid = await run(args);
  assert.equal(invalid.exitCode, 1);
  assert.equal(invalid.users.length, 1);
  assert.equal(invalid.updates.length, 0);
}
const mismatch = await run(["second@example.invalid", "--name", "Анна"], ["Test-password-123", "Other-password-123"]);
assert.equal(mismatch.exitCode, 1);
assert.equal(mismatch.users.length, 1);
console.log("PASS: multiple administrators, names, duplicate protection, password confirmation, targeted reset and argument validation. No database changes.");
