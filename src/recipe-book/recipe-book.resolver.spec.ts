import { Test, TestingModule } from '@nestjs/testing';

import { RecipeBookResolver } from './recipe-book.resolver';
import { RecipeBookService } from './recipe-book.service';
import { UserService } from '../user/user.service';

describe('RecipeBookResolver', () => {
  let resolver: RecipeBookResolver;

  beforeEach(async () => {
    const mockRecipeBookService = {
      // Mock any methods used by the RecipeBookResolver
      findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Test User' }),
    };
    const mockUserService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeBookResolver,
        {
          provide: RecipeBookService,
          useValue: mockRecipeBookService,
        },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    resolver = module.get<RecipeBookResolver>(RecipeBookResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // Additional tests as needed
});
