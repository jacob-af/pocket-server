/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `OAuthAuth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerUserId]` on the table `OAuthAuth` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "OAuthAuth" DROP COLUMN "refreshToken";

-- CreateIndex
CREATE UNIQUE INDEX "OAuthAuth_providerUserId_key" ON "OAuthAuth"("providerUserId");
