/*
  Warnings:

  - You are about to drop the column `unit` on the `ArchivedTouch` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Touch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ArchivedTouch" DROP COLUMN "unit";

-- AlterTable
ALTER TABLE "Touch" DROP COLUMN "unit";
