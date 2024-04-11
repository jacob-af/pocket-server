import { Injectable } from '@nestjs/common';
import {
  ChangeBuildPermissionInput,
  CreateBuildInput,
  UpdateBuildInput,
  Permission,
  TouchInput,
  Touch,
  Build,
  ArchivedBuild,
  ArchivedTouch,
} from '../graphql';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BuildService {
  constructor(private prisma: PrismaService) {}

  async create(
    { buildName, instructions, glassware, ice, touchArray }: CreateBuildInput,
    userId: string,
  ) {
    try {
      const build: Build = await this.prisma.build.create({
        data: {
          buildName,
          instructions,
          glassware,
          ice,
          createdBy: { connect: { id: userId } },
          editedBy: { connect: { id: userId } },
          version: 0,
          touch: {
            create: this.touchArrayWithIndex(touchArray, 0),
          },
        },
      });
      const {
        buildUser: { permission },
      } = await this.changeBuildPermission({
        buildId: build.id,
        userId,
        userPermission: Permission.OWNER,
        desiredPermission: Permission.OWNER,
      });

      return {
        build,
        permission,
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

  async findAll() {
    return await this.prisma.build.findMany();
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
            create: this.touchArrayWithIndex(
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
      const { id, buildName, instructions, glassware, ice, version }: Build =
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
            create: this.touchArrayWithIndex(touch, version),
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
        status: { code: 'Success', message: 'Build is Shared' },
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

  async createTouchArray(context, buildId, touchArray, version) {
    const newTouchArray = await touchArray.map(async (touch, index) => {
      const newTouch = await context.prisma.touch.create({
        data: {
          buildId,
          order: index,
          ingredientTypeId: touch.ingredientTypeId,
          ingredientId: touch.ingredientId,
          amount: touch.amount,
          unit: touch.unit,
          version,
        },
      });
      return newTouch;
    });
    return newTouchArray;
  }

  touchArrayWithIndex(touchArray: TouchInput[], version: number) {
    return touchArray.map((touch, index) => {
      return {
        order: index,
        ingredientId: touch.ingredientId,
        amount: touch.amount,
        unit: touch.unit,
        version,
      };
    });
  }

  async archiveTouchArray(buildId, version) {
    const touchToArchive = await this.prisma.touch.findMany({
      where: {
        buildId,
        version,
      },
    });

    const archivedTouchArray: Promise<ArchivedTouch>[] = touchToArchive.map(
      async (touch: Touch, index: number) => {
        return await this.prisma.archivedTouch.create({
          data: {
            archivedBuild: { connect: { id: buildId } },
            order: index,
            ingredient: { connect: { id: touch.ingredient.id } },
            amount: touch.amount,
            unit: touch.unit,
            version,
          },
        });
      },
    );

    const deletedArray = touchToArchive.map(async (touch: Touch) => {
      return this.prisma.touch.delete({
        where: { id: touch.id },
      });
    });
    console.log(deletedArray);
    return archivedTouchArray;
  }

  async deleteBuildPermission(buildId: string, userId: string) {
    try {
      const buildUser = await this.prisma.buildUser.delete({
        where: {
          userId_buildId: {
            userId,
            buildId,
          },
        },
      });

      return {
        buildUser,
        status: {
          message: 'user no longer has access to this build!',
          code: 'Success',
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
}
