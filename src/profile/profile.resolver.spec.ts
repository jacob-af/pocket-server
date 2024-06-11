import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';
import { RecipeBookService } from '../recipe-book/recipe-book.service';

describe('ProfileResolver', () => {
  let resolver: ProfileResolver;
  let mockRecipeBookService: Partial<RecipeBookService>;
  let prisma: PrismaService;

  beforeEach(async () => {
    mockRecipeBookService = {
      // Mock the methods used by StockService
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileResolver,
        ProfileService,
        { provide: RecipeBookService, useValue: mockRecipeBookService },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    resolver = module.get<ProfileResolver>(ProfileResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
