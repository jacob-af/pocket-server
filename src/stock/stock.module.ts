import { BuildService } from 'src/build/build.service';
import { IngredientService } from 'src/ingredient/ingredient.service';
import { InventoryService } from 'src/inventory/inventory.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StockResolver } from './stock.resolver';
import { StockService } from './stock.service';
import { TouchService } from 'src/touch/touch.service';
import { UnitService } from 'src/unit/unit.service';

@Module({
  providers: [
    StockResolver,
    StockService,
    PrismaService,
    UnitService,
    BuildService,
    IngredientService,
    InventoryService,
    TouchService,
  ],
})
export class StockModule {}
