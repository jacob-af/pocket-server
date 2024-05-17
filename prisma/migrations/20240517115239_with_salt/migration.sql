/*
  Warnings:

  - Added the required column `salt` to the `PasswordAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PasswordAuth" ADD COLUMN     "salt" TEXT NOT NULL;
