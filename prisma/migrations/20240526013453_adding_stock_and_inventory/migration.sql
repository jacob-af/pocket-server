/*
  Warnings:

  - The primary key for the `Stock` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the `StockUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StorageStock` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `inventoryId` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StockUser" DROP CONSTRAINT "StockUser_stockId_fkey";

-- DropForeignKey
ALTER TABLE "StockUser" DROP CONSTRAINT "StockUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "StorageStock" DROP CONSTRAINT "StorageStock_stockId_fkey";

-- DropForeignKey
ALTER TABLE "StorageStock" DROP CONSTRAINT "StorageStock_storageId_fkey";

-- AlterTable
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_pkey",
DROP COLUMN "id",
ADD COLUMN     "inventoryId" TEXT NOT NULL,
ADD CONSTRAINT "Stock_pkey" PRIMARY KEY ("inventoryId", "ingredientName");

-- DropTable
DROP TABLE "StockUser";

-- DropTable
DROP TABLE "StorageStock";

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
