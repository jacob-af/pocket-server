import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { RecipeBookService } from './recipe-book.service';

describe('RecipeBookService', () => {
  let service: RecipeBookService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      recipeBook: {
        create: jest.fn().mockImplementation((data) => ({
          ...data,
          id: '1',
          userBuild: [],
        })),
      },
      recipeBookUser: {
        upsert: jest.fn().mockImplementation((data) => ({
          ...data,
          id: '1',
        })),
      },
      // Add other properties and methods as required by your service
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeBookService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<RecipeBookService>(RecipeBookService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a recipe book', async () => {
      const createRecipeBookInput = {
        name: 'recipe book',
        description: 'a recipe book',
        isPublic: true,
        createdBy: { connect: { id: 'userid' } },
        editedBy: { connect: { id: 'userid' } },
      };

      const result = {
        ...createRecipeBookInput,
        id: '1',
        userBuild: [],
        createdById: 'userid',
        editedById: 'userid',
        createdAt: new Date(),
        editedAt: new Date(),
      };
      jest.spyOn(prisma.recipeBook, 'create').mockResolvedValue(result);

      await expect(
        service.create({
          name: 'recipe book',
          description: 'a recipe book',
          isPublic: true,
          userId: 'userid',
        }),
      ).resolves.toEqual(result);

      expect(prisma.recipeBook.create).toHaveBeenCalledWith({
        data: {
          name: 'recipe book',
          description: 'a recipe book',
          isPublic: true,
          createdBy: { connect: { id: 'userid' } },
          editedBy: { connect: { id: 'userid' } },
        },
      });
    });
  });
});
