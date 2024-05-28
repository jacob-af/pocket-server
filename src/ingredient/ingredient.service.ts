import {
  CreateIngredientInput,
  Ingredient,
  StatusMessage,
  UpdateIngredientInput,
} from '../graphql';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IngredientService {
  constructor(private prisma: PrismaService) {}

  async create(
    createIngredientInput: CreateIngredientInput,
  ): Promise<Ingredient> {
    return await this.prisma.ingredient.create({
      data: createIngredientInput,
    });
  }

  async createManyIngredients(
    createManyIngredientInputs: CreateIngredientInput[],
  ): Promise<StatusMessage> {
    const successes: Ingredient[] = [];
    const errors: string[] = [];
    console.log('hello');
    for (const ingredient of createManyIngredientInputs) {
      try {
        if (ingredient.parent) {
          // Check if parent exists
          const parentExists = await this.prisma.ingredient.findUnique({
            where: { name: ingredient.parent },
          });

          // Create parent if it doesn't exist
          if (!parentExists) {
            await this.prisma.ingredient.create({
              data: {
                name: ingredient.parent,
                description: 'Parent ingredient created automatically',
              },
            });
          }
        }

        // Proceed with upsert operation for the ingredient
        const result = await this.prisma.ingredient.upsert({
          where: {
            name: ingredient.name,
          },
          update: {
            description: ingredient.description,
          },
          create: {
            name: ingredient.name,
            description: ingredient.description,
          },
        });

        // const parent = await this.prisma.ingredientRelation.create({
        //   data: {
        //     parentName: ingredient.parent,
        //     childName: ingredient.name,
        //   },
        // });
        successes.push(result);
        console.log(parent);
        console.log(successes);
      } catch (err) {
        errors.push(ingredient.name);
      }
    }
    console.log(successes.length, errors.length);
    if (successes.length > 0 && errors.length === 0) {
      return {
        message: `Successfully added ${successes.length} ingredients with no errors`,
      };
    } else if (successes.length > 0) {
      return {
        message: `Successfully added ${successes.length} ingredients. The following ingredients could not be added: ${errors.join(', ')}.`,
      };
    } else {
      return {
        message: 'Something has gone horrifically wrong',
      };
    }
  }

  async findAll(options?: { [key: string]: string }): Promise<Ingredient[]> {
    const res: Ingredient[] = await this.prisma.ingredient.findMany({
      where: options,
      orderBy: { name: 'asc' },
    });
    return res;
  }

  async ingredient(name: string): Promise<Ingredient> {
    return await this.prisma.ingredient.findUnique({ where: { name } });
  }

  async update(updateIngredientInput: UpdateIngredientInput) {
    return await this.prisma.ingredient.update({
      where: { id: updateIngredientInput.id },
      data: updateIngredientInput,
    });
  }

  async remove(id: string) {
    const response: Ingredient = await this.prisma.ingredient.delete({
      where: { id },
    });
    return `You have deleted #${response.name}`;
  }

  // async getSiblingsInInventory(userId, ingredientName) {
  //   const siblings = await this.prisma.ingredient.findMany({
  //     where: {
  //       parents: {
  //         some: {
  //           id: {
  //             in: (
  //               await this.prisma.ingredient.findUnique({
  //                 where: { name: ingredientName },
  //                 select: { parents: { select: { id: true } } },
  //               })
  //             ).parents.map((parent) => parent.id),
  //           },
  //         },
  //       },
  //       users: {
  //         some: {
  //           id: userId,
  //         },
  //       },
  //     },
  //   });

  //   return siblings;
  //}
}

// to be implemented
