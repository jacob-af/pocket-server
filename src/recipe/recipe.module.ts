import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeResolver } from './recipe.resolver';
import { BuildService } from '../build/build.service';
import { TouchService } from '../touch/touch.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [
    RecipeResolver,
    RecipeService,
    TouchService,
    BuildService,
    PrismaService,
  ],
})
export class RecipeModule {}
