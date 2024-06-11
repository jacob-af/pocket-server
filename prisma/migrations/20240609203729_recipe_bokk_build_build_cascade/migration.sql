-- DropForeignKey
ALTER TABLE "RecipeBookBuild" DROP CONSTRAINT "RecipeBookBuild_buildId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "dateJoined" DROP NOT NULL,
ALTER COLUMN "lastEdited" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "RecipeBookBuild" ADD CONSTRAINT "RecipeBookBuild_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;
