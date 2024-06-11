import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { StockService } from '../stock/stock.service';
import { TouchInput } from '../graphql';
import { TouchService } from './touch.service';
import { UnitService } from '../unit/unit.service';

describe('TouchService', () => {
  let service: TouchService;
  let prisma: PrismaService;
  let stockService: StockService;
  let unitService: UnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TouchService,
        {
          provide: PrismaService,
          useValue: {
            touch: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: StockService,
          useValue: {
            findOne: jest.fn(),
            pricePerOunce: jest.fn(),
          },
        },
        {
          provide: UnitService,
          useValue: {
            convertUnits: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TouchService>(TouchService);
    prisma = module.get<PrismaService>(PrismaService);
    stockService = module.get<StockService>(StockService);
    unitService = module.get<UnitService>(UnitService);
  });

  describe('createTouchArray', () => {
    it('should create an array of touches', async () => {
      const buildId = 'some-build-id';
      const version = 1;
      const touchArray: TouchInput[] = [
        {
          ingredient: { name: 'ingredient1' },
          amount: 100,
          unit: { abbreviation: 'kg' },
        },
        {
          ingredient: { name: 'ingredient2' },
          amount: 200,
          unit: { abbreviation: 'g' },
        },
      ];

      const createdTouch = {
        id: 'some-id',
        buildId,
        order: expect.any(Number),
        amount: expect.any(Number),
        ingredientName: expect.any(String),
        version,
        unitAbb: expect.any(String),
      };

      prisma.touch.create = jest
        .fn()
        .mockResolvedValueOnce(createdTouch)
        .mockResolvedValueOnce(createdTouch);

      const result = await service.createTouchArray(
        buildId,
        touchArray,
        version,
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject(createdTouch);
      expect(result[1]).toMatchObject(createdTouch);

      expect(prisma.touch.create).toHaveBeenCalledTimes(2);
      expect(prisma.touch.create).toHaveBeenCalledWith({
        data: {
          build: { connect: { id: buildId } },
          order: 0,
          ingredient: { connect: { name: 'ingredient1' } },
          amount: 100,
          unit: { connect: { abbreviation: 'kg' } },
          version,
        },
      });
      expect(prisma.touch.create).toHaveBeenCalledWith({
        data: {
          build: { connect: { id: buildId } },
          order: 1,
          ingredient: { connect: { name: 'ingredient2' } },
          amount: 200,
          unit: { connect: { abbreviation: 'g' } },
          version,
        },
      });
    });

    it('should return an empty array when touchArray is empty', async () => {
      const buildId = 'some-build-id';
      const version = 1;
      const touchArray: TouchInput[] = [];

      const result = await service.createTouchArray(
        buildId,
        touchArray,
        version,
      );

      expect(result).toEqual([]);
      expect(prisma.touch.create).not.toHaveBeenCalled();
    });

    it('should handle errors when buildId is invalid', async () => {
      const buildId = 'invalid-build-id';
      const version = 1;
      const touchArray: TouchInput[] = [
        {
          ingredient: { name: 'ingredient1' },
          amount: 100,
          unit: { abbreviation: 'kg' },
        },
      ];

      prisma.touch.create = jest
        .fn()
        .mockRejectedValue(new Error('Invalid buildId'));

      await expect(
        service.createTouchArray(buildId, touchArray, version),
      ).rejects.toThrow('Invalid buildId');

      expect(prisma.touch.create).toHaveBeenCalledTimes(1);
      expect(prisma.touch.create).toHaveBeenCalledWith({
        data: {
          build: { connect: { id: buildId } },
          order: 0,
          ingredient: { connect: { name: 'ingredient1' } },
          amount: 100,
          unit: { connect: { abbreviation: 'kg' } },
          version,
        },
      });
    });
  });

  describe('touch', () => {
    it('should return a list of touches for a given buildId', async () => {
      const buildId = 'some-build-id';
      const touches = [
        {
          id: 'touch1',
          buildId,
          order: 0,
          amount: 100,
          unitAbb: 'kg',
          ingredientName: 'ingredient1',
          version: 1,
        },
        {
          id: 'touch2',
          buildId,
          order: 1,
          amount: 200,
          unitAbb: 'g',
          ingredientName: 'ingredient2',
          version: 1,
        },
      ];

      prisma.touch.findMany = jest.fn().mockResolvedValue(touches);

      const result = await service.touch(buildId);

      expect(result).toEqual(touches);
      expect(prisma.touch.findMany).toHaveBeenCalledWith({
        where: { buildId },
        orderBy: { order: 'asc' },
      });
    });

    it('should return an empty array if no touches are found', async () => {
      const buildId = 'some-build-id';

      prisma.touch.findMany = jest.fn().mockResolvedValue([]);

      const result = await service.touch(buildId);

      expect(result).toEqual([]);
      expect(prisma.touch.findMany).toHaveBeenCalledWith({
        where: { buildId },
        orderBy: { order: 'asc' },
      });
    });

    it('should handle errors properly', async () => {
      const buildId = 'invalid-build-id';

      prisma.touch.findMany = jest
        .fn()
        .mockRejectedValue(new Error('Invalid buildId'));

      await expect(service.touch(buildId)).rejects.toThrow('Invalid buildId');

      expect(prisma.touch.findMany).toHaveBeenCalledWith({
        where: { buildId },
        orderBy: { order: 'asc' },
      });
    });
  });

  describe('touchWithCost', () => {
    it('should return touches with cost for a given buildId and inventoryId', async () => {
      const buildId = 'some-build-id';
      const inventoryId = 'some-inventory-id';
      const touches = [
        {
          id: 'touch1',
          buildId,
          order: 0,
          amount: 100,
          unit: { abbreviation: 'kg' },
          ingredient: { name: 'ingredient1' },
        },
        {
          id: 'touch2',
          buildId,
          order: 1,
          amount: 200,
          unit: { abbreviation: 'g' },
          ingredient: { name: 'ingredient2' },
        },
      ];
      const touchesWithCost = [
        { ...touches[0], cost: 10 },
        { ...touches[1], cost: 20 },
      ];

      jest.spyOn(service, 'costTouchArray').mockResolvedValue(touchesWithCost);
      (prisma.touch.findMany as jest.Mock).mockResolvedValue(touches);

      const result = await service.touchWithCost(buildId, inventoryId);

      expect(result).toEqual(touchesWithCost);
      expect(prisma.touch.findMany).toHaveBeenCalledWith({
        where: { buildId },
        orderBy: { order: 'asc' },
        include: {
          ingredient: true,
          unit: true,
        },
      });
      expect(service.costTouchArray).toHaveBeenCalledWith(touches, inventoryId);
    });

    it('should handle errors when fetching touches', async () => {
      const buildId = 'some-build-id';
      const inventoryId = 'some-inventory-id';

      jest
        .spyOn(prisma.touch, 'findMany')
        .mockRejectedValue(new Error('Failed to fetch touches'));

      await expect(service.touchWithCost(buildId, inventoryId)).rejects.toThrow(
        'Failed to fetch touches',
      );
      expect(prisma.touch.findMany).toHaveBeenCalledWith({
        where: { buildId },
        orderBy: { order: 'asc' },
        include: {
          ingredient: true,
          unit: true,
        },
      });
    });
  });

  describe('costTouchArray', () => {
    it('should return touches with calculated costs', async () => {
      const inventoryId = 'some-inventory-id';
      const touches = [
        {
          id: 'touch1',
          amount: 100,
          unit: { abbreviation: 'kg' },
          ingredient: { name: 'ingredient1' },
        },
        {
          id: 'touch2',
          amount: 200,
          unit: { abbreviation: 'g' },
          ingredient: { name: 'ingredient2' },
        },
      ];
      const stock1 = { id: 'stock1', ingredientName: 'ingredient1' };
      const stock2 = { id: 'stock2', ingredientName: 'ingredient2' };
      const ppo1 = 1;
      const ppo2 = 2;
      const convertedAmount1 = 3;
      const convertedAmount2 = 4;

      stockService.findOne = jest
        .fn()
        .mockResolvedValueOnce(stock1)
        .mockResolvedValueOnce(stock2);
      stockService.pricePerOunce = jest
        .fn()
        .mockResolvedValueOnce(ppo1)
        .mockResolvedValueOnce(ppo2);
      unitService.convertUnits = jest
        .fn()
        .mockResolvedValueOnce({ convertedAmount: convertedAmount1 })
        .mockResolvedValueOnce({ convertedAmount: convertedAmount2 });

      const result = await service.costTouchArray(touches, inventoryId);

      expect(result).toEqual([
        { ...touches[0], cost: ppo1 * convertedAmount1 },
        { ...touches[1], cost: ppo2 * convertedAmount2 },
      ]);

      expect(stockService.findOne).toHaveBeenCalledTimes(2);
      expect(stockService.pricePerOunce).toHaveBeenCalledTimes(2);
      expect(unitService.convertUnits).toHaveBeenCalledTimes(2);
    });

    it('should handle missing stock and errors gracefully', async () => {
      const inventoryId = 'some-inventory-id';
      const touches = [
        {
          id: 'touch1',
          amount: 100,
          unit: { abbreviation: 'kg' },
          ingredient: { name: 'ingredient1' },
        },
        {
          id: 'touch2',
          amount: 200,
          unit: { abbreviation: 'g' },
          ingredient: { name: 'ingredient2' },
        },
      ];

      stockService.findOne = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockRejectedValueOnce(new Error('Failed to fetch stock'));
      stockService.pricePerOunce = jest.fn();
      unitService.convertUnits = jest.fn();

      const result = await service.costTouchArray(touches, inventoryId);

      expect(result).toEqual([
        { ...touches[0], cost: 0 },
        { ...touches[1], cost: 0 },
      ]);

      expect(stockService.findOne).toHaveBeenCalledTimes(2);
      expect(stockService.pricePerOunce).not.toHaveBeenCalled();
      expect(unitService.convertUnits).not.toHaveBeenCalled();
    });
  });
});
