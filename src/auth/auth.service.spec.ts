import * as bcrypt from 'bcrypt';

import { CreateUserInput, User } from '../graphql';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
  genSalt: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  //let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              updateMany: jest.fn(),
              update: jest.fn(),
            },
            authMethod: {
              create: jest.fn(),
            },
            oAuthAuth: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'ACCESS_TOKEN_SECRET':
                  return 'access-token-secret';
                case 'REFRESH_TOKEN_SECRET':
                  return 'refresh-token-secret';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    //jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    userName: 'Test User',
    dateJoined: new Date(),
    lastEdited: new Date(),
    following: [],
    followedBy: [],
    myBuild: [],
    allBuilds: [],
    buildEditedBy: [],
    profile: null,
  };

  describe('createUser', () => {
    it('should create a user and return tokens', async () => {
      const createUserInput: CreateUserInput = {
        userName: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };
      const hashedPassword = 'hashedpassword';
      const accessToken = 'accessToken';
      const refreshToken = 'refreshToken';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser as any);
      jest
        .spyOn(service, 'createTokens')
        .mockResolvedValue({ accessToken, refreshToken });
      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue(undefined);

      const result = await service.createUser(createUserInput);

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          userName: mockUser.userName,
        },
        accessToken,
        refreshToken,
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          userName: createUserInput.userName,
          password: hashedPassword,
          email: createUserInput.email,
        },
      });
      expect(service.updateRefreshToken).toHaveBeenCalledWith(
        mockUser.id,
        refreshToken,
      );
    });
  });

  // describe('loginUser', () => {
  //   it('should log in a user and return tokens', async () => {
  //     const loginInput: LoginInput = {
  //       email: 'test@example.com',
  //       password: 'password',
  //     };
  //     const hashedPassword = 'hashedpassword';
  //     const accessToken = 'accessToken';
  //     const refreshToken = 'refreshToken';

  //     jest
  //       .spyOn(prisma.user, 'findUnique')
  //       .mockResolvedValue({ ...mockUser, password: hashedPassword } as any);
  //     //jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
  //     jest
  //       .spyOn(service, 'createTokens')
  //       .mockResolvedValue({ accessToken, refreshToken });
  //     jest.spyOn(service, 'updateRefreshToken').mockResolvedValue(undefined);

  //     const result = await service.loginUser(loginInput);

  //     expect(result).toEqual({ ...mockAuthPayload });
  //     expect(prisma.user.findUnique).toHaveBeenCalledWith({
  //       where: { email: loginInput.email },
  //     });
  //     expect(service.updateRefreshToken).toHaveBeenCalledWith(
  //       mockUser.id,
  //       refreshToken,
  //     );
  //   });

  //   it('should throw ForbiddenException if user is not found', async () => {
  //     const loginInput: LoginInput = {
  //       email: 'test@example.com',
  //       password: 'password',
  //     };

  //     jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

  //     await expect(service.loginUser(loginInput)).rejects.toThrow(
  //       'Access Denied',
  //     );
  //   });

  //   it('should throw ForbiddenException if password is incorrect', async () => {
  //     const loginInput: LoginInput = {
  //       email: 'test@example.com',
  //       password: 'password',
  //     };
  //     const hashedPassword = 'hashedpassword';

  //     jest
  //       .spyOn(prisma.user, 'findUnique')
  //       .mockResolvedValue({ ...mockUser, password: hashedPassword } as any);
  //     //jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

  //     await expect(service.loginUser(loginInput)).rejects.toThrow(
  //       'Access Denied',
  //     );
  //   });
  // });

  // describe('logout', () => {
  //   it('should log out a user', async () => {
  //     const userId = '1';
  //     jest
  //       .spyOn(prisma.user, 'updateMany')
  //       .mockResolvedValue({ count: 1 } as any);

  //     const result = await service.logout(userId);

  //     expect(result).toEqual({ loggedOut: true });
  //     expect(prisma.user.updateMany).toHaveBeenCalledWith({
  //       where: { id: userId, refreshToken: { not: null } },
  //       data: { refreshToken: null },
  //     });
  //   });
  // });

  // describe('createNewUser', () => {
  //   it('should create a new user', async () => {
  //     const email = 'test@example.com';
  //     const userName = 'testuser';
  //     jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser as any);

  //     const result = await service.createNewUser(email, userName);

  //     expect(result).toEqual(mockUser);
  //     expect(prisma.user.create).toHaveBeenCalledWith({
  //       data: { email, userName },
  //     });
  //   });
  // });

  // describe('addPasswordAuth', () => {
  //   it('should add password authentication for a user', async () => {
  //     const id = '1';
  //     const password = 'password';
  //     const salt = 'salt';
  //     const passwordHash = 'passwordHash';
  //     const authMethod = { id: '1', userId: id, authType: 'password' };

  //     //jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(salt);
  //     //jest.spyOn(bcrypt, 'hash').mockResolvedValue(passwordHash);
  //     jest
  //       .spyOn(prisma.authMethod, 'create')
  //       .mockResolvedValue(authMethod as any);

  //     const result = await service.addPasswordAuth(id, password);

  //     expect(result).toEqual(authMethod);
  //     expect(prisma.authMethod.create).toHaveBeenCalledWith({
  //       data: {
  //         user: { connect: { id } },
  //         authType: 'password',
  //         passwordAuth: {
  //           create: {
  //             password: passwordHash,
  //             salt,
  //           },
  //         },
  //       },
  //     });
  //   });
  // });

  // describe('addOAuthAuth', () => {
  //   it('should add OAuth authentication for a user', async () => {
  //     const id = '1';
  //     const provider = 'google';
  //     const providerUserId = 'googleUserId';
  //     const accessToken = 'accessToken';
  //     const tokenExpiry = new Date();
  //     const authMethod = { id: '1', userId: id, authType: provider };

  //     jest
  //       .spyOn(prisma.authMethod, 'create')
  //       .mockResolvedValue(authMethod as any);

  //     const result = await service.addOAuthAuth(
  //       id,
  //       provider,
  //       providerUserId,
  //       accessToken,
  //       tokenExpiry,
  //     );

  //     expect(result).toEqual(authMethod);
  //     expect(prisma.authMethod.create).toHaveBeenCalledWith({
  //       data: {
  //         user: { connect: { id } },
  //         authType: provider,
  //         oauthAuth: {
  //           create: {
  //             provider,
  //             providerUserId,
  //             accessToken,
  //             tokenExpiry,
  //           },
  //         },
  //       },
  //     });
  //   });
  // });

  // describe('createTokens', () => {
  //   it('should create access and refresh tokens', async () => {
  //     const userId = '1';
  //     const email = 'test@example.com';
  //     const accessToken = 'accessToken';
  //     const refreshToken = 'refreshToken';

  //     jest.spyOn(jwtService, 'sign').mockImplementation((payload, options) => {
  //       if (options.secret === 'access-token-secret') {
  //         return accessToken;
  //       } else if (options.secret === 'refresh-token-secret') {
  //         return refreshToken;
  //       }
  //       return '';
  //     });

  //     const tokens = await service.createTokens(userId, email);

  //     expect(tokens).toEqual({ accessToken, refreshToken });
  //     expect(jwtService.sign).toHaveBeenCalledWith(
  //       { userId, email },
  //       { expiresIn: '24h', secret: 'access-token-secret' },
  //     );
  //     expect(jwtService.sign).toHaveBeenCalledWith(
  //       { userId, email, accessToken },
  //       { expiresIn: '7d', secret: 'refresh-token-secret' },
  //     );
  //   });
  // });

  // describe('updateRefreshToken', () => {
  //   it('should update the refresh token for a user', async () => {
  //     const userId = '1';
  //     const refreshToken = 'refreshToken';
  //     const hashedRefreshToken = 'hashedRefreshToken';

  //     //jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedRefreshToken);
  //     jest.spyOn(prisma.user, 'update').mockResolvedValue({} as any);

  //     await service.updateRefreshToken(userId, refreshToken);

  //     expect(prisma.user.update).toHaveBeenCalledWith({
  //       where: { id: userId },
  //       data: { refreshToken: hashedRefreshToken },
  //     });
  //   });
  // });

  // describe('getNewTokens', () => {
  //   it('should get new tokens for a user', async () => {
  //     const userId = '1';
  //     const refreshToken = 'refreshToken';
  //     const user = { ...mockUser, refreshToken: 'hashedRefreshToken' };
  //     const accessToken = 'accessToken';
  //     const newRefreshToken = 'newRefreshToken';

  //     jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user as any);
  //     //jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
  //     jest
  //       .spyOn(service, 'createTokens')
  //       .mockResolvedValue({ accessToken, refreshToken: newRefreshToken });
  //     jest.spyOn(service, 'updateRefreshToken').mockResolvedValue(undefined);

  //     const result = await service.getNewTokens(userId, refreshToken);

  //     expect(result).toEqual({
  //       ...mockAuthPayload,
  //       refreshToken: newRefreshToken,
  //     });
  //     expect(prisma.user.findUnique).toHaveBeenCalledWith({
  //       where: { id: userId },
  //     });
  //     expect(bcrypt.compare).toHaveBeenCalledWith(
  //       refreshToken,
  //       user.refreshToken,
  //     );
  //     expect(service.updateRefreshToken).toHaveBeenCalledWith(
  //       userId,
  //       newRefreshToken,
  //     );
  //   });

  //   it('should throw ForbiddenException if user is not found', async () => {
  //     const userId = '1';
  //     const refreshToken = 'refreshToken';

  //     jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

  //     await expect(service.getNewTokens(userId, refreshToken)).rejects.toThrow(
  //       'Access Denied',
  //     );
  //   });

  //   it('should throw ForbiddenException if refresh token is invalid', async () => {
  //     const userId = '1';
  //     const refreshToken = 'refreshToken';
  //     const user = { ...mockUser, refreshToken: 'hashedRefreshToken' };

  //     jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user as any);
  //     //jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

  //     await expect(service.getNewTokens(userId, refreshToken)).rejects.toThrow(
  //       'Access Denied',
  //     );
  //   });
  // });

  // describe('handleGoogleSignIn', () => {
  //   it('should handle Google sign in for an existing user', async () => {
  //     // Added async here
  //     const googleUserId = 'googleUserId';
  //     const email = 'test@example.com';
  //     const userName = 'testuser';
  //     const image = 'image_url';
  //     const gAccessToken = 'gAccessToken';
  //     const tokenExpiry = new Date();
  //     const oauthAuth = {
  //       providerUserId: googleUserId,
  //       authMethod: { id: 'authMethodId', userId: '1' },
  //     };
  //     const accessToken = 'accessToken';
  //     const refreshToken = 'refreshToken';
  //     const mockAuthPayload = { accessToken, refreshToken, user: mockUser }; // Ensure this is correctly defined

  //     jest.spyOn(prisma.oAuthAuth, 'findUnique').mockResolvedValue({
  //       authMethodId: 1,
  //       provider: 'google',
  //       providerUserId: googleUserId,
  //       accessToken: gAccessToken,
  //       tokenExpiry: tokenExpiry,
  //     });
  //     jest.spyOn(prisma.user, 'update').mockResolvedValue({} as any);
  //     jest
  //       .spyOn(service, 'createTokens')
  //       .mockResolvedValue({ accessToken, refreshToken });
  //     jest.spyOn(service, 'updateRefreshToken').mockResolvedValue(undefined);

  //     // Await the result of handleGoogleSignIn
  //     const result = await service.handleGoogleSignIn(
  //       googleUserId,
  //       email,
  //       userName,
  //       image,
  //       gAccessToken,
  //       tokenExpiry,
  //     );

  //     expect(result).toEqual({ ...mockAuthPayload });
  //     expect(prisma.oAuthAuth.findUnique).toHaveBeenCalledWith({
  //       where: { providerUserId: googleUserId },
  //       include: { authMethod: true },
  //     });
  //     expect(prisma.user.update).toHaveBeenCalledWith({
  //       where: { id: oauthAuth.authMethod.userId },
  //       data: {
  //         authMethods: {
  //           update: {
  //             where: { id: oauthAuth.authMethod.id },
  //             data: {
  //               oauthAuth: {
  //                 update: {
  //                   accessToken: gAccessToken,
  //                   tokenExpiry,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //     expect(service.updateRefreshToken).toHaveBeenCalledWith(
  //       mockUser.id,
  //       refreshToken,
  //     );
  //   });
  // });
});
