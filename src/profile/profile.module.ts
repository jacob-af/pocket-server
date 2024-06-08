import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';
import { RecipeBookService } from 'src/recipe-book/recipe-book.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [
    ProfileResolver,
    ProfileService,
    UserService,
    RecipeBookService,
    PrismaService,
  ],
})
export class ProfileModule {}
