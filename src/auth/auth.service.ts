import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
//import { CreateUser } from './dto/create-user.input';
//import { UpdateAuthInput } from './dto/update-auth.input';
import { CreateUserInput, LoginInput, User } from '../graphql';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    const hpassword = await bcrypt.hash(createUserInput.password, 10);
    const user: User = await this.prisma.user.create({
      data: {
        userName: createUserInput.userName,
        password: hpassword,
        email: createUserInput.email,
        subscription: {
          create: {
            status: 'free',
          },
        },
        profile: {
          create: {
            preferredBookName: 'Top 25',
          },
        },
      },
    });
    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return {
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
      },
      accessToken,
      refreshToken,
    };
  }

  async loginUser(loginInput: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginInput.email },
    });
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }
    const passwordCheck = await bcrypt.compare(
      loginInput.password,
      user.password,
    );
    if (!passwordCheck) {
      throw new ForbiddenException('Access Denied');
    }
    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: { id: userId, refreshToken: { not: null } },
      data: { refreshToken: null },
    });
    console.log('Logged out: true');
    return { loggedOut: true };
  }

  async createNewUser(email: string, userName: string) {
    return this.prisma.user.create({ data: { email, userName } });
  }

  async signUp(email: string, userName: string, password: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await this.prisma.user.create({
      data: {
        email,
        userName,
        password: hashedPassword,
        authMethods: {
          create: {
            authType: 'credentials',
            passwordAuth: {
              create: {
                password: hashedPassword,
                salt,
              },
            },
          },
        },
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  //new method
  async signIn({ email, password }: { email: string; password: string }) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        authMethods: {
          include: { passwordAuth: true },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    // Check password
    const credentialAuth = user.authMethods.find(
      (auth) => auth.authType === 'password',
    );
    if (!credentialAuth) {
      console.log('user exists');
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      credentialAuth.passwordAuth.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async addPasswordAuth(id: string, password: string) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const res = await this.prisma.authMethod.create({
      data: {
        user: { connect: { id: id } },
        authType: 'password',
        passwordAuth: {
          create: {
            password: passwordHash,
            salt,
          },
        },
      },
    });
    console.log(res);
    return res;
  }

  async addOAuthAuth(
    id: string,
    provider: string,
    providerUserId: string,
    accessToken: string,
    tokenExpiry: Date,
  ) {
    return this.prisma.authMethod.create({
      data: {
        user: { connect: { id: id } },
        authType: provider,
        oauthAuth: {
          create: {
            provider,
            providerUserId,
            accessToken,
            tokenExpiry,
          },
        },
      },
    });
  }

  async handleGoogleSignIn(
    googleUserId: string,
    email: string,
    userName: string,
    image: string,
    gAccessToken: string,
    tokenExpiry: Date,
  ) {
    // Check if user exists
    console.log('hit the service');
    const oauthAuth = await this.prisma.oAuthAuth.findUnique({
      where: { providerUserId: googleUserId },
      include: { authMethod: true },
    });
    console.log(image, 'image');
    let user: User;
    if (oauthAuth) {
      // User exists, update tokens
      user = await this.prisma.user.update({
        where: { id: oauthAuth.authMethod.userId },
        data: {
          authMethods: {
            update: {
              where: { id: oauthAuth.authMethodId },
              data: {
                oauthAuth: {
                  update: {
                    accessToken: gAccessToken,
                    tokenExpiry,
                  },
                },
              },
            },
          },
          profile: {
            upsert: {
              where: { userId: oauthAuth.authMethod.userId },
              create: { image },
              update: { image },
            },
          },
        },
      });
    } else {
      // User does not exist, create new user
      user = await this.prisma.user.create({
        data: {
          email,
          userName,
          authMethods: {
            create: {
              authType: 'google',
              oauthAuth: {
                create: {
                  provider: 'google',
                  providerUserId: googleUserId,
                  accessToken: gAccessToken,
                  tokenExpiry,
                },
              },
            },
          },
          profile: {
            create: {
              image,
            },
          },
        },
      });
    }

    // Generate your own tokens
    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return {
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async createTokens(userId: string, email: string) {
    const accessToken = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: '24h',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId,
        email,
        accessToken,
      },
      {
        expiresIn: '7d',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      },
    );
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    console.log('refresh');
    const hRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hRefreshToken },
    });
  }

  async getNewTokens(userId: string, rT: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }
    const tokenCheck = await bcrypt.compare(rT, user.refreshToken);
    if (!tokenCheck) {
      throw new ForbiddenException('Access Denied');
    }
    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    console.log(refreshToken);
    return {
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
      },
      accessToken,
      refreshToken,
    };
  }
}
