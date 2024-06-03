import { BuildService } from '../build/build.service';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipeBookService } from 'src/recipe-book/recipe-book.service';
import { RecipeResolver } from './recipe.resolver';
import { RecipeService } from './recipe.service';
import { StockService } from 'src/stock/stock.service';
import { TouchService } from '../touch/touch.service';
import { UnitService } from 'src/unit/unit.service';
import { UserService } from '../user/user.service';

@Module({
  providers: [
    RecipeResolver,
    RecipeService,
    RecipeBookService,
    TouchService,
    StockService,
    BuildService,
    UnitService,
    UserService,
    PrismaService,
  ],
})
export class RecipeModule {}
