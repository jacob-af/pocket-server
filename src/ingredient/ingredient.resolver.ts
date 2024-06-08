import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { IngredientService } from './ingredient.service';
import {
  CreateIngredientInput,
  UpdateIngredientInput,
  Ingredient,
  StatusMessage,
} from '../graphql';
import { Public } from '../auth/decorators/public-decorators';
import { StockService } from '../stock/stock.service';

@Resolver('Ingredient')
export class IngredientResolver {
  constructor(
    private readonly ingredientService: IngredientService,
    private readonly stockService: StockService,
  ) {}

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

  @Public()
  @Query('ingredients')
  findAll() {
    return this.ingredientService.findAll();
  }

  @Query('ingredient')
  findOne(@Args('name') name: string) {
    return this.ingredientService.ingredient(name);
  }

  @Query('stockList')
  async stockList(@Args('inventoryId') inventoryId: string) {
    return await this.ingredientService.stockList(inventoryId);
  }

  @Mutation('updateIngredient')
  update(
    @Args('updateIngredientInput') updateIngredientInput: UpdateIngredientInput,
  ) {
    return this.ingredientService.update(updateIngredientInput);
  }

  @Mutation('removeIngredient')
  async remove(@Args('id') id: string): Promise<StatusMessage> {
    return await this.ingredientService.remove(id);
  }

  @ResolveField('pricePerOunce')
  async pricePerOunce(
    @Parent() ingredient: Ingredient,
    @Args('inventoryId') inventoryId: string,
  ) {
    const stock = await this.stockService.findOne(ingredient.name, inventoryId);

    return this.stockService.pricePerOunce(stock);
  }
}
