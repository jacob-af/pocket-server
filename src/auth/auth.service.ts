import { ForbiddenException, Injectable } from '@nestjs/common';
//import { CreateUser } from './dto/create-user.input';
//import { UpdateAuthInput } from './dto/update-auth.input';
import { CreateUserInput, LoginInput } from '../graphql';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    console.log(createUserInput);
    const hpassword = await bcrypt.hash(createUserInput.password, 10);
    const user = await this.prisma.user.create({
      data: {
        userName: createUserInput.userName,
        password: hpassword,
        email: createUserInput.email,
      },
    });
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

  async loginUser(loginInput: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginInput.email },
    });
    console.log('login service hit');
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
    console.log('user: ', !!user, 'accesToken:', !!accessToken);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
