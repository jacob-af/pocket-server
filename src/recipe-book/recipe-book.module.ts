import { BuildService } from 'src/build/build.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RecipeBookResolver } from './recipe-book.resolver';
import { RecipeBookService } from './recipe-book.service';
import { TouchService } from 'src/touch/touch.service';

@Module({
  providers: [
    RecipeBookResolver,
    RecipeBookService,
    BuildService,
    TouchService,
    PrismaService,
  ],
})
export class RecipeBookModule {}
