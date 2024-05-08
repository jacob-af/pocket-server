/*
  Warnings:

  - Made the column `createdById` on table `ArchivedBuild` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ArchivedBuild" DROP CONSTRAINT "ArchivedBuild_createdById_fkey";

-- AlterTable
ALTER TABLE "ArchivedBuild" ALTER COLUMN "createdById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ArchivedBuild" ADD CONSTRAINT "ArchivedBuild_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
