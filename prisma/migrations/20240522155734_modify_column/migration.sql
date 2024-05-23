/*
  Warnings:

  - You are about to drop the column `public` on the `Build` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Build" DROP COLUMN "public",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;
