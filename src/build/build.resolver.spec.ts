import { Test, TestingModule } from '@nestjs/testing';

import { BuildResolver } from './build.resolver';
import { BuildService } from './build.service';
import { RecipeService } from '../recipe/recipe.service';
import { StockService } from '../stock/stock.service';
import { TouchService } from '../touch/touch.service';
import { UnitService } from '../unit/unit.service';
import { UserService } from '../user/user.service';

describe('BuildResolver', () => {
  let resolver: BuildResolver;

  const buildServiceMock = {
    create: jest.fn(),
    uploadBook: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findFolloweddUsersBuildPermission: jest.fn(),
    costBuild: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    changeBuildPermission: jest.fn(),
    deleteBuildPermission: jest.fn(),
  };

  const touchServiceMock = {
    touch: jest.fn(),
    touchWithCost: jest.fn(),
  };

  const recipeServiceMock = {
    findOne: jest.fn(),
  };

  const userServiceMock = {
    findOne: jest.fn(),
  };

  const stockServiceMock = {
    findOne: jest.fn(),
    pricePerOunce: jest.fn(),
  };

  const unitServiceMock = {
    convertUnits: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildResolver,
        { provide: BuildService, useValue: buildServiceMock },
        { provide: TouchService, useValue: touchServiceMock },
        { provide: RecipeService, useValue: recipeServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: StockService, useValue: stockServiceMock },
        { provide: UnitService, useValue: unitServiceMock },
      ],
    }).compile();

    resolver = module.get<BuildResolver>(BuildResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('create', () => {
    it('should create a build successfully', async () => {
      const createBuildInput = {
        recipe: { name: 'New Recipe' },
        buildName: 'New Build',
        instructions: 'Some instructions',
        glassware: 'Glass',
        ice: 'Cubed',
        touchArray: [],
      };
      const userId = 'user1';
      const expectedBuild = {
        ...createBuildInput,
        createdBy: userId,
      };

      buildServiceMock.create.mockResolvedValue(expectedBuild);

      const result = await resolver.create(createBuildInput, userId);
      expect(result).toEqual(expectedBuild);
      expect(buildServiceMock.create).toHaveBeenCalledWith(
        {
          recipe: { name: createBuildInput.recipe.name },
          buildName: createBuildInput.buildName,
          instructions: createBuildInput.instructions,
          glassware: createBuildInput.glassware,
          ice: createBuildInput.ice,
          touchArray: createBuildInput.touchArray,
        },
        userId,
      );
    });
  });
});
