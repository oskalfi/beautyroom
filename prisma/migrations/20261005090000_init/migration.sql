-- Initial PostgreSQL schema. UUIDs and updatedAt values are supplied by Prisma.
CREATE TYPE "Locale" AS ENUM ('he', 'en', 'ru');

CREATE TABLE "Client" (
    "id" UUID NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100),
    "phone" VARCHAR(32) NOT NULL,
    "archivedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientContact" (
    "id" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClientContact_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Treatment" (
    "id" SERIAL NOT NULL,
    "priceILS" DECIMAL(12,2),
    "priceFrom" BOOLEAN NOT NULL DEFAULT false,
    "durationMinutes" INTEGER,
    "durationFrom" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMPTZ(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TreatmentTranslation" (
    "id" UUID NOT NULL,
    "treatmentId" INTEGER NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "concernsDescription" TEXT NOT NULL DEFAULT '',
    "concerns" JSONB NOT NULL DEFAULT '[]',
    "stepsDescription" TEXT NOT NULL DEFAULT '',
    "steps" JSONB NOT NULL DEFAULT '[]',
    "skinTypes" TEXT[],
    "skinDescription" TEXT NOT NULL DEFAULT '',
    "contraindications" TEXT[],
    "contraindicationsNote" TEXT NOT NULL DEFAULT '',
    "evidence" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "TreatmentTranslation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TreatmentRecord" (
    "id" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "treatmentId" INTEGER NOT NULL,
    "performedAt" TIMESTAMPTZ(3) NOT NULL,
    "treatmentName" VARCHAR(200) NOT NULL,
    "pricePaidILS" DECIMAL(12,2),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "TreatmentRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Media" (
    "id" UUID NOT NULL,
    "treatmentId" INTEGER,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Client_phone_idx" ON "Client"("phone");
CREATE INDEX "Client_lastName_firstName_idx" ON "Client"("lastName", "firstName");
CREATE INDEX "ClientContact_clientId_idx" ON "ClientContact"("clientId");
CREATE UNIQUE INDEX "TreatmentTranslation_treatmentId_locale_key" ON "TreatmentTranslation"("treatmentId", "locale");
CREATE INDEX "TreatmentRecord_clientId_performedAt_idx" ON "TreatmentRecord"("clientId", "performedAt");
CREATE INDEX "TreatmentRecord_treatmentId_idx" ON "TreatmentRecord"("treatmentId");
CREATE INDEX "Media_treatmentId_sortOrder_idx" ON "Media"("treatmentId", "sortOrder");

ALTER TABLE "ClientContact" ADD CONSTRAINT "ClientContact_clientId_fkey"
    FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TreatmentTranslation" ADD CONSTRAINT "TreatmentTranslation_treatmentId_fkey"
    FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TreatmentRecord" ADD CONSTRAINT "TreatmentRecord_clientId_fkey"
    FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TreatmentRecord" ADD CONSTRAINT "TreatmentRecord_treatmentId_fkey"
    FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Media" ADD CONSTRAINT "Media_treatmentId_fkey"
    FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
