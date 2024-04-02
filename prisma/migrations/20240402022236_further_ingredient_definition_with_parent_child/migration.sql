-- CreateTable
CREATE TABLE "IngredientRelation" (
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,

    CONSTRAINT "IngredientRelation_pkey" PRIMARY KEY ("parentId","childId")
);

-- AddForeignKey
ALTER TABLE "IngredientRelation" ADD CONSTRAINT "IngredientRelation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientRelation" ADD CONSTRAINT "IngredientRelation_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
