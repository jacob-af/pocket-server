import { AccessTokenStrategy } from '../auth/strategies/access-token.strategy';
import { BuildService } from '../build/build.service';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileService } from 'src/profile/profile.service';
import { RecipeBookService } from 'src/recipe-book/recipe-book.service';
import { TouchService } from '../touch/touch.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  providers: [
    UserResolver,
    UserService,
    BuildService,
    RecipeBookService,
    TouchService,
    ProfileService,
    PrismaService,
    AccessTokenStrategy,
  ],
})
export class UserModule {}
