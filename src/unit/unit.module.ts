import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UnitResolver } from './unit.resolver';
import { UnitService } from './unit.service';

@Module({
  providers: [UnitResolver, UnitService, PrismaService],
})
export class UnitModule {}
