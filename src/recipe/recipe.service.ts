import {
  CreateRecipeInput,
  Recipe,
  StatusMessage,
  UpdateRecipeInput,
} from '../graphql';

import { BuildService } from '../build/build.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecipeService {
  constructor(
    private prisma: PrismaService,
    private buildService: BuildService,
  ) {}

  async create(
    { recipeName, about, build }: CreateRecipeInput,
    userId: string,
  ) {
    try {
      const recipe = await this.prisma.recipe.create({
        data: {
          name: recipeName,
          about: about,
          createdById: userId,
          editedById: userId,
        },
      });
      const buildWithId = {
        ...build,
        recipe: { name: recipeName },
      };
      const newBuild = await this.buildService.create(buildWithId, userId);
      return {
        ...recipe,
        build: [newBuild.build],
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async createManyRecipes(
    createManyRecipeInputs: CreateRecipeInput[],
    userId: string,
  ): Promise<StatusMessage> {
    const successes: Recipe[] = [];
    const errors: string[] = [];
    for (const recipe of createManyRecipeInputs) {
      try {
        const newRecipe: Recipe = await this.create(recipe, userId);
        successes.push(newRecipe);
      } catch (error) {
        errors.push(recipe.recipeName);
      }
    }
    if (successes.length > 0 && errors.length === 0) {
      return {
        message: `Successfully added ${successes.length} recipes with no errors`,
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

  async findAll() {
    return this.prisma.recipe.findMany();
  }

  async findOne(name: string) {
    return await this.prisma.recipe.findUnique({ where: { name } });
  }

  async recipeList() {
    return await this.prisma.recipe.findMany({
      select: {
        name: true,
        id: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async update({ id, name, about }: UpdateRecipeInput, userId: string) {
    return await this.prisma.recipe.update({
      where: { id },
      data: { name, about, editedBy: { connect: { id: userId } } },
    });
  }

  async remove(id: string) {
    return await this.prisma.recipe.delete({ where: { id } });
  }
}
