import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccessTokenStrategy } from 'src/auth/strategies/access-token.strategy';

@Module({
  providers: [UserResolver, UserService, PrismaService, AccessTokenStrategy],
})
export class UserModule {}
