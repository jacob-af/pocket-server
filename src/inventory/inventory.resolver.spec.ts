import { Test, TestingModule } from '@nestjs/testing';

import { InventoryResolver } from './inventory.resolver';
import { InventoryService } from './inventory.service';
import { StockService } from '../stock/stock.service';

describe('InventoryResolver', () => {
  let resolver: InventoryResolver;

  const inventoryServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    userInventory: jest.fn(),
    create: jest.fn(),
    changePermission: jest.fn(),
  };
  const stockServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryResolver,
        { provide: InventoryService, useValue: inventoryServiceMock },
        { provide: StockService, useValue: stockServiceMock },
      ],
    }).compile();

    resolver = module.get<InventoryResolver>(InventoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // Additional tests can be added here
});
