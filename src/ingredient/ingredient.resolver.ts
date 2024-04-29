import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { IngredientService } from './ingredient.service';
import {
  CreateIngredientInput,
  UpdateIngredientInput,
  Ingredient,
  StatusMessage,
} from '../graphql';

@Resolver('Ingredient')
export class IngredientResolver {
  constructor(private readonly ingredientService: IngredientService) {}

  @Mutation('createIngredient')
  create(
    @Args('createIngredientInput') createIngredientInput: CreateIngredientInput,
  ): Promise<Ingredient> {
    return this.ingredientService.create(createIngredientInput);
  }

  @Mutation('createManyIngredients')
  createManyIngredients(
    @Args('createManyIngredientInputs')
    createManyIngredientInputs: CreateIngredientInput[],
  ): Promise<StatusMessage> {
    return this.ingredientService.createManyIngredients(
      createManyIngredientInputs,
    );
  }

  @Query('ingredients')
  findAll() {
    return this.ingredientService.findAll();
  }

  @Query('ingredient')
  findOne(@Args('name') name: string) {
    return this.ingredientService.ingredient(name);
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
