/*
  Warnings:

  - Made the column `createdById` on table `Build` required. This step will fail if there are existing NULL values in that column.
  - Made the column `editedById` on table `Build` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Build" DROP CONSTRAINT "Build_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Build" DROP CONSTRAINT "Build_editedById_fkey";

-- AlterTable
ALTER TABLE "Build" ALTER COLUMN "createdById" SET NOT NULL,
ALTER COLUMN "editedById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
