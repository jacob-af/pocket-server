-- DropForeignKey
ALTER TABLE "Touch" DROP CONSTRAINT "Touch_unitName_fkey";

-- AddForeignKey
ALTER TABLE "Touch" ADD CONSTRAINT "Touch_unitName_fkey" FOREIGN KEY ("unitName") REFERENCES "Unit"("abbreviation") ON DELETE SET NULL ON UPDATE CASCADE;
