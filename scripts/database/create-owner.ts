import { config } from "dotenv";
import { randomUUID } from "node:crypto";
import { Writable } from "node:stream";
import { createInterface } from "node:readline/promises";
import { hashPassword } from "better-auth/crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { z } from "zod";

config({ path: [".env.local", ".env"], quiet: true });

class SetupError extends Error {}

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
  const email = z.email().parse((process.argv[2] ?? "").trim().toLowerCase());
  const reset = process.argv.includes("--reset-password");
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new SetupError("DATABASE_URL is missing.");
  const password = await readPassword("Пароль владельца (12–128 символов, ввод скрыт): ");
  if (password.length < 12 || password.length > 128) throw new SetupError("Password must contain 12–128 characters.");
  if (password !== await readPassword("Повторите пароль: ")) throw new SetupError("Passwords do not match.");
  const hashed = await hashPassword(password);
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    await db.$transaction(async tx => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(610061002)::text`;
      const existing = await tx.user.findUnique({ where: { email } });
      if (reset) {
        if (!existing?.isOwner) throw new SetupError("Owner was not found.");
        const changed = await tx.account.updateMany({ where: { userId: existing.id, providerId: "credential" }, data: { password: hashed } });
        if (changed.count !== 1) throw new SetupError("Учётная запись для входа не найдена.");
        await tx.session.deleteMany({ where: { userId: existing.id } });
        return;
      }
      if (existing || await tx.user.count({ where: { isOwner: true } })) throw new SetupError("An owner already exists. Use --reset-password to reset their password.");
      const id = randomUUID();
      await tx.user.create({ data: { id, email, name: "Владелец Beauty Room", isOwner: true,
        accounts: { create: { id: randomUUID(), accountId: id, providerId: "credential", password: hashed } } } });
    }, { timeout: 15_000 });
    console.log(reset ? "Пароль обновлён; прежние сеансы входа завершены." : "Владелец создан. Откройте /crm/login и войдите с выбранным email и паролем.");
  } finally { await db.$disconnect(); }
}

main().catch(error => {
  console.error(error instanceof z.ZodError ? "Укажите корректный email: npm run owner:create -- owner@example.com" : error instanceof SetupError ? error.message : "Не удалось создать владельца. Проверьте подключение и миграции.");
  process.exitCode = 1;
});
