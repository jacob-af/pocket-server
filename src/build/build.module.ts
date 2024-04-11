import { Module } from '@nestjs/common';
import { BuildService } from './build.service';
import { BuildResolver } from './build.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [BuildResolver, BuildService, PrismaService],
})
export class BuildModule {}
