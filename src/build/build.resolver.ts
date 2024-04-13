import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { BuildService } from './build.service';
import { TouchService } from '../touch/touch.service';
import {
  CreateBuildInput,
  UpdateBuildInput,
  ChangeBuildPermissionInput,
  Permission,
  Build,
} from '../graphql';
import { CurrentUserId } from 'src/auth/decorators/currentUserId-decorator';
import { resolvePermission } from 'src/utils/resolvePermission';

@Resolver('Build')
export class BuildResolver {
  constructor(
    private readonly buildService: BuildService,
    private touchService: TouchService,
  ) {}

  @Mutation('createBuild')
  create(
    @Args('createBuildInput') createBuildInput: CreateBuildInput,
    @CurrentUserId() userId: string,
  ) {
    return this.buildService.create(createBuildInput, userId);
  }

  @Query('builds')
  findAll() {
    return this.buildService.findAll();
  }

  @Query('build')
  findOne(@Args('id') id: string) {
    return this.buildService.findOne(id);
  }

  @Mutation('updateBuild')
  update(
    @Args('updateBuildInput') updateBuildInput: UpdateBuildInput,
    @CurrentUserId() userId: string,
    permission: Permission,
  ) {
    if (!resolvePermission(permission, Permission.MANAGER)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    try {
      return this.buildService.update(updateBuildInput, userId);
    } catch (err) {
      throw new Error('Something has gone wrong with your update');
    }
  }

  @Mutation('removeBuild')
  remove(@Args('buildId') buildId: string, permission: Permission) {
    if (!resolvePermission(permission, Permission.OWNER)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    return this.buildService.remove(buildId);
  }

  @Mutation('changeBuildPermission')
  changeBuildPermission(
    @Args('changeBuildPermissionInput')
    changeBuildPermissionInput: ChangeBuildPermissionInput,
  ) {
    if (
      !resolvePermission(
        changeBuildPermissionInput.userPermission,
        changeBuildPermissionInput.desiredPermission,
      )
    ) {
      throw new Error('You do not have permission to do that, Dave');
    }
    try {
      return this.buildService.changeBuildPermission(
        changeBuildPermissionInput,
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Mutation('deleteBuildPermission')
  deleteBuildPermission(
    @Args('changeBuildPermissionInput')
    changeBuildPermissionInput: ChangeBuildPermissionInput,
  ) {
    if (
      !resolvePermission(
        changeBuildPermissionInput.userPermission,
        changeBuildPermissionInput.desiredPermission,
      )
    ) {
      throw new Error('You do not have permission to do that, Dave');
    }
    try {
      return this.buildService.deleteBuildPermission(
        changeBuildPermissionInput.userId,
        changeBuildPermissionInput.buildId,
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @ResolveField('touches')
  async touches(@Parent() build: Build) {
    return this.touchService.touches(build.id);
  }
}
