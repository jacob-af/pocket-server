import { BuildService } from '../build/build.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipeBookService } from 'src/recipe-book/recipe-book.service';
import { StockService } from 'src/stock/stock.service';
import { TouchResolver } from './touch.resolver';
import { TouchService } from './touch.service';
import { UnitService } from 'src/unit/unit.service';

@Module({
  providers: [
    TouchResolver,
    TouchService,
    UnitService,
    BuildService,
    IngredientService,
    StockService,
    PrismaService,
    RecipeBookService,
  ],
})
export class TouchModule {}
