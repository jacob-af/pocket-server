/*
  Warnings:

  - You are about to drop the column `unitName` on the `Touch` table. All the data in the column will be lost.
  - You are about to alter the column `unit` on the `Touch` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- DropForeignKey
ALTER TABLE "Touch" DROP CONSTRAINT "Touch_unitName_fkey";

-- AlterTable
ALTER TABLE "Touch" DROP COLUMN "unitName",
ADD COLUMN     "unitAbb" TEXT,
ALTER COLUMN "unit" SET DATA TYPE VARCHAR(50);

-- AddForeignKey
ALTER TABLE "Touch" ADD CONSTRAINT "Touch_unitAbb_fkey" FOREIGN KEY ("unitAbb") REFERENCES "Unit"("abbreviation") ON DELETE SET NULL ON UPDATE CASCADE;
