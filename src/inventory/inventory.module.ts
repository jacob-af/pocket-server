import { InventoryResolver } from './inventory.resolver';
import { InventoryService } from './inventory.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [InventoryResolver, InventoryService, PrismaService],
})
export class InventoryModule {}
