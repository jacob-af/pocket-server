import { Test, TestingModule } from '@nestjs/testing';

import { BuildService } from './build.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BuildService', () => {
  let service: BuildService;
  let mockPrismaService: Partial<PrismaService>;

  beforeEach(async () => {
    mockPrismaService = {
      // Mock the methods used by StockService
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BuildService>(BuildService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
