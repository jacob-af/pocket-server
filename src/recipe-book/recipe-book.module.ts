import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipeBookResolver } from './recipe-book.resolver';
import { RecipeBookService } from './recipe-book.service';
import { StockService } from '../stock/stock.service';
import { TouchService } from '../touch/touch.service';
import { UnitService } from '../unit/unit.service';
import { UserService } from '../user/user.service';

@Module({
  providers: [
    PrismaService,
    RecipeBookResolver,
    RecipeBookService,
    StockService,
    TouchService,
    UnitService,
    UserService,
  ],
})
export class RecipeBookModule {}
