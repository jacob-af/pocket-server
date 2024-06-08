import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { StockService } from '../stock/stock.service';
import { TouchService } from './touch.service';
import { UnitService } from '../unit/unit.service';

describe('TouchService', () => {
  let touchService: TouchService;
  let stockService: StockService;
  let unitService: UnitService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const prismaMock = {
      touch: {
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({
            ...data,
          }),
        ),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TouchService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: StockService, useValue: stockService },
        { provide: UnitService, useValue: unitService },
      ],
    }).compile();

    touchService = module.get<TouchService>(TouchService);
    stockService = module.get<StockService>(StockService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(touchService).toBeDefined();
  });

  describe('createTouchArray', () => {
    it('should create a touch array', async () => {
      const touchArray = [
        {
          ingredient: { name: 'Sugar' },
          amount: 1,
          unit: { abbreviation: 'oz' },
        },
      ];
      const buildId = '1';
      const version = 1;

      // Correctly map through your touchArray to simulate what Prisma would return
      const expectedData = touchArray.map((touch, index) => ({
        build: {}, // Mock the relationship data as well
        ingredient: {},
        unit: {},
        buildId: buildId,
        order: index,
        ingredientName: touch.ingredient.name,
        amount: touch.amount,
        unitAbb: touch.unit.abbreviation,
        version,
      }));

      // Ensuring the mock respects the Prisma-like behavior
      jest.spyOn(prisma.touch, 'create').mockImplementation();

      const results = await touchService.createTouchArray(
        buildId,
        touchArray,
        version,
      );
      await expect(results).resolves.toEqual(expectedData);
      expectedData.forEach((data) =>
        expect(prisma.touch.create).toHaveBeenCalledWith({ data }),
      );
    });
  });

  describe('costTouchArray', () => {
    it('should calculate costs accurately', async () => {
      const touches = [
        {
          id: 'touch1',
          ingredient: { name: 'Sugar' },
          amount: 2,
          unit: { abbreviation: 'kg' },
        },
      ];
      const inventoryId = 'inv1';
      jest.spyOn(stockService, 'findOne').mockResolvedValue({
        buildId: 'build1',
        price: 10,
        amount: 2,
        createdAt: new Date(),
        editedAt: new Date(),
        ingredientName: 'Sugar',
        unitAbb: 'kg',
        inventoryId: 'inv1',
      });
      jest.spyOn(stockService, 'pricePerOunce').mockResolvedValue(0.5);
      jest.spyOn(unitService, 'convertUnits').mockResolvedValue({
        convertedAmount: 70.55,
        originalAmount: 2,
        originalUnit: 'kg',
        convertedUnit: 'oz',
      });

      const result = await touchService.costTouchArray(touches, inventoryId);

      expect(stockService.findOne).toHaveBeenCalledWith('Sugar', 'inv1');
      expect(stockService.pricePerOunce).toHaveBeenCalled();
      expect(unitService.convertUnits).toHaveBeenCalledWith(2, 'kg', 'oz');
      expect(result).toEqual([{ ...touches[0], cost: 35.275 }]);
    });

    it('should handle missing stock entries', async () => {
      const touches = [
        {
          ingredient: { name: 'Unknown' },
          amount: 1,
          unit: { abbreviation: 'oz' },
        },
      ];
      const inventoryId = 'inv2';
      jest.spyOn(stockService, 'findOne').mockResolvedValue(null);

      const result = await touchService.costTouchArray(touches, inventoryId);

      expect(result[0].cost).toBe(0);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Stock not found'),
      );
    });
  });

  describe('costTouchArray Error Handling', () => {
    it('should log errors when unit conversion fails', async () => {
      const touches = [
        {
          ingredient: { name: 'Water' },
          amount: 100,
          unit: { abbreviation: 'ltr' },
        },
      ];
      jest
        .spyOn(unitService, 'convertUnits')
        .mockRejectedValue(new Error('Conversion Failed'));

      await expect(
        touchService.costTouchArray(touches, 'inv3'),
      ).resolves.toEqual([{ ...touches[0], cost: 0 }]);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to calculate cost'),
      );
    });
  });
});
