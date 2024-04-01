import { CreateRecipeInput } from './create-recipe.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateRecipeInput extends PartialType(CreateRecipeInput) {
  id: number;
}
