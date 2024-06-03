import { InventoryResolver } from './inventory.resolver';
import { InventoryService } from './inventory.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StockService } from 'src/stock/stock.service';

@Module({
  providers: [InventoryResolver, InventoryService, StockService, PrismaService],
})
export class InventoryModule {}
