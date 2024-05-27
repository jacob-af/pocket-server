/*
  Warnings:

  - You are about to drop the column `fromUnitId` on the `UnitConversion` table. All the data in the column will be lost.
  - You are about to drop the column `toUnitId` on the `UnitConversion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fromUnitName,toUnitName]` on the table `UnitConversion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fromUnitName` to the `UnitConversion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toUnitName` to the `UnitConversion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UnitConversion" DROP CONSTRAINT "UnitConversion_fromUnitId_fkey";

-- DropForeignKey
ALTER TABLE "UnitConversion" DROP CONSTRAINT "UnitConversion_toUnitId_fkey";

-- DropIndex
DROP INDEX "UnitConversion_fromUnitId_toUnitId_key";

-- AlterTable
ALTER TABLE "UnitConversion" DROP COLUMN "fromUnitId",
DROP COLUMN "toUnitId",
ADD COLUMN     "fromUnitName" TEXT NOT NULL,
ADD COLUMN     "toUnitName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UnitConversion_fromUnitName_toUnitName_key" ON "UnitConversion"("fromUnitName", "toUnitName");

-- AddForeignKey
ALTER TABLE "UnitConversion" ADD CONSTRAINT "UnitConversion_fromUnitName_fkey" FOREIGN KEY ("fromUnitName") REFERENCES "Unit"("abbreviation") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitConversion" ADD CONSTRAINT "UnitConversion_toUnitName_fkey" FOREIGN KEY ("toUnitName") REFERENCES "Unit"("abbreviation") ON DELETE RESTRICT ON UPDATE CASCADE;
