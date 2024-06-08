import { ProfileService } from './profile.service';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUserId } from '../auth/decorators/currentUserId-decorator';
import { Profile } from '../graphql';
import { RecipeBookService } from '../recipe-book/recipe-book.service';

@Resolver('Profile')
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly recipeBookService: RecipeBookService,
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

  @ResolveField('prefferedBook')
  async prefferedBook(
    @Parent() profile: Profile,
    @CurrentUserId() userId: string,
  ) {
    return await this.recipeBookService.findOne(
      profile.prefferedBook.name,
      userId,
    );
  }
}
