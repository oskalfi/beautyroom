import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: [".env.local", ".env"], quiet: true });

// CLI migrations use a direct connection; the app may use Neon's pooled connection.
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Schema validation and client generation work before a database is connected.
  ...(databaseUrl ? { datasource: { url: databaseUrl } } : {}),
});
