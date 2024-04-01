import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput, LoginInput } from 'src/graphql';
import { Public } from './decorators/public-decorators';
import { CurrentUserId } from './decorators/currentUserId-decorator';
import { CurrentUser } from './decorators/currentUser-decorator';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Mutation('signup')
  signup(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.createUser(createUserInput);
  }
  @Public()
  @Mutation('login')
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.loginUser(loginInput);
  }
  @Mutation('logout')
  logout(@Args('userId') userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation('getNewTokens')
  getNewTokens(
    @CurrentUserId() userId: string,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.getNewTokens(userId, refreshToken);
  }
}
