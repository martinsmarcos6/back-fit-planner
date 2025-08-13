-- Create exercise_catalog table
CREATE TABLE "public"."exercise_catalog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercise_catalog_pkey" PRIMARY KEY ("id")
);

-- Add nullable catalogId column to exercises first (so we can backfill)
ALTER TABLE "public"."exercises" ADD COLUMN "catalogId" TEXT;

-- Seed catalog entries for existing exercises (1:1 by current exercise id)
INSERT INTO "public"."exercise_catalog" ("id", "name", "createdAt", "updatedAt")
SELECT e."id", e."name", e."createdAt", e."updatedAt"
FROM "public"."exercises" e
WHERE NOT EXISTS (
  SELECT 1 FROM "public"."exercise_catalog" c WHERE c."id" = e."id"
);

-- Backfill exercises.catalogId using the same id seeded above
UPDATE "public"."exercises" SET "catalogId" = "id" WHERE "catalogId" IS NULL;

-- Now enforce NOT NULL and add the foreign key
ALTER TABLE "public"."exercises" ALTER COLUMN "catalogId" SET NOT NULL;

ALTER TABLE "public"."exercises"
ADD CONSTRAINT "exercises_catalogId_fkey" FOREIGN KEY ("catalogId")
REFERENCES "public"."exercise_catalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

