import { Test, TestingModule } from '@nestjs/testing';

import { BuildService } from '../build/build.service'; // Assuming this is the correct path
import { PrismaService } from '../prisma/prisma.service';
import { RecipeResolver } from './recipe.resolver';
import { RecipeService } from './recipe.service';
import { UserService } from '../user/user.service';

describe('RecipeResolver', () => {
  let resolver: RecipeResolver;
  let mockPrismaService: Partial<PrismaService>;

  beforeEach(async () => {
    // Mock implementations or values can be added here
    mockPrismaService = {
      // Mock the methods used by StockService
    };

    const mockBuildService = {
      // Add other methods as required
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeResolver,
        RecipeService,
        { provide: BuildService, useValue: mockBuildService },
        { provide: PrismaService, useValue: mockPrismaService },
        UserService, // Assuming UserService is provided correctly
      ],
    }).compile();

    resolver = module.get<RecipeResolver>(RecipeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // Additional tests...
});
