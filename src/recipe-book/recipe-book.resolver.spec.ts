import { Test, TestingModule } from '@nestjs/testing';
import { RecipeBookResolver } from './recipe-book.resolver';
import { RecipeBookService } from './recipe-book.service';

describe('RecipeBookResolver', () => {
  let resolver: RecipeBookResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeBookResolver, RecipeBookService],
    }).compile();

    resolver = module.get<RecipeBookResolver>(RecipeBookResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
