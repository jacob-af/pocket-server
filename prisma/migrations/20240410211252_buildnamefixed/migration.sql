/*
  Warnings:

  - You are about to drop the column `name` on the `Build` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[buildName]` on the table `Build` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `buildName` to the `Build` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Build_name_key";

-- AlterTable
ALTER TABLE "Build" DROP COLUMN "name",
ADD COLUMN     "buildName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Build_buildName_key" ON "Build"("buildName");
