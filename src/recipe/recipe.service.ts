import {
  CreateRecipeInput,
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
          createdBy: { connect: { id: userId } },
          editedBy: { connect: { id: userId } },
        },
      });
      const buildWithId = {
        ...build,
        recipe: { name: recipeName },
      };
      const newBuild = await this.buildService.create(buildWithId, userId);
      return {
        ...recipe,
        build: [newBuild],
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async createManyRecipes(
    createManyRecipeInputs: CreateRecipeInput[],
    userId: string,
  ): Promise<StatusMessage> {
    const successes = [];
    const errors: string[] = [];
    for (const recipe of createManyRecipeInputs) {
      try {
        const newRecipe = await this.create(recipe, userId);
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

  async update({ id, name, about, build }: UpdateRecipeInput, userId: string) {
    const newBuild = this.buildService.update(build, userId);
    const recipe = await this.prisma.recipe.update({
      where: { name },
      data: { name, about, editedBy: { connect: { id: userId } } },
    });
    return {
      ...recipe,
      build: { ...newBuild, id },
    };
  }

  async remove(id: string) {
    return await this.prisma.recipe.delete({ where: { id } });
  }

  async getRecipes({
    keyword,
    isPublic,
    fromBook,
    shared,
    createdById,
    orderBy = 'name',
    asc = true,
    skip,
    take,
    userId,
  }: {
    keyword: string;
    isPublic: boolean;
    fromBook: boolean;
    shared: boolean;
    createdById: string;
    orderBy: string;
    asc: boolean;
    skip: number;
    take: number;
    userId: string;
  }) {
    const recipes = await this.prisma.recipe.findMany({
      where: {
        build: {
          some: {
            AND: [
              {
                OR: [
                  {
                    touch: {
                      some: {
                        ingredientName: {
                          contains: keyword,
                          mode: 'insensitive', // Makes the search case-insensitive
                        },
                      },
                    },
                  },
                  {
                    recipe: {
                      about: {
                        contains: keyword,
                        mode: 'insensitive',
                      },
                    },
                  },
                  {
                    notes: {
                      contains: keyword,
                    },
                  },
                ],
              },
              {
                AND: [
                  {
                    isPublic,
                  },
                  {
                    buildUser: {
                      some: {
                        userId: shared ? userId : undefined,
                      },
                    },
                  },
                  {
                    createdById,
                  },
                  {
                    recipeBookBuild: {
                      some: {
                        recipeBook: {
                          recipeBookUser: {
                            some: {
                              userId: fromBook ? userId : undefined,
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
      },

      orderBy: {
        [orderBy]: asc ? 'asc' : 'desc',
      },
      skip,
      take,
    });
    return recipes;
  }

  async allRecipes(options: object) {
    return await this.prisma.recipe.findMany(options);
  }

  async findOne(name: string) {
    return await this.prisma.recipe.findUnique({ where: { name } });
  }

  async publicRecipe(name: string) {
    return await this.prisma.recipe.findFirst({
      where: {
        name,
        build: {
          some: {
            isPublic: true,
          },
        },
      },
    });
  }

  async publicRecipes(skip: number, take: number) {
    console.log('lazy');
    const recipes = await this.prisma.recipe.findMany({
      where: {
        build: {
          some: {
            isPublic: true,
          },
        },
      },
      skip,
      take,
      orderBy: {
        name: 'asc',
      },
    });

    return recipes;
  }

  async userRecipes(skip: number, take: number, userId: string) {
    const recipes = await this.prisma.recipe.findMany({
      where: {
        build: {
          some: {
            OR: [
              {
                recipeBookBuild: {
                  some: {
                    recipeBook: {
                      recipeBookUser: {
                        some: {
                          userId: userId,
                        },
                      },
                    },
                  },
                },
              },
              {
                buildUser: {
                  some: {
                    userId: userId,
                  },
                },
              },
            ],
          },
        },
      },
      skip,
      take,
      orderBy: {
        name: 'asc',
      },
      include: {
        build: {
          include: {
            buildUser: {
              where: {
                userId: userId,
              },
              select: {
                permission: true,
              },
            },
          },
        },
      },
    });
    const updatedRecipes = recipes.map((recipe) => ({
      ...recipe,
      build: recipe.build.map((build) => ({
        ...build,
        permission:
          build.buildUser.length > 0 ? build.buildUser[0].permission : 'View',
      })),
    }));
    console.log(updatedRecipes);

    return updatedRecipes;
  }
}
