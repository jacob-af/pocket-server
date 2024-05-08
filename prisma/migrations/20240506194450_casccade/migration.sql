-- DropForeignKey
ALTER TABLE "Build" DROP CONSTRAINT "Build_recipeName_fkey";

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_recipeName_fkey" FOREIGN KEY ("recipeName") REFERENCES "Recipe"("name") ON DELETE CASCADE ON UPDATE CASCADE;
