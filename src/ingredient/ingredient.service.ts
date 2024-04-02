import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateIngredientInput,
  UpdateIngredientInput,
  Ingredient,
} from 'src/graphql';

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

  async addManyIngredient(createIngredientInputs: CreateIngredientInput[]) {
    const successes: Ingredient[] = [];
    const errors: string[] = [];
    createIngredientInputs.forEach(async (ingredient) => {
      try {
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
        successes.push(result);
      } catch (err) {
        console.log(err.message);
        errors.push(ingredient.name);
      }
    });
    console.log(successes, errors);
    if (successes.length > 0 && errors.length === 0) {
      return {
        message: `Successfully added ${successes.length} ingredients with no errors`,
      };
    } else if (successes.length > 0 && errors.length === 0) {
      return {
        message: `Successfully added ${successes} ingredients. The following ingredients  count not be added: ${errors.join(
          ', ',
        )}.`,
      };
    } else {
      return {
        message: 'something has gone horrifically wrong',
      };
    }
  }

  async findAll(): Promise<Ingredient[]> {
    return this.prisma.ingredient.findMany();
  }

  async findOne(id: string): Promise<Ingredient> {
    return this.prisma.ingredient.findUnique({ where: { id } });
  }

  async update(updateIngredientInput: UpdateIngredientInput) {
    return this.prisma.ingredient.update({
      where: { id: updateIngredientInput.id },
      data: updateIngredientInput,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} ingredient`;
  }
}
