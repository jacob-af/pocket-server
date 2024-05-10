/*
  Warnings:

  - A unique constraint covering the columns `[buildName,recipeName]` on the table `Build` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Build_buildName_recipeName_key" ON "Build"("buildName", "recipeName");
