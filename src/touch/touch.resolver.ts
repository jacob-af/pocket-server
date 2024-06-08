import { Resolver, ResolveField, Parent, Query, Args } from '@nestjs/graphql';
import { TouchService } from './touch.service';
import { BuildService } from '../build/build.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { TouchInput } from '../graphql';

@Resolver('Touch')
export class TouchResolver {
  constructor(
    private readonly touchService: TouchService,
    private readonly buildService: BuildService,
    private readonly ingredientService: IngredientService,
  ) {}

  @Query('costTouchArray')
  costTouchArray(
    @Args('touches') touches: TouchInput[],
    @Args('inventoryId') inventoryId: string,
  ) {
    console.log('hello');
    return this.touchService.costTouchArray(touches, inventoryId);
  }

  @ResolveField('ingredient')
  async ingredient(@Parent() touch) {
    return this.ingredientService.ingredient(touch.ingredientName);
  }

  @ResolveField('unit')
  async unit(@Parent() touch) {
    return this.touchService.Unit(touch.unitAbb);
  }
}
