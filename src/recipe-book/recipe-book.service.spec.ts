import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { RecipeBookService } from './recipe-book.service';

describe('RecipeBookService', () => {
  let service: RecipeBookService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeBookService],
    }).compile();

    service = module.get<RecipeBookService>(RecipeBookService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a recipe bookl', async () => {
      const createRecipeBookInput = {
        userId: 'userid',
        name: 'recipe book',
        description: 'a recipe book',
        isPublic: true, // Assuming these fields are also required
        createdAt: new Date(),
        editedAt: new Date(),
        createdById: 'userid',
        editedById: 'userid',
      };
      const result = {
        ...createRecipeBookInput,
        id: '1',
        userBuild: [],
      };
      jest.spyOn(prisma.recipeBook, 'create').mockResolvedValue(result);

      expect(await service.create(createRecipeBookInput)).toBe(result);
      expect(prisma.recipeBook.create).toHaveBeenCalledWith({
        data: createRecipeBookInput,
      });
    });
  });
});
