import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BuildService } from 'src/build/build.service';
import {
  CreateRecipeInput,
  UpdateRecipeInput,
  Recipe,
  StatusMessage,
} from 'src/graphql';

@Injectable()
export class RecipeService {
  constructor(
    private prisma: PrismaService,
    private buildService: BuildService,
  ) {}

  async create({ name, about, build }: CreateRecipeInput, userId: string) {
    try {
      const recipe = await this.prisma.recipe.create({
        data: {
          name: name,
          about: about,
          createdById: userId,
          editedById: userId,
        },
      });
      const buildWithId = {
        ...build,
        recipeName: recipe.name,
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
        errors.push(recipe.name);
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

  async findOne(id: string) {
    return await this.prisma.recipe.findUnique({ where: { id } });
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
