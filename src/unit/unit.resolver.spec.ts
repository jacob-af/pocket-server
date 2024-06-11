import { Test, TestingModule } from '@nestjs/testing';

import { UnitResolver } from './unit.resolver';
import { UnitService } from './unit.service';

describe('UnitResolver', () => {
  let resolver: UnitResolver;

  const unitServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitResolver,
        UnitService,
        { provide: UnitService, useValue: unitServiceMock },
      ],
    }).compile();

    resolver = module.get<UnitResolver>(UnitResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // Additional tests as needed
});
