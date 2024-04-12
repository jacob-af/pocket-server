/*
  Warnings:

  - Made the column `order` on table `Touch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `Touch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unit` on table `Touch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ingredientId` on table `Touch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `version` on table `Touch` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Touch" ALTER COLUMN "order" SET NOT NULL,
ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "unit" SET NOT NULL,
ALTER COLUMN "ingredientId" SET NOT NULL,
ALTER COLUMN "version" SET NOT NULL;
