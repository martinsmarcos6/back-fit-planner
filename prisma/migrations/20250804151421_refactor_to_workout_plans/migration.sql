/*
  Warnings:

  - You are about to drop the column `description` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `instructions` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `muscleGroup` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the `workout_exercises` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workouts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `order` to the `exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repsRange` to the `exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sets` to the `exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workoutDayId` to the `exercises` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."workout_exercises" DROP CONSTRAINT "workout_exercises_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."workout_exercises" DROP CONSTRAINT "workout_exercises_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "public"."workouts" DROP CONSTRAINT "workouts_userId_fkey";

-- AlterTable
ALTER TABLE "public"."exercises" DROP COLUMN "description",
DROP COLUMN "instructions",
DROP COLUMN "muscleGroup",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "repsRange" TEXT NOT NULL,
ADD COLUMN     "restSeconds" INTEGER,
ADD COLUMN     "sets" INTEGER NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION,
ADD COLUMN     "workoutDayId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."workout_exercises";

-- DropTable
DROP TABLE "public"."workouts";

-- CreateTable
CREATE TABLE "public"."workout_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workout_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."workout_days" (
    "id" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "workoutName" TEXT NOT NULL,
    "description" TEXT,
    "workoutPlanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workout_days_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workout_days_workoutPlanId_dayOfWeek_key" ON "public"."workout_days"("workoutPlanId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "public"."workout_plans" ADD CONSTRAINT "workout_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workout_days" ADD CONSTRAINT "workout_days_workoutPlanId_fkey" FOREIGN KEY ("workoutPlanId") REFERENCES "public"."workout_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."exercises" ADD CONSTRAINT "exercises_workoutDayId_fkey" FOREIGN KEY ("workoutDayId") REFERENCES "public"."workout_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;
