import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RecipeBookService } from './recipe-book.service';
import { BuildService } from '../build/build.service';

import { resolvePermission } from 'src/utils/resolvePermission';
import { CurrentUserId } from 'src/auth/decorators/currentUserId-decorator';
import { Permission, RecipeBook } from 'src/graphql';

@Resolver('RecipeBook')
export class RecipeBookResolver {
  constructor(
    private readonly recipeBookService: RecipeBookService,
    private readonly buildService: BuildService,
  ) {}

  @Mutation('createRecipeBook')
  create(
    @Args('name') name: string,
    @Args('description') description: string,
    @CurrentUserId() userId: string,
  ) {
    return this.recipeBookService.create({
      name,
      description,
      userId,
    });
  }

  @Mutation('updateRecipeBook')
  update(
    @Args('id') id: string,
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('permission') permission: Permission,
  ) {
    if (!resolvePermission(permission, Permission.MANAGER)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    return this.recipeBookService.update({
      id,
      name,
      description,
    });
  }

  @Mutation('removeRecipeBook')
  remove(@Args('id') id: string) {
    return this.recipeBookService.remove(id);
  }

  @Mutation('addBuildToRecipeBook')
  addBuildToRecipeBook(
    @Args('buildId') buildId: string,
    @Args('recipeBookId') recipeBookId: string,
    @Args('bookPermission') bookPermission: Permission,
    @Args('buildPermission') buildPermission: Permission,
  ) {
    if (!resolvePermission(bookPermission, Permission.VIEW)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    if (!resolvePermission(buildPermission, Permission.MANAGER)) {
      throw new Error('You do not have permission to do that, Dave-o');
    }
    return this.recipeBookService.addBuildToRecipeBook({
      buildId,
      recipeBookId,
    });
  }

  @Mutation('removeBuildFromRecipeBook')
  removeBuildFromRecipeBook(
    @Args('buildId') buildId: string,
    @Args('recipeBookId') recipeBookId: string,
    @Args('bookPermission') bookPermission: Permission,
  ) {
    if (!resolvePermission(bookPermission, Permission.MANAGER)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    return this.recipeBookService.removeBuildFromRecipeBook({
      buildId,
      recipeBookId,
    });
  }

  @Mutation('changeRecipeBookPermission')
  changeRecipeBookPermission(
    @Args('userId') userId: string,
    @Args('recipeBookId') recipeBookId,
    @Args('userPermission') userPermission: Permission,
    @Args('desiredPermission') desiredPermission: Permission,
  ) {
    if (!resolvePermission(userPermission, desiredPermission)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    try {
      return this.recipeBookService.changeRecipeBookPermission({
        userId,
        recipeBookId,
        permission: desiredPermission,
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Mutation('removeRecipeBookPermission')
  removeRecipeBookPermission(
    @Args('userId') userId: string,
    @Args('recipeBookId') recipeBookId,
    @Args('userPermission') userPermission: Permission,
  ) {
    if (!resolvePermission(userPermission, Permission.OWNER)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    return this.recipeBookService.removeRecipeBookPermission({
      userId,
      recipeBookId,
    });
  }

  @Query('userRecipeBooks')
  async userRecipeBooks(@CurrentUserId() userId: string) {
    const res = await this.recipeBookService.userRecipeBooks(userId);

    return res;
  }

  @Query('recipeBook')
  async recipeBook(@Args('name') name: string) {
    console.log(name);
    return await this.recipeBookService.recipeBook(name);
  }

  @ResolveField('build')
  async build(
    @Parent() recipeBook: RecipeBook,
    @CurrentUserId() userId: string,
  ) {
    return await this.recipeBookService.build(recipeBook.id, userId);
  }
}
