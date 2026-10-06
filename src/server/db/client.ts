import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForDb = globalThis as unknown as { beautyRoomDb?: PrismaClient };

/** Connect on first use, so public pages can still build without CRM credentials. */
export function getDb(): PrismaClient {
  if (globalForDb.beautyRoomDb) return globalForDb.beautyRoomDb;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Set DATABASE_URL in .env.local before using the database.");
  }

  const adapter = new PrismaPg({ connectionString, max: 5, connectionTimeoutMillis: 10_000 });
  const db = new PrismaClient({ adapter });
  globalForDb.beautyRoomDb = db;
  return db;
}
