-- AlterTable
ALTER TABLE "ArchivedTouch" ADD COLUMN     "unitAbb" TEXT;

-- AddForeignKey
ALTER TABLE "ArchivedTouch" ADD CONSTRAINT "ArchivedTouch_unitAbb_fkey" FOREIGN KEY ("unitAbb") REFERENCES "Unit"("abbreviation") ON DELETE SET NULL ON UPDATE CASCADE;
