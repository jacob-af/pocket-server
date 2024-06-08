import { Test, TestingModule } from '@nestjs/testing';

import { BuildService } from '../build/build.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { TouchResolver } from './touch.resolver';
import { TouchService } from './touch.service';

describe('TouchResolver', () => {
  let resolver: TouchResolver;

  // Mock services
  const touchServiceMock = { costTouchArray: jest.fn() }; // Mock methods as needed
  const buildServiceMock = {};
  const ingredientServiceMock = { ingredient: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TouchResolver,
        { provide: TouchService, useValue: touchServiceMock },
        { provide: BuildService, useValue: buildServiceMock },
        { provide: IngredientService, useValue: ingredientServiceMock },
      ],
    }).compile();

    resolver = module.get<TouchResolver>(TouchResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // Additional test cases can be added here
});
