import { Injectable } from '@nestjs/common';
import {
  ChangeBuildPermissionInput,
  CreateBuildInput,
  UpdateBuildInput,
  Permission,
  ArchivedBuild,
  Build,
  UserBuildPermission,
  BuildWithRecipeOptional,
} from '../graphql';
import { TouchService } from '../touch//touch.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BuildService {
  constructor(
    private prisma: PrismaService,
    private touchService: TouchService,
  ) {}

  async create(
    {
      recipe: { name },
      buildName,
      instructions,
      glassware,
      ice,
      touchArray,
    }: CreateBuildInput,
    userId: string,
  ) {
    try {
      const build: Build = await this.prisma.build.create({
        data: {
          recipe: { connect: { name: name } },
          buildName,
          instructions,
          glassware,
          ice,
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
        build,
        permission,
      };
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(options?: { [key: string]: string }) {
    return await this.prisma.build.findMany({ where: options });
  }

  async findOne(buildId: string) {
    return await this.prisma.build.findUnique({ where: { id: buildId } });
  }

  async update(
    {
      buildId,
      buildName,
      instructions,
      glassware,
      ice,
      touchArray,
    }: UpdateBuildInput,
    userId: string,
  ) {
    try {
      const archivedBuild: ArchivedBuild = await this.archiveBuild(
        buildId,
        userId,
      );

      const build = await this.prisma.build.update({
        where: {
          id: buildId,
        },
        data: {
          buildName,
          instructions,
          glassware,
          ice,
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
          code: 'Success',
          message: 'Against all sanity, you didi it!',
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
      });
      const arcBuild: ArchivedBuild = await this.prisma.archivedBuild.create({
        data: {
          buildId: id,
          buildName,
          createdById: userId,
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
        console.log(t);
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
    console.log(buildUser);
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
      console.log(userId, buildId);
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

  async usersBuilds(userId: string) {
    console.log(userId);
    const buildList: {
      userId: string;
      buildId: string;
      permission: string;
    }[] = await this.prisma.buildUser.findMany({
      where: { userId: userId },
    });
    const builds = [];
    console.log('user builds route hit');
    for (const connection of buildList) {
      const build: BuildWithRecipeOptional = await this.prisma.build.findUnique(
        {
          where: { id: connection.buildId },
        },
      );
      builds.push({ ...build, permission: connection.permission });
    }
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
    console.log(buildId);
    const buildUserPermissions = await this.prisma.buildUser.findMany({
      where: {
        buildId,
        userId: {
          in: followingRelations.map((relation) => relation.following?.id),
        },
      },
    });
    console.log('why', buildUserPermissions.length, 'just why');
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
