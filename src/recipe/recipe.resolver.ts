import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RecipeService } from './recipe.service';
import { CreateRecipeInput } from './dto/create-recipe.input';
import { UpdateRecipeInput } from './dto/update-recipe.input';

@Resolver('Recipe')
export class RecipeResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @Mutation('createRecipe')
  create(@Args('createRecipeInput') createRecipeInput: CreateRecipeInput) {
    return this.recipeService.create(createRecipeInput);
  }

  @Query('recipe')
  findAll() {
    return this.recipeService.findAll();
  }

  @Query('recipe')
  findOne(@Args('id') id: number) {
    return this.recipeService.findOne(id);
  }

  @Mutation('updateRecipe')
  update(@Args('updateRecipeInput') updateRecipeInput: UpdateRecipeInput) {
    return this.recipeService.update(updateRecipeInput.id, updateRecipeInput);
  }

  @Mutation('removeRecipe')
  remove(@Args('id') id: number) {
    return this.recipeService.remove(id);
  }
}
