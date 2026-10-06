import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";

config({ path: [".env.local", ".env"], quiet: true });

const rollbackLesson = new Error("ROLLBACK_LESSON");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Add DATABASE_URL to .env.local first.");
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  try {
    await db.$transaction(async (tx) => {
      // create = INSERT: save one fictional client and a related contact.
      const created = await tx.client.create({
        data: {
          firstName: "Учебный",
          lastName: "Клиент",
          phone: "TEST-NOT-A-REAL-PHONE",
          contacts: { create: { label: "Учебная ссылка", url: "https://example.com/" } },
        },
      });

      // findUnique = SELECT: read the same client using its unique ID.
      const found = await tx.client.findUniqueOrThrow({
        where: { id: created.id },
        include: { contacts: true },
      });
      if (found.contacts.length !== 1) throw new Error("Contact was not saved.");
      console.log(`Создан и прочитан: ${found.firstName} ${found.lastName}; контактов: ${found.contacts.length}.`);

      // Throwing rolls back the whole transaction, including the contact.
      throw rollbackLesson;
    }, { maxWait: 10_000, timeout: 15_000 });
  } catch (error) {
    if (error !== rollbackLesson) throw error;
    console.log("Транзакция отменена: учебные записи не остались в базе.");
  } finally {
    await db.$disconnect();
  }
}

main().catch(() => {
  console.error("Упражнение не выполнено. Проверь подключение и применение миграции; пароль в чат не отправляй.");
  process.exitCode = 1;
});
