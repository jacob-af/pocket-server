-- CreateTable
CREATE TABLE "RecipeBook" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    "editedById" TEXT,

    CONSTRAINT "RecipeBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeBookUser" (
    "userId" TEXT NOT NULL,
    "recipeBookId" TEXT NOT NULL,
    "permission" TEXT NOT NULL,

    CONSTRAINT "RecipeBookUser_pkey" PRIMARY KEY ("userId","recipeBookId")
);

-- CreateTable
CREATE TABLE "RecipeBookBuild" (
    "buildId" TEXT NOT NULL,
    "recipeBookId" TEXT NOT NULL,

    CONSTRAINT "RecipeBookBuild_pkey" PRIMARY KEY ("buildId","recipeBookId")
);

-- AddForeignKey
ALTER TABLE "RecipeBook" ADD CONSTRAINT "RecipeBook_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeBook" ADD CONSTRAINT "RecipeBook_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeBookUser" ADD CONSTRAINT "RecipeBookUser_recipeBookId_fkey" FOREIGN KEY ("recipeBookId") REFERENCES "RecipeBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeBookUser" ADD CONSTRAINT "RecipeBookUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RecipeBookBuild" ADD CONSTRAINT "RecipeBookBuild_recipeBookId_fkey" FOREIGN KEY ("recipeBookId") REFERENCES "RecipeBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeBookBuild" ADD CONSTRAINT "RecipeBookBuild_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
