import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RecipeBookService } from './recipe-book.service';
import { UserService } from '../user/user.service';

import { resolvePermission } from '../utils/resolvePermission';
import { CurrentUserId } from '../auth/decorators/currentUserId-decorator';
import { Permission, RecipeBook } from '../graphql';
import { Public } from '../auth/decorators/public-decorators';

@Resolver('RecipeBook')
export class RecipeBookResolver {
  constructor(
    private readonly recipeBookService: RecipeBookService,
    private readonly userService: UserService,
  ) {}

  @Mutation('createRecipeBook')
  create(
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('isPublic') isPublic: boolean,
    @CurrentUserId() userId: string,
  ) {
    return this.recipeBookService.create({
      name,
      description,
      isPublic,
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
  remove(@Args('id') id: string, @Args('permission') permission: Permission) {
    if (!resolvePermission(permission, Permission.OWNER)) {
      throw new Error('You do not have permission to do that, Dave');
    }
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
    @Args('recipeBookId') recipeBookId: string,
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
    @Args('permission') permission: Permission,
  ) {
    if (!resolvePermission(permission, Permission.MANAGER)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    return this.recipeBookService.removeRecipeBookPermission({
      userId,
      recipeBookId,
    });
  }

  @Query('findFolloweddUsersBookPermission')
  async findFolloweddUsersBookPermission(
    @CurrentUserId() userId: string,
    @Args('recipeBookId') recipeBookId: string,
  ) {
    return await this.recipeBookService.findFolloweddUsersBookPermission({
      userId,
      recipeBookId,
    });
  }

  @Public()
  @Query('publicBook')
  async publicBook(@Args('name') name: string) {
    return await this.recipeBookService.publicBook(name);
  }

  @Public()
  @Query('publicBookList')
  async publicBookList() {
    return await this.recipeBookService.allBooks({
      where: { isPublic: true },
      orderBy: { name: 'asc' },
    });
  }

  @Public()
  @Query('publicBooks')
  async publicBooks(@Args('skip') skip: number, @Args('take') take: number) {
    return await this.recipeBookService.publicBooks(skip, take);
  }

  @Query('book')
  async book(@Args('name') name: string, @CurrentUserId() userId: string) {
    return await this.recipeBookService.findOne(name, userId);
  }

  @Query('userBookList')
  async userBookList(@CurrentUserId() userId: string) {
    return await this.recipeBookService.allBooks({
      where: { recipeBookUser: { some: { userId } } },
      orderBy: { name: 'asc' },
    });
  }

  @Query('userBooks')
  async userBooks(
    @Args('skip') skip: number,
    @Args('take') take: number,
    @CurrentUserId() userId: string,
  ) {
    return await this.recipeBookService.userBooks(skip, take, userId);
  }

  @Query('allBookList')
  async allBookList(@CurrentUserId() userId: string) {
    return await this.recipeBookService.allBooks({
      where: {
        OR: [{ recipeBookUser: { some: { userId } } }, { isPublic: true }],
      },
      orderBy: { name: 'asc' },
    });
  }

  @ResolveField('userBuild')
  async userBuild(
    @Parent() recipeBook: RecipeBook,
    @CurrentUserId() userId: string,
  ) {
    return await this.recipeBookService.build(recipeBook.id, userId);
  }
  @ResolveField('publicBuild')
  async publicBuild(@Parent() recipeBook: RecipeBook) {
    return await this.recipeBookService.publicBuild(recipeBook.id);
  }

  @ResolveField('createdBy')
  async createdBy(@Parent() recipeBook: RecipeBook) {
    return await this.userService.findOne(recipeBook.createdById);
  }
}
