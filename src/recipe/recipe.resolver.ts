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
} from 'src/graphql';
import { CurrentUserId } from 'src/auth/decorators/currentUserId-decorator';

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

  @Query('recipe')
  findAll() {
    return this.recipeService.findAll();
  }

  @Query('recipe')
  findOne(@Args('id') id: string) {
    return this.recipeService.findOne(id);
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

  @ResolveField('builds')
  async builds(@Parent() recipe: Recipe) {
    return this.buildService.findAll({ id: recipe.id });
  }
}
