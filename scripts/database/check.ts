import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";

config({ path: [".env.local", ".env"], quiet: true });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Add DATABASE_URL to .env.local first.");

  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    await db.$queryRaw`SELECT 1`;
    // This also verifies that the initial migration has been applied.
    await db.client.count();
    console.log("PostgreSQL connected; the Client table is ready.");
  } finally {
    await db.$disconnect();
  }
}

main().catch(() => {
  // Do not print raw driver errors: they may contain connection details.
  console.error("Database check failed. Check .env.local, network access and run npm run db:deploy.");
  process.exitCode = 1;
});
