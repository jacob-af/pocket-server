import {
  Resolver,
  // Query,
  // Mutation,
  // Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TouchService } from './touch.service';
import { BuildService } from 'src/build/build.service';
import { IngredientService } from 'src/ingredient/ingredient.service';

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
}
