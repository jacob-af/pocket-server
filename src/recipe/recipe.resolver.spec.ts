import { Test, TestingModule } from '@nestjs/testing';

import { BuildService } from '../build/build.service';
import { RecipeResolver } from './recipe.resolver';
import { RecipeService } from './recipe.service';
import { UserService } from '../user/user.service';

describe('RecipeResolver', () => {
  let resolver: RecipeResolver;

  const recipeServiceMock = {
    create: () => resolver.create,
  }; // Populate with necessary mocked methods
  const buildServiceMock = {};
  const userServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeResolver,
        { provide: RecipeService, useValue: recipeServiceMock },
        { provide: BuildService, useValue: buildServiceMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compile();

    resolver = module.get<RecipeResolver>(RecipeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // Add your specific test cases here
  describe('create', () => {
    it('should create a recipe successfully', async () => {
      const touchArray = [
        {
          ingredient: { name: 'Sugar' },
          amount: 1,
          unit: { abbreviation: 'oz' },
        },
      ];
      const build = {
        buildName: 'build',
        touchArray,
      };
      const createRecipeInput = {
        recipeName: 'New Recipe',
        about: 'Description of the recipe',
        build,
      };

      const userId = 'user123';
      const expectedRecipe = {
        id: 'recipe123',
        name: 'New Recipe',
        about: 'Description of the recipe',
        createdBy: userId,
      };

      recipeServiceMock.create = jest.fn().mockResolvedValue(expectedRecipe);

      const result = await resolver.create(createRecipeInput, userId);
      expect(result).toEqual(expectedRecipe);
      expect(recipeServiceMock.create).toHaveBeenCalledWith(
        createRecipeInput,
        userId,
      );
    });
  });
});
