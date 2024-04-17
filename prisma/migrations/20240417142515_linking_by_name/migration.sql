/*
  Warnings:

  - You are about to drop the column `recipeId` on the `Build` table. All the data in the column will be lost.
  - Added the required column `recipeName` to the `Build` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Build" DROP CONSTRAINT "Build_recipeId_fkey";

-- AlterTable
ALTER TABLE "Build" DROP COLUMN "recipeId",
ADD COLUMN     "recipeName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_recipeName_fkey" FOREIGN KEY ("recipeName") REFERENCES "Recipe"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
