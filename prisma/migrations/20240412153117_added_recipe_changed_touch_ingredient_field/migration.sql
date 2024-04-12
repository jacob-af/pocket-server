/*
  Warnings:

  - You are about to drop the column `ingredientId` on the `ArchivedTouch` table. All the data in the column will be lost.
  - You are about to drop the column `ingredientId` on the `Touch` table. All the data in the column will be lost.
  - Added the required column `ingredientName` to the `ArchivedTouch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredientName` to the `Touch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArchivedTouch" DROP CONSTRAINT "ArchivedTouch_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "Touch" DROP CONSTRAINT "Touch_ingredientId_fkey";

-- AlterTable
ALTER TABLE "ArchivedTouch" DROP COLUMN "ingredientId",
ADD COLUMN     "ingredientName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Build" ADD COLUMN     "recipeId" TEXT;

-- AlterTable
ALTER TABLE "Touch" DROP COLUMN "ingredientId",
ADD COLUMN     "ingredientName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "about" TEXT,
    "createdById" TEXT,
    "editedById" TEXT,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Touch" ADD CONSTRAINT "Touch_ingredientName_fkey" FOREIGN KEY ("ingredientName") REFERENCES "Ingredient"("name") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ArchivedTouch" ADD CONSTRAINT "ArchivedTouch_ingredientName_fkey" FOREIGN KEY ("ingredientName") REFERENCES "Ingredient"("name") ON DELETE NO ACTION ON UPDATE NO ACTION;
