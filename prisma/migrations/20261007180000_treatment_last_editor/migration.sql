-- Keep historical names even if an administrator is renamed or removed.
-- Existing changes have no recorded author; leave these fields NULL.
ALTER TABLE "Treatment"
ADD COLUMN "lastEditedById" TEXT,
ADD COLUMN "lastEditedByName" TEXT;

CREATE INDEX "Treatment_lastEditedById_idx" ON "Treatment"("lastEditedById");

ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_lastEditedById_fkey"
FOREIGN KEY ("lastEditedById") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
