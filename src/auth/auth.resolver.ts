import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload, CreateUserInput, LoginInput } from '../graphql';
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
    console.log('ding');
    return this.authService.loginUser(loginInput);
  }

  @Mutation('logout')
  logout(@CurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  //start new edit
  @Public()
  @Mutation('createNewUser')
  async createNewUser(
    @Args('email') email: string,
    @Args('userName') userName: string,
  ) {
    return this.authService.createNewUser(email, userName);
  }

  @Public()
  @Mutation('addPasswordAuth')
  async addPasswordAuth(
    @Args('id', { type: () => String }) id: string,
    @Args('password') password: string,
  ) {
    return this.authService.addPasswordAuth(id, password);
  }

  @Public()
  @Mutation('addOauthAuth')
  async addOAuthAuth(
    @Args('id', { type: () => String }) id: string,
    @Args('provider') provider: string,
    @Args('providerUserId') providerUserId: string,
    @Args('accessToken') accessToken: string,
    @Args('tokenExpiry') tokenExpiry: Date,
  ) {
    return this.authService.addOAuthAuth(
      id,
      provider,
      providerUserId,
      accessToken,
      tokenExpiry,
    );
  }

  @Public()
  @Mutation('signin')
  signin(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.signIn(loginInput);
  }

  @Public()
  @Mutation('googleSignIn')
  async googleSignIn(
    @Args('googleUserId') googleUserId: string,
    @Args('email') email: string,
    @Args('name') name: string,
    @Args('image') image: string,
    @Args('accessToken') accessToken: string,
    @Args('tokenExpiry') tokenExpiry: Date,
  ): Promise<AuthPayload> {
    return this.authService.handleGoogleSignIn(
      googleUserId,
      email,
      name,
      image,
      accessToken,
      tokenExpiry,
    );
  }
  //  end edit

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation('getNewTokens')
  getNewTokens(
    @CurrentUserId() userId: string,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.getNewTokens(userId, refreshToken);
  }

  @Public()
  @Query()
  hello() {
    return 'We are passing data';
  }
}
