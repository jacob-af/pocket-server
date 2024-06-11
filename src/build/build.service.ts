import {
  ArchivedBuild,
  ChangeBuildPermissionInput,
  CreateBuildInput,
  Permission,
  UpdateBuildInput,
  UserBuildPermission,
} from '../graphql';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipeBookService } from '../recipe-book/recipe-book.service';
import { TouchService } from '../touch//touch.service';

@Injectable()
export class BuildService {
  constructor(
    private prisma: PrismaService,
    private touchService: TouchService,
    private recipeBookService: RecipeBookService,
  ) {}

  async create(
    {
      recipe: { name, about },
      buildName,
      instructions,
      glassware,
      ice,
      image,
      isPublic,
      touchArray,
    }: CreateBuildInput,
    userId: string,
  ) {
    try {
      const build = await this.prisma.build.create({
        data: {
          recipe: {
            connectOrCreate: {
              where: { name },
              create: {
                name,
                about,
                createdBy: { connect: { id: userId } },
                editedBy: { connect: { id: userId } },
              },
            },
          },
          buildName,
          instructions,
          glassware,
          ice,
          image,
          isPublic,
          createdBy: { connect: { id: userId } },
          editedBy: { connect: { id: userId } },
          version: 0,
          touch: {
            create: this.touchService.touchArrayWithIndex(touchArray, 0),
          },
        },
        include: {
          recipe: true,
          touch: true,
        },
      });
      const {
        buildUser: { permission },
      } = await this.changeBuildPermission({
        userId,
        buildId: build.id,
        userPermission: Permission.OWNER,
        desiredPermission: Permission.OWNER,
      });
      return {
        ...build,
        permission,
      };
    } catch (err) {
      console.log(err.message, ': create Build');
      return err;
    }
  }

  async findAll(recipeName: string, userId: string) {
    const builds = await this.prisma.build.findMany({
      where: {
        recipeName: recipeName,
        OR: [
          // Direct association through BuildUser
          {
            buildUser: {
              some: {
                userId: userId,
              },
            },
          },
          // Indirect association through RecipeBookBuild and RecipeBookUser
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
        ],
      },
      include: {
        createdBy: true, // Optional, include related user information
        editedBy: true, // Optional, include related user information
      },
    });

    return builds;
  }

  async findOne(recipeName: string, buildName: string, userId: string) {
    try {
      const build = await this.prisma.build.findUnique({
        where: {
          buildName_recipeName: {
            recipeName,
            buildName,
          },
        },
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
      });
      if (build === null) {
        return null;
      }
      return {
        ...build,
        permission: build.buildUser[0].permission,
      };
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async findBuildById(buildId: string) {
    console.log(buildId);
    if (!!buildId) {
      return await this.prisma.build.findUnique({
        where: { id: buildId },
        include: { touch: true },
      });
    }
    return null;
  }
  async findBuildByIdWithPermission(buildId: string, userId) {
    console.log(buildId);
    if (!!buildId) {
      const build = await this.prisma.build.findUnique({
        where: { id: buildId },
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
      });
      console.log(build);
      return build.buildUser[0].permission;
    }
    return null;
  }

  async update(
    {
      buildId,
      buildName,
      instructions,
      glassware,
      ice,
      image,
      touchArray,
      isPublic,
    }: UpdateBuildInput,
    userId: string,
  ) {
    try {
      const archivedBuild: ArchivedBuild = await this.archiveBuild(
        buildId,
        userId,
      );
      console.log(image);
      const build = await this.prisma.build.update({
        where: {
          id: buildId,
        },
        data: {
          buildName,
          instructions,
          glassware,
          ice,
          image,
          isPublic,
          editedById: userId,
          touch: {
            create: this.touchService.touchArrayWithIndex(
              touchArray,
              archivedBuild.version + 1,
            ),
          },
          version: archivedBuild.version + 1,
        },
      });

      return {
        build,
        status: {
          message: 'You win!',
        },
      };
    } catch (err) {
      console.log(err);
      return {
        status: {
          code: err.code,
          message: err.message,
        },
      };
    }
  }

  async uploadBook(
    bookId: string,
    updateManyBuildInput: UpdateBuildInput[],
    userId: string,
  ) {
    try {
      console.log(updateManyBuildInput[0]);
      const success = updateManyBuildInput.map(async (build) => {
        let newBuild = { id: '' };
        console.log(build.buildId, 'build Id');
        if (!!build.buildId) {
          const permission = await this.findBuildByIdWithPermission(
            build.buildId,
            userId,
          );
          if (permission === 'OWNER' || 'MANAGER') {
            const added = await this.recipeBookService.addBuildToRecipeBook({
              buildId: build.buildId,
              recipeBookId: bookId,
            });
            console.log(added, ': added');
            return await this.update(build, userId);
          } else {
            return null;
          }
        } else {
          console.log(build.recipe.name, build.buildName, userId);
          const buildWithId = await this.findOne(
            build.recipe.name,
            build.buildName,
            userId,
          );
          if (buildWithId === null) {
            try {
              newBuild = await this.create(build, userId);
              console.log(newBuild.id, 'new Build');
              await this.recipeBookService.addBuildToRecipeBook({
                buildId: newBuild.id,
                recipeBookId: bookId,
              });
            } catch (err) {
              console.log(err.message, 'id check');
            }
          } else {
            newBuild = buildWithId;
            await this.recipeBookService.addBuildToRecipeBook({
              buildId: buildWithId.id,
              recipeBookId: bookId,
            });
          }
          return newBuild;
        }
      });
      console.log(success);
      return { message: 'ding' };
    } catch (error) {
      return { message: error.message };
    }
  }

  async remove(buildId: string) {
    return await this.prisma.build.delete({ where: { id: buildId } });
  }

  async archiveBuild(buildId: string, userId: string): Promise<ArchivedBuild> {
    try {
      const { id, buildName, instructions, glassware, ice, version } =
        await this.prisma.build.findUnique({
          where: {
            id: buildId,
          },
        });
      const touch = await this.prisma.touch.findMany({
        where: {
          buildId,
          version,
        },
        include: {
          ingredient: true,
          unit: true,
        },
      });
      const arcBuild: ArchivedBuild = await this.prisma.archivedBuild.create({
        data: {
          build: { connect: { id } },
          buildName,
          createdBy: { connect: { id: userId } },
          instructions,
          glassware,
          ice,
          version,
          archivedTouch: {
            create: this.touchService.touchArrayWithIndex(touch, version),
          },
        },
      });
      touch.forEach(async (t) => {
        return await this.prisma.touch.delete({
          where: { id: t.id },
        });
      });
      return arcBuild;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  async allBuilds(userId: string) {
    const buildUser = await this.prisma.buildUser.findMany({
      where: { userId: userId },
    });

    return buildUser.map(async (each) => {
      const build = await this.prisma.build.findUnique({
        where: { id: each.buildId },
      });
      return {
        ...build,
        permission: each.permission,
      };
    });
  }

  async changeBuildPermission({
    buildId,
    userId,
    userPermission,
    desiredPermission,
  }: ChangeBuildPermissionInput) {
    try {
      console.log(userPermission);
      const buildUser = await this.prisma.buildUser.upsert({
        where: {
          userId_buildId: { userId, buildId },
        },
        update: {
          permission: desiredPermission,
        },
        create: {
          userId,
          buildId,
          permission: desiredPermission,
        },
      });
      return {
        buildUser,
        status: { message: 'Build is Shared' },
      };
    } catch (err) {
      console.log(err);
      return {
        status: {
          message: err.message,
        },
      };
    }
  }

  async deleteBuildPermission(userId: string, buildId: string) {
    try {
      const buildUser = await this.prisma.buildUser.delete({
        where: {
          userId_buildId: {
            userId,
            buildId,
          },
        },
      });
      console.log('working');
      return {
        buildUser,
        status: {
          message: 'user no longer has access to this build!',
        },
      };
    } catch (err) {
      console.log(err);
      return {
        status: {
          message: err.message,
        },
      };
    }
  }

  async userBuilds(recipeName: string, userId: string) {
    const builds = await this.prisma.build.findMany({
      orderBy: {
        buildName: 'asc',
      },
      where: {
        recipeName: recipeName,
        OR: [
          { buildUser: { some: { userId } } },
          {
            recipeBookBuild: {
              some: {
                recipeBook: { recipeBookUser: { some: { userId } } },
              },
            },
          },
        ],
      },
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
    });
    const buildWithPermission = builds.map((build) => {
      if (build.buildUser.length === 0) {
        return {
          ...build,
          permission: 'VIEW',
        };
      }
      return {
        ...build,
        permission: build.buildUser[0].permission,
      };
    });
    return buildWithPermission;
  }

  async publicBuilds(recipeName: string) {
    const builds = await this.prisma.build.findMany({
      orderBy: {
        buildName: 'asc',
      },
      where: {
        recipeName: recipeName,
        isPublic: true,
      },
    });
    return builds;
  }

  async findFolloweddUsersBuildPermission({
    userId,
    buildId,
  }: {
    userId: string;
    buildId: string;
  }): Promise<UserBuildPermission[]> {
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

    // Retrieve permission information for the specific build

    const buildUserPermissions = await this.prisma.buildUser.findMany({
      where: {
        buildId,
        userId: {
          in: followingRelations.map((relation) => relation.following?.id),
        },
      },
    });

    // Create a map for quick lookup of permissions by user ID
    const permissionMap = new Map<string, string | null>();
    buildUserPermissions.forEach((permission) => {
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
    const userBuildPermissions: UserBuildPermission[] = [];

    for (const relation of followingRelations) {
      const user = relation.following;
      if (user && !blockedUserIds.has(user.id)) {
        // Determine the permission level for the user
        const permission = permissionMap.get(user.id) || null;

        // Debugging: log the user ID and permission
        console.log(`User ID: ${user.id}, Permission: ${permission}`);

        // Add the user and permission level to the result
        userBuildPermissions.push({
          user,
          permission,
        });
      }
    }

    // Return the list of user and permission pairs
    return userBuildPermissions;
  }
}
