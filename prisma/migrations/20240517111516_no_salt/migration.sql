/*
  Warnings:

  - You are about to drop the column `salt` on the `PasswordAuth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PasswordAuth" DROP COLUMN "salt";
