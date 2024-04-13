/*
  Warnings:

  - Made the column `instructions` on table `Build` required. This step will fail if there are existing NULL values in that column.
  - Made the column `glassware` on table `Build` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ice` on table `Build` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recipeId` on table `Build` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Build" DROP CONSTRAINT "Build_recipeId_fkey";

-- AlterTable
ALTER TABLE "Build" ALTER COLUMN "instructions" SET NOT NULL,
ALTER COLUMN "glassware" SET NOT NULL,
ALTER COLUMN "ice" SET NOT NULL,
ALTER COLUMN "recipeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
