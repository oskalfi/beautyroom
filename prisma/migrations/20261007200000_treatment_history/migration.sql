CREATE TABLE "TreatmentChange" (
  "id" UUID NOT NULL,
  "operationId" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actorId" TEXT NOT NULL,
  "actorName" TEXT NOT NULL,
  "treatmentId" INTEGER NOT NULL,
  "treatmentName" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "field" TEXT NOT NULL,
  "locale" "Locale",
  "before" TEXT NOT NULL,
  "after" TEXT NOT NULL,
  CONSTRAINT "TreatmentChange_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "TreatmentChange_createdAt_id_idx" ON "TreatmentChange"("createdAt", "id");
CREATE INDEX "TreatmentChange_treatmentId_createdAt_idx" ON "TreatmentChange"("treatmentId", "createdAt");
