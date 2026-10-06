import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { mockTreatments } from "../../src/shared/mocks/treatments";
import he from "../../src/shared/mocks/treatments.he.json";
import en from "../../src/shared/mocks/treatments.en.json";

config({ path: [".env.local", ".env"], quiet: true });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is missing.");
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    let imported = 0;
    await db.$transaction(async tx => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(610061001)::text`;
      for (const [sortOrder, treatment] of mockTreatments.entries()) {
        // Re-running the import never overwrites CRM edits, drafts or archived rows.
        if (await tx.treatment.findUnique({ where: { id: treatment.id } })) continue;
        const translations = { ru: treatment, he: he[String(treatment.id) as keyof typeof he], en: en[String(treatment.id) as keyof typeof en] };
        await tx.treatment.create({
          data: {
            id: treatment.id, priceILS: treatment.priceILS, priceFrom: treatment.priceFrom,
            durationMinutes: treatment.durationMinutes, durationFrom: treatment.durationFrom,
            sortOrder, isPublished: true,
            photos: treatment.imgPath ? { create: { url: treatment.imgPath } } : undefined,
            translations: { create: (["ru", "he", "en"] as const).map(locale => {
              const copy = translations[locale];
              if (!copy) throw new Error("Missing translation.");
              return { locale, name: copy.name, description: copy.description,
                concernsDescription: copy.concernsDescription, concerns: copy.concerns,
                stepsDescription: copy.stepsDescription, steps: copy.steps, skinTypes: copy.skinTypes,
                skinDescription: copy.skinDescription, contraindications: copy.contraindications,
                contraindicationsNote: copy.contraindicationsNote, evidence: treatment.evidence };
            }) },
          },
        });
        imported++;
      }
      // Explicit legacy IDs must not collide with the next auto-generated ID.
      await tx.$queryRaw`SELECT setval(pg_get_serial_sequence('"Treatment"', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM "Treatment"), 1), true)`;
    }, { maxWait: 10_000, timeout: 60_000 });
    console.log(`Импортировано процедур: ${imported}. Существующие записи не изменены.`);
  } finally { await db.$disconnect(); }
}

main().catch(() => {
  console.error("Импорт не выполнен. Проверьте подключение и миграции.");
  process.exitCode = 1;
});
