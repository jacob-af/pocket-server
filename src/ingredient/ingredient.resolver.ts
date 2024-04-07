import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { IngredientService } from './ingredient.service';
import {
  CreateIngredientInput,
  UpdateIngredientInput,
  Ingredient,
} from 'src/graphql';

@Resolver('Ingredient')
export class IngredientResolver {
  constructor(private readonly ingredientService: IngredientService) {}

  @Mutation('createIngredient')
  create(
    @Args('createIngredientInput') createIngredientInput: CreateIngredientInput,
  ): Promise<Ingredient> {
    return this.ingredientService.create(createIngredientInput);
  }

  @Query('ingredients')
  findAll() {
    return this.ingredientService.findAll();
  }

  @Query('ingredient')
  findOne(@Args('id') id: string) {
    return this.ingredientService.findOne(id);
  }

  @Mutation('updateIngredient')
  update(
    @Args('updateIngredientInput') updateIngredientInput: UpdateIngredientInput,
  ) {
    return this.ingredientService.update(updateIngredientInput);
  }

  @Mutation('removeIngredient')
  remove(@Args('id') id: string) {
    return this.ingredientService.remove(id);
  }
}
