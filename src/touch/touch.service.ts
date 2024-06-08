import { ArchivedTouch, TouchInput } from '../graphql';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockService } from '../stock/stock.service';
import { UnitService } from '../unit/unit.service';

@Injectable()
export class TouchService {
  constructor(
    private prisma: PrismaService,
    private stockService: StockService,
    private unitService: UnitService,
  ) {}

  create() {
    return 'This action adds a new touch';
  }

  async touch(buildId: string) {
    return await this.prisma.touch.findMany({
      where: { buildId },
      orderBy: { order: 'asc' },
    });
  }

  async touchWithCost(buildId: string, inventoryId: string) {
    const touches = await this.prisma.touch.findMany({
      where: { buildId },
      orderBy: { order: 'asc' },
      include: {
        ingredient: true,
        unit: true,
      },
    });
    return this.costTouchArray(touches, inventoryId);
  }

  async findOne(id: string) {
    return await this.prisma.touch.findUnique({ where: { id: id } });
  }

  update() {
    return `This action updates a #$ touch`;
  }

  remove() {
    return `This action removes a  touch`;
  }

  async createTouchArray(
    buildId: string,
    touchArray: TouchInput[],
    version: number,
  ) {
    const newTouchArray = touchArray.map(async (touch, index) => {
      const newTouch = await this.prisma.touch.create({
        data: {
          build: { connect: { id: buildId } },
          order: index,
          ingredient: { connect: { name: touch.ingredient.name } },
          amount: touch.amount,
          unit: { connect: { abbreviation: touch.unit.abbreviation } },
          version,
        },
      });
      return newTouch;
    });
    return newTouchArray;
  }

  touchArrayWithIndex(touchArray: TouchInput[], version: number) {
    return touchArray.map((touch, index) => {
      return {
        order: index,
        ingredient: {
          connectOrCreate: {
            where: { name: touch.ingredient.name },
            create: { name: touch.ingredient.name },
          },
        },
        amount: touch.amount,
        unit: { connect: { abbreviation: touch.unit.abbreviation } },
        version,
      };
    });
  }

  async costTouchArray(touches: TouchInput[], inventoryId: string) {
    console.log(touches);
    const touchesWithCost = touches.map(async (touch) => {
      let cost: number = 0;
      try {
        const stock = await this.stockService.findOne(
          touch.ingredient.name,
          inventoryId,
        );
        if (!stock) {
          console.warn(
            `Stock not found for ingredient: ${touch.ingredient.name}`,
          );
          return { ...touch, cost: 0 };
        }
        const ppo = await this.stockService.pricePerOunce(stock);
        const { convertedAmount } = await this.unitService.convertUnits(
          touch.amount,
          touch.unit.abbreviation,
          'oz',
        );
        if (ppo && convertedAmount) {
          cost = ppo * convertedAmount;
        }
      } catch (error) {
        console.error(`Failed to calculate cost for touch ${touch.id}:`, error);
        cost = 0;
      }
      return {
        ...touch,
        cost,
      };
    });

    const result = await Promise.all(touchesWithCost);
    console.log(result);
    return result;
  }

  async archiveTouchArray(buildId: string, version: number) {
    const touchToArchive = await this.prisma.touch.findMany({
      where: {
        buildId,
        version,
      },
    });

    const archivedTouchArray: Promise<ArchivedTouch>[] = touchToArchive.map(
      async (touch, index: number) => {
        return await this.prisma.archivedTouch.create({
          data: {
            archivedBuild: { connect: { id: buildId } },
            order: index,
            ingredient: { connect: { name: touch.ingredientName } },
            amount: touch.amount,
            unit: { connect: { abbreviation: touch.unitAbb } },
            version,
          },
          include: { unit: true },
        });
      },
    );

    const deletedArray = touchToArchive.map(async (touch) => {
      return this.prisma.touch.delete({
        where: { id: touch.id },
      });
    });
    console.log(deletedArray);
    return archivedTouchArray;
  }

  async Unit(abbreviation: string) {
    const res = await this.prisma.unit.findUnique({
      where: { abbreviation: abbreviation },
    });
    return res;
  }
}
