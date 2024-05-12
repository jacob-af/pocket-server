/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `RecipeBook` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RecipeBook_name_key" ON "RecipeBook"("name");
