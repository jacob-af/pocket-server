import { CreateIngredientInput, UpdateIngredientInput } from '../graphql';
import { Ingredient, StatusMessage } from '../graphql';
import { Test, TestingModule } from '@nestjs/testing';

import { IngredientResolver } from './ingredient.resolver';
import { IngredientService } from './ingredient.service';
import { StockService } from '../stock/stock.service';

describe('IngredientResolver', () => {
  let resolver: IngredientResolver;
  let ingredientService: IngredientService;
  let stockService: StockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientResolver,
        {
          provide: IngredientService,
          useValue: {
            create: jest.fn(),
            createManyIngredients: jest.fn(),
            findAll: jest.fn(),
            ingredient: jest.fn(),
            stockList: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: StockService,
          useValue: {
            findOne: jest.fn(),
            pricePerOunce: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<IngredientResolver>(IngredientResolver);
    ingredientService = module.get<IngredientService>(IngredientService);
    stockService = module.get<StockService>(StockService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('create', () => {
    it('should call ingredientService.create with correct parameters', async () => {
      const input: CreateIngredientInput = {
        name: 'Sugar',
        description: 'Sweetener',
        parent: 'root',
      };
      const result: Ingredient = {
        id: '1',
        name: 'Sugar',
        description: 'Sweetener',
      };
      jest.spyOn(ingredientService, 'create').mockResolvedValue(result);

      expect(await resolver.create(input)).toBe(result);
      expect(ingredientService.create).toHaveBeenCalledWith(input);
    });
  });

  describe('createManyIngredients', () => {
    it('should call ingredientService.createManyIngredients with correct parameters', async () => {
      const inputs: CreateIngredientInput[] = [
        { name: 'Sugar', description: 'Sweetener', parent: 'root' },
      ];
      const result: StatusMessage = {
        message: 'Ingredients created successfully',
      };
      jest
        .spyOn(ingredientService, 'createManyIngredients')
        .mockResolvedValue(result);

      expect(await resolver.createManyIngredients(inputs)).toBe(result);
      expect(ingredientService.createManyIngredients).toHaveBeenCalledWith(
        inputs,
      );
    });
  });

  describe('findAll', () => {
    it('should call ingredientService.findAll', async () => {
      const result: Ingredient[] = [
        { id: '1', name: 'Sugar', description: 'Sweetener' },
      ];
      jest.spyOn(ingredientService, 'findAll').mockResolvedValue(result);

      expect(await resolver.findAll()).toBe(result);
      expect(ingredientService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call ingredientService.ingredient with correct parameters', async () => {
      const name = 'Sugar';
      const result: Ingredient = {
        id: '1',
        name: 'Sugar',
        description: 'Sweetener',
      };
      jest.spyOn(ingredientService, 'ingredient').mockResolvedValue(result);

      expect(await resolver.findOne(name)).toBe(result);
      expect(ingredientService.ingredient).toHaveBeenCalledWith(name);
    });
  });

  describe('stockList', () => {
    it('should call ingredientService.stockList with correct parameters', async () => {
      const inventoryId = '123';
      const result: Ingredient[] = [
        { id: '1', name: 'Sugar', description: 'Sweetener' },
      ];
      jest.spyOn(ingredientService, 'stockList').mockResolvedValue(result);

      expect(await resolver.stockList(inventoryId)).toBe(result);
      expect(ingredientService.stockList).toHaveBeenCalledWith(inventoryId);
    });
  });

  describe('update', () => {
    it('should call ingredientService.update with correct parameters', async () => {
      const input: UpdateIngredientInput = {
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
      jest.spyOn(ingredientService, 'update').mockResolvedValue(result);

      expect(await resolver.update(input)).toBe(result);
      expect(ingredientService.update).toHaveBeenCalledWith(input);
    });
  });

  describe('remove', () => {
    it('should call ingredientService.remove with correct parameters', async () => {
      const id = '1';
      const result: StatusMessage = {
        message: `You have deleted the ingredient with ID ${id}`,
      };
      jest.spyOn(ingredientService, 'remove').mockResolvedValue(result);

      expect(await resolver.remove(id)).toBe(result);
      expect(ingredientService.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('pricePerOunce', () => {
    it('should call stockService.findOne and stockService.pricePerOunce with correct parameters', async () => {
      const ingredient: Ingredient = {
        id: '1',
        name: 'Sugar',
        description: 'Sweetener',
      };
      const inventoryId = '123';
      const stock = {
        price: 10,
        amount: 100,
        createdAt: new Date(),
        editedAt: new Date(),
        ingredientName: 'Sugar',
        unitAbb: 'oz',
        buildId: 'build-123',
        inventoryId: '123',
      };
      jest.spyOn(stockService, 'findOne').mockResolvedValue(stock);
      jest.spyOn(stockService, 'pricePerOunce').mockResolvedValue(2.5);

      expect(await resolver.pricePerOunce(ingredient, inventoryId)).toBe(2.5);
      expect(stockService.findOne).toHaveBeenCalledWith('Sugar', inventoryId);
      expect(stockService.pricePerOunce).toHaveBeenCalledWith(stock);
    });
  });
});
