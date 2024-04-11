/*
  Warnings:

  - You are about to drop the column `recipeId` on the `Touch` table. All the data in the column will be lost.
  - You are about to drop the `Recipe` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `buildId` to the `Touch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Touch" DROP CONSTRAINT "Touch_recipeId_fkey";

-- AlterTable
ALTER TABLE "Touch" DROP COLUMN "recipeId",
ADD COLUMN     "buildId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Recipe";

-- CreateTable
CREATE TABLE "Build" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    "instructions" TEXT,
    "notes" TEXT,
    "glassware" VARCHAR,
    "ice" VARCHAR(100),

    CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Build_name_key" ON "Build"("name");

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Touch" ADD CONSTRAINT "Touch_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;
