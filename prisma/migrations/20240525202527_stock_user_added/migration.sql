-- CreateTable
CREATE TABLE "StockUser" (
    "stockId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" TEXT NOT NULL,

    CONSTRAINT "StockUser_pkey" PRIMARY KEY ("stockId","userId")
);

-- AddForeignKey
ALTER TABLE "StockUser" ADD CONSTRAINT "StockUser_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockUser" ADD CONSTRAINT "StockUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
