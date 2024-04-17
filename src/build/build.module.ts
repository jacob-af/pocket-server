import { Module } from '@nestjs/common';
import { BuildService } from './build.service';
import { UserService } from '../user/user.service';
import { RecipeService } from '../recipe/recipe.service';
import { BuildResolver } from './build.resolver';
import { TouchService } from '../touch/touch.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [
    BuildResolver,
    RecipeService,
    BuildService,
    TouchService,
    UserService,
    PrismaService,
  ],
})
export class BuildModule {}
