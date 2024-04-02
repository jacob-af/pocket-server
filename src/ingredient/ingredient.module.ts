import { Module } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientResolver } from './ingredient.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [IngredientResolver, IngredientService, PrismaService],
})
export class IngredientModule {}
