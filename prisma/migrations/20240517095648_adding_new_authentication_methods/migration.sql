-- CreateTable
CREATE TABLE "AuthMethod" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "authType" TEXT NOT NULL,

    CONSTRAINT "AuthMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordAuth" (
    "authMethodId" INTEGER NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,

    CONSTRAINT "PasswordAuth_pkey" PRIMARY KEY ("authMethodId")
);

-- CreateTable
CREATE TABLE "OAuthAuth" (
    "authMethodId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "tokenExpiry" TIMESTAMP(3),

    CONSTRAINT "OAuthAuth_pkey" PRIMARY KEY ("authMethodId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthMethod_userId_authType_key" ON "AuthMethod"("userId", "authType");

-- AddForeignKey
ALTER TABLE "AuthMethod" ADD CONSTRAINT "AuthMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordAuth" ADD CONSTRAINT "PasswordAuth_authMethodId_fkey" FOREIGN KEY ("authMethodId") REFERENCES "AuthMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthAuth" ADD CONSTRAINT "OAuthAuth_authMethodId_fkey" FOREIGN KEY ("authMethodId") REFERENCES "AuthMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
