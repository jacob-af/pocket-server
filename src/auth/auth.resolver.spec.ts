import {
  AuthPayload,
  AuthResponse,
  CreateUserInput,
  LoginInput,
} from '../graphql';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            createUser: jest.fn(),
            loginUser: jest.fn(),
            logout: jest.fn(),
            createNewUser: jest.fn(),
            addPasswordAuth: jest.fn(),
            addOAuthAuth: jest.fn(),
            signIn: jest.fn(),
            handleGoogleSignIn: jest.fn(),
            getNewTokens: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  const mockUserWithSensitiveFields: User = {
    id: '1',
    email: 'test@example.com',
    userName: 'Test User',
    role: 'Free User',
    dateJoined: new Date(),
    lastEdited: new Date(),
    password: 'hashedpassword', // Sensitive field for testing only
    refreshToken: 'hashedrefreshtoken', // Sensitive field for testing only
  };

  const mockAuthPayload: AuthPayload = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    user: mockUserWithSensitiveFields,
  };

  describe('signup', () => {
    it('should call authService.createUser with correct parameters', async () => {
      const input: CreateUserInput = {
        userName: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };
      jest.spyOn(authService, 'createUser').mockResolvedValue(mockAuthPayload);

      expect(await resolver.signup(input)).toBe(mockAuthPayload);
      expect(authService.createUser).toHaveBeenCalledWith(input);
    });
  });

  describe('login', () => {
    it('should call authService.loginUser with correct parameters', async () => {
      const input: LoginInput = {
        email: 'test@example.com',
        password: 'password',
      };
      jest.spyOn(authService, 'loginUser').mockResolvedValue({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: mockUserWithSensitiveFields,
      });

      const result = await resolver.login(input);
      expect(result.accessToken).toBe(mockAuthPayload.accessToken);
      expect(result.refreshToken).toBe(mockAuthPayload.refreshToken);
      expect(result.user.id).toBe(mockAuthPayload.user.id);
      expect(result.user.email).toBe(mockAuthPayload.user.email);
      expect(result.user.userName).toBe(mockAuthPayload.user.userName);
      expect(result.user.dateJoined).toEqual(mockAuthPayload.user.dateJoined);
      expect(result.user.lastEdited).toEqual(mockAuthPayload.user.lastEdited);

      expect(authService.loginUser).toHaveBeenCalledWith(input);
    });
  });

  describe('logout', () => {
    it('should call authService.logout with correct parameters', async () => {
      const userId = '1';
      const result = { loggedOut: true };
      jest.spyOn(authService, 'logout').mockResolvedValue(result);

      expect(await resolver.logout(userId)).toBe(result);
      expect(authService.logout).toHaveBeenCalledWith(userId);
    });
  });

  describe('createNewUser', () => {
    it('should call authService.createNewUser with correct parameters', async () => {
      const email = 'test@example.com';
      const userName = 'testuser';
      jest
        .spyOn(authService, 'createNewUser')
        .mockResolvedValue(mockUserWithSensitiveFields);

      expect(await resolver.createNewUser(email, userName)).toBe(
        mockUserWithSensitiveFields,
      );
      expect(authService.createNewUser).toHaveBeenCalledWith(email, userName);
    });
  });

  describe('addPasswordAuth', () => {
    it('should call authService.addPasswordAuth with correct parameters', async () => {
      const id = '1';
      const password = 'password';

      // Update the mock return value to more closely match your actual data structure
      const mockAuthResponse = {
        authType: 'password',
        id: 1,
        userId: id,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: {
          dateJoined: new Date().toISOString(), // Adjust as necessary to match actual data structure
          email: 'test@example.com',
          id: id,
          lastEdited: new Date().toISOString(),
          password: 'hashedpassword',
          refreshToken: 'hashedrefreshtoken',
          userName: 'Test User',
        },
      };

      jest
        .spyOn(authService, 'addPasswordAuth')
        .mockResolvedValue(mockAuthResponse);

      // Use toEqual instead of toBe for object comparison
      expect(await resolver.addPasswordAuth(id, password)).toEqual(
        mockAuthResponse,
      );
      expect(authService.addPasswordAuth).toHaveBeenCalledWith(id, password);
    });
  });

  it('should call authService.addOAuthAuth with correct parameters', async () => {
    const id = 'user123';
    const provider = 'google';
    const providerUserId = 'googleUserId';
    const accessToken = 'accessToken';
    const tokenExpiry = new Date();

    const expectedResult: AuthResponse = {
      id: 1,
      userId: '1',
      authType: '1',
    };

    jest.spyOn(authService, 'addOAuthAuth').mockResolvedValue(expectedResult);

    const result = await resolver.addOAuthAuth(
      accessToken,
      id,
      provider,
      providerUserId,
      tokenExpiry,
    ); // Await the result
    expect(result).toEqual(expectedResult);
    expect(authService.addOAuthAuth).toHaveBeenCalledWith(
      accessToken,
      id,
      provider,
      providerUserId,
      tokenExpiry,
    );
  });

  describe('signin', () => {
    it('should call authService.signIn with correct parameters', async () => {
      // Ensure 'async' is used
      const loginInput = { email: 'test@user.com', password: 'testpass' };
      const mockAuthPayload = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: {
          id: '1',
          userName: 'Test User',
          email: 'test@example.com',
          role: 'Free User',
          dateJoined: new Date('2024-06-08T12:03:09.495Z'),
          lastEdited: new Date('2024-06-08T12:03:09.495Z'),
          password: 'hashedpassword',
          refreshToken: 'hashedrefreshtoken',
          authMethods: [
            // Add this to match expected structure
            {
              id: 101,
              userId: '1',
              authType: 'Password',
              passwordAuth: {
                authMethodId: 1,
                password: 'securePassword123!',
                salt: 'randomSaltValue',
              },
            },
          ],
        },
      };

      jest.spyOn(authService, 'signIn').mockResolvedValue(mockAuthPayload);

      const result = await resolver.signin(loginInput); // Await the result
      expect(result).toEqual(mockAuthPayload);
      expect(authService.signIn).toHaveBeenCalledWith(loginInput);
    });
  });

  describe('googleSignIn', () => {
    it('should call authService.handleGoogleSignIn with correct parameters', async () => {
      const googleUserId = 'googleUserId';
      const email = 'test@example.com';
      const name = 'Test User';
      const image = 'image_url';
      const accessToken = 'accessToken';
      const tokenExpiry = new Date();
      jest
        .spyOn(authService, 'handleGoogleSignIn')
        .mockResolvedValue(mockAuthPayload);

      expect(
        await resolver.googleSignIn(
          googleUserId,
          email,
          name,
          image,
          accessToken,
          tokenExpiry,
        ),
      ).toBe(mockAuthPayload);
      expect(authService.handleGoogleSignIn).toHaveBeenCalledWith(
        googleUserId,
        email,
        name,
        image,
        accessToken,
        tokenExpiry,
      );
    });
  });

  describe('getNewTokens', () => {
    it('should call authService.getNewTokens with correct parameters', async () => {
      const userId = '1';
      const refreshToken = 'refreshToken';

      const mockAuthPayload: AuthPayload = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: {
          id: '1',
          email: 'test@example.com',
          userName: 'Test User',
          dateJoined: new Date(),
          lastEdited: new Date(),
        },
      };

      jest
        .spyOn(authService, 'getNewTokens')
        .mockResolvedValue(mockAuthPayload);

      expect(await resolver.getNewTokens(userId, refreshToken)).toBe(
        mockAuthPayload,
      );
      expect(authService.getNewTokens).toHaveBeenCalledWith(
        userId,
        refreshToken,
      );
    });
  });

  describe('hello', () => {
    it('should return a hello message', () => {
      expect(resolver.hello()).toBe('We are passing data');
    });
  });
});
