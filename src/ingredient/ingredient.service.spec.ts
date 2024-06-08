import {
  CreateIngredientInput,
  Ingredient,
  StatusMessage,
  UpdateIngredientInput,
} from '../graphql';
import { Test, TestingModule } from '@nestjs/testing';

import { IngredientService } from './ingredient.service';
import { PrismaService } from '../prisma/prisma.service';

describe('IngredientService', () => {
  let service: IngredientService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientService,
        {
          provide: PrismaService,
          useValue: {
            ingredient: {
              create: jest.fn(),
              findUnique: jest.fn(),
              upsert: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            stock: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<IngredientService>(IngredientService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an ingredient', async () => {
      const createIngredientInput: CreateIngredientInput = {
        name: 'Sugar',
        description: 'Sweetener',
        parent: 'root',
      };
      const result: Ingredient = {
        id: '1',
        name: 'Sugar',
        description: 'Sweetener',
      };
      jest.spyOn(prisma.ingredient, 'create').mockResolvedValue(result);

      expect(await service.create(createIngredientInput)).toBe(result);
      expect(prisma.ingredient.create).toHaveBeenCalledWith({
        data: createIngredientInput,
      });
    });

    it('should throw an error if the ingredient name already exists', async () => {
      const createIngredientInput = {
        name: 'Lemon',
        description: 'A sour fruit.',
      };

      const prismaError = {
        code: 'P2002',
        meta: {
          target: ['name'],
        },
      };

      jest.spyOn(prisma.ingredient, 'create').mockRejectedValue(prismaError);

      try {
        await service.create(createIngredientInput);
        fail(
          'The service should throw an error for duplicate ingredient names',
        );
      } catch (e) {
        expect(e).toMatchObject(prismaError);
      }
    });
  });

  describe('createManyIngredients', () => {
    it('should create multiple ingredients', async () => {
      const createManyIngredientInputs: CreateIngredientInput[] = [
        { name: 'Sugar', description: 'Sweetener', parent: 'root' },
        { name: 'Salt', description: 'Salty', parent: '' },
      ];
      const result1: Ingredient = {
        id: '1',
        name: 'Sugar',
        description: 'Sweetener',
      };
      const result2: Ingredient = {
        id: '2',
        name: 'Salt',
        description: 'Salty',
      };
      jest.spyOn(prisma.ingredient, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.ingredient, 'create').mockResolvedValue(result1);
      jest.spyOn(prisma.ingredient, 'upsert').mockResolvedValue(result2);

      const statusMessage: StatusMessage = await service.createManyIngredients(
        createManyIngredientInputs,
      );

      expect(statusMessage.message).toContain('Successfully added');
    });
  });

  describe('findAll', () => {
    it('should find all ingredients', async () => {
      const result: Ingredient[] = [
        { id: '1', name: 'Sugar', description: 'Sweetener' },
      ];
      jest.spyOn(prisma.ingredient, 'findMany').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
      expect(prisma.ingredient.findMany).toHaveBeenCalled();
    });
  });

  describe('ingredient', () => {
    it('should find an ingredient by name', async () => {
      const result: Ingredient = {
        id: '1',
        name: 'Sugar',
        description: 'Sweetener',
      };
      jest.spyOn(prisma.ingredient, 'findUnique').mockResolvedValue(result);

      expect(await service.ingredient('Sugar')).toBe(result);
      expect(prisma.ingredient.findUnique).toHaveBeenCalledWith({
        where: { name: 'Sugar' },
      });
    });
  });

  describe('stockList', () => {
    it('should find stock list by inventoryId', async () => {
      const stock = [
        {
          price: 10,
          amount: 100,
          createdAt: new Date(),
          editedAt: new Date(),
          ingredientName: 'Sugar',
          unitAbb: 'oz',
          buildId: 'build-123',
          inventoryId: '123',
          ingredient: { id: '1', name: 'Sugar', description: 'Sweetener' },
        },
      ];
      jest.spyOn(prisma.stock, 'findMany').mockResolvedValue(stock);

      expect(await service.stockList('123')).toEqual([stock[0].ingredient]);
      expect(prisma.stock.findMany).toHaveBeenCalledWith({
        where: { inventoryId: '123' },
        include: { ingredient: true },
        orderBy: {
          ingredient: { name: 'asc' },
        },
      });
    });
  });

  describe('update', () => {
    it('should update an ingredient', async () => {
      const updateIngredientInput: UpdateIngredientInput = {
        id: '1',
        name: 'Sugar',
        description: 'Sweetener',
        parent: 'root',
      };
      const result: Ingredient = {
        id: '1',
        name: 'Sugar',
        description: 'Sweetener',
      };
      jest.spyOn(prisma.ingredient, 'update').mockResolvedValue(result);

      expect(await service.update(updateIngredientInput)).toBe(result);
      expect(prisma.ingredient.update).toHaveBeenCalledWith({
        where: { id: updateIngredientInput.id },
        data: updateIngredientInput,
      });
    });
  });

  describe('remove', () => {
    it('should remove an ingredient and return a status message', async () => {
      const id = '1';
      jest.spyOn(prisma.ingredient, 'delete').mockResolvedValue({} as any);

      const result = await service.remove(id);

      expect(result.message).toBe(
        `You have deleted the ingredient with ID ${id}`,
      );
      expect(prisma.ingredient.delete).toHaveBeenCalledWith({ where: { id } });
    });

    it('should handle errors during removal', async () => {
      const id = '1';
      const errorMessage = 'Ingredient not found';
      jest
        .spyOn(prisma.ingredient, 'delete')
        .mockRejectedValue(new Error(errorMessage));

      const result = await service.remove(id);

      expect(result.message).toBe(errorMessage);
    });
  });
});
