import { Permission, UserBookPermission } from '../graphql';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecipeBookService {
  constructor(private prisma: PrismaService) {}

  async create({
    name,
    description,
    isPublic,
    userId,
  }: {
    name: string;
    description: string;
    isPublic: boolean;
    userId: string;
  }) {
    const recipeBook = await this.prisma.recipeBook.create({
      data: {
        name,
        description,
        isPublic,
        createdBy: { connect: { id: userId } },
        editedBy: { connect: { id: userId } },
      },
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
    return this.prisma.recipeBook.delete({ where: { id } });
  }

  async addBuildToRecipeBook({
    buildId,
    recipeBookId,
  }: {
    buildId: string;
    recipeBookId: string;
  }) {
    const res = await this.prisma.recipeBookBuild.upsert({
      where: {
        buildId_recipeBookId: {
          recipeBookId,
          buildId,
        },
      },
      update: {
        recipeBookId,
        buildId,
      },
      create: {
        recipeBookId,
        buildId,
      },
      include: {
        build: true,
      },
    });
    console.log(res);
    return res.build;
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
    try {
      await this.prisma.recipeBookUser.delete({
        where: {
          userId_recipeBookId: {
            userId,
            recipeBookId,
          },
        },
      });
      console.log('cheese');
      return {
        message: `User no longer has access to Recipe Book`,
      };
    } catch (err) {
      return {
        status: {
          message: err.message,
        },
      };
    }
  }

  async allBooks(options: object) {
    return await this.prisma.recipeBook.findMany(options);
  }

  async findOne(name: string, userId: string) {
    console.log('hello');
    try {
      const recipeBook = await this.prisma.recipeBook.findUnique({
        where: {
          name: name,
        },
      });
      console.log(recipeBook);
      const bookUser = await this.prisma.recipeBookUser.findUnique({
        where: {
          userId_recipeBookId: {
            userId,
            recipeBookId: recipeBook.id,
          },
        },
      });
      console.log(recipeBook);
      if (!!bookUser) {
        const book = {
          ...recipeBook,
          permission: bookUser.permission,
        };
        return book;
      } else {
        const book = {
          ...recipeBook,
          permission: 'VIEW',
        };
        return book;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async publicBook(name: string) {
    return await this.prisma.recipeBook.findFirst({
      where: {
        name,
        isPublic: true,
      },
    });
  }

  async publicBooks(skip: number, take: number) {
    const books = await this.prisma.recipeBook.findMany({
      where: {
        isPublic: true,
      },
      skip,
      take,
      orderBy: {
        name: 'asc',
      },
    });

    return books;
  }

  async userBooks(skip: number, take: number, userId: string) {
    const bookList = await this.prisma.recipeBookUser.findMany({
      where: {
        userId: userId,
      },
      include: {
        recipeBook: true, // Include the RecipeBook model data
      },
      skip,
      take,
    });
    console.log('yes, the user recipe books');
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
        orderBy: {
          build: {
            recipe: {
              name: 'asc',
            },
          },
        },
      });

      return builds.map((book) => {
        const { buildUser, ...build } = book.build;
        return buildUser[0] !== undefined
          ? {
              ...build,
              permission: buildUser[0].permission,
            }
          : {
              ...build,
              permission: 'VIEW',
            };
      }); // Extract the builds or return an empty array
    } catch (error) {
      console.error('Error fetching builds for recipe book:', error);
      throw error;
    }
  }

  async publicBuild(recipeBookId: string) {
    const builds = await this.prisma.build.findMany({
      where: {
        isPublic: true,
        recipeBookBuild: {
          some: {
            recipeBookId,
          },
        },
      },
    });
    const buildsWithPermission = builds.map((build) => {
      return {
        ...build,
        permission: 'VIEW',
      };
    });
    return buildsWithPermission;
  }

  async allBuild({
    recipeBookId,
    userId,
  }: {
    recipeBookId: string;
    userId: string;
  }) {
    let userBuilds = [];
    if (userId != undefined) {
      userBuilds = await this.build(recipeBookId, userId);
    }
    const publicBuilds = await this.publicBuild(recipeBookId);
    console.log(publicBuilds);
    const map = new Map(userBuilds.map((item) => [item.id, item]));

    // Step 3: Iterate through the second array and add new objects
    publicBuilds.forEach((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    });

    // Step 4: Convert the map back to an array
    const builds = Array.from(map.values());
    console.log(builds[0]);
    return builds;
  }

  async findFolloweddUsersBookPermission({
    userId,
    recipeBookId,
  }: {
    userId: string;
    recipeBookId: string;
  }): Promise<UserBookPermission[]> {
    // Retrieve the list of users the current user follows
    const followingRelations = await this.prisma.follow.findMany({
      where: { followedById: userId },
      include: { following: true },
    });

    // Retrieve the list of users the current user has blocked
    const blockedRelations = await this.prisma.follow.findMany({
      where: {
        OR: [
          { followingId: userId, relationship: 'Blocked' },
          { followedById: userId, relationship: 'Blocked' },
        ],
      },
      include: {
        following: true,
        followedBy: true,
      },
    });

    // Retrieve permission information for the specific book
    const bookUserPermissions = await this.prisma.recipeBookUser.findMany({
      where: {
        recipeBookId,
        userId: {
          in: followingRelations.map((relation) => relation.following?.id),
        },
      },
    });
    console.log('why', bookUserPermissions.length, 'just why');
    // Create a map for quick lookup of permissions by user ID
    const permissionMap = new Map<string, string | null>();
    bookUserPermissions.forEach((permission) => {
      //console.log(permission);
      permissionMap.set(permission.userId, permission.permission);
    });

    // Create a set of blocked user IDs for efficient lookups
    const blockedUserIds = new Set<string>();
    blockedRelations.forEach((relation) => {
      if (relation.following) {
        blockedUserIds.add(relation.following.id);
      }
      if (relation.followedBy) {
        blockedUserIds.add(relation.followedBy.id);
      }
    });

    // Process the following relations and filter out blocked users
    const userBookPermissions: UserBookPermission[] = [];

    for (const relation of followingRelations) {
      const user = relation.following;
      if (user && !blockedUserIds.has(user.id)) {
        // Determine the permission level for the user
        const permission = permissionMap.get(user.id) || null;

        // Debugging: log the user ID and permission
        console.log(`User ID: ${user.id}, Permission: ${permission}`);

        // Add the user and permission level to the result
        userBookPermissions.push({
          user,
          permission,
        });
      }
    }
    return userBookPermissions;
  }
}
