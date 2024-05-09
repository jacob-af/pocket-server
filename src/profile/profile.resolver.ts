import { ProfileService } from './profile.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUserId } from 'src/auth/decorators/currentUserId-decorator';
import { UserService } from 'src/user/user.service';

@Resolver('Profile')
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  @Query('getProfile')
  getProfile(@Args('userId') userId: string) {
    return this.profileService.getProfile(userId);
  }

  @Mutation('updateProfile') //Also used to create
  updateProfile(@Args('image') image: string, @CurrentUserId() userId: string) {
    console.log(image, userId);
    return this.profileService.updateProfile(userId, image);
  }
}
