/*
  Warnings:

  - The primary key for the `Stock` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `permission` on the `Stock` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildId` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Stock` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `ingredientName` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitAbb` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_inventoryId_fkey";

-- AlterTable
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_pkey",
DROP COLUMN "permission",
ADD COLUMN     "amount" REAL NOT NULL,
ADD COLUMN     "buildId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "ingredientName" TEXT NOT NULL,
ADD COLUMN     "price" REAL NOT NULL,
ADD COLUMN     "unitAbb" TEXT NOT NULL,
ALTER COLUMN "ingredientId" DROP NOT NULL,
ADD CONSTRAINT "Stock_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "InventoryStorage" (
    "inventoryId" TEXT NOT NULL,
    "storageId" TEXT NOT NULL,

    CONSTRAINT "InventoryStorage_pkey" PRIMARY KEY ("inventoryId","storageId")
);

-- CreateTable
CREATE TABLE "Storage" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "editedById" TEXT NOT NULL,

    CONSTRAINT "Storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorageUser" (
    "userId" TEXT NOT NULL,
    "storageId" TEXT NOT NULL,
    "permission" TEXT NOT NULL,

    CONSTRAINT "StorageUser_pkey" PRIMARY KEY ("userId","storageId")
);

-- CreateTable
CREATE TABLE "StorageStock" (
    "stockId" TEXT NOT NULL,
    "storageId" TEXT NOT NULL,

    CONSTRAINT "StorageStock_pkey" PRIMARY KEY ("stockId","storageId")
);

-- AddForeignKey
ALTER TABLE "InventoryStorage" ADD CONSTRAINT "InventoryStorage_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "Storage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryStorage" ADD CONSTRAINT "InventoryStorage_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Storage" ADD CONSTRAINT "Storage_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Storage" ADD CONSTRAINT "Storage_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageUser" ADD CONSTRAINT "StorageUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageUser" ADD CONSTRAINT "StorageUser_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "Storage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_unitAbb_fkey" FOREIGN KEY ("unitAbb") REFERENCES "Unit"("abbreviation") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageStock" ADD CONSTRAINT "StorageStock_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageStock" ADD CONSTRAINT "StorageStock_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "Storage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
