import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RecipeBookService } from './recipe-book.service';

import { resolvePermission } from 'src/utils/resolvePermission';
import { CurrentUserId } from 'src/auth/decorators/currentUserId-decorator';
import { Permission } from 'src/graphql';

@Resolver('RecipeBook')
export class RecipeBookResolver {
  constructor(private readonly recipeBookService: RecipeBookService) {}

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
      throw new Error('You do not have permission to do that, Dave');
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
  userRecipeBooks(@CurrentUserId() userId: string) {
    return this.recipeBookService.userRecipeBooks(userId);
  }
}
