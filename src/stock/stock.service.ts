import { CreateStockInput, StatusMessage, Stock } from 'src/graphql';

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.stock.findMany();
  }

  async findOne(ingredientName: string, inventoryId: string) {
    return await this.prisma.stock.findUnique({
      where: {
        inventoryId_ingredientName: {
          ingredientName,
          inventoryId,
        },
      },
    });
  }

  async create(createStock: CreateStockInput, inventoryId: string) {
    console.log(createStock);

    const data: any = {
      price: createStock.price,
      amount: createStock.amount,
      ingredient: { connect: { name: createStock.ingredientName } },
      unit: { connect: { abbreviation: createStock.unitAbb } },
      inventory: { connect: { id: inventoryId } },
    };

    if (createStock.buildName && createStock.recipeName) {
      data.buildRef = {
        connect: {
          buildName_recipeName: {
            buildName: createStock.buildName,
            recipeName: createStock.recipeName,
          },
        },
      };
    }

    return await this.prisma.stock.create({ data });
  }

  async createMany(
    createManyStocks: CreateStockInput[],
    inventoryId: string,
  ): Promise<StatusMessage> {
    const successes: Stock[] = [];
    const errors: string[] = [];

    for (const stock of createManyStocks) {
      try {
        const data: any = {
          inventory: { connect: { id: inventoryId } },
          ingredient: {
            connectOrCreate: {
              where: { name: stock.ingredientName },
              create: { name: stock.ingredientName },
            },
          },
          amount: stock.amount,
          unit: { connect: { abbreviation: stock.unitAbb } },
          price: stock.price,
        };

        const updateData: any = {
          amount: stock.amount,
          unit: { connect: { abbreviation: stock.unitAbb } },
          price: stock.price,
        };

        if (stock.buildName && stock.recipeName) {
          data.buildRef = {
            connect: {
              buildName_recipeName: {
                buildName: stock.buildName,
                recipeName: stock.recipeName,
              },
            },
          };
        }

        const result = await this.prisma.stock.upsert({
          where: {
            inventoryId_ingredientName: {
              inventoryId: inventoryId,
              ingredientName: stock.ingredientName,
            },
          },
          update: updateData,
          create: data,
        });
        successes.push(result);
        console.log(successes.length, errors.length);
      } catch (err) {
        console.log(err.message);
        errors.push(stock.ingredientName);
      }
    }

    console.log(successes.length);
    if (successes.length > 0 && errors.length === 0) {
      return {
        message: `Successfully added ${successes.length} stocks with no errors`,
      };
    } else if (successes.length > 0 && errors.length > 0) {
      return {
        message: `Successfully added ${successes.length} stocks. The following stocks could not be added: ${errors.join(
          ', ',
        )}.`,
      };
    } else {
      return {
        message: 'Something has gone horrifically wrong',
      };
    }
  }

  async pricePerOunce(stock) {
    const conversion = await this.prisma.unitConversion.findUnique({
      where: {
        fromUnitName_toUnitName: {
          fromUnitName: stock.unitAbb,
          toUnitName: 'oz',
        },
      },
      select: {
        factor: true,
      },
    });

    if (!conversion) {
      throw new Error(`Conversion from ${stock.unitAbb} to oz not found`);
    }

    const amountInOunces = stock.amount * conversion.factor;
    const pricePerOunce = stock.price / amountInOunces;

    return pricePerOunce;
  }
}
