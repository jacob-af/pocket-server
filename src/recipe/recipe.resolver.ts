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
} from '../graphql';
import { CurrentUserId } from '../auth/decorators/currentUserId-decorator';
import { resolvePermission } from 'src/utils/resolvePermission';

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

  @Query('recipes')
  findAll() {
    return this.recipeService.findAll();
  }

  @Query('recipeList')
  recipeList() {
    return this.recipeService.recipeList();
  }

  @Query('recipe')
  findOne(@Args('name') name: string) {
    console.log(name);
    return this.recipeService.findOne(name);
  }

  @Query('userRecipe')
  userRecipe() {
    return this.recipeService.userRecipe();
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
  remove(@Args('id') id: string, permission: Permission) {
    if (!resolvePermission(permission, Permission.MANAGER)) {
      throw new Error('You do not have permission to do that, Dave');
    }
    return this.recipeService.remove(id);
  }

  @ResolveField('build')
  async build(@Parent() recipe: Recipe) {
    return this.buildService.findAll({ recipeName: recipe.name });
  }

  @ResolveField('userBuild')
  async userBuild(@Parent() recipe: Recipe, @CurrentUserId() userId: string) {
    return this.buildService.userBuilds2({ recipeName: recipe.name, userId });
  }

  @ResolveField('createdBy')
  async createdBy(@Parent() recipe: Recipe) {
    return this.userService.findOne(recipe.createdById);
  }
}
