import { CreateStockInput, Permission } from 'src/graphql';

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.stock.findMany();
  }

  async create(createStock: CreateStockInput) {
    console.log(createStock);
    if (createStock.buildRef) {
      return await this.prisma.stock.create({
        data: {
          price: createStock.price,
          amount: createStock.amount,
          ingredient: { connect: { name: createStock.ingredient.name } },
          unit: { connect: { abbreviation: createStock.unit.abbreviation } },
          buildRef: { connect: { id: createStock.buildRef.id } },
          inventory: { connect: { id: createStock.inventory.id } },
        },
      });
    } else {
      return await this.prisma.stock.create({
        data: {
          price: createStock.price,
          amount: createStock.amount,
          ingredient: { connect: { name: createStock.ingredient.name } },
          unit: { connect: { abbreviation: createStock.unit.abbreviation } },
          inventory: { connect: { id: createStock.inventory.id } },
        },
      });
    }
  }

  //   async changePermission(
  //     stockId: string,
  //     userId: string,
  //     permission: Permission,
  //   ) {
  //     const stockUser = await this.prisma.stockUser.upsert({
  //       where: { stockId_userId: { stockId, userId } },
  //       update: { permission },
  //       create: { stockId, userId, permission },
  //     });
  //     return stockUser.permission;
  //   }
}
