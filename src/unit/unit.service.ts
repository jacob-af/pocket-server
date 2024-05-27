import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UnitService {
  constructor(private prisma: PrismaService) {}

  async findAll(options: object | null) {
    return await this.prisma.unit.findMany(options);
  }

  async findOne(unitAbb: string) {
    console.log(unitAbb);
    return await this.prisma.unit.findUnique({
      where: { abbreviation: unitAbb },
    });
  }

  async convertUnits(
    amount: number,
    unitName: string,
    desiredUnitName: string,
  ) {
    const conversion = await this.prisma.unitConversion.findUnique({
      where: {
        fromUnitName_toUnitName: {
          fromUnitName: unitName,
          toUnitName: desiredUnitName,
        },
      },
      select: {
        factor: true,
      },
    });

    if (!conversion) {
      throw new Error(
        `Conversion from ${unitName} to ${desiredUnitName} not found`,
      );
    }

    const convertedAmount = amount * conversion.factor;
    return {
      originalAmount: amount,
      convertedAmount: convertedAmount,
      originalUnit: unitName,
      convertedUnit: desiredUnitName,
    };
  }
}
