/*
  Warnings:

  - The primary key for the `IngredientRelation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `childId` on the `IngredientRelation` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `IngredientRelation` table. All the data in the column will be lost.
  - Added the required column `childName` to the `IngredientRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentName` to the `IngredientRelation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IngredientRelation" DROP CONSTRAINT "IngredientRelation_childId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientRelation" DROP CONSTRAINT "IngredientRelation_parentId_fkey";

-- AlterTable
ALTER TABLE "IngredientRelation" DROP CONSTRAINT "IngredientRelation_pkey",
DROP COLUMN "childId",
DROP COLUMN "parentId",
ADD COLUMN     "childName" TEXT NOT NULL,
ADD COLUMN     "parentName" TEXT NOT NULL,
ADD CONSTRAINT "IngredientRelation_pkey" PRIMARY KEY ("parentName", "childName");

-- AddForeignKey
ALTER TABLE "IngredientRelation" ADD CONSTRAINT "IngredientRelation_parentName_fkey" FOREIGN KEY ("parentName") REFERENCES "Ingredient"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientRelation" ADD CONSTRAINT "IngredientRelation_childName_fkey" FOREIGN KEY ("childName") REFERENCES "Ingredient"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
