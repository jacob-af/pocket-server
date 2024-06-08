import { Test, TestingModule } from '@nestjs/testing';

import { BuildService } from '../build/build.service';
import { ProfileService } from '../profile/profile.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

describe('UserResolver', () => {
  let resolver: UserResolver;

  const userServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findFollows: jest.fn(),
    findFollowers: jest.fn(),
    getUserRelationships: jest.fn(),
    followUser: jest.fn(),
    unfollowUser: jest.fn(),
    blockUser: jest.fn(),
    unblockUser: jest.fn(),
  };

  const profileServiceMock = {
    getProfile: jest.fn(),
  };

  const buildServiceMock = {
    allBuilds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useValue: userServiceMock },
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: BuildService, useValue: buildServiceMock },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // Add your specific test cases here
  describe('userById', () => {
    it('should return a user by ID', async () => {
      const userId = 'user1';
      const expectedUser = { id: userId, name: 'John Doe' };
      userServiceMock.findOne.mockResolvedValue(expectedUser);

      const result = await resolver.userById(userId);
      expect(result).toEqual(expectedUser);
      expect(userServiceMock.findOne).toHaveBeenCalledWith(userId);
    });
  });
});
