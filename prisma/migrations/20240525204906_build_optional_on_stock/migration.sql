-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_buildId_fkey";

-- AlterTable
ALTER TABLE "Stock" ALTER COLUMN "buildId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE SET NULL ON UPDATE CASCADE;
