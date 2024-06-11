import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { ProfileService } from './profile.service';
import { RecipeBookService } from '../recipe-book/recipe-book.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let mockPrismaService: Partial<PrismaService>;
  let mockRecipeBookService: Partial<RecipeBookService>;

  beforeEach(async () => {
    mockPrismaService = {
      // Mock the methods used by StockService
    };
    mockRecipeBookService = {
      // Mock the methods used by StockService
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RecipeBookService, useValue: mockRecipeBookService },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
