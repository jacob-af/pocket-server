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
import { RecipeService } from '../recipe/recipe.service';
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
    private buildService: BuildService,
    private touchService: TouchService,
    private recipeService: RecipeService,
  ) {}

  @Mutation('createBuild')
  create(
    @Args('createBuildInput') createBuildInput: CreateBuildInput,
    @CurrentUserId() userId: string,
  ) {
    return this.buildService.create(createBuildInput, userId);
  }

  @Query('findAllBuilds')
  findAll() {
    return this.buildService.findAll();
  }

  @Query('findOneBuild')
  findOne(@Args('id') id: string) {
    return this.buildService.findOne(id);
  }

  @Query('usersBuilds')
  usersBuilds(@CurrentUserId() userId: string) {
    console.log(userId);
    return this.buildService.usersBuilds(userId);
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

  @ResolveField('touch')
  async touch(@Parent() build: Build) {
    return this.touchService.touch(build.id);
  }
  @ResolveField('recipe')
  async recipe(@Parent() build) {
    console.log(build.recipeName);
    return this.recipeService.findOne(build.recipeName);
  }
}
