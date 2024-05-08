import { BuildService } from '../build/build.service';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipeResolver } from './recipe.resolver';
import { RecipeService } from './recipe.service';
import { TouchService } from '../touch/touch.service';
import { UserService } from '../user/user.service';

@Module({
  providers: [
    RecipeResolver,
    RecipeService,
    TouchService,
    BuildService,
    UserService,
    PrismaService,
  ],
})
export class RecipeModule {}
