import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [ProfileResolver, ProfileService, UserService, PrismaService],
})
export class ProfileModule {}
