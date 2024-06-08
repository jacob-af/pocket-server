-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "preferredBookId" TEXT,
ADD COLUMN     "preferredInventoryId" TEXT;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_preferredBookId_fkey" FOREIGN KEY ("preferredBookId") REFERENCES "RecipeBook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_preferredInventoryId_fkey" FOREIGN KEY ("preferredInventoryId") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
