import { config } from "dotenv";
import { randomUUID } from "node:crypto";
import { Writable } from "node:stream";
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";
import { hashPassword } from "better-auth/crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { z } from "zod";

config({ path: [".env.local", ".env"], quiet: true });

class SetupError extends Error {}

async function readName() {
  if (!process.stdin.isTTY) throw new SetupError("Запусти команду в интерактивном терминале.");
  const reader = createInterface({ input: process.stdin, output: process.stdout });
  try { return await reader.question("Имя администратора (будет отображаться в CRM): "); }
  finally { reader.close(); }
}

async function readPassword(prompt: string) {
  // Hidden terminal input: the password is not placed in shell history or logs.
  if (!process.stdin.isTTY) throw new SetupError("Run this command in an interactive terminal.");
  const muted = new Writable({ write(_chunk, _encoding, done) { done(); } });
  const reader = createInterface({ input: process.stdin, output: muted, terminal: true });
  process.stdout.write(prompt);
  try { return await reader.question(""); }
  finally { reader.close(); process.stdout.write("\n"); }
}

async function main() {
  let options;
  try {
    options = parseArgs({
      options: { name: { type: "string" }, "reset-password": { type: "boolean" }, help: { type: "boolean", short: "h" } },
      allowPositionals: true,
    });
  } catch { throw new SetupError('Некорректные аргументы. Пример: npm run owner:create -- admin@example.com --name "Анна"'); }
  if (options.values.help) {
    console.log('Создать администратора: npm run owner:create -- admin@example.com --name "Анна"\nБез --name команда попросит ввести имя.\nСменить пароль: npm run owner:create -- admin@example.com --reset-password');
    return;
  }
  if (options.positionals.length !== 1) throw new SetupError("Укажи один email администратора.");
  const email = z.email({ error: "Укажи корректный email администратора." }).parse(options.positionals[0].trim().toLowerCase());
  const reset = options.values["reset-password"] === true;
  if (reset && options.values.name !== undefined) throw new SetupError("--reset-password меняет только пароль. Не передавай --name вместе с ним.");
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new SetupError("DATABASE_URL is missing.");
  const name = reset ? undefined : z.string().trim().min(1, "Имя администратора не должно быть пустым.").max(100, "Имя должно быть не длиннее 100 символов.").parse(options.values.name ?? await readName());
  const password = await readPassword("Пароль администратора (12–128 символов, ввод скрыт): ");
  if (password.length < 12 || password.length > 128) throw new SetupError("Password must contain 12–128 characters.");
  if (password !== await readPassword("Повторите пароль: ")) throw new SetupError("Passwords do not match.");
  const hashed = await hashPassword(password);
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    await db.$transaction(async tx => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(610061002)::text`;
      const existing = await tx.user.findUnique({ where: { email } });
      if (reset) {
        if (!existing?.isOwner) throw new SetupError("Администратор с таким email не найден.");
        const changed = await tx.account.updateMany({ where: { userId: existing.id, providerId: "credential" }, data: { password: hashed } });
        if (changed.count !== 1) throw new SetupError("Учётная запись для входа не найдена.");
        await tx.session.deleteMany({ where: { userId: existing.id } });
        return;
      }
      if (existing) throw new SetupError("Этот email уже занят. Для смены пароля администратора используй --reset-password.");
      const id = randomUUID();
      await tx.user.create({ data: { id, email, name: name!, isOwner: true,
        accounts: { create: { id: randomUUID(), accountId: id, providerId: "credential", password: hashed } } } });
    }, { timeout: 15_000 });
    console.log(reset ? "Пароль обновлён; прежние сеансы входа завершены." : "Администратор создан. Откройте /crm/login и войдите с выбранным email и паролем.");
  } finally { await db.$disconnect(); }
}

main().catch(error => {
  console.error(error instanceof z.ZodError ? error.issues.map(issue => issue.message).join(" ") : error instanceof SetupError ? error.message : "Не удалось создать администратора. Проверьте подключение и миграции.");
  process.exitCode = 1;
});
