/*
  Warnings:

  - You are about to drop the `exercise_records` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."exercise_records" DROP CONSTRAINT "exercise_records_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."exercise_records" DROP CONSTRAINT "exercise_records_userId_fkey";

-- DropTable
DROP TABLE "public"."exercise_records";
