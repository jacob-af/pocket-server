import {
  Resolver,
  ResolveField,
  Query,
  Mutation,
  Args,
  Parent,
} from '@nestjs/graphql';
import { RecipeService } from './recipe.service';
import { BuildService } from '../build/build.service';
import { UserService } from '../user/user.service';
import {
  CreateRecipeInput,
  UpdateRecipeInput,
  Recipe,
  StatusMessage,
  Permission,
  RecipeBook,
} from '../graphql';
import { CurrentUserId } from '../auth/decorators/currentUserId-decorator';
import { resolvePermission } from 'src/utils/resolvePermission';
import { Public } from 'src/auth/decorators/public-decorators';

@Resolver('Recipe')
export class RecipeResolver {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly buildService: BuildService,
    private readonly userService: UserService,
  ) {}

  @Mutation('createRecipe')
  async create(
    @Args('createRecipeInput') createRecipeInput: CreateRecipeInput,
    @CurrentUserId() userId: string,
  ) {
    return await this.recipeService.create(createRecipeInput, userId);
  }

  @Mutation('createManyRecipes')
  createManyRecipes(
    @Args('createManyRecipeInputs')
    createManyRecipeInputs: CreateRecipeInput[],
    @CurrentUserId() userId: string,
  ): Promise<StatusMessage> {
    return this.recipeService.createManyRecipes(createManyRecipeInputs, userId);
  }

  @Mutation('updateRecipe')
  update(
    @Args('updateRecipeInput') updateRecipeInput: UpdateRecipeInput,
    @CurrentUserId() userId: string,
  ) {
    if (
      !resolvePermission(updateRecipeInput.build.permission, Permission.MANAGER)
    ) {
      throw new Error('You do not have permission to do that, Dave');
    }
    return this.recipeService.update(updateRecipeInput, userId);
  }

  @Mutation('removeRecipe')
  async remove(@Args('id') id: string, permission: Permission) {
    if (!resolvePermission(permission, Permission.MANAGER)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    return await this.recipeService.remove(id);
  }

  //Queries

  @Public()
  @Query('publicRecipe')
  async publicRecipe(@Args('name') name: string) {
    return await this.recipeService.publicRecipe(name);
  }

  @Public()
  @Query('publicRecipeList')
  async publicRecipeList() {
    return await this.recipeService.allRecipes({
      where: { build: { some: { isPublic: true } } },
      orderBy: { name: 'asc' },
    });
  }
  @Public()
  @Query('publicRecipes')
  async ublicRecipes(@Args('skip') skip: number, @Args('take') take: number) {
    return await this.recipeService.publicRecipes(skip, take);
  }

  @Query('recipe')
  async recipe(@Args('name') name: string) {
    return await this.recipeService.findOne(name);
  }

  @Query('userRecipeList')
  async userRecipeList(@CurrentUserId() userId: string) {
    return await this.recipeService.allRecipes({
      where: {
        build: { some: { buildUser: { some: { userId } } } },
      },
      orderBy: { name: 'asc' },
    });
  }

  @Query('userRecipes')
  async userRecipes(
    @Args('skip') skip: number,
    @Args('take') take: number,
    @CurrentUserId() userId: string,
  ) {
    return await this.recipeService.userRecipes(skip, take, userId);
  }

  @Public()
  @ResolveField('userBuild')
  async userBuild(@Parent() recipe: Recipe, @CurrentUserId() userId: string) {
    return this.buildService.userBuilds(recipe.name, userId);
  }

  @ResolveField('publicBuild')
  async publicBuild(@Parent() book: RecipeBook) {
    return this.buildService.publicBuilds(book.name);
  }

  @ResolveField('createdBy')
  async createdBy(@Parent() recipe: Recipe) {
    return this.userService.findOne(recipe.createdById);
  }
}
