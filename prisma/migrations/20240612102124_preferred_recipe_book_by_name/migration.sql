/*
  Warnings:

  - You are about to drop the column `preferredBookId` on the `Profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_preferredBookId_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "preferredBookId",
ADD COLUMN     "preferredBookName" TEXT;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_preferredBookName_fkey" FOREIGN KEY ("preferredBookName") REFERENCES "RecipeBook"("name") ON DELETE SET NULL ON UPDATE CASCADE;
