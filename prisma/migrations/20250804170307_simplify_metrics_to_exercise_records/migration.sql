-- CreateTable
CREATE TABLE "public"."exercise_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercise_records_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."exercise_records" ADD CONSTRAINT "exercise_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."exercise_records" ADD CONSTRAINT "exercise_records_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "public"."exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
