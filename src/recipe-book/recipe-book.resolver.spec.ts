import { Test, TestingModule } from '@nestjs/testing';

import { RecipeBookResolver } from './recipe-book.resolver';
import { RecipeBookService } from './recipe-book.service';
import { UserService } from '../user/user.service'; // Ensure the import path is correct

describe('RecipeBookResolver', () => {
  let resolver: RecipeBookResolver;

  beforeEach(async () => {
    // Create a mock for UserService
    const mockUserService = {
      // Mock any methods used by the RecipeBookResolver
      getUserById: jest.fn().mockResolvedValue({ id: '1', name: 'Test User' }),
      // Add other methods as necessary
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeBookResolver,
        RecipeBookService,
        { provide: UserService, useValue: mockUserService }, // Provide the mock
      ],
    }).compile();

    resolver = module.get<RecipeBookResolver>(RecipeBookResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // Additional tests as needed
});
