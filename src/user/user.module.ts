import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { BuildService } from '../build/build.service';
import { TouchService } from '../touch/touch.service';
import { AccessTokenStrategy } from '../auth/strategies/access-token.strategy';

@Module({
  providers: [
    UserResolver,
    UserService,
    BuildService,
    TouchService,
    PrismaService,
    AccessTokenStrategy,
  ],
})
export class UserModule {}
