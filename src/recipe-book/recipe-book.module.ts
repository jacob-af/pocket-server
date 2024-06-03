import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RecipeBookResolver } from './recipe-book.resolver';
import { RecipeBookService } from './recipe-book.service';
import { StockService } from 'src/stock/stock.service';
import { TouchService } from 'src/touch/touch.service';
import { UnitService } from 'src/unit/unit.service';
import { UserService } from 'src/user/user.service';

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
