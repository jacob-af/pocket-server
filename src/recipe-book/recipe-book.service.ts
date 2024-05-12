import { Permission, RecipeBook } from '../graphql';

import { BuildService } from 'src/build/build.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecipeBookService {
  constructor(
    private prisma: PrismaService,
    private buildService: BuildService,
  ) {}

  async create({
    name,
    description,
    userId,
  }: {
    name: string;
    description: string;
    userId: string;
  }) {
    const recipeBook: RecipeBook = await this.prisma.recipeBook.create({
      data: { name, description },
    });
    const {
      recipeBookUser: { permission },
    } = await this.changeRecipeBookPermission({
      userId,
      recipeBookId: recipeBook.id,
      permission: Permission.OWNER,
    });
    return {
      ...recipeBook,
      permission: permission,
    };
  }

  update({
    id,
    name,
    description,
  }: {
    id: string;
    name: string;
    description: string;
  }) {
    return this.prisma.recipeBook.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });
  }

  remove(id: string) {
    return `This action removes a #${id} recipeBook`;
  }

  async addBuildToRecipeBook({
    buildId,
    recipeBookId,
  }: {
    buildId: string;
    recipeBookId: string;
  }) {
    const res = await this.prisma.recipeBookBuild.create({
      data: {
        recipeBookId,
        buildId,
      },
      include: {
        build: true,
      },
    });
    console.log(res);
    return {
      message: `Build Successfully Added`,
    };
  }

  async removeBuildFromRecipeBook({
    buildId,
    recipeBookId,
  }: {
    buildId: string;
    recipeBookId: string;
  }) {
    await this.prisma.recipeBookBuild.delete({
      where: {
        buildId_recipeBookId: {
          recipeBookId,
          buildId,
        },
      },
    });
    return {
      message: `Build Successfully Removed`,
    };
  }

  async changeRecipeBookPermission({
    userId,
    recipeBookId,
    permission,
  }: {
    userId: string;
    recipeBookId: string;
    permission: Permission;
  }) {
    const recipeBookUser = await this.prisma.recipeBookUser.upsert({
      where: {
        userId_recipeBookId: {
          userId,
          recipeBookId,
        },
      },
      update: {
        permission,
      },
      create: {
        userId,
        recipeBookId,
        permission,
      },
    });
    return {
      recipeBookUser,
      status: { message: 'Build is Shared' },
    };
  }

  async removeRecipeBookPermission({
    userId,
    recipeBookId,
  }: {
    userId: string;
    recipeBookId: string;
  }) {
    const bookUser = await this.prisma.recipeBookUser.delete({
      where: {
        userId_recipeBookId: {
          userId,
          recipeBookId,
        },
      },
      include: {
        user: true,
        recipeBook: true,
      },
    });
    return {
      bookUser,
      status: {
        message: `User ${bookUser.user.userName}no longer has access to Recipe Book ${bookUser.recipeBook.name}`,
      },
    };
  }

  async userRecipeBooks(userId: string) {
    const bookList = await this.prisma.recipeBookUser.findMany({
      where: {
        userId: userId,
      },
      include: {
        recipeBook: true, // Include the RecipeBook model data
      },
    });
    const sharedBooks = bookList.map((b) => {
      return {
        ...b.recipeBook,
        permission: b.permission,
      };
    });
    return sharedBooks;
  }

  async build(recipeBookId: string, userId: string) {
    try {
      // Query the RecipeBookBuild table to fetch builds associated with the specified recipe book
      const builds = await this.prisma.recipeBookBuild.findMany({
        where: {
          recipeBookId: recipeBookId,
        },
        include: {
          build: {
            include: {
              buildUser: {
                where: {
                  userId: userId,
                },
              },
            },
          },
        },
      });

      return builds.map((book) => {
        console.log('build:', book.build);
        return {
          ...book.build,
          permission: book.build.buildUser[0].permission || 'VIEW',
        };
      }); // Extract the builds or return an empty array
    } catch (error) {
      console.error('Error fetching builds for recipe book:', error);
      throw error;
    }
  }
}
