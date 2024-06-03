import { BuildService } from '../build/build.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipeBookService } from 'src/recipe-book/recipe-book.service';
import { TouchResolver } from './touch.resolver';
import { TouchService } from './touch.service';

@Module({
  providers: [
    TouchResolver,
    TouchService,
    BuildService,
    IngredientService,
    PrismaService,
    RecipeBookService,
  ],
})
export class TouchModule {}
