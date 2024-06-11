import { Test, TestingModule } from '@nestjs/testing';

import { BuildService } from './build.service';
import { PrismaService } from '../prisma/prisma.service';
import { RecipeBookService } from '../recipe-book/recipe-book.service';
import { TouchService } from '../touch/touch.service';

describe('BuildService', () => {
  let service: BuildService;
  let touchService: TouchService;
  let recipeBookService: RecipeBookService;
  let mockPrismaService: Partial<PrismaService>;

  beforeEach(async () => {
    mockPrismaService = {
      // Mock the methods used by StockService
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: TouchService, useValue: touchService },
        { provide: RecipeBookService, useValue: recipeBookService },
      ],
    }).compile();

    service = module.get<BuildService>(BuildService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
