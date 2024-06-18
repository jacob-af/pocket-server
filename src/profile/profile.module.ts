import { BuildService } from 'src/build/build.service';
import { InventoryService } from 'src/inventory/inventory.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';
import { RecipeBookService } from 'src/recipe-book/recipe-book.service';
import { RecipeService } from 'src/recipe/recipe.service';
import { StockService } from 'src/stock/stock.service';
import { TouchService } from 'src/touch/touch.service';
import { UnitService } from 'src/unit/unit.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [
    ProfileResolver,
    ProfileService,
    BuildService,
    UserService,
    InventoryService,
    RecipeService,
    RecipeBookService,
    StockService,
    TouchService,
    UnitService,
    PrismaService,
  ],
})
export class ProfileModule {}
