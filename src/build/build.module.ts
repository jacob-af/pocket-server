import { BuildResolver } from './build.resolver';
import { BuildService } from './build.service';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipeService } from '../recipe/recipe.service';
import { StockService } from 'src/stock/stock.service';
import { TouchService } from '../touch/touch.service';
import { UnitService } from 'src/unit/unit.service';
import { UserService } from '../user/user.service';

@Module({
  providers: [
    BuildResolver,
    RecipeService,
    BuildService,
    StockService,
    TouchService,
    UnitService,
    UserService,
    PrismaService,
  ],
})
export class BuildModule {}
