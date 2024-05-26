/*
  Warnings:

  - You are about to drop the column `ingredientId` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryId` on the `Stock` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_ingredientId_fkey";

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "ingredientId",
DROP COLUMN "inventoryId";

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_ingredientName_fkey" FOREIGN KEY ("ingredientName") REFERENCES "Ingredient"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
