-- CreateTable
CREATE TABLE "ArchivedBuild" (
    "id" TEXT NOT NULL,
    "buildName" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    "buildId" TEXT NOT NULL,
    "recipeId" TEXT,
    "instructions" TEXT,
    "notes" TEXT,
    "glassware" VARCHAR,
    "ice" VARCHAR(100),
    "version" INTEGER NOT NULL,

    CONSTRAINT "ArchivedBuild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildUser" (
    "userId" TEXT NOT NULL,
    "buildId" TEXT NOT NULL,
    "permission" TEXT NOT NULL,

    CONSTRAINT "BuildUser_pkey" PRIMARY KEY ("userId","buildId")
);

-- CreateTable
CREATE TABLE "ArchivedTouch" (
    "id" TEXT NOT NULL,
    "archivedBuildId" TEXT NOT NULL,
    "order" INTEGER,
    "amount" REAL NOT NULL,
    "unit" VARCHAR(50) NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "ArchivedTouch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArchivedBuild" ADD CONSTRAINT "ArchivedBuild_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivedBuild" ADD CONSTRAINT "ArchivedBuild_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildUser" ADD CONSTRAINT "BuildUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildUser" ADD CONSTRAINT "BuildUser_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivedTouch" ADD CONSTRAINT "ArchivedTouch_archivedBuildId_fkey" FOREIGN KEY ("archivedBuildId") REFERENCES "ArchivedBuild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivedTouch" ADD CONSTRAINT "ArchivedTouch_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
