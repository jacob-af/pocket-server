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
import {
  CreateRecipeInput,
  UpdateRecipeInput,
  Recipe,
  StatusMessage,
} from '../graphql';
import { CurrentUserId } from '../auth/decorators/currentUserId-decorator';

@Resolver('Recipe')
export class RecipeResolver {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly buildService: BuildService,
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
    return this.recipeService.findOne(name);
  }

  @Mutation('updateRecipe')
  update(
    @Args('updateRecipeInput') updateRecipeInput: UpdateRecipeInput,
    @CurrentUserId() userId: string,
  ) {
    return this.recipeService.update(updateRecipeInput, userId);
  }

  @Mutation('removeRecipe')
  remove(@Args('id') id: string) {
    return this.recipeService.remove(id);
  }

  @ResolveField('build')
  async build(@Parent() recipe: Recipe) {
    return this.buildService.findAll({ recipeName: recipe.name });
  }
}
