import { IngredientResolver } from './ingredient.resolver';
import { IngredientService } from './ingredient.service';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockService } from 'src/stock/stock.service';

@Module({
  providers: [
    IngredientResolver,
    IngredientService,
    StockService,
    PrismaService,
  ],
})
export class IngredientModule {}
