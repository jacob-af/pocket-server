import { Test, TestingModule } from '@nestjs/testing';

import { BuildService } from '../build/build.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { InventoryService } from '../inventory/inventory.service';
import { StockResolver } from './stock.resolver';
import { StockService } from './stock.service';
import { UnitService } from '../unit/unit.service';

describe('StockResolver', () => {
  let resolver: StockResolver;

  // Mock services
  const stockServiceMock = {
    /* Mock methods  used in StockResolver */
    findAll: () => resolver.findAllStock,
    findOne: () => resolver.findOneStock,
  };
  const unitServiceMock = {
    /* Mock methods used in StockResolver */
  };
  const ingredientServiceMock = {
    /* Mock methods used in StockResolver */
  };
  const buildServiceMock = {
    /* Mock methods used in StockResolver */
  };
  const inventoryServiceMock = {
    /* Mock methods used in StockResolver */
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockResolver,
        { provide: StockService, useValue: stockServiceMock },
        { provide: UnitService, useValue: unitServiceMock },
        { provide: IngredientService, useValue: ingredientServiceMock },
        { provide: BuildService, useValue: buildServiceMock },
        { provide: InventoryService, useValue: inventoryServiceMock },
      ],
    }).compile();

    resolver = module.get<StockResolver>(StockResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // Additional tests can go here
  describe('findAllStock', () => {
    it('should return an array of stock items', async () => {
      const mockStocks = [{ id: '1', price: 100 }];
      stockServiceMock.findAll = jest.fn().mockResolvedValue(mockStocks);

      const result = await resolver.findAllStock();
      expect(result).toEqual(mockStocks);
      expect(stockServiceMock.findAll).toHaveBeenCalled();
    });
  });

  describe('fineOneStock', () => {
    it('should return one stock item', async () => {
      const mockStock = { id: '1', price: 100, ingredientName: 'Sugar' };
      const ingredientName = 'Sugar';
      const inventoryId = 'inv1';
      stockServiceMock.findOne = jest.fn().mockResolvedValue(mockStock);

      const result = await resolver.findOneStock(ingredientName, inventoryId);
      expect(result).toEqual(mockStock);
    });
  });
});
