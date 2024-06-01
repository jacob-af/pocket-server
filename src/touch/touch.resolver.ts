import {
  Resolver,
  // Query,
  // Mutation,
  // Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TouchService } from './touch.service';
import { BuildService } from '../build/build.service';
import { IngredientService } from '../ingredient/ingredient.service';

@Resolver('Touch')
export class TouchResolver {
  constructor(
    private readonly touchService: TouchService,
    private readonly buildService: BuildService,
    private readonly ingredientService: IngredientService,
  ) {}

  // @Query('findAll')
  // findAll() {
  //   return this.touchService.findAll();
  // }

  // @Query('touches')
  // findOne(@Args('id') id: string) {
  //   return this.touchService.findOne(id);
  // }

  @ResolveField('ingredient')
  async ingredient(@Parent() touch) {
    return this.ingredientService.ingredient(touch.ingredientName);
  }

  @ResolveField('unit')
  async unit(@Parent() touch) {
    return this.touchService.Unit(touch.unitAbb);
  }
}
