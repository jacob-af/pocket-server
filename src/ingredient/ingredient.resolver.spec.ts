import { Test, TestingModule } from '@nestjs/testing';
import { IngredientResolver } from './ingredient.resolver';
import { IngredientService } from './ingredient.service';

describe('IngredientResolver', () => {
  let resolver: IngredientResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngredientResolver, IngredientService],
    }).compile();

    resolver = module.get<IngredientResolver>(IngredientResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
